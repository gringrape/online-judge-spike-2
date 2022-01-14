const util = require('util');

const exec = util.promisify(require('child_process').exec);

const execute = require('./execute');

describe('excute', () => {
  beforeAll(async () => {
    await exec('docker-compose up -d');
  });

  afterAll(async () => {
    await exec('docker-compose down');
  }, 20000);

  it('executes simple java code', async () => {
    const code = `
      class Solution {
        public int solution(int a, int b) {
          return a + b;
        }
      }
    `;

    const input = [4, 9];

    expect(await execute(code, input, 'java')).toBe(13);
  });

  it('executes complex java code', async () => {
    const code = `
    class Solution {
      public int solution(int a, int b, int c) {
        return a * b * c;
      }
    }
  `;

    const input = [4, 9, 6];

    expect(await execute(code, input, 'java')).toBe(216);
  });

  it('executes simple javascript code', async () => {
    const code = `
      function solution(a, b) {
        return a + b;
      }
    `;

    const input = [22, 33];

    expect(await execute(code, input, 'javascript')).toBe(55);
  });

  it('executes complex javascript code', async () => {
    const code = `
      function solution(a, b) {
        return a + b;
      }
    `;

    const input = [22, 33];

    expect(await execute(code, input, 'javascript')).toBe(55);
  });
});
