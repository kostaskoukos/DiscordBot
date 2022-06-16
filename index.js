const { Client, Intents } = require('discord.js');
const voice = require('@discordjs/voice');
const { Player, QueryType } = require('discord-player');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] });
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
        return msg.channel.send('Πες μια εντολή ρε μαύρε');
    }

    // if (greekopt('help', command)) {//HELP
    //     msg.channel.send('!nigger + επιλογές: αστείο/joke, ερώτηση/question & την ερώτηση');
    //     return;
    // }

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
        return msg.channel.send(yes.data.answer == 'yes' ? 'ναι' : 'όχι');
        // msg.channel.send(yes.data.image);
    }

    if (command == 'rickroll') {//RICKROLL
        return msg.channel.send('https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713');
    }

    if (command == 'meme') {
        const meme = await axios.get('https://meme-api.herokuapp.com/gimme');
        return msg.channel.send(meme.data.url);
    }

    const vc = msg.member.voice.channel;
    const player = new Player(client);
    const queue = player.createQueue(msg.guild, {
        metadata: msg.channel
    });
    if (!queue.connection) await queue.connect(vc);

    if (command == 'play') {
        if (!vc)
            return msg.channel.send('Μπες σε ένα voice channel ρε μαύρε');


        const arg = msg.content.substring(13);

        if (arg.includes('youtube.com/')) {
            if (arg.includes('playlist')) {                      //PLAYLIST
                const tracks = await player.search(arg, {
                    requestedBy: msg.author,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                }).then(res => res.tracks);

                if (!tracks) {
                    msg.channel.send('Δεν βρίσκω το playlist ρε μαύρε');
                    return;
                }

                queue.addTracks(tracks);
            } else {                                            //SONG
                const track = await player.search(arg, {
                    requestedBy: msg.author,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                }).then(res => res.tracks[0]);

                if (!track) {
                    msg.channel.send('Δεν βρίσκω το τραγούδι ρε μαύρε');
                    return;
                }

                queue.addTrack(track);
            }
        } else {                                                 //SEARCH TERMS
            const track = await player.search(arg, {
                requestedBy: msg.author,
                searchEngine: QueryType.AUTO
            }).then(res => res.tracks[0]);

            if (!track) {
                msg.channel.send('Δεν βρίσκω το τραγούδι ρε μαύρε');
                return;
            }

            queue.addTrack(track);
        }
        queue.play();
        player.on('trackStart', (q, track) => { msg.channel.send(`Τώρα παίζει: **${track.title}**`); })
        return;
    }
    if (command == 'pause') {
        queue.connection.pause(false);
        return;
    }
    if (command == 'resume') {
        queue.connection.resume();
        return;
    }
    if (command == 'skip') {
        queue.skip();
        queue.play();
        return;
    }
    if (command == 'stop') {
        queue.destroy(true);
        return;
    }
    msg.channel.send('Ποια εντολή είναι αυτή ρε μαύρε');
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
