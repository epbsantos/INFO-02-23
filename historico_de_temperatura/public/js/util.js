export function fDateUTC(dateBR) {
    return dateBR.split('/').reverse().join('-')
};
export function fDateBR(dateUTC) {
    return dateUTC.split('-').reverse().join('/')
};