window.onload = function() {
    // Capturar valores do localStorage e exibir nas fieldsets
    console.log("Capturando valores do localStorage...");
    document.getElementById('inatividade-value').innerText = localStorage.getItem('inatividade') || 'N/A';
    document.getElementById('resumo2').innerText = localStorage.getItem('numeroProcesso') || 'N/A';

    const vantagensInatividadeElement = document.getElementById('vantagens-inatividade');
    const referenteAoElement = document.getElementById('referente-ao');

    const vantagensInatividade = localStorage.getItem('vantagensInatividade') || 'N/A';
    const referenteAo = localStorage.getItem('referenteAo') || 'N/A';

    console.log("vantagensInatividade:", vantagensInatividade);
    console.log("referenteAo:", referenteAo);

    if (vantagensInatividadeElement) {
        vantagensInatividadeElement.innerText = vantagensInatividade;
    } else {
        console.error("Elemento 'vantagens-inatividade' não encontrado.");
    }

    if (referenteAoElement) {
        referenteAoElement.innerText = referenteAo;
    } else {
        console.error("Elemento 'referente-ao' não encontrado.");
    }

    // Capturar as averbações diretamente do formulário do index.html
    const anosServicoMilitar = parseInt(window.opener.document.getElementById("anosServicoMilitar").value) || 0;
    const mesesServicoMilitar = parseInt(window.opener.document.getElementById("mesesServicoMilitar").value) || 0;
    const diasServicoMilitar = parseInt(window.opener.document.getElementById("diasServicoMilitar").value) || 0;
    const anosServicoEstatutario = parseInt(window.opener.document.getElementById("anosServicoEstatutario").value) || 0;
    const mesesServicoEstatutario = parseInt(window.opener.document.getElementById("mesesServicoEstatutario").value) || 0;
    const diasServicoEstatutario = parseInt(window.opener.document.getElementById("diasServicoEstatutario").value) || 0;
    const anosLicencaEspecial = parseInt(window.opener.document.getElementById("anosLicencaEspecial").value) || 0;
    const mesesLicencaEspecial = parseInt(window.opener.document.getElementById("mesesLicencaEspecial").value) || 0;
    const diasLicencaEspecial = parseInt(window.opener.document.getElementById("diasLicencaEspecial").value) || 0;
    const anosFerias = parseInt(window.opener.document.getElementById("anosFerias").value) || 0;
    const mesesFerias = parseInt(window.opener.document.getElementById("mesesFerias").value) || 0;
    const diasFerias = parseInt(window.opener.document.getElementById("diasFerias").value) || 0;
    const anosTsQos = parseInt(window.opener.document.getElementById("anosTsQos").value) || 0;
    const mesesTsQos = parseInt(window.opener.document.getElementById("mesesTsQos").value) || 0;
    const diasTsQos = parseInt(window.opener.document.getElementById("diasTsQos").value) || 0;
    const anosInss = parseInt(window.opener.document.getElementById("anosInss").value) || 0;
    const mesesInss = parseInt(window.opener.document.getElementById("mesesInss").value) || 0;
    const diasInss = parseInt(window.opener.document.getElementById("diasInss").value) || 0;

    console.log("anosServicoMilitar:", anosServicoMilitar);
    console.log("mesesServicoMilitar:", mesesServicoMilitar);
    console.log("diasServicoMilitar:", diasServicoMilitar);
    console.log("anosServicoEstatutario:", anosServicoEstatutario);
    console.log("mesesServicoEstatutario:", mesesServicoEstatutario);
    console.log("diasServicoEstatutario:", diasServicoEstatutario);
    console.log("anosLicencaEspecial:", anosLicencaEspecial);
    console.log("mesesLicencaEspecial:", mesesLicencaEspecial);
    console.log("diasLicencaEspecial:", diasLicencaEspecial);
    console.log("anosFerias:", anosFerias);
    console.log("mesesFerias:", mesesFerias);
    console.log("diasFerias:", diasFerias);
    console.log("anosTsQos:", anosTsQos);
    console.log("mesesTsQos:", mesesTsQos);
    console.log("diasTsQos:", diasTsQos);
    console.log("anosInss:", anosInss);
    console.log("mesesInss:", mesesInss);
    console.log("diasInss:", diasInss);

    // Capturar "Tempo de Serviço CBMERJ" e "Anos de Serviço" do localStorage
    const tempoServicoCBMERJ = JSON.parse(localStorage.getItem('tempoServicoCBMERJ')) || { anos: 0, meses: 0, dias: 0 };
    const anosServico = JSON.parse(localStorage.getItem('anosServico')) || { anos: 0, meses: 0, dias: 0 };

    console.log("tempoServicoCBMERJ:", tempoServicoCBMERJ);
    console.log("anosServico:", anosServico);

    // Função para verificar se um ano é bissexto
    function isBissexto(ano) {
        return (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
    }

    // Função para calcular o número de anos bissextos entre duas datas
    function calcularAnosBissextos(dataInclusao, dataExclusao) {
        const anoInclusao = dataInclusao.getFullYear();
        const anoExclusao = dataExclusao.getFullYear();
        let anosBissextos = 0;

        for (let ano = anoInclusao; ano <= anoExclusao; ano++) {
            if (isBissexto(ano)) {
                if (ano > anoInclusao || (ano === anoInclusao && dataInclusao.getMonth() < 2) ||
                    ano < anoExclusao || (ano === anoExclusao && dataExclusao.getMonth() > 1)) {
                    anosBissextos++;
                }
            }
        }

        return anosBissextos;
    }

    // Capturar datas de inclusão e exclusão do localStorage
    const dataInclusaoStr = localStorage.getItem('dataInclusao');
    const dataExclusaoStr = localStorage.getItem('dataExclusao');

    console.log("dataInclusaoStr:", dataInclusaoStr);
    console.log("dataExclusaoStr:", dataExclusaoStr);

    let anosBissextos = 0;
    if (dataInclusaoStr && dataExclusaoStr) {
        const dataInclusao = new Date(dataInclusaoStr);
        const dataExclusao = new Date(dataExclusaoStr);

        if (!isNaN(dataInclusao.getTime()) && !isNaN(dataExclusao.getTime())) {
            anosBissextos = calcularAnosBissextos(dataInclusao, dataExclusao);
        }
    }

    console.log("anosBissextos:", anosBissextos);

    // Atualizar os valores nas colunas de Anos Bissextos e Data de Aquisição
    const anosBissextosElement = document.getElementById('anos-bissextos');
    const dataAquisicaoElement = document.getElementById('data-aquisicao');

    if (anosBissextosElement) {
        anosBissextosElement.innerText = anosBissextos || 'N/A';
    } else {
        console.error("Elemento 'anos-bissextos' não encontrado.");
    }

    if (dataAquisicaoElement) {
        dataAquisicaoElement.innerText = localStorage.getItem('dataAquisicao') || 'N/A';
    } else {
        console.error("Elemento 'data-aquisicao' não encontrado.");
    }

    // Capturar os valores adicionais do localStorage
    const gts = localStorage.getItem('gts') || 'N/A';
    const gret = localStorage.getItem('gret') || 'N/A';

    console.log("gts:", gts);
    console.log("gret:", gret);

    // Capturar o valor de gradPosto
const gradPosto = window.opener.document.getElementById("gradPosto").value;
console.log("gradPosto:", gradPosto);

// Determinar se é praça ou oficial
const isPraca = [
    "Soldado BM",
    "Cabo BM",
    "3º Sargento BM",
    "2º Sargento BM",
    "1º Sargento BM",
    "Subtenente BM"
].includes(gradPosto);

// Capturar o valor de DOERJ do localStorage
const doerj = window.opener.document.getElementById("DOERJ").value || 'N/A';

// Atualizar o campo 4 com o texto apropriado
const resumo4Element = document.getElementById('resumo4');
if (isPraca) {
    resumo4Element.innerText = `Ato do Ilmo Sr. Diretor da DGP; publicado no DOERJ em: ${doerj}`;
} else {
    resumo4Element.innerText = `Ato do Ilmo Sr. Comandante Geral; publicado no DOERJ em: ${doerj}`;
}

    // Montar o texto de resumo para as averbações
    const averbacoesResumidas = [
        { label: 'Tempo de Serviço CBMERJ', anos: tempoServicoCBMERJ.anos, meses: tempoServicoCBMERJ.meses, dias: tempoServicoCBMERJ.dias, legislacao: '' },
        { label: 'Tempo de Serviço Militar', anos: anosServicoMilitar, meses: mesesServicoMilitar, dias: diasServicoMilitar, legislacao: 'Art. 135, inciso III da Lei 880/85.' },
        { label: 'Tempo de Serviço Estatutário', anos: anosServicoEstatutario, meses: mesesServicoEstatutario, dias: diasServicoEstatutario, legislacao: 'Art. 135, inciso I da Lei 880/85.' },
        { label: 'Licença Especial', anos: anosLicencaEspecial, meses: mesesLicencaEspecial, dias: diasLicencaEspecial, legislacao: 'Art. 135, inciso IV da Lei 880/85.' },
        { label: 'Férias', anos: anosFerias, meses: mesesFerias, dias: diasFerias, legislacao: 'Art. 135, inciso V da Lei 880/85.' },
        { label: 'T.S Q.O.S', anos: anosTsQos, meses: mesesTsQos, dias: diasTsQos, legislacao: 'Art. 135, inciso II da Lei 880/85.' },
        { label: 'INSS', anos: anosInss, meses: mesesInss, dias: diasInss, legislacao: 'Art. 201, §9-A, CRFB/88.' },
        { label: 'Anos de Serviço', anos: anosServico.anos, meses: anosServico.meses, dias: anosServico.dias, legislacao: '' }
    ];

    let resumoAverbacoes = '';
    let resumoLegislacao = '';

    averbacoesResumidas.forEach(item => {
        if (item.anos > 0 || item.meses > 0 || item.dias > 0) {
            resumoAverbacoes += `
                <div class="linha-tempo">
                    <div class="coluna-titulo">${item.label}</div>
                    <div class="coluna">${item.anos}</div>
                    <div class="coluna">${item.meses}</div>
                    <div class="coluna">${item.dias}</div>
                </div>
            `;
            if (item.legislacao) {
                resumoLegislacao += `
                    <div class="linha-tempo">
                        <div class="coluna-titulo">${item.legislacao}</div>
                    </div>
                `;
            }
        }
    });

    console.log("resumoAverbacoes:", resumoAverbacoes);
    console.log("resumoLegislacao:", resumoLegislacao);

    const tabelaCalculos = document.querySelector('.tabela-calculos');
    if (tabelaCalculos) {
        tabelaCalculos.innerHTML += resumoAverbacoes || 'N/A';
    } else {
        console.error("Elemento '.tabela-calculos' não encontrado.");
    }

    const tabelaComplementar = document.querySelector('.tabela-complementar');
    if (tabelaComplementar) {
        tabelaComplementar.innerHTML = `
            <div class="linha-tempo">
                <div class="coluna-titulo">Anos bissextos: ${anosBissextos}</div>
            </div>
            <div class="linha-tempo">
                <div class="coluna-titulo">Data de Aquisição: ${localStorage.getItem('dataAquisicao') || 'N/A'}</div>
            </div>
            ${resumoLegislacao}
            <div class="linha-tempo">
                <div class="coluna-titulo">Faz jus a ${Math.round(gts)}% de GTS e ${parseFloat(gret).toFixed(2)}% GRET</div>
            </div>
        `;
    } else {
        console.error("Elemento '.tabela-complementar' não encontrado.");
    }
};
