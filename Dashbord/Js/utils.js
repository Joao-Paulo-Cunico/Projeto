
// FORMATA A DATA CORRETAMENTE
export function formatarData(data) {
  const partes = data.split("-");

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

//FORMATAR VALOR
export function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}