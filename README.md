# Controle Financeiro Pessoal

Aplicação web para organização e controle financeiro pessoal, desenvolvida com foco em simplicidade, organização modular de código e execução direta no navegador.

O projeto resolve a dificuldade de acompanhar receitas e despesas cotidianas, oferecendo uma visão unificada do saldo atual, histórico detalhado de movimentações, suporte a compras parceladas e gráficos visuais para análise da distribuição de gastos e evolução temporal.

---

## Funcionalidades

### Funcionalidades Implementadas

* **Gestão de Receitas e Despesas**
  * Cadastro de entradas (receitas) e saídas (despesas) com valor, descrição, data e categoria.
  * Validação de campos (valores positivos, descrições obrigatórias e datas no formato ISO válido).
  * Listas separadas para visualização de receitas e despesas cadastradas.
  * Edição de registros existentes com preenchimento automático do formulário.
  * Exclusão individual de movimentações.

* **Parcelamento de Transações**
  * Divisão de receitas ou despesas em múltiplas parcelas (mínimo de 2 parcelas).
  * Distribuição exata de centavos para garantir que a soma das parcelas seja idêntica ao valor total informado.
  * Cálculo e projeção automática das datas de vencimento mês a mês, tratando variações de dias entre meses.
  * Identificação visual da parcela atual e do total de ocorrências (ex.: `Parcela 1/6`).

* **Painel de Totais e Saldo**
  * Cálculo em tempo real de Receitas Totais, Despesas Totais e Saldo Líquido.
  * Destaque visual dinâmico para indicar saldo positivo ou negativo.

* **Histórico com Múltiplos Filtros e Pesquisa**
  * Exibição cronológica unificada de todas as movimentações.
  * Filtro por categoria (ex.: Alimentação, Moradia, Salário, Lazer, etc.).
  * Filtro por tipo de lançamento: Todos, Únicos ou Parcelados.
  * Filtro por período mensal, gerado dinamicamente com base nas datas cadastradas.
  * Campo de busca em tempo real por palavras-chave na descrição.

* **Visualização com Gráficos Interativos (Chart.js)**
  * **Receitas x Despesas**: Gráfico em formato de rosca (*doughnut*) exibindo proporções, porcentagens calculadas e valores consolidados.
  * **Despesas por Categoria**: Gráfico em formato de rosca (*doughnut*) detalhando a distribuição percentual e o valor gasto em cada categoria.
  * **Evolução Mensal**: Gráfico de linha (*line chart*) comparando o histórico de receitas e despesas ao longo dos meses.

* **Persistência de Dados no Navegador**
  * Armazenamento local contínuo via `localStorage`.
  * Sanitização, normalização e controle de versão de dados na inicialização.

### Funcionalidades Planejadas

As seguintes funcionalidades representam elementos da interface ainda não integrados ou planos para versões futuras:

* **Autenticação de Usuários**: A interface possui uma tela de login estática (`login.html`), mas a validação de credenciais, sessão e múltiplos usuários ainda não estão implementadas.
* **Metas Financeiras e Relatórios Detalhados**: Itens presentes na barra de navegação e na seção de extras que serão desenvolvidos em etapas posteriores.
* **Exportação e Importação de Dados**: Possibilidade de exportar dados para planilhas (CSV) ou backup em arquivo JSON.
* **Gerenciamento de Categorias**: Permitir que o usuário adicione, edite ou remova categorias personalizadas.

---

## Tecnologias Utilizadas

| Tecnologia | Função no Projeto |
| :--- | :--- |
| **HTML5** | Estruturação semântica do painel e das telas, utilizando tags semânticas e boas práticas de acessibilidade (ARIA). |
| **CSS3** | Estilização da interface, layout baseado em CSS Grid e Flexbox, tipografia e estados visuais condicionais (saldo positivo/negativo). |
| **JavaScript (ES6+)** | Lógica da aplicação, manipulação do DOM, regras de negócio e cálculos financeiros em centavos. |
| **ES Modules (`import` / `export`)** | Modularização do código JavaScript em múltiplos arquivos com responsabilidades isoladas. |
| **Chart.js (v4 via CDN)** | Biblioteca para renderização dos gráficos interativos nos elementos `<canvas>`. |
| **Web Storage API (`localStorage`)** | Persistência dos registros financeiros no armazenamento local do navegador do usuário. |


## Como Executar o Projeto

Como o projeto faz uso de **módulos nativos do JavaScript (ES Modules)** (`<script type="module" src="dash.js"></script>`), navegadores modernos bloqueiam o carregamento desses arquivos se abertos diretamente pelo protocolo de arquivos locais (`file:///`), devido a políticas de segurança (CORS).

Por isso, **é necessário executar o projeto por meio de um servidor web local**.

### Pré-requisitos

* Navegador web moderno (Chrome, Edge, Firefox, Brave, Safari, etc.).
* Uma ferramenta simples para iniciar um servidor local (escolha uma das opções abaixo).

### Passo a passo

1. **Obtenha os arquivos do projeto:**
   Clone o repositório ou baixe o código compactado e extraia-o no seu computador.

2. **Inicie um servidor local:**

   * **Opção 1: Extensão Live Server (VS Code - Recomendada)**
     1. Abra a pasta do projeto no Visual Studio Code.
     2. Instale a extensão **Live Server**.
     3. Clique com o botão direito no arquivo `Projeto/Dashbord/dashboard.html` e selecione **Open with Live Server**.

   * **Opção 2: Python (caso tenha o Python instalado)**
     Abra o terminal na pasta raiz do projeto e execute:
     ```bash
     python -m http.server 8000
     ```
     Em seguida, acesse no navegador: `http://localhost:8000/Projeto/Dashbord/dashboard.html`

   * **Opção 3: Node.js (via npx)**
     Abra o terminal na pasta raiz do projeto e execute:
     ```bash
     npx serve .
     ```
     Em seguida, abra o endereço exibido no terminal e navegue até `Projeto/Dashbord/dashboard.html`.

---

## Estrutura de Pastas

A estrutura atual do repositório organiza o código em módulos específicos:

```text
.
├── Projeto/
│   ├── Dashbord/
│   │   ├── Js/
│   │   │   ├── categorias.js     # Lista de categorias predefinidas e manipulação dos elementos select
│   │   │   ├── dados.js          # Leitura, escrita e validação defensiva dos dados no localStorage
│   │   │   ├── filtros.js        # Lógica de filtragem (categoria, tipo, período mensal e busca textual)
│   │   │   ├── formularios.js    # Utilitários de limpeza e restauração de estado dos formulários
│   │   │   ├── graficos.js       # Configuração, criação e atualização dos gráficos com Chart.js
│   │   │   ├── movimentacoes.js  # Regras de negócio (cálculo de totais, validação, ordenação e parcelamento)
│   │   │   ├── renderizacao.js   # Criação dinâmica e manipulação dos elementos no DOM
│   │   │   └── utils.js          # Funções utilitárias (formatação de moeda BRL, datas ISO e projeção mensal)
│   │   ├── dash.js               # Ponto de entrada (entrypoint) do dashboard e escuta de eventos
│   │   ├── dashboard.css         # Folha de estilos do painel principal
│   │   └── dashboard.html        # Estrutura HTML do painel financeiro
│   └── Login/
│       ├── Login.css             # Folha de estilos da tela de login
│       └── login.html            # Estrutura HTML da tela de login (estática)
└── README.md                     # Documentação do projeto
```

---

## Armazenamento de Dados

O projeto utiliza exclusivamente a **Web Storage API (`localStorage`)** do navegador para salvar as informações financeiras:

* **Chave utilizada:** `"movimentacoes"`.
* **Formato dos dados:** Objeto serializado em JSON contendo um array de lançamentos.
* **Estrutura de cada registro:**
  * `id`: Identificador único gerado automaticamente via `crypto.randomUUID()`.
  * `tipo`: Tipo da movimentação (`"receita"` ou `"despesa"`).
  * `descricao`: Descrição textual do lançamento.
  * `valor`: Valor monetário numérico.
  * `categoria`: Identificador da categoria selecionada.
  * `data`: Data no formato ISO (`YYYY-MM-DD`).
  * `schemaVersion`: Versão do formato de dados para compatibilidade futura.
  * `origem`: Identificador de origem (`"unica"` ou `"parcelada"`).
  * `serieId`, `indiceOcorrencia`, `totalOcorrencias`: Metadados atribuídos quando o lançamento pertence a um parcelamento.

> **Importante:** A aplicação **não possui backend, API ou banco de dados remoto**. Todas as informações cadastradas permanecem salvas localmente no navegador em que foram inseridas. Caso o armazenamento local seja limpo ou a aplicação seja acessada de outro dispositivo, os registros não serão compartilhados.

---

## Próximas Melhorias

* [ ] Implementação de lógica de autenticação integrada à tela de login já existente.
* [ ] Conexão com um backend e banco de dados para sincronização em nuvem e múltiplos dispositivos.
* [ ] Criação de módulo de metas financeiras com acompanhamento de progresso.
* [ ] Geração e exportação de relatórios em formatos como PDF ou CSV.
* [ ] Possibilidade de personalizar e adicionar novas categorias pelo próprio painel.
* [ ] Suporte a alternância entre tema claro e tema escuro (*dark mode*).

---

## Aprendizados e Objetivo

Este projeto foi construído como uma aplicação prática de desenvolvimento web front-end sem dependência de frameworks adicionais (Vanilla JavaScript), exercitando conceitos fundamentais como:

1. **Arquitetura Modular:** Aplicação de ES Modules para separação clara de responsabilidades entre regras de negócio, persistência, apresentação e utilitários.
2. **Manipulação Precisa de Dados Financeiros:** Cálculos de parcelamento baseados em centavos inteiros para evitar imprecisões com pontos flutuantes, além de tratamento de datas sem desvios de fuso horário.
3. **Visualização de Dados:** Integração com Chart.js para traduzir dados brutos em representações gráficas claras e responsivas, incluindo cálculos de percentual e formatação localizada (`Intl.NumberFormat`).
4. **Resiliência e Persistência:** Implementação de sanitização e versionamento no carregamento de dados do `localStorage` para prevenir quebras causadas por dados inválidos ou formatos legados.
