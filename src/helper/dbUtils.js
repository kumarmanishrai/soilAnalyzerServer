function handleMongoEvents(connection, name) {
    if (!connection || typeof connection.on !== 'function') {
        throw new TypeError(`Invalid connection object passed for ${name}`);
    }
    connection.on('error', console.error.bind(console, `Couldn't connect ${name} MongoDB to server`));
    connection.once('open', () => {
        console.log(`${name} MongoDB connected successfully`);
    });
}

module.exports = handleMongoEvents;