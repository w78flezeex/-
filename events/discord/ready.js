const register = require('../../utils/slashsync');
const { ActivityType } = require('discord.js');

module.exports = async (client) => {
  await register(client, client.register_arr.map((command) => ({
    name: command.name,
    description: command.description,
    options: command.options,
    type: '1'
  })), {
    debug: true
  });
  // Register slash commands - ( If you are one of those people who read the codes I highly suggest ignoring this because I am very bad at what I am doing, thanks LMAO )
  console.log(`[ / | Команда Slash ] - ✅ Загружены все команды косой черты!`)
  let invite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}permissions=1342500081&scope=applications.commands%20bot`;
  console.log(`[STATUS] ${client.user.tag} теперь доступна!\n[INFO] Сюда вашу ссылку на ют каналл[Invite Link] ${invite}`);
  client.user.setPresence({
  activities: [{ name: `!help`, type: ActivityType.Watching }],
  status: 'online',
});

};
