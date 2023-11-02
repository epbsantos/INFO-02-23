export default class LineChart {
    constructor(canvas) {
        const data = {
            labels: this.#label,
            datasets: [this.#dataset]
        };
        const config = {
            type: 'line',
            data: data,
        };
        this.#chart = new Chart(canvas, config);
    }
    #chart = null;
    #dataset = {
        label: 'Temperatura média',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    };
    #label = [];
    update(data, label) {
        this.#dataset.data = data;
        this.#label.splice(0);
        this.#label.push(...label);
        this.#chart.update();
    }
}