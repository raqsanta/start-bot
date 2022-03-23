const { Client, Intents, Message } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
require('dotenv').config()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('messageCreate', async interaction => {

  if (!interaction.content.startsWith('st!')) return

  const message = interaction.content.substring(3)

  if (!message) return

  if (message == 'avisos') {

    interaction.channel.send('aqui serão enviados os avisos do site')

  }

  if (message == 'regras') {

    interaction.channel.send('aqui serão enviadas as regras do site')

  }

  if (message == 'meet' || message == 'reunião' || message == 'palestra') {

    interaction.channel.send('a reunião hoje será sobre, link da reunião no meet:')

  }

  if (message == 'board') {

    interaction.channel.send('aqui estarão todas as tarefas e afazares pendentes:')

  }

})


client.on('interactionCreate', async interaction => {

  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login(process.env.SECRET_TOKEN);