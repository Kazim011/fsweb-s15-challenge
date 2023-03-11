const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const bilmeceler_middleware = require("./middleware/bilmeceler-middleware.js");

const authRouter = require("./auth/auth-router.js");
const bilmecelerRouter = require("./bilmeceler/bilmeceler-router.js");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ message: "Server Çalışıyor" });
});

server.use("/api/auth", authRouter);
server.use(
  "/api/bilmeceler",
  bilmeceler_middleware.checkToken,
  bilmecelerRouter
); // sadece giriş yapan kullanıcılar erişebilir!

module.exports = server;
