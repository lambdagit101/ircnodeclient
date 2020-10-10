var irc = require('irc');
const prompt = require('prompt');
const ircserver = require('./ircinfo.json').server;
const ircnick = require('./ircinfo.json').nickname;
const ircchannel = require('./ircinfo.json').channel;

var client = new irc.Client(ircserver, ircnick, {
    channels: [ircchannel],
});

console.log(`Logging in to ${ircserver} with nickname ${ircnick} on channel ${ircchannel}...`);
console.log('We recommend that you wait until you are connected to the channel before sending a message.');

function sendmessage() {
	const properties = [
		{
			name: 'Message'	
		}
	];
	prompt.start();
	
	prompt.get(properties, function (err, result) {
		client.say(ircchannel, result.Message);
		sendmessage();
	});
}

sendmessage();

client.addListener('error', function(message) {
    console.log('An error occurred: ', message);
});

client.addListener('message', function (from, to, message) {
    console.log(from + ': ' + message);
});

client.addListener('motd', function (motd) {
    console.log('MOTD: ' + motd);
});

client.addListener('topic', function (channel, topic, nick, message) {
    console.log(nick + ' ' + channel + ' ' + topic + ': ' + message);
});

client.addListener('join', function (channel, nick, message) {
    console.log(nick + ': ' + message);
});

client.addListener('quit', function (nick, reason, channels, message) {
    console.log(nick + ' has left. Reason: ' + reason);
});

client.addListener('kick', function (channel, nick, by, reason, message) {
    console.log(nick + ' was kicked from ' + channel + ' by ' + by + '. Reason: ' + reason);
});

client.addListener('registered', function (message) {
    console.log(message);
});

process.on('SIGHUP', function() {
  console.log('Quitting...');
  client.part(ircchannel);
  process.exit();
});