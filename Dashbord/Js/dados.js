import { ehDataISOValida } from "./utils.js";

const VERSAO_SCHEMA_ATUAL = 1;

export function salvarDados(movimentacoes) {
  localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
}

export function carregarDados() {
  const dadosSalvos = localStorage.getItem("movimentacoes");

  if (!dadosSalvos) {
    return [];
  }

  try {
    const dados = JSON.parse(dadosSalvos);

    if (!Array.isArray(dados)) {
      return [];
    }

    return dados
      .map(normalizarMovimentacao)
      .filter(function (movimentacao) {
        return movimentacao !== null;
      });
  } catch {
    return [];
  }
}

function normalizarMovimentacao(registro) {
  if (!registro || typeof registro !== "object" || Array.isArray(registro)) {
    return null;
  }

  const valor = Number(registro.valor);
  const descricao = typeof registro.descricao === "string"
    ? registro.descricao.trim()
    : "";
  const idValido = (typeof registro.id === "string" && registro.id !== "")
    || (typeof registro.id === "number" && Number.isFinite(registro.id));

  if (
    !Number.isFinite(valor)
    || valor <= 0
    || descricao === ""
    || !ehDataISOValida(registro.data)
    || (registro.tipo !== "receita" && registro.tipo !== "despesa")
  ) {
    return null;
  }

  return {
    ...registro,
    id: idValido ? registro.id : crypto.randomUUID(),
    tipo: registro.tipo,
    valor,
    descricao,
    categoria: typeof registro.categoria === "string" ? registro.categoria : "outros",
    data: registro.data,
    schemaVersion: Number.isInteger(registro.schemaVersion)
      ? registro.schemaVersion
      : VERSAO_SCHEMA_ATUAL,
    // Metadados reservados para séries; movimentações atuais permanecem únicas.
    serieId: typeof registro.serieId === "string" ? registro.serieId : null,
    origem: typeof registro.origem === "string" ? registro.origem : "unica",
    indiceOcorrencia: Number.isInteger(registro.indiceOcorrencia)
      ? registro.indiceOcorrencia
      : null,
    totalOcorrencias: Number.isInteger(registro.totalOcorrencias)
      ? registro.totalOcorrencias
      : null,
  };
}
