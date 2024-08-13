// Importação das funções necessárias
import {
  calcularAnosServico,
  calcularTempoAtividadeMilitar,
  calcularTempoEfetivoServico,
} from "./calculoTempoServico.js";
import { calcularDataAquisicao } from "./dataAquisicao.js";

// Função para calcular GHP
export function calcularGHP(gradPosto, soldo) {
  const ghpValores = {
    CSC: 1.6,
    "Formação SGT/Oficial": 0.8,
    "CAS ou equivalente": 1.1,
    "Curso de SD/CB": 0.75,
  };
  const percentual = ghpValores[gradPosto] || 0;
  return { valor: percentual * soldo, percentual: percentual * 100 };
}

// Função auxiliar para calcular o percentual
function calcularPercentual(anosPercentualAtividade, limite) {
  if (limite === 122.5) {
    return Math.min(anosPercentualAtividade, 122.5);
  } else if (limite === 150) {
    return Math.min(anosPercentualAtividade, 150);
  } else if (limite === 192.5) {
    return Math.min(anosPercentualAtividade, 192.5);
  } else {
    return 0;
  }
}

// Função para calcular a GRET
export function calcularGRET(
  dataInclusao,
  dataExclusao,
  postoGraduacao,
  averbacoes,
  soldo,
  inatividade,
  reforma,
) {
  const dataExclusaoDate = new Date(dataExclusao);
  const dataInclusaoDate = new Date(dataInclusao);
  const dataInicio2022 = new Date("2022-01-01");
  const dataInicio2020 = new Date("2020-10-27");
  const dataFim2021 = new Date("2021-12-31");
  const dataInicio2008 = new Date("2008-06-09");

  // Chamando a função de data de aquisição
  const dataAquisicao = calcularDataAquisicao(dataInclusao, averbacoes);

  // Chamando a função para calcular os anos de serviço com base nas datas e averbações
  const anosDeServico = calcularAnosServico(
    dataInclusao,
    dataExclusao,
    averbacoes,
  ).anos;

  // Chamando a função para calcular os anos de atividade militar
  const anosAtividadeMilitar = calcularTempoAtividadeMilitar(
    dataInclusao,
    dataExclusao,
    averbacoes,
  ).anos;

  // Logs para depuração
  console.log(`Data de Inclusão: ${dataInclusaoDate}`);
  console.log(`Data de Exclusão: ${dataExclusaoDate}`);
  console.log(`Data de Aquisição: ${dataAquisicao}`);
  console.log(`Anos de Serviço Calculados: ${anosDeServico}`);
  console.log(`Anos de Atividade Militar Calculados: ${anosAtividadeMilitar}`);
  console.log(`Averbações: ${JSON.stringify(averbacoes)}`);
  console.log(`Graduação/Posto: ${postoGraduacao}`);
  console.log(`Inatividade: ${inatividade}`);
  console.log(`Reforma: ${reforma}`);

  const percentuaisPos2022 = {
    150: [
      "Soldado BM",
      "Cabo BM",
      "3º Sargento BM",
      "2º Sargento BM",
      "1º Sargento BM",
      "Subtenente BM",
      "2º Tenente BM",
      "1º Tenente BM",
      "Capitão BM",
    ],
    192.5: ["Major BM", "Tenente Coronel BM", "Coronel BM"],
  };

  const percentuais2020A2021 = {
    122.5: [
      "Soldado BM",
      "Cabo BM",
      "3º Sargento BM",
      "2º Sargento BM",
      "1º Sargento BM",
    ],
    150: ["Subtenente BM", "2º Tenente BM", "1º Tenente BM"],
    192.5: ["Capitão BM", "Major BM", "Tenente Coronel BM", "Coronel BM"],
  };

  let percentual = 0;

  if (dataAquisicao < dataInicio2008) {
    // Regra para data de aquisição anterior a 09/06/2008
    percentual = anosDeServico * 5; // 5% por ano de serviço
    console.log(`Anos de Serviço: ${anosDeServico}`);
    console.log(`Percentual calculado: ${percentual}`);
  } else if (
    dataAquisicao >= dataInicio2008 &&
    dataAquisicao < dataInicio2020 &&
    dataExclusaoDate < dataInicio2022 &&
    (inatividade === "RESERVA REMUNERADA" ||
      inatividade === "RESERVA REMUNERADA EX-OFFÍCIO" ||
      (inatividade === "REFORMA" &&
        (reforma === "Art. 107, V c/ Art. 110, I" ||
          reforma === "Art. 107, V.")))
  ) {
    // Regra para a data de exclusão anterior a 01/01/2022 e data de aquisição entre 09/06/2008 e 26/10/2020
    const anosPercentualServico = anosDeServico * 5; // 5% por ano de serviço
    const limite = Object.keys(percentuais2020A2021).find((key) =>
      percentuais2020A2021[key].includes(postoGraduacao),
    );
    console.log(`Limite encontrado: ${limite}`);
    console.log(`Anos de Serviço: ${anosDeServico}`);
    console.log(`Anos Percentual Serviço: ${anosPercentualServico}`);

    if (limite === undefined) {
      console.error(`Limite não encontrado para posto: ${postoGraduacao}`);
      percentual = 0;
    } else {
      const limiteValor = parseFloat(limite);
      console.log(`Limite valor: ${limiteValor}`);
      percentual = calcularPercentual(anosPercentualServico, limiteValor);
      console.log(`Percentual calculado: ${percentual}`);
    }

    console.log(`Anos de Serviço: ${anosDeServico}`);
    console.log(`Percentual calculado: ${percentual}`);
    console.log(`Limite percentual: ${limite}`);
  } else if (
    dataAquisicao > dataFim2021 &&
    dataExclusaoDate >= dataInicio2020 &&
    dataExclusaoDate <= dataFim2021 &&
    (inatividade === "RESERVA REMUNERADA" ||
      inatividade === "RESERVA REMUNERADA EX-OFFÍCIO" ||
      (inatividade === "REFORMA" &&
        (reforma === "Art. 107, V c/ Art. 110, I" ||
          reforma === "Art. 107, V.")))
  ) {
    // Regra para a data de aquisição posterior a 31/12/2021 e data de exclusão entre 27/10/2020 e 31/12/2021
    const anosPercentualAtividade = anosAtividadeMilitar * 5; // 5% por ano de atividade militar
    const limite = Object.keys(percentuais2020A2021).find((key) =>
      percentuais2020A2021[key].includes(postoGraduacao),
    );
    console.log(`Limite encontrado: ${limite}`);
    console.log(`Anos de Atividade Militar: ${anosAtividadeMilitar}`);
    console.log(`Anos Percentual Atividade: ${anosPercentualAtividade}`);

    if (limite === undefined) {
      console.error(`Limite não encontrado para posto: ${postoGraduacao}`);
      percentual = 0;
    } else {
      const limiteValor = parseFloat(limite);
      console.log(`Limite valor: ${limiteValor}`);
      percentual = calcularPercentual(anosPercentualAtividade, limiteValor);
      console.log(`Percentual calculado: ${percentual}`);
    }

    console.log(`Anos de Atividade Militar: ${anosAtividadeMilitar}`);
    console.log(`Percentual calculado: ${percentual}`);
    console.log(`Limite percentual: ${limite}`);
  } else if (
    dataAquisicao < dataFim2021 &&
    dataAquisicao >= dataInicio2020 &&
    dataExclusaoDate >= dataInicio2020 &&
    dataExclusaoDate <= dataFim2021 &&
    (inatividade === "RESERVA REMUNERADA" ||
      inatividade === "RESERVA REMUNERADA EX-OFFÍCIO" ||
      (inatividade === "REFORMA" &&
        (reforma === "Art. 107, V c/ Art. 110, I" ||
          reforma === "Art. 107, V.")))
  ) {
    // Regra para a data de aquisição e data de exclusãoe entre 27/10/2020 e 31/12/2021
    const anosPercentualAtividade = anosAtividadeMilitar * 5; // 5% por ano de atividade militar
    const limite = Object.keys(percentuais2020A2021).find((key) =>
      percentuais2020A2021[key].includes(postoGraduacao),
    );
    console.log(`Limite encontrado: ${limite}`);
    console.log(`Anos de Atividade Militar: ${anosAtividadeMilitar}`);
    console.log(`Anos Percentual Atividade: ${anosPercentualAtividade}`);

    if (limite === undefined) {
      console.error(`Limite não encontrado para posto: ${postoGraduacao}`);
      percentual = 0;
    } else {
      const limiteValor = parseFloat(limite);
      console.log(`Limite valor: ${limiteValor}`);
      percentual = calcularPercentual(anosPercentualAtividade, limiteValor);
      console.log(`Percentual calculado: ${percentual}`);
    }

    console.log(`Anos de Atividade Militar: ${anosAtividadeMilitar}`);
    console.log(`Percentual calculado: ${percentual}`);
    console.log(`Limite percentual: ${limite}`);
  } else if (dataExclusaoDate >= dataInicio2022) {
    // Regra para a data de exclusão a partir de 01/01/2022
    if (
      [
        "Soldado BM",
        "Cabo BM",
        "3º Sargento BM",
        "2º Sargento BM",
        "1º Sargento BM",
        "Subtenente BM",
        "2º Tenente BM",
        "1º Tenente BM",
        "Capitão BM",
      ].includes(postoGraduacao)
    ) {
      percentual = 150;
    } else if (
      ["Major BM", "Tenente Coronel BM", "Coronel BM"].includes(postoGraduacao)
    ) {
      percentual = 192.5;
    }
    console.log(`Percentual para pós-2022: ${percentual}`);
  } else if (
    inatividade === "REFORMA" &&
    ["Art. 107, I, II, III, IV."].includes(reforma) &&
    dataExclusaoDate < dataInicio2022
  ) {
    const anosPercentualServico = anosDeServico * 5;
    // Regra para REFORMA com Art. 107, I, II, III, IV. antes de 01/01/2022
    const limite = Object.keys(percentuais2020A2021).find((key) =>
      percentuais2020A2021[key].includes(postoGraduacao),
    );
    console.log(`Limite encontrado: ${limite}`);
    console.log(`Anos de Serviço: ${anosDeServico}`);
    console.log(`Anos Percentual Serviço: ${anosPercentualServico}`);

    if (limite === undefined) {
      console.error(`Limite não encontrado para posto: ${postoGraduacao}`);
      percentual = 0;
    } else {
      const limiteValor = parseFloat(limite);
      console.log(`Limite valor: ${limiteValor}`);
      percentual = calcularPercentual(anosPercentualServico, limiteValor);
      console.log(`Percentual calculado: ${percentual}`);
    }

    console.log(`Anos de Serviço: ${anosDeServico}`);
    console.log(`Percentual calculado: ${percentual}`);
    console.log(`Limite percentual: ${limite}`);
  }

  console.log(`Graduação/Posto: ${postoGraduacao}`);
  console.log(`Percentual apurado: ${percentual}`);
  console.log(`Tipo de inatividade: ${inatividade}`);
  console.log(`Anos de Serviço: ${anosDeServico}`);

  const gretValue = (percentual / 100) * soldo;
  console.log(`Valor final da GRET: ${gretValue}`);

  return { valor: gretValue, percentual: percentual }; // Converte percentual para decimal e multiplica pelo soldo
}

// Função para calcular IAI ou GRAM
export function calcularIAI_GRAM(
  anosServico,
  dataExclusao,
  diasAtividadeMilitar, // Atualizado para usar diasAtividadeMilitar diretamente
  soldo,
  ghp,
  gret,
) {
  const dataExclusaoDate = new Date(dataExclusao);
  const dataInicioIAIRecente = new Date("2020-10-27");
  const dataFimIAIRecente = new Date("2021-12-31");
  const dataInicioGRAM = new Date("2022-01-01");

  // Converte dias de atividade militar para anos
  const anosAtividadeMilitar = diasAtividadeMilitar / 365.25;

  let percentual = 0;

  console.log(`Anos de Serviço: ${JSON.stringify(anosServico)}`);
  console.log(`Anos de Atividade Militar: ${anosAtividadeMilitar}`); // Atualizado para usar anosAtividadeMilitar diretamente
  console.log(`Data de Exclusão: ${dataExclusaoDate}`);

  if (dataExclusaoDate >= dataInicioGRAM) {
    percentual = 0.625; // GRAM é fixo em 62,5%
    console.log(`Percentual GRAM: ${percentual}`);
  } else if (
    dataExclusaoDate >= dataInicioIAIRecente &&
    dataExclusaoDate <= dataFimIAIRecente
  ) {
    console.log(
      `Comparando anosAtividadeMilitar < 30: ${anosAtividadeMilitar} < 30`,
    );
    if (anosAtividadeMilitar < 30) {
      // Atualizado para usar anosAtividadeMilitar diretamente
      percentual = 0.2;
      console.log(
        `Percentual IAI Recente (< 30 anos de atividade): ${percentual}`,
      );
    } else {
      console.log(
        `Comparando anosAtividadeMilitar >= 30 && anosAtividadeMilitar <= 40: ${anosAtividadeMilitar} >= 30 && ${anosAtividadeMilitar} <= 40`,
      );
      if (anosAtividadeMilitar >= 30 && anosAtividadeMilitar <= 40) {
        // Atualizado para usar anosAtividadeMilitar diretamente
        percentual = 0.25;
        console.log(
          `Percentual IAI Recente (30-40 anos de atividade): ${percentual}`,
        );
      } else {
        percentual = 0.3;
        console.log(
          `Percentual IAI Recente (> 40 anos de atividade): ${percentual}`,
        );
      }
    }
  } else if (dataExclusaoDate < dataInicioIAIRecente) {
    console.log(`Comparando anosServico.anos < 30: ${anosServico.anos} < 30`);
    if (anosServico.anos < 30) {
      percentual = 0.2;
      console.log(`Percentual IAI (< 30 anos de serviço): ${percentual}`);
    } else {
      console.log(
        `Comparando anosServico.anos >= 30 && anosServico.anos < 40: ${anosServico.anos} >= 30 && ${anosServico.anos} < 40`,
      );
      if (anosServico.anos >= 30 && anosServico.anos < 40) {
        percentual = 0.25;
        console.log(`Percentual IAI (30-40 anos de serviço): ${percentual}`);
      } else {
        percentual = 0.3;
        console.log(`Percentual IAI (> 40 anos de serviço): ${percentual}`);
      }
    }
  }

  const base = soldo + ghp + gret;
  console.log(`Base: ${base}`);
  const valorFinalIAI_GRAM = base * percentual;
  console.log(`Valor final do IAI/GRAM: ${valorFinalIAI_GRAM}`);
  return { valor: valorFinalIAI_GRAM, percentual: percentual * 100 };
  // Calcula o valor final de IAI ou GRAM
}

// Função para calcular GTS
export function calcularGTS(diasEfetivoServico, soldo, ghp, gret, iaiGram) {
  const diasPorTrienio = 3 * 365; // 3 anos
  const trieniosCompletos = Math.floor(diasEfetivoServico / diasPorTrienio);
  const trieniosParaCalculo = Math.min(trieniosCompletos, 11);
  let percentualGTS = 0;

  if (trieniosParaCalculo > 0) {
    percentualGTS += 10; // Primeiro triênio
    if (trieniosParaCalculo > 1) {
      percentualGTS += (trieniosParaCalculo - 1) * 5;
    }
  }

  // Calcula o valor total da GTS como um percentual do total de proventos
  const totalProventosBase = soldo + ghp + gret + iaiGram;
  console.log(`Dias de Efetivo Serviço: ${diasEfetivoServico}`);
  console.log(`Trienios Completos: ${trieniosCompletos}`);
  console.log(`Percentual GTS: ${percentualGTS}`);
  console.log(`Total de Proventos Base para GTS: ${totalProventosBase}`);
  return {
    valor: totalProventosBase * (percentualGTS / 100),
    percentual: percentualGTS,
  };
}
// Função para calcular Pecúnia
export function calcularPecunia(percentual, soldo, gret, ghp, gram, gts, dataExclusao) {
  const dataExclusaoDate = new Date(dataExclusao);
  const dataInicio2022 = new Date("2022-01-01");

  if (dataExclusaoDate >= dataInicio2022) {
    return (soldo + gret + ghp + gram + gts) * (percentual / 100);
  } else {
    return (soldo + gret + ghp + gts) * (percentual / 100);
  }
}
