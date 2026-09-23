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

export function atualizarBotoesFormulario(btnReceita, btnDespesa) {
  btnReceita.textContent = "Adicionar";
  btnDespesa.textContent = "Adicionar";
}
