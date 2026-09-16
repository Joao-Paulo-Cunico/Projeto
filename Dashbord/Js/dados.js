export function salvarDados(movimentacoes) {
  localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
}

export function carregarDados() {
  const dadosSalvos = localStorage.getItem("movimentacoes");

  if (!dadosSalvos) {
    return [];
  }

  return JSON.parse(dadosSalvos);
}