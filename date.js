// module.exports = getDate; //omitimos los parentesis xq no queremos activar la function aquí

module.exports.getDate = function() {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    let longDate = today.toLocaleString("en-US", options);
    return longDate;
}