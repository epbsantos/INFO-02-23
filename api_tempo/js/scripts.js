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

function encontrarEstacaoMaisProxima(latitude, longitude) {
    let estacaoMaisProxima = null;
    let distanciaMinima = Infinity;

    for (const estacao of estacoes) {
        const distancia = calcularDistancia(
            latitude,
            longitude,
            estacao.VL_LATITUDE,
            estacao.VL_LONGITUDE
        );

        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            estacaoMaisProxima = estacao;
        }
    }

    return {
        'estacao': estacaoMaisProxima,
        'distancia': distanciaMinima
    };
}

// pega estações automaticas;
fetch("https://epbsantos.github.io/INFO-02-23/api_tempo/resources/estacoes_automaticas.json")
    .then((response) => response.json())
    .then((data) => {
        estacoes = data;
    })
    .catch((error) => {
        console.error("Erro ao carregar o arquivo JSON:", error);
    });

//variaveis de pesquisa de cep
var pesquisaCEP, pesquisaRua, pesquisaBairro, pesquisaCidadeUf, pesquisaLatitude, pesquisaLongitude, estacaoProxima, leituras;


// mascara para CEP no botão de pesquisa por cep
const element = document.getElementById('CEP');
const maskOptions = {
    mask: '00000-000'
};
const mask = IMask(element, maskOptions);

// mascara para data no botão de pesquisa por data
const element2 = document.getElementById('dateStart');
const element3 = document.getElementById('dateEnd');
const maskOptions2 = {
    mask: '00/00/0000'
};
const mask2 = IMask(element2, maskOptions2);
const mask3 = IMask(element3, maskOptions2);

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

            estacaoProxima = encontrarEstacaoMaisProxima(pesquisaLatitude, pesquisaLongitude);

            if (estacaoProxima) {
                document.getElementById("infoEstacao").innerHTML = "<strong>Estação: </strong>" + 
                                    estacaoProxima.estacao.DC_NOME + 
                                    " (" + Math.floor(estacaoProxima.distancia) + "km)";

                const dateStart = document.getElementById('dateStart');
                const dateEnd = document.getElementById('dateEnd');
                const searchButton = document.getElementById('searchButton');
                
                dateStart.disabled = false;
                dateEnd.disabled = false;
                searchButton.disabled = false;
            } else {
                console.log("Nenhuma estação encontrada na lista.");
            }
        })
        .catch(function (error) {
            console.error("Ocorreu um erro:", error);
        });
});

var searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", function () {
    dataInicio = document.getElementById('dateStart').value;
    dataFim = document.getElementById('dateEnd').value;

    dataInicioFormatada = dataInicio.split('/').reverse().join('-');
    dataFimFormatada = dataFim.split('/').reverse().join('-');

    urlApi = "https://apitempo.inmet.gov.br/token/estacao/diaria/" + 
                dataInicioFormatada + "/" + 
                dataFimFormatada + "/" + 
                estacaoProxima.estacao.CD_ESTACAO + "/" +
                "eUlqdXRLU29rV3lybkhIYmJRYlJvSTFlY3gxdjhpU00=yIjutKSokWyrnHHbbQbRoI1ecx1v8iSM";

    fetch(urlApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            leituras = data;
            console.log(leituras, estacaoProxima);
        })
        .catch(function (error) {
            console.error("Ocorreu um erro:", error);
        });
});

function atualizarGraficoComDados(dados) {
    if (graficoTemperatura) {
      graficoTemperatura.data.datasets[0].data = dados.temperaturaMaxima;
      graficoTemperatura.data.datasets[1].data = dados.temperaturaMinima;
  
      graficoTemperatura.update();
    }
  }
  function obterDadosDaAPI() {
    const apiUrl = ""; // Adicionar API clima
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        atualizarGraficoComDados(data);
      })
      .catch((error) => {
        console.error("Erro ao obter dados da API:", error);
      });
  }
  const botaoAtualizarGrafico = document.getElementById("atualizarGrafico");
  botaoAtualizarGrafico.addEventListener("click", obterDadosDaAPI);
  

  var ctx1 = document.getElementById('graficoTemperatura').getContext('2d');
  
  var dados1 = {
    labels: Array.from({ length: 31 }, (_, i) => (i + 1).toString()), 
    datasets: [
      {
        label: 'Temperatura Máxima (°C)',
        data: [],
        borderColor: 'rgba(255, 0, 0, 1)',
        fill: false
      },
      {
        label: 'Temperatura Mínima (°C)',
        data: [],
        borderColor: 'rgba(0, 0, 255, 1)',
        fill: false
      }
    ]
  };
  
  // Calcular a média com base nas temperaturas máximas e mínimas
  var mediaTemperaturas = dados1.datasets[0].data.map((tempMax, index) => (tempMax + dados1.datasets[1].data[index]) / 2);
  dados1.datasets.push({
    label: 'Média (°C)',
    data: mediaTemperaturas,
    borderColor: 'rgba(0, 128, 0, 1)', 
    fill: false
  });
  var graficoTemperatura = new Chart(ctx1, {
    type: 'line',
    data: dados1
  });

  obterDadosDaAPI();

  // Gráfico de Umidade, Precipitação e Velocidade do Vento
  var ctx2 = document.getElementById('graficoTempUmidadePrecipitacaoVento').getContext('2d');

  var dados2 = {
    labels: Array.from({ length: 31 }, (_, i) => (i + 1).toString()), 
    datasets: [
      {
        label: 'Umidade (%)',
        data: [], 
        borderColor: 'rgba(0, 128, 0, 1)',
        fill: false
      },
      {
        label: 'Precipitação (mm)',
        data: [], 
        borderColor: 'rgba(0, 0, 128, 1)',
        fill: false
      },
      {
        label: 'Velocidade do Vento (km/h)',
        data: [],
        borderColor: 'rgba(128, 0, 128, 1)',
        fill: false
      }
    ]
  };
  
  var graficoTempUmidadePrecipitacaoVento = new Chart(ctx2, {
    type: 'line',
    data: dados2
  });
  
