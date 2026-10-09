import { adicionarMesesAData, ehDataISOValida } from "./utils.js";

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

export function editarMovimentacao(movimentacoes, id, novaMovimentacao) {
  const indice = movimentacoes.findIndex(function (mov) {
    return mov.id === id;
  });

  if (indice === -1) {
    return false;
  }

  movimentacoes[indice] = {
    ...movimentacoes[indice],
    ...novaMovimentacao,
    id,
  };

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
    id: crypto.randomUUID(),
    tipo,
    descricao,
    valor,
    categoria,
    data,
    schemaVersion: 1,
    serieId: null,
    origem: "unica",
    indiceOcorrencia: null,
    totalOcorrencias: null,
  };
}

export function criarMovimentacoesParceladas(
  tipo,
  valorTotal,
  descricao,
  categoria,
  dataInicial,
  quantidadeParcelas,
) {
  const serieId = crypto.randomUUID();
  const totalCentavos = Math.round(valorTotal * 100);
  const valorBaseCentavos = Math.floor(totalCentavos / quantidadeParcelas);
  const centavosRestantes = totalCentavos % quantidadeParcelas;

  return Array.from({ length: quantidadeParcelas }, function (_, indice) {
    const valorCentavos = valorBaseCentavos
      + (indice < centavosRestantes ? 1 : 0);

    return {
      ...criarMovimentacao(
        tipo,
        valorCentavos / 100,
        descricao,
        categoria,
        adicionarMesesAData(dataInicial, indice),
      ),
      serieId,
      origem: "parcelada",
      indiceOcorrencia: indice + 1,
      totalOcorrencias: quantidadeParcelas,
    };
  });
}

export function validarMovimentacao(valor, descricao, data) {
  if (!Number.isFinite(valor) || valor <= 0) {
    return "Digite numeros positivos";
  }

  if (descricao.trim() === "") {
    return "Digite uma descrição.";
  }

  if (!ehDataISOValida(data)) {
    return "Digite uma data.";
  }

  return null;
}
