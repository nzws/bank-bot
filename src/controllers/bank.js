import { historyEmbeds } from '../utils/text';

export const Balance = async ({ getState, msg, args }) => {
  const [id] = args;
  const state = getState();
  const session = state[`${id}_page`];

  if (!session) {
    return msg.reply('まだログイン済んでないみたい');
  }

  const balance = await session.getBalance();
  msg.reply('', {
    embed: {
      author: {
        name: `${id} - ${state.bank[id].bank}`
      },
      fields: [
        {
          name: '残高',
          value: `¥${balance}`
        }
      ]
    }
  });
};

export const Log = async ({ getState, msg, args }) => {
  const [id] = args;
  const state = getState();
  const session = state[`${id}_page`];

  if (!session || !state.hist || !state.hist[id]) {
    return msg.reply('まだログイン済んでないみたい');
  }

  msg.reply('', {
    embed: {
      author: {
        name: `${id} - ${state.bank[id].bank}`
      },
      fields: state.hist[id].map(historyEmbeds)
    }
  });
};

export const RakutenSend = async ({ getState, msg, args }) => {
  const [id, amount] = args;
  const state = getState();
  const session = state[`${id}_page`];
  const bank = state.bank[id];

  if (!session) {
    return msg.reply('まだログイン済んでないみたい');
  }
  if (bank.bank !== 'rakuten') {
    return msg.reply('楽天じゃないみたい');
  }

  const options = { month: 'long', day: 'numeric' };

  const logs = await session.action('DEPOSIT_FROM_JPBANK', {
    amount,
    PIN: bank.PIN
  });

  msg.reply(':white_check_mark: 申請しました', {
    embed: {
      author: {
        name: `${id} - ${state.bank[id].bank}`
      },
      fields: [
        {
          name: '入金額',
          value: `¥${logs.amount}`
        },
        {
          name: '手数料',
          value: `¥${logs.fee}`
        },
        {
          name: '予定日',
          value: `${new Date(logs.schedule).toLocaleDateString(
            'en-us',
            options
          )}`
        }
      ]
    }
  });
};
