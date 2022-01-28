const express = require("express");
const cors = require("cors");

const indexRouter = require("./routes");
const rabbitmqRouter = require("./routes/rabbitmq");
const RabbitmqServer = require("./rabbitmq");

const app = express();
const { Server } = require("http");
const server = Server(app);

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "5120mb" }));
app.use(express.urlencoded({ limit: "5120mb" }));

app.get("/", (req, res) => {
  return res.json({ message: "ok" });
});

app.use("/", indexRouter);
app.use("/", rabbitmqRouter);

server.listen(process.env.PORT || 3331, () => {
  console.log("Rodando serviço B");
});

const consumer = async () => {
  const server = new RabbitmqServer("amqp://admin:admin@localhost:5672");
  await server.start();

  await server.consumeFromQueue("expressB", (message) =>
    console.log(
      "RECEBENDO DADOS DA FILA expressB no serviço B",
      message.content.toString()
    )
  );
};

consumer();
