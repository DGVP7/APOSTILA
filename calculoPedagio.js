import { calcularAnosMesesDias, formatDate } from "./formUtils.js";

// Função para calcular o pedágio
export function calcularPedagio(dataAquisicao) {
  const dataReferencia = new Date("2021-12-21");
  const diffTime = Math.abs(dataAquisicao - dataReferencia);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const pedagioDias = Math.floor(diffDays * 0.17);

  const dataInatividadePedagio = new Date(dataAquisicao);
  dataInatividadePedagio.setDate(
    dataInatividadePedagio.getDate() + pedagioDias,
  );

  const tempoPedagio = calcularAnosMesesDias(pedagioDias);
  const dataInatividadePedagioFormatada = formatDate(dataInatividadePedagio);

  return {
    tempoPedagio,
    dataInatividadePedagio: dataInatividadePedagioFormatada,
  };
}

// Função para calcular o aumento de tempo de atividade militar
export function calcularAumentoTempoAtividadeMilitar(dataInclusao, averbacoes) {
  const totalDiasAverbacoes = averbacoes.reduce(
    (total, atual) => total + atual,
    0,
  );
  const dataReferencia = new Date("2022-01-01");

  const dataAquisicao = new Date(dataInclusao);
  dataAquisicao.setFullYear(dataAquisicao.getFullYear() + 30);
  dataAquisicao.setDate(dataAquisicao.getDate() - totalDiasAverbacoes);

  const diffTime = Math.abs(dataAquisicao - dataReferencia);
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
  const aumentoMeses = diffYears * 4;

  const dataInatividadeAumento = new Date(dataInclusao);
  dataInatividadeAumento.setFullYear(dataInatividadeAumento.getFullYear() + 25);
  dataInatividadeAumento.setDate(
    dataInatividadeAumento.getDate() - totalDiasAverbacoes,
  );
  dataInatividadeAumento.setMonth(
    dataInatividadeAumento.getMonth() + aumentoMeses,
  );

  const tempoAumento = {
    anos: Math.floor(aumentoMeses / 12),
    meses: aumentoMeses % 12,
    dias: 0,
  };
  const dataInatividadeAumentoFormatada = formatDate(dataInatividadeAumento);

  return {
    tempoAumento,
    dataInatividadeAumento: dataInatividadeAumentoFormatada,
  };
}
