const amqp = require('amqplib');

async function pushNotification() {
    try {
        const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
        const channel = await connection.createChannel();

        const exchange = 'fanout_exchange';
        const exchangeType = 'fanout';

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const queue = await channel.assertQueue('', { exclusive: true }); //unique queue name
        console.log('Waiting for mail messages...', queue);

        await channel.bindQueue(queue.queue, exchange, '');

        await channel.consume(queue.queue, (msg) => {
            if (msg) {
                const product = JSON.parse(msg.content.toString());
                console.log('Sending push notification for product:', product);
                // Acknowledge the message
                channel.ack(msg);
            }
        }, { noAck: false });

    } catch (err) {
        console.error('Error:', err);
    }
}

pushNotification();
