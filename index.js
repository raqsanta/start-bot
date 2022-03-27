const { Client, Intents, Message, MessageAttachment, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
require('dotenv').config()

const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const Link = require('./models/Links');
const Meet = require('./models/Meet');
const Todo = require('./models/Todo');
const Users = require('./models/Users');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

async function main() {
  await mongoose.connect(process.env.URI);
}

async function getUserData(id) {

  //vai retornar todos os dados do usuário, se ele n existir vai retornar um null
  return await Users.findOne({ id: id })

}

main().then(() => console.log('MongoDB is working properly!')).catch(err => console.log(err));

client.on('messageCreate', async interaction => {

  const message = interaction.content.startsWith('st!') &&
    interaction.content.substring(3) || null

  if (!message || interaction.author.bot) return


  //Cadastro de Usuário no MongoDB
  const getUser = await getUserData(interaction.author.id)

  if (!getUser) {

    if (message.toLowerCase() == 'turma frontend') {

      new Users({

        id: interaction.author.id,
        isAdmin: false,
        course: 'Front-end'

      }).save()

      interaction.reply('Usuário registrado com sucesso!')

      return

    }

    if (message.toLowerCase() == 'turma backend') {

      new Users({

        id: interaction.author.id,
        isAdmin: false,
        course: 'Back-end'

      }).save()

      interaction.reply('Usuário registrado com sucesso!')

      return

    }

    interaction.reply('Informe a sua turma para continuar. \nResponda com o comando **st!turma frontend** ou **st!turma backend**')
    return

  }

  //Fim do Cadastro

  if (message.toLowerCase() == 'help' || message.toLowerCase() == 'sobre' || message.toLowerCase() == 'ajuda') {

    interaction.reply('Algumas informações sobre o robô foram enviadas ao seu privado.')

    const helpEmbed = new MessageEmbed()
      .setColor('#d94479')
      .addField('Projeto Start',
        [
          '**st!help** - **st!ajuda** - **st!sobre**: Lista todos os comandos',
          '**st!links**: Lista todos os links salvos pelos usuários para futuros estudos.',
          '**st!addlink <titulo>$<link>$<preço>**: Adiciona um link publicamente para o banco de dados.',
          '**st!removelink <titulo>**: Remove um link adicionado através do título.',
          '**st!meet - st!reunião - st!palestra**: Recebe informações sobre a reunião de hoje assim que ela é anunciada.',
          '**st!ticket <texto>**: Envia uma reclamação e rapidamente trabalharemos em uma solução.',
          '**st!todo - st!board - st!tarefas**: Lista todas as tarefas pendentes e os dias restantes para o dia de entrega.',
          '**st!addtodo <texto>$<dd/mm/yyyy>**: Adiciona uma tarefa pendente através da descrição e data de entrega.',
          '**st!modulo**: Recebe informações sobre o atual módulo do Start.'
        ].join('\n')
      )
      .setDescription('O Projeto Start é uma aliança entre a Rede Cidadã, a Accenture do Brasil e a Accenture Foundation, que vem desde 2013, quando foi iniciado e denominado como Programming for the Future. Em 2016, por sua vez, foi denominado como Accenture do Futuro e a partir de 2018 como Start, justamente por incorporar habilidades tecnológicas de e-learning, aos moldes da Accenture Brasil, ou seja, a plataforma Canvas, na trajetória da formação de jovens para o mundo do trabalho. Assim como foram incorporadas habilidades e competências comportamentais. Em 2019, o projeto expandiu sua atuação, passando a ser chamado de Start (Latam), contando com o investimento direto da própria Accenture Foundation. Em âmbito nacional, o projeto acontece em Belo Horizonte e Recife e na América Latina na Argentina, México, Chile e Colômbia.')
      .setTimestamp()
      .setFooter({ text: 'Por Tathy do Start' });

    interaction.author.send({ embeds: [helpEmbed] })



  }

  if (message.toLowerCase().startsWith('addlink ')) {

    const arguments = message.substring(8).split('$')

    if (arguments.length != 3) {
      interaction.channel.send('A sintaxe correta é **st!addlink <titulo>$<link>$<preço>**!')
      return
    }

    arguments[2] = parseInt(arguments[2])

    const addLink = new Link({
      title: arguments[0],
      course: getUser.course,
      link: arguments[1],
      price: arguments[2]
    }).save()
      .then(() => {
        interaction.channel.send('A página **' + arguments[0] + '** foi adicionada aos links!')
      })
      .catch(() => {
        interaction.channel.send('Esse título já se encontra na lista de links!')
      })


  }

  if (message.toLowerCase().startsWith('removelink ')) {

    const arguments = message.substring(11)

    Link.deleteOne({
      title: arguments
    })
      .then((element) => {
        if (element.deletedCount > 0) {
          interaction.channel.send('Link removido com sucesso!')
        } else {
          interaction.channel.send('Link não encontrado na lista!')

        }
      })

  }

  if (message.toLowerCase() == 'links') {

    Link.find({ course: getUser.course }, async (error, array) => {

      if (error) return

      const linksArray = await array.map((element, index) => {

        const price = element.price <= 0 ?
          'GRÁTIS'
          :
          'R$ ' + element.price

        if (index == 0) {
          return element.title + ' - ' + element.link + ' - ' + price + '\n'
        }

        return element.title + ' - <' + element.link + '> - ' + price + '\n'

      })

      interaction.channel.send('Lista de Cursos Salvos para ' + getUser.course + ':\n' + linksArray.join(''))

    })

  }

  if (message.toLowerCase() == 'editmeet ') {

    const arguments = message.substring(9).split('$')

    if (arguments.length != 5) {
      interaction.channel.send('A sintaxe correta é **st!editmeet <data>$<url-imagem>$<titulo>$<descrição>$<link>**!')
      return
    }

    Meet.findOneAndUpdate({ course: getUser.course }, {

      title: 'Start ' + arguments[0],
      image: arguments[1],
      description: {
        title: arguments[2],
        text: arguments[3],
        link: arguments[4],
      }

    })

  }

  if (message.toLowerCase() == 'meet' || message.toLowerCase() == 'reunião' || message.toLowerCase() == 'palestra') {

    Meet.findOne({ course: getUser.course }, function (err, arr) {

      if (err || !arr) return

      const image = arr.image.startsWith('https://') || arr.image.startsWith('http://') ?
        arr.image
        :
        ''

      const meetEmbed = new MessageEmbed()
        .setColor('#d94479')
        .setTitle(arr.title)
        .addField(arr.description.title,
          arr.description.text + arr.description.link
        )
        .setImage(image)
        .setFooter({ text: 'Por Tathy do Start' });

      interaction.channel.send({ embeds: [meetEmbed] });

    });

  }

  if (message.toLowerCase().startsWith('ticket ')) {

    let report = message.substring(7)
    let userID = process.env.ADMIN_ID

    if (!userID) return

    interaction.reply('Ticket enviado com sucesso!')

    const user = await client.users.fetch(userID)

    if (report.length <= 4) return

    user.send('Olá! O usuário ' + interaction.author.username + ' enviou o seguinte ticket: **' + report + '**')

  }

  if (message.toLowerCase().startsWith('addtodo ')) {

    const arguments = message.substring(8).split('$')

    if (arguments.length != 2) {
      interaction.channel.send('A sintaxe correta é **st!addtodo <texto>$<dd/mm/yyyy>**!')
      return
    }

    const date = arguments[1].split('/')
    const day = date[0]
    const month = date[1]
    const year = date[2]

    new Todo({
      title: arguments[0],
      course: getUser.course,
      date: {

        day: parseInt(day, 10),
        month: parseInt(month, 10) - 1,
        year: parseInt(year, 10),

      }
    }).save()

    interaction.channel.send('A tarefa **' + arguments[0] + '** foi adicionada a lista de to do!')

  }

  if (message.toLowerCase() == 'board' || message.toLowerCase() == 'todo' || message.toLowerCase() == 'tarefas') {

    Todo.find({ course: getUser.course }, async (error, array) => {

      if (error) return

      const currentDate = new Date()

      const todoList = await array.map((element) => {

        const elementDate = new Date(element.date.year, element.date.month, element.date.day)

        const timeRemaining = new Date(elementDate - currentDate)
        const daysRemaining = (Math.round(timeRemaining / 86400000)) + 1

        if (daysRemaining >= 0) {

          return element.title + ' - ' + daysRemaining + ' dias restantes'

        }

      })

      const filterList = await todoList.filter((element) => {

        return element !== undefined

      })

      filterList &&
        interaction.channel.send('Lista de Pendências para ' + getUser.course + ':\n' + todoList.join('\n'))

    })

  }

  if (message.toLowerCase() == 'modulo') {

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

})

client.login(process.env.SECRET_TOKEN);