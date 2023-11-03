export function fDateUTC(dateBR) {
    return dateBR.split('/').reverse().join('-')
};
export function fDateBR(dateUTC) {
    return dateUTC.split('-').reverse().join('/')
};

export function toStrDateBR(date) {
    return `0${date.getDate()}`.slice(-2) + `/${date.getMonth()}/${date.getFullYear()}`
};

function average(arr) { return arr.reduce((p, c) => p + c, 0) / arr.length };

function buildGroups(arr, max) {
    var result = [[]];
    var group = 0;

    for (var i = 0; i < arr.length; i++) {
        if (result[group] === undefined) {
            result[group] = [];
        }
        result[group].push(arr[i]);
        if ((i + 1) % max === 0) {
            group = group + 1;
        }
    }
    return result;
}

export function prepareData(data, label) {
    const groupSize = Math.max(Math.round((label.length / 30)), 1);

    const dataMaxGroups = buildGroups(data.max, groupSize);
    const dataMeanGroups = buildGroups(data.mean, groupSize);
    const dataMinGroups = buildGroups(data.min, groupSize);
    const labelGroups = buildGroups(label, groupSize);

    return {
        data: {
            mean: dataMeanGroups.map(group => group.length > 1 ? average(group) : group[0]),
            max: dataMaxGroups.map(group => group.length > 1 ? Math.max(...group) : group[0]),
            min: dataMinGroups.map(group => group.length > 1 ? Math.min(...group) : group[0]),
        },
        label: labelGroups.map(group => group.length > 1 ? `${fDateBR(group[0])} - ${fDateBR(group[group.length - 1])}` : fDateBR(group[0]))
    }
}