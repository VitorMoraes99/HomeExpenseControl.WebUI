# 📊 Home Expense Control - Web (Front-end)

Este é o módulo Front-end do sistema de Controle de Gastos Residenciais. Uma aplicação web responsiva, construída com foco em usabilidade, performance e aderência estrita a regras de negócio financeiras.

## 🚀 Tecnologias Utilizadas

- **React (v18)** - Biblioteca principal para construção da interface.
- **TypeScript** - Tipagem estática para maior segurança e previsibilidade do código.
- **Vite** - Bundler ultrarrápido para desenvolvimento.
- **Tailwind CSS** - Estilização utilitária para um design moderno e responsivo.
- **Axios** - Gerenciamento de requisições HTTP para a API.
- **Lucide React** - Biblioteca de ícones limpos e consistentes.

## ✨ Funcionalidades e Regras de Negócio Implementadas

O sistema atende a 100% dos requisitos propostos, incluindo os desafios opcionais:

- **📊 Dashboard Financeiro Avançado:**
  - Cálculo em tempo real de totais de Entradas, Saídas e Saldo Atual.
  - Relatório detalhado agrupado por Pessoa.
  - Relatório detalhado agrupado por Categoria (Requisito Bônus).
- **👥 Gestão de Pessoas (CRUD Completo):**
  - Criação, edição, exclusão e listagem de usuários do sistema.
  - UX: Alerta de segurança ao tentar deletar um usuário (Cascade Delete na API).
- **🏷️ Gestão de Categorias (CRUD Completo):**
  - Organização por finalidade: Receita, Despesa ou Ambas.
- **💸 Gestão de Transações (CRUD Completo):**
  - Lançamento de receitas e despesas associadas a Pessoas e Categorias.
  - Regra de Negócio 1: Filtro dinâmico de categorias com base no tipo da transação escolhida.
  - Regra de Negócio 2: Bloqueio de interface para menores de 18 anos (forçando o lançamento apenas como "Despesa").

## ⚙️ Como executar o projeto localmente

### Pré-requisitos

- Node.js (versão 18 ou superior recomendada).
- Gerenciador de pacotes (npm ou yarn).
- A API Back-end em C# estar em execução localmente.

### Passo a passo

1. Clone o repositório
   git clone [COLOQUE_A_URL_AQUI]

2. Acesse a pasta do projeto
   cd [NOME_DA_PASTA_DO_FRONTEND]

3. Instale as dependências
   npm install

4. Configuração da API
   Certifique-se de que a URL da API no arquivo src/services/api.ts aponta para a mesma porta em que o seu Back-end C# está rodando (padrão: http://localhost:5175/api).

5. Inicie o servidor de desenvolvimento
   npm run dev

6. Acesse no navegador
   Abra o link fornecido no terminal (geralmente http://localhost:5173).

## 📁 Estrutura de Diretórios Principais

src/
├── components/ # Componentes isolados (ex: Modais, Formulários)
├── pages/ # Páginas da aplicação (Dashboard, Pessoas, Categorias)
├── services/ # Configurações de serviços externos (Axios API)
├── App.tsx # Configuração de Rotas e Layout principal
└── main.tsx # Ponto de entrada do React
