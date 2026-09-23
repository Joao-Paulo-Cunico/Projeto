import { formatarData, formatarMoeda } from "./Js/utils.js";
import {
  preencherCategorias,
  preencherFiltroHistorico,
  encontrarCategoria,
} from "./Js/categorias.js";
import { salvarDados, carregarDados } from "./Js/dados.js";
import {
  limparFormulario,
  atualizarBotoesFormulario,
} from "./Js/formularios.js";
import {
  calcularMovimentacoes,
  ordenarMovimentacoes,
  editarMovimentacao,
  excluirMovimentacao,
  criarMovimentacao,
  validarMovimentacao,
} from "./Js/movimentacoes.js";
import {
  renderizarHistorico,
  renderizarMovimentacoes,
  criarBotaoExcluir,
  criarBotaoEditar,
} from "./Js/renderizacao.js";
import { passouFiltro } from "./Js/filtros.js";

const saldoElemento = document.getElementById("saldo");
const movimentacoes = carregarDados();
let idEmEdicao = null;
let tipoEmEdicao = null;

movimentacoes.forEach(function (mov) {
  if (!mov.id) {
    mov.id = Date.now() + Math.random();
  }
});

ordenarMovimentacoes(movimentacoes);
salvarDados(movimentacoes);

// DESCRICAO
const inputDescricaoReceita = document.getElementById("descricao-receita");
const inputDescricaoDespesa = document.getElementById("descricao-despesa");

// RECEITA
const inputReceita = document.getElementById("input-receita");
const btnReceita = document.getElementById("btn-receita");
const listaReceitas = document.getElementById("lista-receita");
const categoriaReceita = document.getElementById("categoria-receita");

// DESPESA
const listaDespesa = document.getElementById("lista-despesa");
const inputDespesa = document.getElementById("input-despesa");
const btnDespesa = document.getElementById("btn-despesa");
const categoriaDespesa = document.getElementById("categoria-despesa");

// BOTAO CANCELAR
const btnCancelarReceita = document.getElementById("btn-cancelar-receita");
const btnCancelarDespesa = document.getElementById("btn-cancelar-despesa");

//HISTORICO
const historicoGeral = document.getElementById("historico");

const filtroHistorico = document.getElementById("filtro-historico");
filtroHistorico.addEventListener("change", function () {
  atualizarTela();
});

const pesquisaHistorico = document.getElementById("pesquisa-historico");
pesquisaHistorico.addEventListener("input", function () {
  atualizarTela();
});

//SOMA DESPESAS/RECEITAS TOPBAR
const receitaTotalElemento = document.getElementById("receita-total");
const despesaTotalElemento = document.getElementById("despesa-total");

// DATA DESPESA/RECEITA
const dataReceita = document.getElementById("data-receita");
const dataDespesa = document.getElementById("data-despesa");

//RECEITA
btnReceita.addEventListener("click", function () {
  adicionarMovimentacao(
    "receita",
    inputReceita,
    inputDescricaoReceita,
    categoriaReceita,
    dataReceita,
  );
});

//DESPESA
btnDespesa.addEventListener("click", function () {
  adicionarMovimentacao(
    "despesa",
    inputDespesa,
    inputDescricaoDespesa,
    categoriaDespesa,
    dataDespesa,
  );
});

//CATEGORIAS
preencherCategorias(categoriaReceita);
preencherCategorias(categoriaDespesa);
preencherFiltroHistorico(filtroHistorico);

// ADICIONA A MOVIMENTACAO NOS BOTOES DE ADD RECEITA/DESPESA
function adicionarMovimentacao(
  tipo,
  inputValor,
  inputDescricao,
  selectCategoria,
  inputData,
) {
  const valor = Number(inputValor.value);
  const descricao = inputDescricao.value;
  const categoria = selectCategoria.value;
  const data = inputData.value;

  const erro = validarMovimentacao(valor, descricao, data);

  if (erro !== null) {
    alert(erro);
    return;
  }

  const movimentacao = criarMovimentacao(
    tipo,
    valor,
    descricao,
    categoria,
    data,
  );

  if (idEmEdicao !== null && tipoEmEdicao === tipo) {
    editarMovimentacao(movimentacoes, idEmEdicao, movimentacao);

    idEmEdicao = null;
    tipoEmEdicao = null;

    atualizarBotoesFormulario(btnReceita, btnDespesa);
  } else {
    movimentacoes.push(movimentacao);
  }

  ordenarMovimentacoes(movimentacoes);
  salvarDados(movimentacoes);
  atualizarTela();

  limparFormulario(inputValor, inputDescricao, selectCategoria, inputData);
}

//ATUALIZA O SALDO/RECEITA/DESPESA TOTAL
function atualizarSaldo(saldoTotal, receitasTotais, despesasTotais) {
  saldoElemento.textContent = `Saldo: ${formatarMoeda(saldoTotal)}`;
  receitaTotalElemento.textContent = `Receitas Totais: ${formatarMoeda(receitasTotais)}`;
  despesaTotalElemento.textContent = `Despesas Totais: ${formatarMoeda(despesasTotais)}`;
}

function iniciarEdicao(id) {
  const mov = movimentacoes.find(function (mov) {
    return mov.id === id;
  });

  if (!mov) {
    return;
  }

  idEmEdicao = mov.id;
  tipoEmEdicao = mov.tipo;

  if (mov.tipo === "receita") {
    inputReceita.value = mov.valor;
    inputDescricaoReceita.value = mov.descricao;
    categoriaReceita.value = mov.categoria;
    dataReceita.value = mov.data;

    btnReceita.textContent = "Salvar edição";
    btnDespesa.textContent = "Adicionar";
  } else {
    inputDespesa.value = mov.valor;
    inputDescricaoDespesa.value = mov.descricao;
    categoriaDespesa.value = mov.categoria;
    dataDespesa.value = mov.data;

    btnDespesa.textContent = "Salvar edição";
    btnReceita.textContent = "Adicionar";
  }
}

// CRIA BOTAO PARA CANCELAR EDICAO RECEITA/DESPESA
btnCancelarReceita.addEventListener("click", cancelarEdicao);
btnCancelarDespesa.addEventListener("click", cancelarEdicao);

function cancelarEdicao() {
  idEmEdicao = null;
  tipoEmEdicao = null;

  limparFormulario(
    inputReceita,
    inputDescricaoReceita,
    categoriaReceita,
    dataReceita,
  );

  limparFormulario(
    inputDespesa,
    inputDescricaoDespesa,
    categoriaDespesa,
    dataDespesa,
  );

  atualizarBotoesFormulario(btnReceita, btnDespesa);
}

// ATUALIZA A TELA COM TODAS AS FUNCOES QUE SAO NECESSARIAS PARA FUNCIONAR E ATUALIZAR AUTOMATICAMENTE
function atualizarTela() {
  const { saldoTotal, receitaTotal, despesaTotal } = calcularMovimentacoes(
    movimentacoes,
  );

  atualizarSaldo(saldoTotal, receitaTotal, despesaTotal);

  renderizarHistorico(
    historicoGeral,
    movimentacoes,
    passouFiltro,
    filtroHistorico.value,
    pesquisaHistorico.value,
    encontrarCategoria,
    formatarData,
    formatarMoeda,
  );
  renderizarMovimentacoes(
    listaReceitas,
    listaDespesa,
    movimentacoes,
    formatarData,
    formatarMoeda,
    encontrarCategoria,
    criarBotaoExcluir,
    criarBotaoEditar,
    function (id) {
      const foiExcluida = excluirMovimentacao(movimentacoes, id);

      if (foiExcluida) {
        salvarDados(movimentacoes);
        atualizarTela();
      }
    },
    iniciarEdicao,
  );
}

atualizarTela();
