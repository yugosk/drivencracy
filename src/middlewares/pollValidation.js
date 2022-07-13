import { ObjectId } from "mongodb";
import db from "../db/mongodb.js";
import { pollSchema } from "../schemas/pollSchema.js";

export async function validatePoll(req, res, next) {
  const newPoll = req.body;
  const { error } = pollSchema.validate(newPoll);
  if (error) {
    return res.status(422).send("mensagem: " + error.details[0].message);
  }
  res.locals.poll = newPoll;
  next();
}

export async function checkPoll(req, res, next) {
  const _id = new ObjectId(req.params.id);
  const checkPoll = await db.collection("polls").findOne({ _id });
  if (!checkPoll) res.status(404).send("Enquete não encontrada");

  res.locals.pollTitle = checkPoll.title;
  res.locals.pollId = checkPoll._id;
  res.locals.expireAt = checkPoll.expireAt;

  next();
}
