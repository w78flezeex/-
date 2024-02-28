const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ComponentType } = require("discord.js");
const config = require('../config.json');

module.exports.run = async (client, message, args) => {

const embed = new EmbedBuilder()
.setTitle(`Commands of ${client.user.username}`)
.setColor('#2F3136')
.setDescription('**Пожалуйста, выберите категорию, чтобы просмотреть все ее команды**')
.addFields({ name: `Ссылки:`, value: `- [Ютуб канал](https://www.youtube.com/channel/UC-ahntthLD-1M9UogTYhy9g)\n- [Дискорд сервер](https://discord.gg/ZVzuq4kuu3)`, inline: true })
.setTimestamp()
.setFooter({
  text: `Requested by ${message.author.username} | ` + config.copyright, 
  iconURL: message.author.displayAvatarURL()
});

  const giveaway = new EmbedBuilder()
  .setTitle("Categories » Розыгрыш")
  .setColor('#2F3136')
  .setDescription("```yaml\nВот команды раздачи:```")
  .addFields(
    { name: 'Create / Start'  , value: `Запустите розыгрыш в своей гильдии!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
    { name: 'Drop' , value: `Начни розыгрыш капель!\n > **Types: __\`slash\` / \`сообщение\`__**`, inline: true },
    { name: 'Edit' , value: `Отредактируйте уже действующую раздачу!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
    { name: 'End' , value: `Завершите уже действующую акцию!\n > **Types: __\`slash\` / \`сообщение\`__**`, inline: true },
    { name: 'List' , value: `Перечислите все розыгрыши, проводимые в этой гильдии!\n > **Types: __\`clash\` / \`message\`__**`, inline: true },
    { name: 'Pause' , value: `Приостановите уже действующую розыгрыш!\n > **Type: __\`slash\`__**`, inline: true },
    { name: 'Reroll' , value: `Перезалейте завершившийся розыгрыш!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
    { name: 'Resume' , value: `Возобновите приостановленную раздачу!\n > **Type: __\`slash\`__**`, inline: true },
  )
  .setTimestamp()
  .setFooter({
    text: `Requested by ${message.author.username} | ` + config.copyright, 
    iconURL: message.author.displayAvatarURL()
  });

  const general = new EmbedBuilder()
  .setTitle("Categories » Общий")
  .setColor('#2F3136')
  .setDescription("```yaml\nВот общие команды бота:```")
  .addFields(
    { name: 'Help'  , value: `Показывает все доступные команды этому боту!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
    { name: 'Invite' , value: `Получите ссылку-приглашение бота!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
    { name: 'Ping' , value: `Проверьте задержку веб-сокета бота!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
  )
  .setTimestamp()
  .setFooter({
    text: `Запрошенный ${message.author.username} | ` + config.copyright, 
    iconURL: message.author.displayAvatarURL()
  });
  
  const components = (state) => [
    new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
        .setCustomId("меню помощи")
        .setPlaceholder("Пожалуйста выберити категорию")
        .setDisabled(state)
        .addOptions([{
                label: `Подарки`,
                value: `отдавать`,
                description: `Просмотрите все команды, основанные на бесплатных раздачах!`,
                emoji: `🎉`
            },
            {
                label: `Общий`,
                value: `общий`,
                description: `Просмотр всех общих команд бота!`,
                emoji: `⚙`
            }
        ])
    ),
];

const initialMessage = await message.reply({ embeds: [embed], components: components(false) });

const filter = (interaction) => interaction.user.id === message.author.id;

        const collector = message.channel.createMessageComponentCollector(
            {
                filter,
                componentType: ComponentType.SelectMenu,
                idle: 300000,
                dispose: true,
            });

        collector.on('collect', (interaction) => {
            if (interaction.values[0] === "giveaway") {
                interaction.update({ embeds: [giveaway], components: components(false) }).catch((e) => {});
            } else if (interaction.values[0] === "general") {
                interaction.update({ embeds: [general], components: components(false) }).catch((e) => {});
            }
        });
        collector.on("конец", (collected, reason) => {
            if (reason == "время") {
                initialMessage.edit({
                   content: "Коллекционер уничтожен, попробуйте еще раз!",
                   components: [],
                });
             }
        });
}
