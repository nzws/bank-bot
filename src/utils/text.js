const options = { month: 'long', day: 'numeric' };

export const historyEmbeds = v => ({
  name: `${new Date(v.date).toLocaleDateString('en-us', options)} - ${v.name}`,
  value: `**¥${v.amount * (v.type === 'withdrawal' ? -1 : 1)}** - 残高: ¥${
    v.balance
  }`
});
