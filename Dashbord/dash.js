const saldo = document.getElementById("saldo");
let saldoTotal = 0;
let movimentacoes = [];
const dadosSalvos = localStorage.getItem("movimentacoes");

if (dadosSalvos) {
    movimentacoes = JSON.parse(dadosSalvos);
}

// DESCRICAO
const input_descricao_receita = document.getElementById("descricao-receita");
const input_descricao_despesa = document.getElementById("descricao-despesa");

// RECEITA
const input_receita = document.getElementById("input-receita");
const btn_receita = document.getElementById("btn-receita");
const lista_receitas = document.getElementById("lista-receita");
const categoriaReceita = document.getElementById("categoria-receita");

// DESPESA
const lista_despesa = document.getElementById("lista-despesa");
const input_despesa = document.getElementById("input-despesa");
const btn_despesa = document.getElementById("btn-despesa");
const categoriaDespesa = document.getElementById("categoria-despesa");

//HISTORICO
const historico_geral = document.getElementById("historico");
const filtro_historico = document.getElementById("filtro-historico");
filtro_historico.addEventListener("change", function () {
    renderizarHistorico();
});

//SOMA DESPESAS/RECEITAS TOPBAR
const receita_total = document.getElementById("receita-total")
const despesa_total = document.getElementById("despesa-total")
let receitaTotal = 0;
let despesaTotal = 0;


//RECEITA
btn_receita.addEventListener("click", function () {
    const valor = Number(input_receita.value);
    const descricao = input_descricao_receita.value;
    const categoria = categoriaReceita.value;

    if (!validarValor(valor)) {
        return;
    }

    movimentacoes.push({
        tipo: "receita",
        descricao,
        valor,
        categoria
    });

    salvarDados();
    renderizarMovimentacoes();
    renderizarHistorico();

    input_receita.value = "";
    input_descricao_receita.value = "";
});

//DESPESA
btn_despesa.addEventListener("click", function () {
    const valor = Number(input_despesa.value);
    const descricao = input_descricao_despesa.value;
    const categoria = categoriaDespesa.value;

    if (!validarValor(valor)) {
        return;
    }

    movimentacoes.push({
        tipo: "despesa",
        descricao,
        valor,
        categoria
    });

    salvarDados();
    renderizarMovimentacoes();
    renderizarHistorico();

    input_despesa.value = "";
    input_descricao_despesa.value = "";
});

//ATUALIZA O SALDO/RECEITA/DESPESA TOTAL
function atualizarSaldo() {
    saldo.textContent = `Saldo: R$ ${saldoTotal}`;
    receita_total.textContent = `Receitas Totais: R$ ${receitaTotal}`;
    despesa_total.textContent = `Receitas Totais: R$ ${despesaTotal}`;
}

function validarValor(valor) {
    if (valor <= 0) {
        alert("Digite numeros positivos");
        return false;
    }

    return true;
}

function criarBotaoExcluir(indice) {
    const botao = document.createElement("button");

    botao.textContent = "Excluir";

    botao.addEventListener("click", function () {
        movimentacoes.splice(indice, 1);
        salvarDados();
        renderizarMovimentacoes();
        renderizarHistorico();
    });

    return botao;
}

function salvarDados() {
    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );
}

// RENDERIZA AS MOVIMETACOES DE RECEITA E DESPESA
function renderizarMovimentacoes() {

    lista_receitas.innerHTML = "";
    lista_despesa.innerHTML = "";

    movimentacoes.forEach(function (mov, indice) {
        const item = document.createElement("div");
        const texto = document.createElement("p");

        texto.textContent = `R$ ${mov.valor} | Categoria: ${mov.categoria} | Descricao: ${mov.descricao}`;

        const botao = criarBotaoExcluir(indice);

        item.appendChild(texto);
        item.appendChild(botao);

        if (mov.tipo === "receita") {
            lista_receitas.prepend(item);
        } else {
            lista_despesa.prepend(item);
        }
    });

    calcularMovimentacoes();
}

//ATUALIZA O SALDO CALCULANDO SEPARADAMENTE A SOMA DE CADA UM
function calcularMovimentacoes() {
    saldoTotal = 0;
    receitaTotal = 0;
    despesaTotal = 0;

    movimentacoes.forEach(function (mov, indice) {

        if (mov.tipo === "receita") {
            saldoTotal += mov.valor;
            receitaTotal += mov.valor;
        } else {
            saldoTotal -= mov.valor;
            despesaTotal += mov.valor;
        }
    });

    atualizarSaldo();
}

function renderizarHistorico() {
    historico_geral.innerHTML = "";

    const filtro = filtro_historico.value;

    movimentacoes.forEach(function (mov) {

        if (filtro !== "todos" && mov.categoria !== filtro) {
            return;
        }

        const item = document.createElement("p");

        const categoria =
            mov.categoria.charAt(0).toUpperCase() +
            mov.categoria.slice(1);

        const emoji = mov.tipo === "receita" ? "💰" : "💸";

        item.textContent =
            `${emoji} ${mov.tipo} | R$ ${mov.valor} | ${categoria} | ${mov.descricao}`;

        historico_geral.prepend(item);
    });
}

calcularMovimentacoes();
renderizarHistorico();
renderizarMovimentacoes();
