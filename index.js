const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, 'GUILD_MESSAGES', 'GUILD_MESSAGE_TYPING'] });
const axios = require('axios');

client.on('ready', () => {
    console.log('bot online!');
});

client.on('messageCreate', async msg => {
    if (msg.author.user == client.user)
        return;

    const split = msg.content.split(' ');

    if (split[0] != '!nigger')
        return;

    const command = split[1];
    if (!command)
        msg.channel.send('Πες μια εντολή ρε μαύρε');

    if (greekopt('help', command)) {
        msg.channel.send('!nigger + επιλογές: αστείο/joke, ερώτηση/question & την ερώτηση');

    } else if (greekopt('joke', command)) {//JOKE
        const joke = await axios.get('https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=religious,nsfw');
        if (joke.data.setup) {
            msg.channel.send(joke.data.setup);
            msg.channel.send(joke.data.delivery);
        } else {
            msg.channel.send(joke.data.joke);
        }
    } else if (greekopt('question', command)) {//QUESTION
        if (!split[2]) {
            msg.channel.send('Πες μια ερώτηση ρε μαύρε');
        } else {
            const yes = await axios.get('https://yesno.wtf/api');
            msg.channel.send(yes.data.answer);
            // msg.channel.send(yes.data.image);
        }
    } else {
        msg.channel.send('Ποια εντολή είναι αυτή ρε μαύρε');
    }
});

const greekopt = (string, command) => {
    if (string == 'help')
        return command.toLowerCase() == 'help' || command.toLowerCase() == 'βοηθεια' || command.toLowerCase() == 'βοήθεια';
    else if (string == 'joke')
        return command.toLowerCase() == 'joke' || command.toLowerCase() == 'αστείο' || command.toLowerCase() == 'αστειο';
    else if (string == 'question')
        return command.toLowerCase() == 'question' || command.toLowerCase() == 'ερώτηση' || command.toLowerCase() == 'ερωτηση';
    return;
}

client.login('OTg0NDg1NDEzNDYyODg0Mzgz.GjJGuC.wXV-d8EpFKaLsXqcdVYeItaEePcV_YPKPlO0r4');