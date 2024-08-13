// Função para calcular a data de aquisição
export function calcularDataAquisicao(dataInclusao, averbacoes) {
  const totalDiasAverbacoes = averbacoes.reduce(
    (total, atual) => total + atual,
    0,
  );

  const dataAquisicao = new Date(dataInclusao);
  dataAquisicao.setFullYear(dataAquisicao.getFullYear() + 30);
  dataAquisicao.setDate(dataAquisicao.getDate() - totalDiasAverbacoes);

  return dataAquisicao;
}
