import puppeteer from 'puppeteer';
import { Client } from 'discord.js';

import config from '../config';
import router from './routes';
import { catcher, logError, logInfo } from './utils/logger';

if (!config.bank.encrypted) {
  logError('❌ 口座データが暗号化されていません');
  logError('  yarn encrypt を使用して暗号化してください！');
  process.exit(1);
}

const state = {};
const setState = (key, data) => (state[key] = data);
const getState = () => state;

(async () => {
  const browser = await puppeteer.launch({
    slowMo: 50
  });
  setState('browser', browser);

  const client = new Client();

  router.use(async (state, next) => {
    const { author, channel } = state.msg;

    const start = Date.now();
    await next();
    const ms = Date.now() - start;

    const u = `${author.id}:${author.username}#${author.discriminator}`;
    const c = `${channel.id}:#${channel.name}`;

    logInfo(`${u} - ${c} / ${state.url} - ${ms}ms`);
  });

  client.on('ready', () => {
    logInfo(`Logged in as ${client.user.tag}!`);

    client.user.setActivity('!! 暗号化されています !!', {
      type: 'PLAYING'
    });

    client.on('message', msg => {
      let args = msg.content.split(' ');
      const url = args[0];
      args.splice(0, 1);

      if (url.slice(0, 1) !== ':') {
        return;
      }

      router
        .route(url, {
          url,
          msg,
          args,
          client,
          getState,
          setState
        })
        .catch(e => catcher(msg, e));
    });
  });

  client.login(config.discordToken);
})();
