exports.getDate = function() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today  = new Date();

    return today.toLocaleDateString("en-US", options)

    
}


exports.getDay = function() {
    const options = { weekday: 'long'};
    const today  = new Date();

    return today.toLocaleDateString("en-US", options)

}

