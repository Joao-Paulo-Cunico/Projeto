export function passouFiltro(mov, filtro, pesquisa) {
  pesquisa = pesquisa.toLowerCase();

  if (filtro !== "todos" && mov.categoria !== filtro) {
    return false;
  }

  if (pesquisa !== "" && !mov.descricao.toLowerCase().includes(pesquisa)) {
    return false;
  }

  return true;
}