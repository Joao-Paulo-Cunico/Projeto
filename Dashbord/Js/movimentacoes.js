//ATUALIZA O SALDO CALCULANDO SEPARADAMENTE A SOMA DE CADA UM
export function calcularMovimentacoes(movimentacoes) {
  let saldoTotal = 0;
  let receitaTotal = 0;
  let despesaTotal = 0;

  movimentacoes.forEach(function (mov) {
    if (mov.tipo === "receita") {
      saldoTotal += mov.valor;
      receitaTotal += mov.valor;
    } else {
      saldoTotal -= mov.valor;
      despesaTotal += mov.valor;
    }
  });

  return {
    saldoTotal,
    receitaTotal,
    despesaTotal,
  };
}

export function ordenarMovimentacoes(movimentacoes) {
  movimentacoes.sort(function (a, b) {
    return new Date(a.data) - new Date(b.data);
  });
}

export function adicionarAoArray(movimentacoes, movimentacao) {
  movimentacoes.push(movimentacao);
}

export function editarMovimentacao(movimentacoes, id, novaMovimentacao) {
  const indice = movimentacoes.findIndex(function (mov) {
    return mov.id === id;
  });

  if (indice === -1) {
    return false;
  }

  novaMovimentacao.id = id;
  movimentacoes[indice] = novaMovimentacao;

  return true;
}

export function excluirMovimentacao(movimentacoes, id) {
  const indice = movimentacoes.findIndex(function (mov) {
    return mov.id === id;
  });

  if (indice === -1) {
    return false;
  }

  movimentacoes.splice(indice, 1);

  return true;
}

export function criarMovimentacao(
  tipo,
  valor,
  descricao,
  categoria,
  data,
) {
  return {
    id: Date.now(),
    tipo,
    descricao,
    valor,
    categoria,
    data,
  };
}

export function validarMovimentacao(valor, descricao, data) {
  if (valor <= 0) {
    return "Digite numeros positivos";
  }

  if (descricao.trim() === "") {
    return "Digite uma descrição.";
  }

  if (data === "") {
    return "Digite uma data.";
  }

  return null;
}