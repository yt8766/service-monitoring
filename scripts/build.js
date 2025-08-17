import fs from 'fs';
import { rm } from 'fs/promises';
import path from 'path';

const args = process.argv.splice(2);
const build = async target => {
  const filename = path.resolve(`packages/${target}`);
  await rm(`${filename}/build`, { recursive: true, force: true });
  await rm(`${filename}/dist`, { recursive: true, force: true });
};

const buildAll = async () => {
  const ret = [];
  let packages = fs.readdirSync(path.resolve('packages'));
  if (args[1]) {
    packages = packages.filter(p => p === args[1]);
  }

  for (const target of packages) {
    const p = Promise.resolve().then(() => build(target));
    ret.push(p);
  }

  return Promise.all(ret);
};

buildAll();
