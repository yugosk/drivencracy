import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pollRouter from "./routers/pollRouter.js";
import choiceRouter from "./routers/choiceRouter.js";

const server = express();
dotenv.config();
server.use(cors());
server.use(express.json());

server.use(pollRouter);
server.use(choiceRouter);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
