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
  criarMovimentacoesParceladas,
  validarMovimentacao,
} from "./Js/movimentacoes.js";
import {
  renderizarHistorico,
  renderizarMovimentacoes,
  criarBotaoExcluir,
  criarBotaoEditar,
} from "./Js/renderizacao.js";
import {
  passouFiltro,
  passouFiltroMes,
  preencherFiltroMes,
} from "./Js/filtros.js";
import { atualizarGraficos } from "./Js/graficos.js";

const saldoElemento = document.getElementById("saldo");
const movimentacoes = carregarDados();
let idEmEdicao = null;
let tipoEmEdicao = null;

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

// PARCELAMENTO
const btnMaisOpcoes = document.getElementById("btn-mais-opcoes");
const painelMaisOpcoes = document.getElementById("painel-mais-opcoes");
const btnMostrarParcelamento = document.getElementById("btn-mostrar-parcelamento");
const formularioParcelamento = document.getElementById("form-parcelamento");
const tipoParcelamento = document.getElementById("tipo-parcelamento");
const descricaoParcelamento = document.getElementById("descricao-parcelamento");
const valorParcelamento = document.getElementById("valor-parcelamento");
const categoriaParcelamento = document.getElementById("categoria-parcelamento");
const dataParcelamento = document.getElementById("data-parcelamento");
const quantidadeParcelas = document.getElementById("quantidade-parcelas");
const btnAdicionarParcelamento = document.getElementById("btn-adicionar-parcelamento");

//HISTORICO
const historicoGeral = document.getElementById("historico");

const filtroHistorico = document.getElementById("filtro-historico");
filtroHistorico.addEventListener("change", function () {
  atualizarTela();
});

const filtroTipo = document.getElementById("filtro-tipo");
filtroTipo.addEventListener("change", function () {
  atualizarTela();
});

const filtroMes = document.getElementById("filtro-mes");
filtroMes.addEventListener("change", function () {
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

btnMaisOpcoes.addEventListener("click", function () {
  const estaAberto = !painelMaisOpcoes.hidden;

  painelMaisOpcoes.hidden = estaAberto;
  if (estaAberto) {
    formularioParcelamento.hidden = true;
  }
  btnMaisOpcoes.setAttribute("aria-expanded", String(!estaAberto));
});

btnMostrarParcelamento.addEventListener("click", function () {
  formularioParcelamento.hidden = false;
});

btnAdicionarParcelamento.addEventListener("click", function () {
  const valorTotal = Number(valorParcelamento.value);
  const descricao = descricaoParcelamento.value;
  const categoria = categoriaParcelamento.value;
  const data = dataParcelamento.value;
  const quantidade = Number(quantidadeParcelas.value);
  const erro = validarMovimentacao(valorTotal, descricao, data);

  if (erro !== null) {
    alert(erro);
    return;
  }

  if (!Number.isInteger(quantidade) || quantidade < 2) {
    alert("Digite uma quantidade de parcelas a partir de 2.");
    return;
  }

  if (idEmEdicao !== null) {
    cancelarEdicao();
  }

  const parcelas = criarMovimentacoesParceladas(
    tipoParcelamento.value,
    valorTotal,
    descricao,
    categoria,
    data,
    quantidade,
  );

  movimentacoes.push(...parcelas);
  ordenarMovimentacoes(movimentacoes);
  salvarDados(movimentacoes);
  atualizarTela();
  limparFormularioParcelamento();
});

//CATEGORIAS
preencherCategorias(categoriaReceita);
preencherCategorias(categoriaDespesa);
preencherCategorias(categoriaParcelamento);
preencherFiltroHistorico(filtroHistorico);
preencherFiltroMes(filtroMes, movimentacoes);

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

  if (idEmEdicao !== null && tipoEmEdicao !== tipo) {
    cancelarEdicao();
  }

  const movimentacao = criarMovimentacao(
    tipo,
    valor,
    descricao,
    categoria,
    data,
  );

  if (idEmEdicao !== null && tipoEmEdicao === tipo) {
    const foiEditada = editarMovimentacao(
      movimentacoes,
      idEmEdicao,
      movimentacao,
    );

    idEmEdicao = null;
    tipoEmEdicao = null;

    atualizarBotoesFormulario(btnReceita, btnDespesa);

    if (!foiEditada) {
      movimentacoes.push(movimentacao);
    }
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

  saldoElemento.classList.remove("saldo-positivo", "saldo-negativo");

  if (saldoTotal > 0) {
    saldoElemento.classList.add("saldo-positivo");
  } else if (saldoTotal < 0) {
    saldoElemento.classList.add("saldo-negativo");
  }
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

function limparFormularioParcelamento() {
  tipoParcelamento.selectedIndex = 0;
  descricaoParcelamento.value = "";
  valorParcelamento.value = "";
  categoriaParcelamento.selectedIndex = 0;
  dataParcelamento.value = "";
  quantidadeParcelas.value = "";
}

// ATUALIZA A TELA COM TODAS AS FUNCOES QUE SAO NECESSARIAS PARA FUNCIONAR E ATUALIZAR AUTOMATICAMENTE
function atualizarTela() {
  preencherFiltroMes(filtroMes, movimentacoes);

  const movimentacoesFiltradas = movimentacoes.filter(function (mov) {
    return passouFiltroMes(mov, filtroMes.value);
  });

  const { saldoTotal, receitaTotal, despesaTotal } = calcularMovimentacoes(
    movimentacoesFiltradas,
  );

  atualizarSaldo(saldoTotal, receitaTotal, despesaTotal);
  atualizarGraficos(
    movimentacoesFiltradas,
    receitaTotal,
    despesaTotal,
    encontrarCategoria,
    movimentacoes,
  );

  renderizarHistorico(
    historicoGeral,
    movimentacoesFiltradas,
    passouFiltro,
    filtroHistorico.value,
    pesquisaHistorico.value,
    filtroTipo.value,
    encontrarCategoria,
    formatarData,
    formatarMoeda,
  );
  renderizarMovimentacoes(
    listaReceitas,
    listaDespesa,
    movimentacoesFiltradas,
    formatarData,
    formatarMoeda,
    encontrarCategoria,
    criarBotaoExcluir,
    criarBotaoEditar,
    function (id) {
      const foiExcluida = excluirMovimentacao(movimentacoes, id);

      if (foiExcluida) {
        if (idEmEdicao === id) {
          cancelarEdicao();
        }

        salvarDados(movimentacoes);
        atualizarTela();
      }
    },
    iniciarEdicao,
  );
}

atualizarTela();
