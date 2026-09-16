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