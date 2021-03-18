'use strict'

import Helper from '../src/index'
import { expect } from 'chai'

const helper = new Helper('./scripts')
const room = helper.createRoom({ httpd: false })

describe('hello-world', () => {
  afterEach(() => room.destroy())

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
