import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db;

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
  await mongoClient.connect();
  db = mongoClient.db(process.env.MONGO_DATABASE);
} catch (error) {
  console.error("Houve um problema ao tentar a conexão com o banco de dados");
}

export default db;
