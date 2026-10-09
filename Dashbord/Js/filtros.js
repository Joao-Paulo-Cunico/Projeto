export function passouFiltro(mov, filtro, pesquisa, filtroTipo = "todos") {
  pesquisa = pesquisa.toLowerCase();

  if (filtro !== "todos" && mov.categoria !== filtro) {
    return false;
  }

  if (filtroTipo !== "todos" && mov.origem !== filtroTipo) {
    return false;
  }

  if (pesquisa !== "" && !mov.descricao.toLowerCase().includes(pesquisa)) {
    return false;
  }

  return true;
}

export function passouFiltroMes(mov, mesSelecionado) {
  if (mesSelecionado === "todos") {
    return true;
  }

  return mov.data.slice(0, 7) === mesSelecionado;
}

export function preencherFiltroMes(select, movimentacoes) {
  const mesSelecionado = select.value;
  const meses = [...new Set(movimentacoes.map(function (mov) {
    return mov.data.slice(0, 7);
  }))].sort();

  select.innerHTML = "";

  const opcaoTodos = document.createElement("option");
  opcaoTodos.value = "todos";
  opcaoTodos.textContent = "Todos os meses";
  select.appendChild(opcaoTodos);

  meses.forEach(function (mes) {
    const partes = mes.split("-");
    const nomesDosMeses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    const option = document.createElement("option");

    option.value = mes;
    option.textContent = `${nomesDosMeses[Number(partes[1]) - 1]}/${partes[0]}`;
    select.appendChild(option);
  });

  select.value = meses.includes(mesSelecionado) ? mesSelecionado : "todos";
}
