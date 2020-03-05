import bankJs from '@nzws/bank-js';

import config from '../../config';
import { decrypt } from '../utils/crypto';
import { historyEmbeds } from '../utils/text';

export const Help = state => {
  const { msg } = state;

  msg.reply(['https://github.com/nzws/bank-bot', '(訳: ソースコード見て)']);
};

export const Login = async ({ msg, args, setState, getState, client }) => {
  const { bank, browser } = getState();
  const { encrypted, iv } = config.bank;
  try {
    msg.delete();

    if (bank) {
      return msg.reply('ログイン済みそう');
    }

    const password = args[0].padStart(32, '0');
    const data = JSON.parse(decrypt(encrypted, iv, password));

    setState('bank', data);
    msg.reply('✅ ログインしました、接続しています...');

    client.user.setActivity('Running', {
      type: 'PLAYING'
    });

    const login = async id => {
      const { bank, username, password, options } = data[id];

      const b = new bankJs(bank);
      await b.init(browser);
      await b.login(username, password, options);
      setState(`${id}_page`, b);

      const checker = async id => {
        let isFirst = false;
        const state = getState();
        const session = state[`${id}_page`];
        if (!state.hist) {
          state.hist = {};
        }
        if (!state.hist[id]) {
          state.hist[id] = [];
          isFirst = true;
        }

        const log = await session.getLogs();
        const oldLogs = JSON.stringify(state.hist[id]);

        setTimeout(() => checker(id), 1000 * 60 * 30);
        setState('hist', {
          ...state.hist,
          [id]: log
        });
        if (isFirst) {
          return;
        }

        const newLogs = log.filter(
          v => oldLogs.indexOf(JSON.stringify(v)) === -1
        );
        if (!newLogs[0]) {
          return;
        }

        msg.channel.send(':new: 新たな取引', {
          embed: {
            author: {
              name: `${id} - ${state.bank[id].bank}`
            },
            fields: newLogs.map(historyEmbeds)
          }
        });
      };

      await checker(id);

      return msg.channel.send(`✅ ${id} に接続`);
    };
    const promise = Object.keys(data).map(id => () => login(id));
    for (const func of promise) {
      await func();
    }
  } catch (e) {
    msg.reply('パスワード違いそう');
  }
};
