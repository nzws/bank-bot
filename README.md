# @nzws/bank-bot

![img](https://i.imgur.com/Yb8Qj3s.png)

Discord 上で銀行のあれそれ見れるへんなやつ

**これは @nzws/bank-js のデモ兼話のネタにするために制作したもので、常用はおすすめしません**

## 使い方

```bash
git clone https://github.com/nzws/bank-bot
cd bank-bot
yarn
cp config.sample.json config.json
```

`config.json` はなんか適当に書いてください

- `discordToken`: discord bot のトークン
- `bank.password`: bot 起動時に必要なパスワード **→ 漏れてもいいやつ**
- `bank.banks.~~`: 口座設定 key は適当でおｋ (後ほど暗号化)

config 書き終えたら `yarn encrypt` で暗号化します。

`yarn build && yarn start` で起動できます。

最後に、discord 内で `:login <bank.passwordのパスワード>` を入力して暗号化を解きロードさせてください。

## コマンド

| コマンド                      | 内容                      |
| ----------------------------- | ------------------------- |
| `:login <password>`           | 起動                      |
| `:balance <id>`               | 残高照会                  |
| `:log <id>`                   | 履歴                      |
| `:rakuten-send <id> <amount>` | ゆうちょ → 楽天の自動払込 |
