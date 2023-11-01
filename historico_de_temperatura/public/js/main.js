$(document).ready(function () {
    const mapState = new Map();
    const mapCity = new Map();

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
                    $.ajax({
                        url: `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=2023-10-11&end_date=2023-10-25&daily=temperature_2m_mean&&timezone=America%2FSao_Paulo`, success: (result) => {
                            console.log(result)
                        }
                    });
                }
            });

        }
    });
});