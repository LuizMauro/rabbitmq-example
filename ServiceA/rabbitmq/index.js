const { connect } = require("amqplib");

class RabbitmqServer {
  conn;
  channel;

  constructor(uri) {
    this.uri = uri;
  }

  async start() {
    console.log(this.uri);
    this.conn = await connect(this.uri);
    this.channel = await this.conn.createChannel();
  }

  async publishInQueue(queue, message) {
    return this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async consumeFromQueue(queue, callback) {
    this.channel.prefetch(1);

    return this.channel.consume(queue, (message) => {
      callback(message);
      setTimeout(() => {
        this.channel.ack(message);
      }, 5000);
    });
  }
}

module.exports = RabbitmqServer;
