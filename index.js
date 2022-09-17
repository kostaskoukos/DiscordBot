const { Client, Intents } = require('discord.js');
const { Player, QueryType } = require('discord-player');
const { GatewayIntentBits } = require('discord-api-types/v10');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', GatewayIntentBits.MessageContent] });
const axios = require('axios');
require('dotenv').config();

client.on('ready', () => {
    console.log('bot online!');
});

let player;
let queue;
let first = true;
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

    if (command == 'play') {
        if (!msg.member.voice.channel)
            return msg.channel.send('Μπες σε ένα voice channel ρε μαύρε');

        if (first) {
            console.log('first');
            player = new Player(client);
            queue = player.createQueue(msg.guild, {
                metadata: msg.channel
            });
            // await queue.connect(msg.member.voice.channel);
            // console.log('connecting');
            first = false;
        }

        if (queue.destroyed) {
            console.log('destroyed');
            queue = player.createQueue(msg.guild, {
                metadata: msg.channel
            });
        }
        if (!queue.connection) {
            await queue.connect(msg.member.voice.channel);
            console.log('connecting');
        }

        queue.clear();
        const arg = msg.content.substring(13);

        if (arg.includes('youtube.com/')) {
            if (arg.includes('playlist')) {                      //PLAYLIST
                await player.search(arg, {
                    requestedBy: msg.author,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                }).then(res => {
                    const tracks = res.tracks;
                    if (!tracks) {
                        msg.channel.send('Δεν βρίσκω το playlist ρε μαύρε');
                        return;
                    }
                    queue.addTracks(tracks);
                });
            } else {                                            //SONG
                await player.search(arg, {
                    requestedBy: msg.author,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                }).then(res => {
                    const track = res.tracks[0];
                    if (!track) {
                        msg.channel.send('Δεν βρίσκω το τραγούδι ρε μαύρε');
                        return;
                    }
                    queue.addTrack(track);
                });
            }
        } else {                                                 //SEARCH TERMS
            await player.search(arg, {
                requestedBy: msg.author,
                searchEngine: QueryType.AUTO
            }).then(res => {
                const track = res.tracks[0];
                if (!track) {
                    msg.channel.send('Δεν βρίσκω το τραγούδι ρε μαύρε');
                    return;
                }
                queue.addTrack(track);
            });
        }
        console.log(queue.tracks.length);
        queue.play();
        let sendonce = true;
        player.on('trackStart', (q, track) => {
            if (sendonce) {
                msg.channel.send(`Τώρα παίζει: **${track.title}**(${track.duration})`);
                sendonce = false;
            }
        });
        return;
    }
    if (command == 'pause') {
        queue.connection.pause(true);
        console.log(queue.playing);
        msg.channel.send('Η μουσική σταμάτησε!');
        return;
    }
    if (command == 'resume') {
        queue.connection.resume();
        msg.channel.send('Η μουσική ξαναξεκίνησε!');
        return;
    }
    if (command == 'skip') {
        if (queue.tracks.length == 0)
            return msg.channel.send('Υπάρχει μόνο ένα τραγούδι στην λίστα ρε μαύρε');
        queue.skip();
        msg.channel.send('Το τρέχον τραγούδι παραλείφθηκε!');
        return;
    }
    if (command == 'stop') {
        queue.destroy();
        msg.channel.send('Ο nigger βγήκε από το voice channel');
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