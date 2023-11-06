export default class LineChart {
    constructor(canvas) {
        const data = {
            labels: this.#label,
            datasets: [this.#datasetMax, this.#datasetMean, this.#datasetMin]
        };
        const config = {
            type: 'line',
            data: data,
            options: {
                plugins: {  // 'legend' now within object 'plugins {}'
                  legend: {
                    labels: {
                      color: "white",  // not 'fontColor:' anymore
                      // fontSize: 18  // not 'fontSize:' anymore
                      font: {
                        size: 16 // 'size' now within object 'font {}'
                      }
                    }
                  }
                }
            },
        };
        Chart.defaults.color = '#fff';
        this.#chart = new Chart(canvas, config);
    }
    #chart = null;
    #datasetMax = {
        label: 'Temperatura máxima',
        data: [],
        fill: false,
        borderColor: '#FD0000',
        tension: 0.1
    };
    #datasetMean = {
        label: 'Temperatura média',
        data: [],
        fill: false,
        borderColor: '#5EC700',
        tension: 0.1
    };
    #datasetMin = {
        label: 'Temperatura mínima',
        data: [],
        fill: false,
        borderColor: '#2360EC',
        tension: 0.1
    };
    #label = [];
    update(data, label) {
        this.#datasetMax.data = data.max;
        this.#datasetMean.data = data.mean;
        this.#datasetMin.data = data.min;
        this.#label.splice(0);
        this.#label.push(...label);
        this.#chart.update();
    }
}