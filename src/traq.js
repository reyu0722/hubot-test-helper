const { MessageCreated } = require('hubot-traq/src/events/events')

const settings = {
  event: {
    eventTime: '2021-02-16T19:41:22.316778Z'
  },
  user: {
    id: 'this-is-a-user-id-------------------',
    iconId: 'this-is-a-user-icon-id--------------',
    bot: false
  },
  message: {
    id: 'this-is-a-message-id----------------',
    user: 'user',
    channelId: '------------------------------------',
    embedded: [],
    createdAt: '2021-02-16T19:41:22.316778Z',
    updatedAt: '2021-02-16T19:41:22.316778Z'
  },
}



class User {
  constructor({ id, name, displayName, iconId, bot }) {
    if (!name) throw new Error()

    this.id = id || settings.user.id
    this.name = name
    this.displayName = displayName || name
    this.iconId = iconId || settings.user.iconId
    this.bot = bot || settings.user.bot
  }
}

class Message {
  constructor({ id, user, channelId, text, plainText, embedded, createdAt, updatedAt }) {
    if (!text) throw new Error()

    this.id = id || settings.message.id
    this.user = new User(user)
    this.channelId = channelId || settings.message.channelId
    this.text = text
    this.plainText = plainText || text
    this.embedded = embedded || settings.message.embedded
    this.createdAt = createdAt || settings.message.createdAt
    this.updatedAt = updatedAt || settings.message.updatedAt
  }
}

class MessageEvent extends MessageCreated {
  constructor(name, text, options) {
    const op = { text }
    if (typeof options === 'object') Object.assign(op, options)
    if (typeof op.user != 'object') op.user = { name }
    else op.user.name = name
    super({ eventTime: settings.event.eventTime, message: new Message(op) })
    this.user.name = name
  }
}

module.exports = { MessageEvent }