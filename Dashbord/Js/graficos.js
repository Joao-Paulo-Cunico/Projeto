let graficoReceitasDespesas = null;
let graficoDespesasCategoria = null;
let graficoEvolucaoMensal = null;

const coresCategorias = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#14b8a6",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef",
];

function agruparDespesasPorCategoria(movimentacoes, encontrarCategoria) {
  const despesasPorCategoria = {};

  movimentacoes.forEach(function (mov) {
    if (mov.tipo !== "despesa") return;

    if (!despesasPorCategoria[mov.categoria]) {
      despesasPorCategoria[mov.categoria] = 0;
    }

    despesasPorCategoria[mov.categoria] += Number(mov.valor) || 0;
  });

  const categorias = Object.keys(despesasPorCategoria);

  return {
    labels: categorias.map(function (categoria) {
      return encontrarCategoria(categoria);
    }),
    valores: categorias.map(function (categoria) {
      return despesasPorCategoria[categoria];
    }),
  };
}

function agruparMovimentacoesPorMes(movimentacoes) {
  const movimentacoesPorMes = {};

  movimentacoes.forEach(function (mov) {
    if (!mov.data) return;

    const mes = mov.data.slice(0, 7);

    if (!movimentacoesPorMes[mes]) {
      movimentacoesPorMes[mes] = { receita: 0, despesa: 0 };
    }

    movimentacoesPorMes[mes][mov.tipo] += Number(mov.valor) || 0;
  });

  const meses = Object.keys(movimentacoesPorMes).sort();

  return {
    labels: meses.map(function (mes) {
      const partes = mes.split("-");
      return `${partes[1]}/${partes[0]}`;
    }),
    receitas: meses.map(function (mes) {
      return movimentacoesPorMes[mes].receita;
    }),
    despesas: meses.map(function (mes) {
      return movimentacoesPorMes[mes].despesa;
    }),
  };
}

function criarGraficoRosca(elemento, labels, valores, cores) {
  return new Chart(elemento, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: valores,
        backgroundColor: cores,
        borderWidth: 2,
        borderColor: "#ffffff",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
  });
}

function atualizarGraficoRosca(grafico, labels, valores, cores) {
  grafico.data.labels = labels;
  grafico.data.datasets[0].data = valores;
  grafico.data.datasets[0].backgroundColor = cores;
  grafico.update();
}

function repetirCores(quantidade) {
  return Array.from({ length: quantidade }, function (_, indice) {
    return coresCategorias[indice % coresCategorias.length];
  });
}

export function atualizarGraficos(
  movimentacoes,
  receitaTotal,
  despesaTotal,
  encontrarCategoria,
) {
  const despesasPorCategoria = agruparDespesasPorCategoria(
    movimentacoes,
    encontrarCategoria,
  );
  const evolucaoMensal = agruparMovimentacoesPorMes(movimentacoes);
  const canvasReceitasDespesas = document.getElementById("grafico-receitas-despesas");
  const canvasDespesasCategoria = document.getElementById("grafico-despesas-categoria");
  const canvasEvolucaoMensal = document.getElementById("grafico-evolucao-mensal");

  if (!graficoReceitasDespesas) {
    graficoReceitasDespesas = criarGraficoRosca(
      canvasReceitasDespesas,
      ["Receitas", "Despesas"],
      [receitaTotal, despesaTotal],
      ["#0ea5a4", "#ef4444"],
    );
  } else {
    atualizarGraficoRosca(
      graficoReceitasDespesas,
      ["Receitas", "Despesas"],
      [receitaTotal, despesaTotal],
      ["#0ea5a4", "#ef4444"],
    );
  }

  if (!graficoDespesasCategoria) {
    graficoDespesasCategoria = criarGraficoRosca(
      canvasDespesasCategoria,
      despesasPorCategoria.labels,
      despesasPorCategoria.valores,
      repetirCores(despesasPorCategoria.valores.length),
    );
  } else {
    atualizarGraficoRosca(
      graficoDespesasCategoria,
      despesasPorCategoria.labels,
      despesasPorCategoria.valores,
      repetirCores(despesasPorCategoria.valores.length),
    );
  }

  if (!graficoEvolucaoMensal) {
    graficoEvolucaoMensal = new Chart(canvasEvolucaoMensal, {
      type: "line",
      data: {
        labels: evolucaoMensal.labels,
        datasets: [
          { label: "Receitas", data: evolucaoMensal.receitas, borderColor: "#0ea5a4", backgroundColor: "rgba(14, 165, 164, 0.15)", tension: 0.3 },
          { label: "Despesas", data: evolucaoMensal.despesas, borderColor: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.15)", tension: 0.3 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });
  } else {
    graficoEvolucaoMensal.data.labels = evolucaoMensal.labels;
    graficoEvolucaoMensal.data.datasets[0].data = evolucaoMensal.receitas;
    graficoEvolucaoMensal.data.datasets[1].data = evolucaoMensal.despesas;
    graficoEvolucaoMensal.update();
  }
}
