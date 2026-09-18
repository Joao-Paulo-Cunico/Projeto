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
  adicionarAoArray,
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

const saldo = document.getElementById("saldo");
let saldoTotal = 0;
let movimentacoes = [];
let idEmEdicao = null;
let tipoEmEdicao = null;

movimentacoes = carregarDados();

movimentacoes.forEach(function (mov) {
  if (!mov.id) {
    mov.id = Date.now() + Math.random();
  }
});

ordenarMovimentacoes(movimentacoes);
salvarDados(movimentacoes);

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

// BOTAO CANCELAR
const btn_cancelar_receita = document.getElementById("btn-cancelar-receita");
const btn_cancelar_despesa = document.getElementById("btn-cancelar-despesa");

//HISTORICO
const historico_geral = document.getElementById("historico");

const filtro_historico = document.getElementById("filtro-historico");
filtro_historico.addEventListener("change", function () {
  atualizarTela();
});

const pesquisa_historico = document.getElementById("pesquisa-historico");
pesquisa_historico.addEventListener("input", function () {
  atualizarTela();
});

//SOMA DESPESAS/RECEITAS TOPBAR
const receita_total = document.getElementById("receita-total");
const despesa_total = document.getElementById("despesa-total");
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
    data_receita,
  );
});

//DESPESA
btn_despesa.addEventListener("click", function () {
  adicionarMovimentacao(
    "despesa",
    input_despesa,
    input_descricao_despesa,
    categoriaDespesa,
    data_despesa,
  );
});

//CATEGORIAS
preencherCategorias(categoriaReceita);
preencherCategorias(categoriaDespesa);
preencherFiltroHistorico(filtro_historico);

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

    atualizarBotoesFormulario(btn_receita, btn_despesa);
  } else {
    adicionarAoArray(movimentacoes, movimentacao);
  }

  ordenarMovimentacoes(movimentacoes);
  salvarDados(movimentacoes);
  atualizarTela();

  limparFormulario(inputValor, inputDescricao, selectCategoria, inputData);
}

//ATUALIZA O SALDO/RECEITA/DESPESA TOTAL
function atualizarSaldo() {
  saldo.textContent = `Saldo: ${formatarMoeda(saldoTotal)}`;
  receita_total.textContent = `Receitas Totais: ${formatarMoeda(receitaTotal)}`;
  despesa_total.textContent = `Despesas Totais: ${formatarMoeda(despesaTotal)}`;
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
    input_receita.value = mov.valor;
    input_descricao_receita.value = mov.descricao;
    categoriaReceita.value = mov.categoria;
    data_receita.value = mov.data;

    btn_receita.textContent = "Salvar edição";
    btn_despesa.textContent = "Adicionar";
  } else {
    input_despesa.value = mov.valor;
    input_descricao_despesa.value = mov.descricao;
    categoriaDespesa.value = mov.categoria;
    data_despesa.value = mov.data;

    btn_despesa.textContent = "Salvar edição";
    btn_receita.textContent = "Adicionar";
  }
}

// CRIA BOTAO PARA CANCELAR EDICAO RECEITA/DESPESA
btn_cancelar_receita.addEventListener("click", cancelarEdicao);
btn_cancelar_despesa.addEventListener("click", cancelarEdicao);

function cancelarEdicao() {
  idEmEdicao = null;
  tipoEmEdicao = null;

  limparFormulario(
    input_receita,
    input_descricao_receita,
    categoriaReceita,
    data_receita,
  );

  limparFormulario(
    input_despesa,
    input_descricao_despesa,
    categoriaDespesa,
    data_despesa,
  );

  atualizarBotoesFormulario(btn_receita, btn_despesa);
}

// ATUALIZA A TELA COM TODAS AS FUNCOES QUE SAO NECESSARIAS PARA FUNCIONAR E ATUALIZAR AUTOMATICAMENTE
function atualizarTela() {
  const totais = calcularMovimentacoes(movimentacoes);

  saldoTotal = totais.saldoTotal;
  receitaTotal = totais.receitaTotal;
  despesaTotal = totais.despesaTotal;

  atualizarSaldo();

  renderizarHistorico(
    historico_geral,
    movimentacoes,
    passouFiltro,
    filtro_historico.value,
    pesquisa_historico.value,
    encontrarCategoria,
    formatarData,
    formatarMoeda,
  );
  renderizarMovimentacoes(
    lista_receitas,
    lista_despesa,
    movimentacoes,
    formatarData,
    formatarMoeda,
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
