const amqp = require('amqplib');

async function sendMessage(headers, message) {
    try {
        const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
        const channel = await connection.createChannel();
        const exchange = 'header_exchange';
        const exchangeType = 'headers';

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        channel.publish(exchange, "", Buffer.from(JSON.stringify(message)), { persistent: true, headers });
        console.log(`Message was send! with headers ${headers} and message ${message}`);

        console.log('Message sent successfully');

        await channel.close();
        await connection.close();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}

sendMessage({ 'x-match': 'all', 'notification-type': 'new_video', 'content-type': 'video' }, "This is a new video");
sendMessage({ 'x-match': 'all', 'notification-type': 'live_stream', 'content-type': 'gaming' }, "This is a live stream");
sendMessage({ 'x-match': 'any', 'notification-type-comment': 'comment', 'content-type': 'vlog' }, "This is a comment");
sendMessage({ 'x-match': 'any', 'notification-type-like': 'like', 'content-type': 'vlog' }, "This is a like");