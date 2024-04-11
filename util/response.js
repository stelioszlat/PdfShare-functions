module.exports.error = (message) => {
    return JSON.stringify({
        statusCode: 500,
        body: {
            message
        }
    });
}

module.exports.response = (status, body) => {
    return JSON.stringify({
        statusCode: status,
        body: {
            ...body
        }
    });
}