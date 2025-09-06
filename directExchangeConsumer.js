const amqp = require('amqplib');

async function receiveMail() {
    try {
        const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
        const channel = await connection.createChannel();
        // const exchange = 'direct_exchange';
        // const routingKey = 'send_mail';
        const queue = 'mail_queue';

        // await channel.assertExchange(exchange, 'direct', { durable: false });
        await channel.assertQueue(queue, { durable: false });
        // await channel.bindQueue(queue, exchange, routingKey);

        console.log('Waiting for mail messages...');

        await channel.consume(queue, (msg) => {
            if (msg) {
                const mail = JSON.parse(msg.content.toString());
                console.log('Received mail:', mail);
                
                // Simulate sending the email
                console.log(`Sending email to: ${mail.to}`);
                console.log(`From: ${mail.from}`);
                console.log(`Subject: ${mail.subject}`);
                console.log(`Message: ${mail.text}`);
                console.log('Email sent successfully!\n');
                
                // Acknowledge the message
                channel.ack(msg);
            }
        }, { noAck: false });

    } catch (err) {
        console.error('Error:', err);
    }
}

receiveMail();
