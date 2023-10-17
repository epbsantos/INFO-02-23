//variaveis de pesquisa de cep
var pesquisaCEP, pesquisaRua, pesquisaBairro, pesquisaCidadeUf, pesquisaLatitude, pesquisaLongitude;


// mascara para CEP no botão de pesquisa por cep
const element = document.getElementById('CEP');
const maskOptions = {
    mask: '00000-000'
};
const mask = IMask(element, maskOptions);

// captura click em pesquisar cep
var botaoPesquisar = document.getElementById("pesquisa_cep");
botaoPesquisar.addEventListener("click", function () {
    var campoCEP = document.getElementById("CEP");
    var valorCEP = campoCEP.value;

    fetch("https://brasilapi.com.br/api/cep/v2/" + valorCEP )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            temp = data;
            pesquisaCEP = data.cep;
            pesquisaRua = data.street;
            pesquisaBairro = data.neighborhood;
            pesquisaCidadeUf = data.city + "/" + data.state;
            pesquisaLongitude = data.location.coordinates.longitude;
            pesquisaLatitude = data.location.coordinates.latitude;

            document.getElementById("respCep").innerHTML = pesquisaCEP;
            document.getElementById("respRua").innerHTML = pesquisaRua;
            document.getElementById("respBairro").innerHTML = pesquisaBairro;
            document.getElementById("respCidadeUf").innerHTML = pesquisaCidadeUf;
            document.getElementById("respLatitude").innerHTML = pesquisaLatitude;
            document.getElementById("respLongitude").innerHTML = pesquisaLongitude;
        })
        .catch(function (error) {
            console.error("Ocorreu um erro:", error);
        });
});

fetch("../resources/estacoes_automaticas.json")
    .then((response) => response.json())
    .then((data) => {
        estacoes = data;
    })
    .catch((error) => {
        console.error("Erro ao carregar o arquivo JSON:", error);
    });



function calcularDistancia(lat1, lon1, lat2, lon2) {
    const raioTerra = 6371;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = raioTerra * c;

    return distancia;
}

function encontrarEstacaoMaisProxima() {
    let estacaoMaisProxima = null;
    let distanciaMinima = Infinity;

    for (const estacao of estacoes) {
        const distancia = calcularDistancia(
            pontoDeReferencia.latitude,
            pontoDeReferencia.longitude,
            estacao.VL_LATITUDE,
            estacao.VL_LONGITUDE
        );

        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            estacaoMaisProxima = estacao;
        }
    }
    return estacaoMaisProxima;
}

const estacaoProxima = encontrarEstacaoMaisProxima();

if (estacaoProxima) {
    console.log(
        "Estação mais próxima: " + estacaoProxima.DC_NOME + ", Distância: " + distanciaMinima + " km"
    );
} else {
    console.log("Nenhuma estação encontrada na lista.");
}