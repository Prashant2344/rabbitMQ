const amqp = require('amqplib');

async function sendMessage(routingKey, message) {
    try {
        const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
        const channel = await connection.createChannel();
        const exchange = 'topic_exchange';
        const exchangeType = 'topic';

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(" [x] Sent %s: %s", routingKey, JSON.stringify(message));
        console.log(`Message was send! with routing key ${routingKey} and message ${message}`);

        console.log('Message sent successfully');

        await channel.close();
        await connection.close();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }   
}

sendMessage('order.placed', { orderId: 123, productId: 456, quantity: 10 });
sendMessage('payment.processed', { paymentId: 789, amount: 1000 });