import { calcularAnosMesesDias } from "./formUtils.js";

// Função para calcular o tempo de serviço CBMERJ
export function calcularTempoServicoCBMERJ(dataInclusao, dataExclusao) {
  const inicio = new Date(dataInclusao);
  const fim = new Date(dataExclusao);
  const diffTime = Math.abs(fim - inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return calcularAnosMesesDias(diffDays);
}

// Função para calcular o tempo de efetivo serviço
export function calcularTempoEfetivoServico(
  dataInclusao,
  dataExclusao,
  averbacoes,
) {
  const inicio = new Date(dataInclusao);
  const fim = new Date(dataExclusao);
  const diffTime = Math.abs(fim - inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const totalDiasEfetivoServico =
    diffDays +
    (averbacoes[0] || 0) +
    (averbacoes[1] || 0) +
    (averbacoes[2] || 0) +
    (averbacoes[3] || 0);

  return {
    ...calcularAnosMesesDias(totalDiasEfetivoServico),
    totalDias: totalDiasEfetivoServico,
  };
}

// Função para calcular os anos de serviço
export function calcularAnosServico(dataInclusao, dataExclusao, averbacoes) {
  const inicio = new Date(dataInclusao);
  const fim = new Date(dataExclusao);
  const diffTime = Math.abs(fim - inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const totalDiasAnosServico =
    diffDays +
    (averbacoes[0] || 0) +
    (averbacoes[1] || 0) +
    (averbacoes[2] || 0) +
    (averbacoes[3] || 0) +
    (averbacoes[4] || 0) +
    (averbacoes[5] || 0);

  return calcularAnosMesesDias(totalDiasAnosServico);
}

// Função para calcular o tempo de atividade militar
export function calcularTempoAtividadeMilitar(
  dataInclusao,
  dataExclusao,
  averbacoes,
) {
  const inicio = new Date(dataInclusao);
  const fim = new Date(dataExclusao);
  const diffTime = Math.abs(fim - inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const totalDiasAtividadeMilitar = diffDays + (averbacoes[0] || 0);

  console.log(`Data de Inclusão: ${dataInclusao}`);
  console.log(`Data de Exclusão: ${dataExclusao}`);
  console.log(`Diferença em Dias: ${diffDays}`);
  console.log(`Tempo de Serviço Militar: ${averbacoes[0]}`);
  console.log(
    `Total de Dias de Atividade Militar: ${totalDiasAtividadeMilitar}`,
  );

  return calcularAnosMesesDias(totalDiasAtividadeMilitar);
}
