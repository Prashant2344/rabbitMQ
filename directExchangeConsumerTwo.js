const amqp = require('amqplib');

async function receiveSms() {
    try {
        const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
        const channel = await connection.createChannel();

        const queue = 'sms_queue';

        await channel.assertQueue(queue, { durable: false });

        console.log('Waiting for sms messages...');

        await channel.consume(queue, (message) => {
            if (message) {
                const sms = JSON.parse(message.content.toString());
                console.log('Received sms:', sms);
                
                // Simulate sending the email
                console.log(`Sending sms to: ${sms.to}`);
                console.log(`From: ${sms.from}`);
                console.log(`Message: ${sms.message}`);
                console.log('Sms sent successfully!\n');
                
                // Acknowledge the message
                channel.ack(message);
            }
        }, { noAck: false });

    } catch (err) {
        console.error('Error:', err);
    }
}

receiveSms();
