# como iniciar

Para que o bot funcione, você precisa, primeiramente, instalar o node.js.

Em um prompt de comando, você deve direcionar-se ao caminho do projeto e digitar:

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

