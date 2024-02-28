const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ComponentType } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'help',
  description: '📜 Просмотрите все команды, доступные внизу!',
  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setTitle(`Commands of ${client.user.username}`)
      .setColor('#2F3136')
      .setDescription('**Пожалуйста, выберите категорию, чтобы просмотреть все ее команды**')
      .addFields({ name: `Ссылки:`, value: `- [Ютуб канал](Ваш ют каналл)\n- [Дискорд сервер](Ваш дс каналл)`, inline: true })
      
      .setTimestamp()
      .setFooter({
        text: `Запрошенный ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL()
      });

    const giveaway = new EmbedBuilder()
      .setTitle("Категории » Розыгрыш призов")
      .setColor('#2F3136')
      .setDescription("```yaml\nВот команды для розыгрыша призов:```")
      .addFields(
        { name: 'Create / Start', value: `Запустите розыгрыш в своей гильдии!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
        { name: 'Drop', value: `Запустите раздачу подарков!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
        { name: 'Edit', value: `Отредактируйте уже запущенный розыгрыш!!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
        { name: 'End', value: `Завершите уже запущенный розыгрыш!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
        { name: 'List', value: `Перечислите все розыгрыши, проводимые в этой гильдии!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
        { name: 'Pause', value: `Приостановите уже запущенный розыгрыш!\n > **Type: __\`slash\`__**`, inline: true },
        { name: 'Reroll', value: `Повторите розыгрыш завершившегося розыгрыша призов!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
        { name: 'Resume', value: `Возобновите приостановленный розыгрыш призов!\n > **Type: __\`slash\`__**`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL()
      });

    const general = new EmbedBuilder()
      .setTitle("Категории » Общие")
      .setColor('#2F3136')
      .setDescription("```yaml\nЗдесь приведены общие команды бота:```")
      .addFields(
        { name: 'Help', value: `Показаны все доступные команды для этого бота!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
        { name: 'Invite', value: `Получите ссылку для приглашения на загрузку!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
        { name: 'Ping', value: `Проверьте задержку веб-соединения бота!\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL()
      });

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Please Select a Category")
          .setDisabled(state)
          .addOptions([{
            label: `Giveaways`,
            value: `giveaway`,
            description: `Просмотрите все команды, основанные на розыгрыше призов!`,
            emoji: `🎉`
          },
          {
            label: `General`,
            value: `general`,
            description: `Просмотрите все общие команды бота!`,
            emoji: `⚙`
          }
          ])
      ),
    ];

    const initialMessage = await interaction.reply({ embeds: [embed], components: components(false) });

    const filter = (interaction) => interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector(
      {
        filter,
        componentType: ComponentType.SelectMenu,
        idle: 300000,
        dispose: true,
      });

    collector.on('collect', (interaction) => {
      if (interaction.values[0] === "giveaway") {
        interaction.update({ embeds: [giveaway], components: components(false) }).catch((e) => { });
      } else if (interaction.values[0] === "general") {
        interaction.update({ embeds: [general], components: components(false) }).catch((e) => { });
      }
    });
    collector.on('end', (collected, reason) => {
      if (reason == "time") {
        initialMessage.edit({
          content: "Collector Destroyed, Try Again!",
          components: [],
        });
      }
    })
  }
}
