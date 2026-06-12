# MyLibrary — Frontend

Frontend da aplicação MyLibrary, uma biblioteca pessoal virtual.
Desenvolvido em React com Vite.

## Tecnologias utilizadas

- React
- Vite
- React Router DOM
- CSS por página (sem framework de UI)

## Estrutura do projeto

```
src/
├── assets/         # Imagens e recursos estáticos
├── components/     # Navbar, Footer, ProtectedRoute
├── pages/          # Um componente por página da aplicação
├── styles/         # Folha de estilos dedicada por página
├── utils/
│   ├── auth.js     # Gestão do token JWT no localStorage
│   └── api.js      # authFetch com injeção automática do token
├── App.jsx         # Definição de rotas
└── main.jsx        # Ponto de entrada
```

## Instalação e execução local

```bash
# Clonar o repositório
git clone https://github.com/jeremiasrivarola/PW-TP-LAB-36342-FRONTEND.git
cd frontend

# Instalar dependências
npm install

# Iniciar em modo de desenvolvimento
npm run dev
```

## Páginas da aplicação

| Rota | Página | Auth |
|------|--------|------|
| / | HomePage | Não |
| /login | LoginPage | Não |
| /register | RegisterPage | Não |
| /dashboard | DashboardPage | Sim |
| /all-books | AllBooksPage | Sim |
| /add-book | AddBookPage | Sim |
| /books/:id | BookDetailPage | Sim |
| /books/:id/edit | EditBookPage | Sim |
| /profile | ProfilePage | Sim |

## Funcionalidades

- Registo e login de utilizador
- Dashboard com livros organizados por estado (Por Ler, A Ler, Lidos)
- Listagem completa com filtros por estado e género
- Adição e edição de livros com capa por URL ou ficheiro local
- Pré-visualização de imagem antes de guardar
- Actualização de estado do livro inline
- Pesquisa de livros por título na Navbar
- Página de perfil com edição de dados e estatísticas pessoais
- Sessão protegida por JWT com redirect automático para login

## Notas

A aplicação detecta automaticamente o ambiente de execução:

- Em desenvolvimento aponta para `http://localhost:3000`
- Em produção aponta para a API na Vercel

## Deploy

O frontend está disponível em produção na Vercel.
