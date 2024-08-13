// Função para calcular anos, meses e dias a partir de um total de dias
export function calcularAnosMesesDias(totalDias) {
  const anos = Math.floor(totalDias / 365);
  const meses = Math.floor((totalDias % 365) / 30);
  const dias = totalDias % 30;

  return { anos, meses, dias };
}

// Função para formatar uma data em dd/mm/yyyy
export function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
