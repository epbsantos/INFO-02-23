import { fDateUTC, prepareData } from './util.js'
import LineChart from './lineChart.js';

$(document).ready(function () {
    const mapState = new Map();
    const mapCity = new Map();

    const canvasLineChart = document.getElementById('lineChart');
    const lineChart = new LineChart(canvasLineChart);

    $.validator.addMethod('compareDates', () => {
        const startDate = new Date(fDateUTC($('#startDate').val()));
        const endDate = new Date(fDateUTC($('#endDate').val()));
        if (startDate.getTime() > endDate.getTime()) {
            return false;
        }
        return true;
    });

    $("#filtersForm").validate({
        rules: {
            state: {
                required: true,
            },
            city: {
                required: true,
            },
            startDate: {
                required: true,
                compareDates: true,
            },
            endDate: {
                required: true,
                compareDates: true,
            },
        },
        messages: {
            state: {
                required: 'Selecione um estado!',
            },
            city: {
                required: 'Selecione uma cidade!',
            },
            startDate: {
                required: 'Defina uma data de inicío!',
                compareDates: 'Data inícial deve ser menor que a final!',
            },
            endDate: {
                required: 'Defina uma data de fim!',
                compareDates: 'Data final deve ser maior que a inícial!',
            },
        },
        errorPlacement: (label, element) => {
            label.addClass('text-warning');
            if (element.hasClass('select2-hidden-accessible')) {
                element = element.next('.select2-container');
            }
            label.insertAfter(element);
        },
    });


    $('.select2').select2({
        placeholder: 'Selecione'
    });
    $.ajax({
        url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados", success: (result) => {
            const ordenedResult = result.sort((a, b) => a.nome.localeCompare(b.nome));
            $('#stateSelect')
                .append($("<option></option>")
                    .attr("selected", true)
                    .attr("disabled", true)
                    .text("Selecione"));
            $.each(ordenedResult, function (key, value) {
                mapState.set(+value.id, value);
                $('#stateSelect')
                    .append($("<option></option>")
                        .attr("value", value.id)
                        .text(`${value.nome} - ${value.sigla}`));
            });
        }
    });
    $('#stateSelect').on('change', () => {
        const idState = $('#stateSelect').val();
        const state = mapState.get(+idState);
        if (state) {
            $.ajax({
                url: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.id}/municipios`, success: (result) => {
                    const ordenedResult = result.sort((a, b) => a.nome.localeCompare(b.nome));
                    $('#citySelect').empty();
                    $('#citySelect')
                        .append($("<option></option>")
                            .attr("selected", true)
                            .attr("disabled", true)
                            .text("Selecione"));
                    mapCity.clear();
                    $.each(ordenedResult, function (key, value) {
                        mapCity.set(+value.id, value);
                        $('#citySelect')
                            .append($("<option></option>")
                                .attr("value", value.id)
                                .text(value.nome));
                    });
                }
            });
        }
    });

    $('.datepicker').datepicker({
        closeText: 'Fechar',
        prevText: '<Anterior',
        nextText: 'Próximo>',
        currentText: 'Hoje',
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',
        maxDate: 0
    });


    $('.datepicker').on('change', (e) => {
        const date = new Date(fDateUTC(e.target.value));
        if (!(date instanceof Date && !isNaN(date))) {
            e.target.value = "";
        } else {
            const endDatepiker = $.datepicker._getInst(document.getElementById('endDate'));
            if (e.target.id == 'startDate') {
                date.setDate(date.getDate() + 1);
                endDatepiker.settings.minDate = date;
            }
        }
    });

    $('#filtersForm').on('submit', (e) => {
        e.preventDefault();
        const idCity = $('#citySelect').val();
        const city = mapCity.get(+idCity);
        const idState = $('#stateSelect').val();
        const state = mapState.get(+idState)
        if (city) {
            $.ajax({
                url: `https://nominatim.openstreetmap.org/search.php?q=${city.nome},${state.nome}&format=jsonv2`, success: (result) => {
                    const city = result.find((value) => value.addresstype == "municipality");
                    const lat = city.lat;
                    const lon = city.lon;
                    const startDate = fDateUTC($('#startDate').val());
                    const endDate = fDateUTC($('#endDate').val());
                    $.ajax({
                        url: `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean&timezone=America%2FSao_Paulo`, success: (result) => {
                            const daily = result.daily;

                            const time = daily.time;

                            const temp_max = daily.temperature_2m_max;
                            const temp_mean = daily.temperature_2m_mean;
                            const temp_min = daily.temperature_2m_min;

                            const quantOfNotNull = temp_mean.filter(temp => temp != null).length;

                            const data = {
                                max: temp_max.slice(0, quantOfNotNull),
                                mean: temp_mean.slice(0, quantOfNotNull),
                                min: temp_min.slice(0, quantOfNotNull),
                            };
                            const label = time.slice(0, quantOfNotNull);
                            const preparedData = prepareData(data, label);
                            lineChart.update(preparedData.data, preparedData.label);
                        }
                    });
                }
            });

        }
    });
});

