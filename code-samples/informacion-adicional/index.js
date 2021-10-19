const { Client, Intents, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const querystring = require('querystring');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

client.once('ready', () => {
	console.log('¡Listo!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'cat') {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

		interaction.reply({ files: [file] });
	} else if (commandName === 'urban') {
		const term = interaction.options.getString('term');
		const query = querystring.stringify({ term });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());

		if (!list.length) {
			return interaction.reply(`No se encontraron resultados para **${term}**.`);
		}

		const [answer] = list;

		const embed = new MessageEmbed()
			.setColor('#EFFF00')
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
				{ name: 'Definición', value: trim(answer.definition, 1024) },
				{ name: 'Ejemplo', value: trim(answer.example, 1024) },
				{ name: 'Votos', value: `${answer.thumbs_up} Pulgares arriba. ${answer.thumbs_down} Pulgares abajo.` },
			);
		interaction.reply({ embeds: [embed] });
	}
});

client.login('tu-token-va-aqui');
