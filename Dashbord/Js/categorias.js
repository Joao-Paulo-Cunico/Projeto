

// CATEGORIAS
export const categorias = [
  { value: "salario", label: "Salário" },
  { value: "pix", label: "Pix" },
  { value: "presente", label: "Presente" },
  { value: "emprestimo", label: "Empréstimo" },
  { value: "transferencia", label: "Transferência" },
  { value: "academia", label: "Academia" },
  { value: "assinatura", label: "Assinatura" },
  { value: "casa", label: "Casa" },
  { value: "educacao", label: "Educação" },
  { value: "lazer", label: "Lazer" },
  { value: "operacao_bancaria", label: "Operação Bancária" },
  { value: "saude", label: "Saúde" },
  { value: "servicos", label: "Serviços" },
  { value: "mercado", label: "Mercado" },
  { value: "restaurante", label: "Restaurante" },
  { value: "transporte", label: "Transporte" },
  { value: "viagens", label: "Viagens" },
  { value: "outros", label: "Outros" },
];

export function preencherCategorias(select) {
  categorias.forEach(function (categoria) {
    const option = document.createElement("option");

    option.value = categoria.value;
    option.textContent = categoria.label;

    select.appendChild(option);
  });
}


export function preencherFiltroHistorico(select) {
  const opcaoTodos = document.createElement("option");

  opcaoTodos.value = "todos";
  opcaoTodos.textContent = "Todos";

  select.appendChild(opcaoTodos);

  categorias.forEach(function (categoria) {
    const option = document.createElement("option");

    option.value = categoria.value;
    option.textContent = categoria.label;

    select.appendChild(option);
  });
}

export function encontrarCategoria(idCategoria) {
  const categoria = categorias.find(function (categoria) {
    return categoria.value === idCategoria;
  });

  if (!categoria) {
    return idCategoria;
  }

  return categoria.label;
}