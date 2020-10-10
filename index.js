var irc = require('irc'); // Loading the IRC functions so we have a working IRC client
const prompt = require('prompt'); // Loading the prompt function so we can send messages
const ircserver = require('./ircinfo.json').server;
const ircnick = require('./ircinfo.json').nickname;
const ircchannel = require('./ircinfo.json').channel;
const ircport = require('./ircinfo.json').ircport;
const ircrealname = require('./ircinfo.json').realname;
const ircusername = require('./ircinfo.json').username;
const prefix = require('./ircinfo.json').commandprefix;

var client = new irc.Client(ircserver, ircnick, {
    channels: [ircchannel],
	port: ircport,
	realName: ircrealname,
	userName: ircusername
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
		if (result.Message.toLowerCase().startsWith(`${prefix}disconnect`)) {
			console.log('Quitting...');
			client.part(ircchannel);
			process.exit();	
		} else {
			client.say(ircchannel, result.Message);
		}
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
    console.log(nick + ' was kicked from ' + ircserver + ' by ' + by + '. Reason: ' + reason);
});

client.addListener('kill', function (nick, reason, channel, message) {
    console.log(nick + ' was killed from ' + ircserver + '. Reason: ' + reason);
});

client.addListener('nick', function (oldnick, newnick, channels, message) {
    console.log(oldnick + ' changed nickname to ' + newnick + '.');
});

client.addListener('registered', function (message) {
    console.log(message);
});

process.on('SIGHUP', function() {
  console.log('Quitting...');
  client.part(ircchannel);
  process.exit();
});