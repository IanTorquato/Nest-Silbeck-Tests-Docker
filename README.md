### Projeto onde testo muitas coisas para um possível uso na empresa em que trabalho

* Usando: Nest + TS + TypeORM + Docker + Docker Compose

* Containers: Server Node + Postgres + PgAdmin + Redis + Redis Commander

ps-1: Infelizmente não tenho tempo para fazer um Readme bonito (Nem nos outros projetos do meu perfil) por conta do combo de Trabalho e Faculdade.

ps-2: A verificaçãode "role" do usuário está sendo feita de forma Horrível, enviando o email pelo insomnia no lugar do Bearer Token. Situação somente de teste, o normal, obviamente, é fazer primeiro o login de usuários com JWT e retirar do token o id do usuário para pesquisa (Arquivo src/modules/auth/roles.guard.ts Linha 28).