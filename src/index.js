'use strict'

const Fs = require('fs')
const Path = require('path')
const Hubot = require('hubot/es2015')
const { MessageEvent } = require('./traq')

process.setMaxListeners(0)

class MockResponse extends Hubot.Response {
  sendPrivate(/* ...strings*/) {
    const strings = [].slice.call(arguments, 0)

    this.robot.adapter.sendPrivate.apply(this.robot.adapter, [this.envelope].concat(strings))
  }
}

class MockRobot extends Hubot.Robot {
  constructor(httpd) {
    if (httpd == null) {
      httpd = true
    }
    super(null, null, httpd, 'hubot')

    this.messagesTo = {}

    this.Response = MockResponse
  }

  messageRoom(roomName, str) {
    if (roomName == this.adapter.name) {
      this.adapter.messages.push(['hubot', str])
    } else {
      if (!(roomName in this.messagesTo)) {
        this.messagesTo[roomName] = []
      }
      this.messagesTo[roomName].push(['hubot', str])
    }
  }

  loadAdapter() {
    this.adapter = new Room(this)
  }
}

class Room extends Hubot.Adapter {
  // XXX: https://github.com/hubotio/hubot/pull/1390
  static messages(obj) {
    if (obj instanceof MockRobot) {
      return obj.adapter.messages
    } else {
      return obj.messages
    }
  }

  constructor(robot) {
    super()
    this.robot = robot
    this.messages = []

    this.privateMessages = {}

    this.user = {
      say: (user, text, options) => this.receive(user, text, options)
      // enter: (userName, userParams) => this.enter(userName, userParams),
      // leave: (userName, userParams) => this.leave(userName, userParams)
    }
  }

  receive(user, text, options) {
    return new Promise(resolve => {
      const message = new MessageEvent(user, text, options)
      this.messages.push([user, message.text])
      this.robot.receive(message, resolve)
    })
  }

  destroy() {
    if (this.robot.server) {
      this.robot.server.close()
    }
  }

  async reply(envelope /*, ...strings*/) {
    const strings = [].slice.call(arguments, 1)

    strings.forEach(str => Room.messages(this).push(['hubot', `@${envelope.user.name} ${str}`]))
  }

  async send(/*envelope , ...strings*/) {
    const strings = [].slice.call(arguments, 1)
    strings.forEach(str => {
      if (typeof str == 'string') Room.messages(this).push(['hubot', str])
      else Room.messages(this).push(['hubot', `:${str.name}:`])
    })
  }

  sendPrivate(envelope /*, ...strings*/) {
    const strings = [].slice.call(arguments, 1)

    if (!(envelope.user.name in this.privateMessages)) {
      this.privateMessages[envelope.user.name] = []
    }
    strings.forEach(str => this.privateMessages[envelope.user.name].push(['hubot', str]))
  }

  robotEvent() {
    this.robot.emit.apply(this.robot, arguments)
  }

  enter(userName, userParams) {
    if (userParams == null) {
      userParams = {}
    }
    return new Promise(resolve => {
      userParams.room = this.name
      const user = new Hubot.User(userName, userParams)
      this.robot.receive(new Hubot.EnterMessage(user), resolve)
    })
  }

  leave(userName, userParams) {
    if (userParams == null) {
      userParams = {}
    }
    return new Promise(resolve => {
      userParams.room = this.name
      const user = new Hubot.User(userName, userParams)
      this.robot.receive(new Hubot.LeaveMessage(user), resolve)
    })
  }
}

class Helper {
  constructor(scriptsPaths) {
    if (!Array.isArray(scriptsPaths)) {
      scriptsPaths = [scriptsPaths]
    }
    this.scriptsPaths = scriptsPaths
  }

  createRoom(options) {
    if (options == null) {
      options = {}
    }
    const robot = new MockRobot(options.httpd)

    if ('response' in options) {
      robot.Response = options.response
    }

    for (let script of this.scriptsPaths) {
      script = Path.resolve(Path.dirname(module.parent.filename), script)
      if (Fs.statSync(script).isDirectory()) {
        for (let file of Fs.readdirSync(script).sort()) {
          robot.loadFile(script, file)
        }
      } else {
        robot.loadFile(Path.dirname(script), Path.basename(script))
      }
    }

    robot.brain.emit('loaded')

    robot.adapter.name = options.name || 'room1'
    return robot.adapter
  }
}
Helper.Response = MockResponse

module.exports = Helper
