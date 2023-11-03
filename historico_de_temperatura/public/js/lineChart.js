export default class LineChart {
    constructor(canvas) {
        const data = {
            labels: this.#label,
            datasets: [this.#datasetMax, this.#datasetMean, this.#datasetMin]
        };
        const config = {
            type: 'line',
            data: data,
        };
        this.#chart = new Chart(canvas, config);
    }
    #chart = null;
    #datasetMax = {
        label: 'Temperatura máxima',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    };
    #datasetMean = {
        label: 'Temperatura média',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    };
    #datasetMin = {
        label: 'Temperatura mínima',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
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