# Agendamento PetShop

Projeto desenvolvido como **desafio prático** do curso **Full Stack** da [Rocketseat](https://www.rocketseat.com.br/). A proposta foi construir uma agenda de atendimentos para um pet shop, com interface moderna e funcionalidades essenciais de agendamento.

## Sobre o projeto

Aplicação web para visualizar e gerenciar agendamentos do dia, organizados por período (manhã, tarde e noite). O usuário pode criar novos atendimentos pelo modal, consultar a agenda por data e remover agendamentos existentes.

## Tecnologias utilizadas

| Tecnologia | Uso no projeto |
|------------|----------------|
| **HTML5** | Estrutura da página, formulários e elementos semânticos |
| **CSS3** | Estilização, layout responsivo e variáveis de cores/fontes |
| **JavaScript** | Lógica da aplicação (modal, calendário, agendamentos e validações) |

### CSS

- Organização em arquivos separados por componente e breakpoint
- **Flexbox** e **Grid** para layout
- **Media queries** para adaptação em mobile e desktop
- **Variáveis CSS** (`:root`) para cores, fontes e espaçamentos

### JavaScript

- Manipulação do DOM sem frameworks
- Eventos de clique, submit e teclado
- Validação de horários e prevenção de agendamentos duplicados
- Renderização dinâmica dos cards na agenda

## Funcionalidades

- Agenda inicial vazia com mensagem por período
- Filtro de agendamentos por data
- Cadastro de novos atendimentos via modal
- Formatação automática de telefone
- Bloqueio de horários já ocupados
- Remoção de agendamentos
- Layout responsivo

## Como executar

1. Clone ou baixe o repositório
2. Abra o arquivo `index.html` no navegador

Ou utilize uma extensão como **Live Server** no VS Code para melhor experiência de desenvolvimento.

Desafio prático — Rocketseat Full Stack
