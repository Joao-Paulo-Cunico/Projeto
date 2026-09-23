// CARREGA TODO O HISTORICO COM TODAS AS DESPESAS E RECEITAS JUNTAS
export function renderizarHistorico(
  historicoGeral,
  movimentacoes,
  passouFiltro,
  filtro,
  pesquisa,
  encontrarCategoria,
  formatarData,
  formatarMoeda,
) {
  historicoGeral.innerHTML = "";

  movimentacoes.forEach(function (mov) {
    if (!passouFiltro(mov, filtro, pesquisa)) {
      return;
    }

    const item = document.createElement("p");

    const categoria = encontrarCategoria(mov.categoria);

    const emoji = mov.tipo === "receita" ? "💰" : "💸";

    item.textContent = `${emoji} ${mov.tipo} | ${formatarData(mov.data)} | ${formatarMoeda(mov.valor)} | ${categoria} | ${mov.descricao}`;

    historicoGeral.prepend(item);
  });
}

export function renderizarMovimentacoes(
  listaReceitas,
  listaDespesa,
  movimentacoes,
  formatarData,
  formatarMoeda,
  encontrarCategoria,
  criarBotaoExcluir,
  criarBotaoEditar,
  excluirMovimentacao,
  iniciarEdicao,
) {
  listaReceitas.innerHTML = "";
  listaDespesa.innerHTML = "";

  movimentacoes.forEach(function (mov) {
    const item = document.createElement("div");
    const texto = document.createElement("p");

    const categoria = encontrarCategoria(mov.categoria);

    texto.textContent = `${formatarData(mov.data)} | ${formatarMoeda(mov.valor)} | Categoria: ${categoria} | Descricao: ${mov.descricao}`;

    const botao = criarBotaoExcluir(mov.id, excluirMovimentacao);
    const botaoEditar = criarBotaoEditar(mov.id, iniciarEdicao);
    const acoes = document.createElement("div");

    acoes.className = "acoes-movimentacao";
    botao.className = "btn-excluir";
    botaoEditar.className = "btn-editar";

    item.appendChild(texto);
    acoes.appendChild(botaoEditar);
    acoes.appendChild(botao);
    item.appendChild(acoes);

    if (mov.tipo === "receita") {
      listaReceitas.prepend(item);
    } else {
      listaDespesa.prepend(item);
    }
  });
}

export function criarBotaoExcluir(id, excluirMovimentacao) {
  const botao = document.createElement("button");

  botao.textContent = "Excluir";

  botao.addEventListener("click", function () {
    excluirMovimentacao(id);
  });

  return botao;
}

export function criarBotaoEditar(id, iniciarEdicao) {
  const botaoEditar = document.createElement("button");

  botaoEditar.textContent = "Editar";

  botaoEditar.addEventListener("click", function () {
    iniciarEdicao(id);
  });

  return botaoEditar;
}
