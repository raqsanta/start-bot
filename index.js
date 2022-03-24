const { Client, Intents, Message, MessageAttachment, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
require('dotenv').config()

const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const Meet = require('./models/Meet')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

async function main() {
  await mongoose.connect(process.env.URI);
}

main().then(() => console.log('MongoDB is working properly!')).catch(err => console.log(err));

client.on('messageCreate', async interaction => {

  const message = interaction.content.startsWith('st!') &&
    interaction.content.substring(3).toLowerCase() || null

  if (!message) return

  if (message == 'help' || message == 'sobre' || message == 'ajuda') {

    interaction.reply('Algumas informações sobre o robô foram enviadas ao seu privado.')
    
    const helpEmbed = new MessageEmbed()
    .setColor('#b93bb9')
    .addField('Lista de Comandos',
      'st!help - st!ajuda - st!sobre: Lista todos os comandos\nst!regras: Lista se não todas, ao menos muitas das regras do projeto Start.\nst!meet - st!reunião - st!palestra: Listar todas as informações sobre a reunião de hoje.\nst!board - st!todo - st!tarefas: Lista todos os afazeres pendentes e suas respectivas datas de entrega.\nst!modulo: Retorna uma imagem contendo informações sobre o módulo atual.'
    )
    .setTimestamp()
    .setFooter({ text: 'Por Tathy do Start' });

    interaction.author.send({ embeds: [helpEmbed] })

    

  }

  if (message == 'regras') {

    interaction.channel.send('aqui serão enviadas as regras do site')

  }

  if (message == 'meet' || message == 'reunião' || message == 'palestra') {

    Meet.find(function (err, arr) {

      if (err) return

      const image = arr[0].image.startsWith('https://') || arr[0].image.startsWith('http://') ?
      arr[0].image
      :
      ''

      const meetEmbed = new MessageEmbed()
        .setColor('#b93bb9')
        .setTitle(arr[0].title)
        .addField(arr[0].description.title,
          arr[0].description.text + arr[0].description.link
        )
        .setImage(image)
        .setTimestamp()
        .setFooter({ text: 'Por Tathy do Start' });

      interaction.channel.send({ embeds: [meetEmbed] });

    });

  }

  if (message == 'board' || message == 'todo' || message == 'tarefas') {

    interaction.channel.send('aqui estarão todas as tarefas e afazares pendentes:')

  }

  if (message == 'modulo') {

    (async () => {

      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.goto('https://academia.iphac.org.br/login/index.php');

      await page.evaluate(async (CPF, PASSWORD) => {

        document.getElementById('username').value = CPF
        document.getElementById('password').value = PASSWORD

      }, process.env.USER_CPF, process.env.USER_PASSWORD)

      await page.click('[id="loginbtn"]')

      await page.waitForNavigation();

      await page.goto('https://academia.iphac.org.br/pluginfile.php/288326/mod_page/content/3/amb_.png')

      const currentDate = Date.now()

      await page.screenshot({ path: './images/screenshot-' + currentDate + '.png' });

      await browser.close();

      const screenshot = new MessageAttachment('./images/screenshot-' + currentDate + '.png')

      interaction.reply({ files: [screenshot] })

    })()

  }

  if (message == 'scrap') {

    (async () => {

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://academia.iphac.org.br/login/index.php');

      const currentDate = Date.now()

      await page.evaluate(async (CPF, PASSWORD) => {

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

client.login(process.env.SECRET_TOKEN);