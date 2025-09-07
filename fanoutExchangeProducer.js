const amqp = require('amqplib');

async function announceNewProduce(product) {
    try {
        const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
        const channel = await connection.createChannel();

        const exchange = 'fanout_exchange';
        const exchangeType = 'fanout';

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        channel.publish(exchange, "", Buffer.from(JSON.stringify(product)), { persistent: true });

        console.log('Sms sent successfully');
        console.log('Push notification sent successfully');
        
        await channel.close();
        await connection.close();
    }
    catch (err) {
        console.log(err);
    }
}

announceNewProduce({id: 1, item: 'Product 1', price: 100});