// Description:

//   Test script
module.exports = (robot: HubotTraq.Robot) => robot.respond(/hi$/i, msg => msg.reply('hi'))
