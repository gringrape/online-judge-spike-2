const { nanoid } = require('nanoid');

const util = require('util');

const fs = require('fs').promises;

const exec = util.promisify(require('child_process').exec);
const { spawn } = require('child_process');

const save = async (string, fileName) => {
  const folderName = nanoid();
  const path = `./user_scripts/${folderName}`;
  await fs.mkdir(path, { recursive: true });
  await fs.writeFile(`${path}/${fileName}`, string, 'utf8');

  return path;
};

const cleanup = async (path) => {
  await exec(`rm -r ${path}`);
};

async function executeJava(code, input) {
  const getExecutableCode = () => {
    const inputString = input.join(',');

    return `
      class Main {
        public static void main(String[] args) {
          Solution solver = new Solution();
          System.out.print(solver.solution(${inputString}));
        }
      }
  
      ${code}
    `;
  };

  const runInContainer = async (path) => {
    const shell = spawn('docker', ['compose', 'exec', 'java', 'bash'], {
      shell: true,
    });

    shell.stdin.write(`java -cp application/${path} Main`);
    shell.stdin.end();

    return new Promise((resolve) => {
      shell.stdout.on('data', (data) => {
        resolve(data.toString());
      });
    });
  };

  const compile = async (path, fileName) => {
    await exec(`javac ${path}/${fileName}`);
  };

  const executableCode = getExecutableCode();

  const fileName = 'test.java';
  const path = await save(executableCode, fileName);

  await compile(path, fileName);

  const output = await runInContainer(path);

  await cleanup(path);

  return JSON.parse(output);
}

async function executeJavaScript(code, input) {
  const getExecutableCode = () => {
    const inputString = input.join(',');

    return `
      const func = ${code};
    
      console.log(func(${inputString}));
    `;
  };

  const runInContainer = (path, fileName) => {
    const shell = spawn('docker', ['compose', 'exec', 'node', 'bash'], {
      shell: true,
    });

    shell.stdin.write(`node /application/${path}/${fileName} \n`);
    shell.stdin.end();

    return new Promise((resolve) => {
      shell.stdout.on('data', (data) => {
        resolve(data.toString());
      });
    });
  };

  const executableCode = getExecutableCode();

  const fileName = 'test';
  const path = await save(executableCode, fileName);

  const output = await runInContainer(path, fileName);

  await cleanup(path);

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
