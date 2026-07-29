const saldo = document.getElementById("saldo");
let saldoTotal = 0;
let movimentacoes = [];
const dadosSalvos = localStorage.getItem("movimentacoes");

if (dadosSalvos) {
    movimentacoes = JSON.parse(dadosSalvos);

    ordenarMovimentacoes();
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

const pesquisa_historico = document.getElementById("pesquisa-historico");
pesquisa_historico.addEventListener("input", function () {
    renderizarHistorico();
})


//SOMA DESPESAS/RECEITAS TOPBAR
const receita_total = document.getElementById("receita-total")
const despesa_total = document.getElementById("despesa-total")
let receitaTotal = 0;
let despesaTotal = 0;

// DATA DESPESA/RECEITA
const data_receita = document.getElementById("data-receita");
const data_despesa = document.getElementById("data-despesa");


//RECEITA
btn_receita.addEventListener("click", function () {

    adicionarMovimentacao(
        "receita",
        input_receita,
        input_descricao_receita,
        categoriaReceita,
        data_receita
    );

});

//DESPESA
btn_despesa.addEventListener("click", function () {

    adicionarMovimentacao(
        "despesa",
        input_despesa,
        input_descricao_despesa,
        categoriaDespesa,
        data_despesa
    );

});

// ADICIONA A MOVIMENTACAO NOS BOTOES DE ADD RECEITA/DESPESA
function adicionarMovimentacao(
    tipo,
    inputValor,
    inputDescricao,
    selectCategoria,
    inputData) {


    const valor = Number(inputValor.value);
    const descricao = inputDescricao.value;
    const categoria = selectCategoria.value;
    const data = inputData.value

    if (!validarValor(valor)) {
        return;
    }

    movimentacoes.push({
        tipo,
        descricao,
        valor,
        categoria,
        data
    });

    ordenarMovimentacoes();
    salvarDados();
    atualizarTela();

    input_receita.value = "";
    input_descricao_receita.value = "";
}


//ATUALIZA O SALDO/RECEITA/DESPESA TOTAL
function atualizarSaldo() {
    saldo.textContent = `Saldo: R$ ${saldoTotal}`;
    receita_total.textContent = `Receitas Totais: R$ ${receitaTotal}`;
    despesa_total.textContent = `Despesa Totais: R$ ${despesaTotal}`;
}

// VALIDA PARA DIGITAR SOMENTE VALORES POSITIVOS
function validarValor(valor) {
    if (valor <= 0) {
        alert("Digite numeros positivos");
        return false;
    }

    return true;
}

// CRIA BOTAO PARA EXCLUIR RECEITA/DESPESA ADICIONADA
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

        texto.textContent = `${formatarData(mov.data)} | R$ ${mov.valor} | Categoria: ${mov.categoria} | Descricao: ${mov.descricao}`;

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

// CARREGA TODO O HISTORICO COM TODAS AS DESPESAS E RECEITAS JUNTAS
function renderizarHistorico() {
    historico_geral.innerHTML = "";
    
    movimentacoes.forEach(function (mov) {
        
        if(!passouFiltro(mov)){
            return;
        }
        
        const item = document.createElement("p");
        
        const categoria =
        mov.categoria.charAt(0).toUpperCase() +
        mov.categoria.slice(1);
        
        const emoji = mov.tipo === "receita" ? "💰" : "💸";
        
        item.textContent =
        `${emoji} ${mov.tipo} | ${formatarData(mov.data)} | R$ ${mov.valor} | ${categoria} | ${mov.descricao}`;
        
        historico_geral.prepend(item);
    });
}

// FORMATA A DATA CORRETAMENTE
function formatarData(data) {
    const partes = data.split("-");
    
    return `${partes[2]}/${partes[1]}/${partes[0]}`
}
// FORMATA NA POSICAO CERTA AS MOVIMENTACOES
function ordenarMovimentacoes() {
    movimentacoes.sort(function (a, b) {
        return new Date(a.data) - new Date(b.data);
    });
}
// FILTRO E PESQUISA NO HISTORICO
function passouFiltro(mov) {
    
    const filtro = filtro_historico.value;
    const pesquisa = pesquisa_historico.value.toLowerCase();
    
    if (filtro !== "todos" && mov.categoria !== filtro) {
        return;
    }
    
    if (pesquisa !== "" && !mov.descricao.toLowerCase().includes(pesquisa)) {
        return;
    }

    return true;
}


// ATUALIZA A TELA COM TODAS AS FUNCOES QUE SAO NECESSARIAS PARA FUNCIONAR E ATUALIZAR AUTOMATICAMENTE
function atualizarTela() {
    calcularMovimentacoes();
    renderizarHistorico();
    renderizarMovimentacoes();
}

atualizarTela();
