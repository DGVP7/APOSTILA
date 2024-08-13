import {
  calcularTempoServicoCBMERJ,
  calcularAnosServico,
  calcularTempoEfetivoServico,
  calcularTempoAtividadeMilitar,
} from "./calculoTempoServico.js";
import { calcularDataAquisicao } from "./dataAquisicao.js";
import {
  calcularPedagio,
  calcularAumentoTempoAtividadeMilitar,
} from "./calculoPedagio.js";
import { formatDate } from "./formUtils.js";
import { buscarSoldo } from "./soldo.js";
import {
  calcularGHP,
  calcularGRET,
  calcularIAI_GRAM,
  calcularGTS,
  calcularPecunia
} from "./calculoProventos.js";

function gerarResumo() {
  const nome = document.getElementById("nome").value;
  const rgMilitar = document.getElementById("rgMilitar").value;
  const gradPosto = document.getElementById("gradPosto").value;
  const inatividade = document.getElementById("inatividade").value;
  const dataInclusao = document.getElementById("dataInclusao").value;
  const dataExclusao = document.getElementById("dataExclusao").value;
  const dataExclusaoDate = new Date(dataExclusao);
  const dataInicio2022 = new Date("2022-01-01");
  const reforma = document.getElementById("reforma").value;
  const exOficio = document.getElementById("exOficio").value;

  // Definir vantagensInatividade com base na data de exclusão
  let vantagensInatividade;
  if (dataExclusaoDate >= dataInicio2022) {
    vantagensInatividade = "Vantagens de inatividade - Lei Estadual nº 279/79, Lei Estadual nº 880/85 e Lei Estadual nº 9537/21, abaixo discriminadas,";
  } else {
    vantagensInatividade = "Vantagens de inatividade - Lei Estadual nº 279/79 e Lei Estadual nº 880/85, abaixo discriminadas,";
  }

  const anosServicoMilitar =
    parseInt(document.getElementById("anosServicoMilitar").value) || 0;
  const mesesServicoMilitar =
    parseInt(document.getElementById("mesesServicoMilitar").value) || 0;
  const diasServicoMilitar =
    parseInt(document.getElementById("diasServicoMilitar").value) || 0;
  const anosServicoEstatutario =
    parseInt(document.getElementById("anosServicoEstatutario").value) || 0;
  const mesesServicoEstatutario =
    parseInt(document.getElementById("mesesServicoEstatutario").value) || 0;
  const diasServicoEstatutario =
    parseInt(document.getElementById("diasServicoEstatutario").value) || 0;
  const anosLicencaEspecial =
    parseInt(document.getElementById("anosLicencaEspecial").value) || 0;
  const mesesLicencaEspecial =
    parseInt(document.getElementById("mesesLicencaEspecial").value) || 0;
  const diasLicencaEspecial =
    parseInt(document.getElementById("diasLicencaEspecial").value) || 0;
  const anosFerias = parseInt(document.getElementById("anosFerias").value) || 0;
  const mesesFerias =
    parseInt(document.getElementById("mesesFerias").value) || 0;
  const diasFerias = parseInt(document.getElementById("diasFerias").value) || 0;
  const anosTsQos = parseInt(document.getElementById("anosTsQos").value) || 0;
  const mesesTsQos = parseInt(document.getElementById("mesesTsQos").value) || 0;
  const diasTsQos = parseInt(document.getElementById("diasTsQos").value) || 0;
  const anosInss = parseInt(document.getElementById("anosInss").value) || 0;
  const mesesInss = parseInt(document.getElementById("mesesInss").value) || 0;
  const diasInss = parseInt(document.getElementById("diasInss").value) || 0;

  const averbacoes = [
    anosServicoMilitar * 365 + mesesServicoMilitar * 30 + diasServicoMilitar,
    anosServicoEstatutario * 365 +
      mesesServicoEstatutario * 30 +
      diasServicoEstatutario,
    anosLicencaEspecial * 365 + mesesLicencaEspecial * 30 + diasLicencaEspecial,
    anosFerias * 365 + mesesFerias * 30 + diasFerias,
    anosTsQos * 365 + mesesTsQos * 30 + diasTsQos,
    anosInss * 365 + mesesInss * 30 + diasInss,
  ];
  const tempoServicoCBMERJ = calcularTempoServicoCBMERJ(
    dataInclusao,
    dataExclusao,
  );
  const tempoEfetivoServico = calcularTempoEfetivoServico(
    dataInclusao,
    dataExclusao,
    averbacoes,
  );
  const anosServico = calcularAnosServico(
    dataInclusao,
    dataExclusao,
    averbacoes,
  );
  const anosDeServico = anosServico.anos; // Usar anos inteiros
  const tempoAtividadeMilitar = calcularTempoAtividadeMilitar(
    dataInclusao,
    dataExclusao,
    averbacoes,
  );
  const dataAquisicao = calcularDataAquisicao(dataInclusao, averbacoes);

  const { tempoPedagio, dataInatividadePedagio } =
    calcularPedagio(dataAquisicao);
  const { tempoAumento, dataInatividadeAumento } =
    calcularAumentoTempoAtividadeMilitar(dataInclusao, averbacoes);

  const mesAno = dataExclusao.slice(5, 7) + "/" + dataExclusao.slice(2, 4);
  const anosServicoTotal =
    anosServico.anos + anosServico.meses / 12 + anosServico.dias / 365;

  buscarSoldo(
    gradPosto,
    mesAno,
    inatividade,
    anosServicoTotal,
    reforma,
    exOficio,
    anosDeServico,
  )
    .then((resultadoSoldo) => {
      console.log(`Resultado Soldo: ${JSON.stringify(resultadoSoldo)}`);
      const soldo = parseFloat(resultadoSoldo.valor);
      if (isNaN(soldo)) {
        throw new Error("Soldo retornou NaN");
      }
      const gradPostoSoldo = resultadoSoldo.gradPosto;
      const ghpObj = calcularGHP(document.getElementById("ghp").value, soldo);
      const gretObj = calcularGRET(
        dataInclusao,
        dataExclusao,
        gradPosto,
        averbacoes,
        soldo,
        inatividade,
        reforma,
      );
      const iaiGramObj = calcularIAI_GRAM(
        anosServico,
        dataExclusao,
        tempoEfetivoServico.totalDias,
        soldo,
        ghpObj.valor,
        gretObj.valor,
      );
      const gtsObj = calcularGTS(
        tempoEfetivoServico.totalDias,
        soldo,
        ghpObj.valor,
        gretObj.valor,
        iaiGramObj.valor,
      );

      // Calcular Pecúnia se selecionado "sim"
      let pecunia = 0;
      let percentualPecunia = 0; // Inicialize a variável aqui
      if (document.getElementById("pecunia").value === "sim" && parseFloat(document.getElementById("percentual").value) > 0) {
        percentualPecunia = parseFloat(document.getElementById("percentual").value);
        pecunia = calcularPecunia(percentualPecunia, soldo, gretObj.valor, ghpObj.valor, iaiGramObj.valor, gtsObj.valor, dataExclusao);
      }

      const totalProventos =
        soldo + ghpObj.valor + gretObj.valor + iaiGramObj.valor + gtsObj.valor + pecunia;

      let complementoInatividade = "";

      // Ajustando o complemento da inatividade
      if (inatividade === "REFORMA") {
        complementoInatividade = `REFORMA ${reforma}`;
      } else if (inatividade === "RESERVA REMUNERADA EX-OFFÍCIO") {
        complementoInatividade = `RESERVA REMUNERADA EX-OFFÍCIO ${exOficio}`;
      } else {
        complementoInatividade = inatividade;
      }

      // Determinando o termo correto para IAI ou GRAM com base na data de exclusão
      const termoIAI_GRAM = dataExclusaoDate < dataInicio2022 ? "IAI" : "GRAM";

      // Criar o texto do resumo
      let resumo = `
        ${gradPosto} ${nome}, RG ${rgMilitar}
        ${complementoInatividade} em ${formatDate(new Date(dataExclusao))}
        Tempo de Serviço CBMERJ: ${tempoServicoCBMERJ.anos} anos, ${tempoServicoCBMERJ.meses} meses, ${tempoServicoCBMERJ.dias} dias
        Tempo de Atividade Militar: ${tempoAtividadeMilitar.anos} anos, ${tempoAtividadeMilitar.meses} meses, ${tempoAtividadeMilitar.dias} dias
        Tempo de Efetivo Serviço: ${tempoEfetivoServico.anos} anos, ${tempoEfetivoServico.meses} meses, ${tempoEfetivoServico.dias} dias
        Anos de Serviço: ${anosServico.anos} anos, ${anosServico.meses} meses, ${anosServico.dias} dias
        Data de Aquisição: ${formatDate(dataAquisicao)}
        Pedágio: ${tempoPedagio.anos} anos, ${tempoPedagio.meses} meses, ${tempoPedagio.dias} dias referentes à 17%, com data de inatividade em ${dataInatividadePedagio}
        Aumento de Tempo de Atividade Militar: ${tempoAumento.anos} anos, ${tempoAumento.meses} meses de pré-requisito de natureza militar, com data de inatividade em ${dataInatividadeAumento}
        Proventos: soldo de ${gradPostoSoldo} no valor de R$${soldo.toFixed(2)}, GHP (${ghpObj.percentual.toFixed(0)}%) R$${ghpObj.valor.toFixed(2)}, GRET (${gretObj.percentual}%) R$${gretObj.valor.toFixed(2)}, ${termoIAI_GRAM} (${iaiGramObj.percentual}%) R$${iaiGramObj.valor.toFixed(2)}, GTS (${gtsObj.percentual}%) R$${gtsObj.valor.toFixed(2)}`;

      // Adicionar Pecúnia ao resumo se aplicável
if (percentualPecunia > 0) {
  resumo += `, Pecúnia (${percentualPecunia}%) R$${pecunia.toFixed(2)}`;
}

resumo += `, perfazendo um total de R$${totalProventos.toFixed(2)}`;

document.getElementById("resumo").innerText = resumo.trim();


// Armazenar valores no localStorage após gerar o resumo
localStorage.setItem('inatividade', inatividade); // Armazena apenas o valor de inatividade simples
localStorage.setItem('numeroProcesso', document.getElementById('numeroProcesso').value); // Armazena o valor de numeroProcesso
localStorage.setItem('vantagensInatividade', vantagensInatividade);
localStorage.setItem('referenteAo', `Referente ao ${gradPosto} ${nome}, RG ${rgMilitar}`);
localStorage.setItem('tempoServicoCBMERJ', JSON.stringify(tempoServicoCBMERJ));
localStorage.setItem('anosServico', JSON.stringify(anosServico));
localStorage.setItem('dataAquisicao', formatDate(dataAquisicao));
localStorage.setItem('gts', gtsObj.percentual.toFixed(2));
localStorage.setItem('gret', gretObj.percentual.toFixed(2));
localStorage.setItem('dataInclusao', document.getElementById('dataInclusao').value);
localStorage.setItem('dataExclusao', document.getElementById('dataExclusao').value);

})
.catch((error) => {
  document.getElementById("resumo").innerText =
  `Erro ao gerar resumo: ${error}`;
});
}

document.getElementById("gerarResumo").addEventListener("click", gerarResumo);
