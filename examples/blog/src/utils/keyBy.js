export default function keyBy(field) {
    return this.reduce((result, value) => {
        result[value[field]] = value;
        return result;
    }, {});
}
