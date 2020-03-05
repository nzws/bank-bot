import fs from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';

import Config from '../config';
import { logError, logInfo } from '../src/utils/logger';
import { encrypt } from '../src/utils/crypto';

const writeFile = promisify(fs.writeFile);

const run = async () => {
  const config = JSON.parse(JSON.stringify(Config));
  if (config.bank.encrypted) {
    console.log('✔ このコンフィグは暗号化済みです');
    return process.exit(0);
  }
  const { banks, password } = config.bank;
  if (!banks || !password) {
    logError('bank.banks または bank.password がありません');
    return process.exit(1);
  }

  config.bank = encrypt(JSON.stringify(banks), password.padStart(32, '0'));

  const json = JSON.stringify(config, null, 2);
  await writeFile(resolve('config.json'), json, 'utf8');
  logInfo('✔ Succeed!');
};

run().catch(logError);
