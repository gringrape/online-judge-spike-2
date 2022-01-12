const { spawn } = require('child_process');

const fs = require('fs').promises;

async function judgeJavaScript(code, testCase) {
  const shell = spawn('docker', ['compose', 'exec', 'node', 'bash'], {
    shell: true,
  });

  const { input, output: expectedOutput } = testCase;

  const inputString = input.join(',');

  const executableCode = `
    const func = ${code};
  
    console.log(func(${inputString}));
  `;

  const path = './test';
  await fs.writeFile(path, executableCode, 'utf8');

  shell.stdin.write('node /application/test \n');
  shell.stdin.end();

  const output = await new Promise((resolve) => {
    shell.stdout.on('data', (data) => {
      resolve(data.toString());
    });
  });

  const result = JSON.stringify(JSON.parse(output));
  const expected = JSON.stringify(expectedOutput);

  return result === expected;
}

async function main() {
  const javaScriptCode = `
  function add(a, b) {
    return a + b; 
  }`;

  const testCase = {
    input: [4, 9],
    output: 13,
  };

  await judgeJavaScript(javaScriptCode, testCase);
}

main();
