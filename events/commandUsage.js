/**
 * @file commandUsage event
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

module.exports = (message, command) => {
  message.channel.send({
    embed: {
      color: message.client.colors.yellow,
      title: 'Invalid Use!',
      description: `See the usage below to know how to use \`${command.name}\` command.`,
      fields: [
        {
          name: 'Usage',
          value: `\`${command.usage}\``
        },
        {
          name: 'Example',
          value: `\`${command.example.join('`\n`') || '-'}\``
        }
      ],
      footer: {
        text: `Try ${message.client.config.prefix}help ${command.name} for more information.`
      }
    }
  }).catch(e => {
    message.client.log.error(e.stack);
  });
};