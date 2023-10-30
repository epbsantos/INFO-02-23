$(document).ready(function () {
    const mapState = new Map();
    const mapCity = new Map();

    $('.form-select').select2({
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
                    console.log(city.lat, city.lon);
                }
            });
        }
    });
});