/**
 * @file quake3 command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const Q3 = require('gamedig');

exports.exec = (Bastion, message, args) => {
  if (args.length < 1 || !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(args = args[0])) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  args = args.split(':');
  let host = args[0];

  if (host === '127.0.0.1') {
    return message.channel.send({
      embed: {
        description: 'There is no place like `127.0.0.1`'
      }
    });
  }

  let port;
  if (args[1]) {
    port = parseInt(args[1]);
  }
  else {
    port = 27960;
  }

  Q3.query({
    type: 'quake3',
    host: host,
    port: port
  }).then(data => {
    let stats = [
      {
        name: 'Server IP',
        value: `[${host}:${port}](steam://connect/${host}:${port})`,
        inline: true
      },
      {
        name: 'Private',
        value: data.password,
        inline: true
      },
      {
        name: 'Players',
        value: `${data.players.length}/${data.maxplayers}`,
        inline: true
      },
      {
        name: 'Map/Gametype',
        value: `${data.map} - ${data.raw.g_gametype}`
      }
    ];

    if (data.players.length > 0) {
      let players = [];
      let scores = [];
      for (let i = 0; i < data.players.length; i++) {
        players.push(data.players[i].name);
      }
      for (let i = 0; i < data.players.length; i++) {
        scores.push(data.players[i].frags);
      }
      stats.push(
        {
          name: 'Player',
          value: players.join('\n'),
          inline: true
        },
        {
          name: 'Score',
          value: scores.join('\n'),
          inline: true
        }
      );
    }

    message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: data.name,
        description: '[Quake III Arena](https://store.steampowered.com/app/2200)',
        fields: stats
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }).catch(() => {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'connection'), Bastion.strings.error(message.guild.language, 'invalidIPPort', true), message.channel);
  });
};

exports.config = {
  aliases: [ 'q3' ],
  enabled: true
};

exports.help = {
  name: 'quake3',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'quake3 <Q3_SERVER_IP>[:PORT]',
  example: [ 'quake3 139.59.31.128', 'quake3 139.59.31.128:27960' ]
};
