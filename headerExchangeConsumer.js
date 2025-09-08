const amqp = require('amqplib');

async function receiveMessage(headers) {
    try {
        const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
        const channel = await connection.createChannel();
        const exchange = 'header_exchange';
        const exchangeType = 'headers';

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const queue = await channel.assertQueue('', { exclusive: true });
        console.log('Waiting for messages...', queue);
        await channel.bindQueue(queue.queue, exchange, '', headers);

        await channel.consume(queue.queue, (message) => {
            if (message) {
                console.log('Received message:', message.content.toString());
                channel.ack(message);
            }
        }, { noAck: false });
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}

receiveMessage({ 'x-match': 'all', 'notification-type': 'new_video', 'content-type': 'video' });
// receiveMessage({ 'x-match': 'all', 'notification-type': 'live_stream', 'content-type': 'gaming' });
// receiveMessage({ 'x-match': 'any', 'notification-type-comment': 'comment', 'content-type': 'vlog' });
// receiveMessage({ 'x-match': 'any', 'notification-type-like': 'like', 'content-type': 'vlog' });