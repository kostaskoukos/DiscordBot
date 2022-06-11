const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, 'GUILD_MESSAGES', 'GUILD_MESSAGE_TYPING'] });
const axios = require('axios');
require('dotenv').config();

client.on('ready', () => {
    console.log('bot online!');
});

client.on('messageCreate', async msg => {
    if (msg.author.bot)
        return;

    const split = msg.content.split(' ');

    if (split[0] != '!nigger')
        return;

    const command = split[1];
    if (!command) {
        msg.channel.send('Πες μια εντολή ρε μαύρε');
        return;
    }

    if (greekopt('help', command)) {//HELP
        msg.channel.send('!nigger + επιλογές: αστείο/joke, ερώτηση/question & την ερώτηση');
        return;
    }

    if (greekopt('joke', command)) {//JOKE
        const joke = await axios.get('https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=religious,nsfw');
        if (joke.data.setup) {
            msg.channel.send(joke.data.setup);
            msg.channel.send(joke.data.delivery);
        } else {
            msg.channel.send(joke.data.joke);
        }
        return;
    }
//         slice -1 = last character
    if (msg.content.slice(-1) == '?' || msg.content.slice(-1) == ';') {// YES/NO QUESTION
        const yes = await axios.get('https://yesno.wtf/api');
        msg.channel.send(yes.data.answer=='yes'?'ναι':'όχι');
        // msg.channel.send(yes.data.image);
        return;
    }

    if (command == 'rickroll') {//RICKROLL
        msg.channel.send('https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713');
        return;
    }

    if (command == 'meme') {
        const meme = await axios.get('https://meme-api.herokuapp.com/gimme');
        msg.channel.send(meme.data.url);
        return;
    }

    msg.channel.send('Ποια εντολή είναι αυτή ρε μαύρε');
    // if (greekopt('help', command)) {
    //     msg.channel.send('!nigger + επιλογές: αστείο/joke, ερώτηση/question & την ερώτηση');

    // } else if (greekopt('joke', command)) {//JOKE
    //     const joke = await axios.get('https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=religious,nsfw');
    //     if (joke.data.setup) {
    //         msg.channel.send(joke.data.setup);
    //         msg.channel.send(joke.data.delivery);
    //     } else {
    //         msg.channel.send(joke.data.joke);
    //     }
    // } else if (greekopt('question', command)) {//QUESTION
    //     if (!split[2]) {
    //         msg.channel.send('Πες μια ερώτηση ρε μαύρε');
    //     } else {
    //         const yes = await axios.get('https://yesno.wtf/api');
    //         msg.channel.send(yes.data.answer);
    //         // msg.channel.send(yes.data.image);
    //     }
    // } else {
    //     msg.channel.send('Ποια εντολή είναι αυτή ρε μαύρε');
    // }

});

const greekopt = (string, command) => {
    if (string == 'help')
        return command == 'help' || command == 'βοηθεια' || command == 'βοήθεια';
    else if (string == 'joke')
        return command == 'joke' || command == 'αστείο' || command == 'αστειο';
    else if (string == 'question')
        return command == 'question' || command == 'ερώτηση' || command == 'ερωτηση';
    return;
}

client.login(process.env.TOKEN);
