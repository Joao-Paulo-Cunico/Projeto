
// FORMATA A DATA CORRETAMENTE
export function formatarData(data) {
  const partes = data.split("-");

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export function ehDataISOValida(data) {
  if (typeof data !== "string") {
    return false;
  }

  const correspondencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data);

  if (!correspondencia) {
    return false;
  }

  const ano = Number(correspondencia[1]);
  const mes = Number(correspondencia[2]);
  const dia = Number(correspondencia[3]);
  const dataUtc = new Date(Date.UTC(ano, mes - 1, dia));

  return dataUtc.getUTCFullYear() === ano
    && dataUtc.getUTCMonth() === mes - 1
    && dataUtc.getUTCDate() === dia;
}

// Utilitário para futuras séries: opera com componentes de calendário, sem setMonth.
export function adicionarMesesAData(data, quantidadeMeses) {
  if (!ehDataISOValida(data) || !Number.isInteger(quantidadeMeses)) {
    return null;
  }

  const [ano, mes, dia] = data.split("-").map(Number);
  const mesAbsoluto = ano * 12 + (mes - 1) + quantidadeMeses;
  const anoDestino = Math.floor(mesAbsoluto / 12);
  const mesDestino = ((mesAbsoluto % 12) + 12) % 12;
  const ultimoDiaDestino = new Date(
    Date.UTC(anoDestino, mesDestino + 1, 0),
  ).getUTCDate();
  const diaDestino = Math.min(dia, ultimoDiaDestino);

  return `${String(anoDestino).padStart(4, "0")}-${String(mesDestino + 1).padStart(2, "0")}-${String(diaDestino).padStart(2, "0")}`;
}

//FORMATAR VALOR
export function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
