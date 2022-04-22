
# o start
O Projeto Start é um projeto que [eu](https://github.com/ggkei) participo como estudante da turma de Front-End. 

# o bot
De antemão, faz-se necessário avisar que esse bot não é gerido pelo Start ou Rede Cidadã, mas desenvolvido por e para os alunos. 
Seu código é aberto e todos podem editar ou estudá-lo livremente.

A principal ideia é que o bot disponha de comandos curtos que facilitem o trabalho dos usuários ao salvar links úteis para todos os alunos de uma mesma turma
(tais como cursos gratuitos), visualizar rapidamente qual será o tema da palestra ou reunião do dia, e verificar quais atividades estão pendentes.


![image](https://user-images.githubusercontent.com/98771718/164758539-765bf51a-4b17-4a8e-9246-b7b330792c07.png)

# como iniciar

Para que o bot funcione, você precisa, primeiramente, instalar o node.js.

Em um prompt de comando, direcione-se ao caminho do projeto e digite:

> npm i

Em seguida, crie um arquivo nomeado .env na raiz do projeto e cole os textos no bloco abaixo:

(Lembre-se de alterar as variáveis com seus dados.)
  
```
SECRET_TOKEN="<token-do-bot>"
USER_CPF="<cpf-da-plataforma>"
USER_PASSWORD="<senha-da-plataforma>"
ADMIN_ID="<discord-id>"
URI="mongodb+srv://<nome>:<senha>"
```

Novamente ao prompt de comando, digite:

> npm start

O bot deverá funcionar corretamente.

