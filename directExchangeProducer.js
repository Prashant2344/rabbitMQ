const amqp = require('amqplib');

async function sendMail() {
    try {
        const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
        const channel = await connection.createChannel();

        const exchange = 'direct_exchange';
        const exchangeType = 'direct';

        const queue = 'mail_queue';
        const queue2 = 'sms_queue';

        const routingKey = 'send_mail';
        const routingKey2 = 'send_sms';

        const mail = {
            to: 'updatesilpakaprashant@gmail.com',
            from: 'updateprashant@gmail.com',
            subject: 'Test Email',
            text: 'This is a test email'
        }

        const sms = {
            to: '9876543210',
            from: '1234567890',
            message: 'This is a test SMS'
        }

        await channel.assertExchange(exchange, exchangeType, { durable: false });

        await channel.assertQueue(queue, { durable: false });
        await channel.assertQueue(queue2, { durable: false });

        await channel.bindQueue(queue, exchange, routingKey);
        await channel.bindQueue(queue2, exchange, routingKey2);

        await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(mail)), { persistent: true });
        await channel.publish(exchange, routingKey2, Buffer.from(JSON.stringify(sms)), { persistent: true });

        console.log('Sms sent successfully');
        console.log('Mail sent successfully');
        
        await channel.close();
        await connection.close();
    }
    catch (err) {
        console.log(err);
    }
}

sendMail();