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

    input_despesa.value = "";
    input_descricao_despesa.value = "";
});

function atualizarSaldo() {
    saldo.textContent = `Saldo: R$ ${saldoTotal}`;
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
    });

    return botao;
}

function salvarDados() {
    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );
}

function renderizarMovimentacoes() {
    saldoTotal = 0;

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
            saldoTotal += mov.valor;
            lista_receitas.appendChild(item);
        } else {
            saldoTotal -= mov.valor;
            lista_despesa.appendChild(item);
        }
    });

    atualizarSaldo();
}

renderizarMovimentacoes();
