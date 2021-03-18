# Hubot test helper for hubot-traQ

[hubot-test-helper](https://github.com/mtsmfm/hubot-test-helper)をhubot-traq用にいい感じにしたもの

TypeScriptが使えます、多分

```
npm i --save-dev reyu0722/hubot-test-helper
```

```
"scripts": {
  "test": "mocha -r ts-node/register \"test/**/*.ts\""
}
```

```typescript
import Helper from 'hubot-test-helper'
import { expect } from 'chai'

const helper = new Helper('../scripts')
let room = helper.createRoom({ httpd: false })

describe('hello-world', () => {
  afterEach(() => {
    room.destroy()
    room = helper.createRoom({ httpd: false })
  })

  context('user says hi to hubot', () => {
    beforeEach(async () => {
      await room.user.say('alice', '@hubot hi')
      await room.user.say('bob', '@hubot hi')
    })

    it('should reply to user', () => {
      expect(room.messages).to.eql([
        ['alice', '@hubot hi'],
        ['hubot', '@alice hi'],
        ['bob', '@hubot hi'],
        ['hubot', '@bob hi']
      ])
    })
  })
})

```
