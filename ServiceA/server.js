const express = require("express");
const cors = require("cors");

const indexRouter = require("./routes");
const rabbitmqRouter = require("./routes/rabbitmq");
const RabbitmqServer = require("./rabbitmq");

const app = express();
const { Server } = require("http");
const server = Server(app);

app.use(express.json({ limit: "5120mb" }));
app.use(express.urlencoded({ limit: "5120mb" }));
app.set("trust proxy", true);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "ok" });
});

app.use("/", indexRouter);
app.use("/", rabbitmqRouter);

server.listen(process.env.PORT || 3332, () => {
  console.log("Rodando serviço A");
});

const consumer = async () => {
  const server = new RabbitmqServer("amqp://admin:admin@localhost:5672");
  await server.start();
  await server.consumeFromQueue("expressA", (message) =>
    console.log(
      "RECEBENDO DADOS DA FILA expressA no serviço A",
      message.content.toString()
    )
  );
};

consumer();
