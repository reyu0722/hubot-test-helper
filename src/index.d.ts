import Hubot from 'hubot'

declare namespace HubotTestHelper {
  class MockRobot extends Hubot.Robot {
    messageTo: Object
    Response: Response
    messageRoom(roomName: string, str: string): void
    loadAdapter(): void
  }
  class Room extends Hubot.Adapter {
    robot: MockRobot
    messages: string[][]
    privateMessages: Object
    user: {
      say(user: string, text: string, options?: Object): Promise<void>
    }
    receive(user: string, text: string, options?: Object): Promise<void>
    destroy(): void
    reply(...strings: string[]): void
    send(...strings: string[]): void
    sendPrivate(...strings: string[]): void
    robotEvent(): void
  }
  class Response extends Hubot.Response {
    sendPrivate(...strings: string[]): void
  }
  class Helper {
    constructor(scriptsPaths: string | string[])
    scriptsPaths: string[]
    createRoom(options?: Object | null): Room
    Response: Response
  }
}

export = HubotTestHelper.Helper
export as namespace HubotTestHelper
