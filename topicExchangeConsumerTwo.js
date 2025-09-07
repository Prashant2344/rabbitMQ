const amqp = require('amqplib');

async function receiveMessage(routingKey, queue) {
    try {
        const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
        const channel = await connection.createChannel();
        const exchange = 'topic_exchange';
        const exchangeType = 'topic';

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        await channel.assertQueue(queue, { durable: false });
        await channel.bindQueue(queue, exchange, routingKey);

        console.log('Waiting for messages...');

        await channel.consume(queue, (message) => {
            if (message) {
                console.log('Received message:', message.content.toString());
                channel.ack(message);
            }
        }, { noAck: false });
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

receiveMessage('payment.*', 'payment_queue');