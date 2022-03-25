const { Client, Intents, Message, MessageAttachment, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
require('dotenv').config()

const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const Link = require('./models/Links');
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
      .setColor('#d94479')
      .addField('Projeto Start',
        '**st!help** - **st!ajuda** - **st!sobre**: Lista todos os comandos\n**st!regras**: Lista se não todas, ao menos muitas das regras do projeto Start.\n**st!meet** - **st!reunião** - **st!palestra**: Listar todas as informações sobre a reunião de hoje.\n**st!board** - **st!todo** - **st!tarefas**: Lista todos os afazeres pendentes e suas respectivas datas de entrega.\n**st!modulo**: Retorna uma imagem contendo informações sobre o módulo atual.'
      )
      .setDescription('O Projeto Start é uma aliança entre a Rede Cidadã, a Accenture do Brasil e a Accenture Foundation, que vem desde 2013, quando foi iniciado e denominado como Programming for the Future. Em 2016, por sua vez, foi denominado como Accenture do Futuro e a partir de 2018 como Start, justamente por incorporar habilidades tecnológicas de e-learning, aos moldes da Accenture Brasil, ou seja, a plataforma Canvas, na trajetória da formação de jovens para o mundo do trabalho. Assim como foram incorporadas habilidades e competências comportamentais. Em 2019, o projeto expandiu sua atuação, passando a ser chamado de Start (Latam), contando com o investimento direto da própria Accenture Foundation. Em âmbito nacional, o projeto acontece em Belo Horizonte e Recife e na América Latina na Argentina, México, Chile e Colômbia.')
      .setTimestamp()
      .setFooter({ text: 'Por Tathy do Start' });

    interaction.author.send({ embeds: [helpEmbed] })



  }

  if (message.startsWith('addlink ')) {

    const arguments = message.substring(8).split('$')

    if (arguments.length != 3) {
      interaction.channel.send('A sintaxe correta é **st!addlink <titulo>$<link>$<preço>**!')
      return
    }

    arguments[2] = parseInt(arguments[2])

    const addLink = new Link({
      title: arguments[0],
      link: arguments[1],
      price: arguments[2]
    }).save()

    interaction.channel.send('A página **' + arguments[0] + '** foi adicionada aos links!')

  }

  if (message == 'links') {


    Link.find(async (error, array) => {

      if (error) return

      const linksArray = await array.map((element) => {

        const price = element.price <= 0 ?
          'GRÁTIS'
          :
          'R$ ' + price

        return element.title + ' - ' + element.link + ' - ' + price + '\n'

      })

      interaction.channel.send('Lista de links salvos:\n'+linksArray.toString())

    })

  }

  if (message == 'meet' || message == 'reunião' || message == 'palestra') {

    Meet.find(function (err, arr) {

      if (err) return

      const image = arr[0].image.startsWith('https://') || arr[0].image.startsWith('http://') ?
        arr[0].image
        :
        ''

      const meetEmbed = new MessageEmbed()
        .setColor('#d94479')
        .setTitle(arr[0].title)
        .addField(arr[0].description.title,
          arr[0].description.text + arr[0].description.link
        )
        .setImage(image)
        .setFooter({ text: 'Por Tathy do Start' });

      interaction.channel.send({ embeds: [meetEmbed] });

    });

  }

  if (message.startsWith('ticket ')) {

    let report = message.substring(7)
    let userID = process.env.ADMIN_ID

    if (!userID) return

    interaction.reply('Ticket enviado com sucesso!')

    const user = await client.users.fetch(userID)

    if (report.length <= 4) return

    user.send('Olá! O usuário ' + interaction.author.username + ' enviou o seguinte ticket: **' + report + '**')

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