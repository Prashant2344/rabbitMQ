const amqp = require('amqplib');

async function sendMail() {
    try {
        const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
        const channel = await connection.createChannel();
        const exchange = 'direct_exchange';
        const routingKey = 'send_mail';
        const queue = 'mail_queue';

        const mail = {
            to: 'silpakaprashant@gmail.com',
            from: 'prashant@gmail.com',
            subject: 'Test Email',
            text: 'This is a test email'
        }

        await channel.assertExchange(exchange, 'direct', { durable: false });
        await channel.assertQueue(queue, { durable: false });

        await channel.bindQueue(queue, exchange, routingKey);

        await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(mail)), { persistent: true });
        console.log('Mail sent successfully');
        await channel.close();
        await connection.close();
    }
    catch (err) {
        console.log(err);
    }
}

sendMail();