const { Client, Intents, Message, MessageAttachment } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
require('dotenv').config()

const puppeteer = require('puppeteer');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('messageCreate', async interaction => {

  if (!interaction.content.startsWith('st!')) return

  const message = interaction.content.substring(3)

  if (!message) return

  if (message == 'help' || message == 'sobre' || message == 'ajuda') {

    interaction.reply('Algumas informações sobre o robô foram enviadas ao seu privado.')
    interaction.author.send('teste')

  }

  if (message == 'regras') {

    interaction.channel.send('aqui serão enviadas as regras do site')

  }

  if (message == 'meet' || message == 'reunião' || message == 'palestra') {

    interaction.channel.send('a reunião hoje será sobre, conheça o palestrante link da reunião no meet:')

  }

  if (message == 'board' || message == 'avisos') {

    interaction.channel.send('aqui estarão todas as tarefas e afazares pendentes:')

  }

  if (message == 'scrap') {

    (async () => {

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://academia.iphac.org.br/login/index.php');

      const currentDate = Date.now()

      //await page.screenshot({ path: './images/screenshot-' + currentDate + '.png' });

      await page.evaluate( async (CPF, PASSWORD) => {

        //id = username
        //id = password
        //id = loginbtn

        document.getElementById('username').value = CPF
        document.getElementById('password').value = PASSWORD

      }, process.env.USER_CPF, process.env.USER_PASSWORD)

      await page.click('[id="loginbtn"]')

      await page.waitForNavigation();

      await page.screenshot({ path: './images/screenshot-' + currentDate + '.png' });

      await browser.close();

      const attachment = new MessageAttachment('./images/screenshot-' + currentDate + '.png')

      interaction.reply({ files: [attachment] })

    })();


  }



})


client.on('interactionCreate', async interaction => {

  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login(process.env.SECRET_TOKEN);