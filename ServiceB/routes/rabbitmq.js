const express = require("express");
const RabbitmqServer = require("../rabbitmq");
const router = express.Router();

router.use(express.json({ limit: "5120mb" }));
router.use(express.urlencoded({ limit: "5120mb" }));

router.post("/express/service/b/to/a", async function (req, res, next) {
  const server = new RabbitmqServer("amqp://admin:admin@localhost:5672");
  await server.start();
  await server.publishInQueue("expressA", JSON.stringify(req.body));

  res.send(req.body);
});

module.exports = router;
