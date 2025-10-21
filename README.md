#  Simulador de Gerenciamento de Arquivos

Trabalho prático desenvolvido para a disciplina de Sistemas Operacionais, focado no estudo e simulação de Gerenciamento de Arquivos.

##  Objetivo

Este projeto tem como objetivo consolidar o conhecimento sobre Gerenciamento de Arquivos em Sistemas Operacionais. Ele é composto por duas partes:

1.  **Pesquisa Teórica:** Um estudo aprofundado sobre estruturas de diretórios, métodos de acesso, proteção e sistemas de arquivos como FAT, NTFS e ext4.
2.  **Ferramenta de Simulação:** Uma aplicação (algoritmo base) que simula visualmente como o Sistema Operacional aloca espaço em disco para arquivos, facilitando o aprendizado prático dos conceitos.

---

##  A Ferramenta de Simulação

O núcleo deste projeto é um simulador que demonstra diferentes métodos de alocação de espaço em disco. A ferramenta permite ao usuário "criar" e "deletar" arquivos virtuais e observar visualmente como os blocos de um disco simulado são gerenciados.

### Funcionalidades

* **Visualização do "Disco":** Uma representação gráfica ou textual dos blocos de dados, mostrando quais estão livres ou ocupados.
* **Simulação de Métodos de Alocação:**
    * **Alocação Encadeada (Ex: FAT):** Demonstra como os arquivos são armazenados em blocos não contíguos, com ponteiros (ou uma tabela) ligando-os.
    * **(Opcional) Alocação Contígua:** Mostra a alocação de arquivos em blocos sequenciais e o problema da fragmentação externa.
    * **(Opcional) Alocação Indexada (Ex: Inode/ext4):** Simula o uso de um "bloco de índice" que aponta para os blocos de dados do arquivo.
* **Operações Básicas:** Permite criar arquivos (especificando um tamanho) e deletar arquivos, liberando os blocos correspondentes.

---

##  Tecnologias Utilizadas

* **Linguagem:** [TypeScript ]  * **Bibliotecas:** [Listar bibliotecas, ex: 'rich' para Python se for terminal colorido]

---

##  Como Executar

Exportar para Github através do botão "Exportar para Github"
Clonar e instalar:

git clone <SEU_GIT_URL>
cd <SEU_PROJETO>
npm install
Adicionar plataforma Android:

npx cap add android
npx cap update android
Construir e executar:

npm run build
npx cap sync
npx cap run android
Observação: você precisa ter o Android Studio instalado

O que vem a seguir?
Adicione mais comandos : vim, nano, ping, curl
Executar JavaScript : eval de código JS real
Temas : Múltiplos esquemas de núcleos
Persistência : Salvar arquivos localmente

---

##  Autores (Grupo)

* [ Arthur]
* [Heloyse]
* [Jean]
* [Juliano]

---

**Disciplina:** Sistemas Operacionais  
**Professor:** [Dr. Rallyson dos Santos Ferreira]  
**Instituição:** [Universidade Federal do Amazonas]
