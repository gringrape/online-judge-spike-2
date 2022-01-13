const { nanoid } = require('nanoid');

const util = require('util');

const fs = require('fs').promises;

const exec = util.promisify(require('child_process').exec);
const { spawn } = require('child_process');

async function executeJava(code, input) {
  const shell = spawn('docker', ['compose', 'exec', 'java', 'bash'], {
    shell: true,
  });

  const inputString = input.join(',');

  const executableCode = `
    class Main {
      public static void main(String[] args) {
        Solution solver = new Solution();
        System.out.print(solver.solution(${inputString}));
      }
    }

    ${code}
  `;

  const folderName = nanoid();
  const fileName = 'test.java';

  const path = `./user_scripts/${folderName}`;
  await fs.mkdir(path, { recursive: true });
  await fs.writeFile(`${path}/${fileName}`, executableCode, 'utf8');

  await exec(`javac ${path}/${fileName}`);

  shell.stdin.write(`java -cp application/${path} Main`);
  shell.stdin.end();

  const output = await new Promise((resolve) => {
    shell.stdout.on('data', (data) => {
      resolve(data.toString());
    });
  });

  await exec(`rm -r ${path}`);

  return JSON.parse(output);
}

async function executeJavaScript(code, input) {
  const shell = spawn('docker', ['compose', 'exec', 'node', 'bash'], {
    shell: true,
  });

  const inputString = input.join(',');

  const executableCode = `
    const func = ${code};
  
    console.log(func(${inputString}));
  `;

  const folderName = nanoid();
  const fileName = 'test';

  const path = `./user_scripts/${folderName}`;
  await fs.mkdir(path, { recursive: true });
  await fs.writeFile(`${path}/${fileName}`, executableCode, 'utf8');

  shell.stdin.write(`node /application/${path}/${fileName} \n`);
  shell.stdin.end();

  const output = await new Promise((resolve) => {
    shell.stdout.on('data', (data) => {
      resolve(data.toString());
    });
  });

  await exec(`rm -r ${path}`);

  return JSON.parse(output);
}

async function excute(code, input, language) {
  if (language === 'java') {
    return executeJava(code, input);
  }

  if (language === 'javascript') {
    return executeJavaScript(code, input);
  }

  return null;
}

module.exports = excute;
