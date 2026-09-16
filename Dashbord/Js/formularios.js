export function limparFormulario(
  inputValor,
  inputDescricao,
  selectCategoria,
  inputData,
) {
  inputValor.value = "";
  inputDescricao.value = "";
  selectCategoria.selectedIndex = 0;
  inputData.value = "";
}

export function atualizarBotoesFormulario(btn_receita, btn_despesa) {
  btn_receita.textContent = "Adicionar";
  btn_despesa.textContent = "Adicionar";
}