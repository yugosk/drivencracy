import db from "../db/mongodb.js";
import { ObjectId } from "mongodb";
import { choiceSchema } from "../schemas/pollSchema.js";
import dayjs from "dayjs";
import "dayjs/plugin/customParseFormat.js";

export async function validateChoiceFormat(req, res, next) {
  const newChoice = req.body;
  const { error } = choiceSchema.validate(newChoice);
  if (error) {
    return res.status(422).send("mensagem: " + error.details[0].message);
  }
  res.locals.choice = newChoice;
  next();
}

export async function checkPoll(req, res, next) {
  const newChoice = res.locals.choice;
  const _id = ObjectId(newChoice.poolId);

  const checkPoll = await db.collection("polls").findOne({ _id });
  if (!checkPoll) return res.status(404).send("Enquete não encontrada");

  const expireDate = dayjs(checkPoll.expireAt, "YYYY-MM-DD HH:mm");
  if (!dayjs().isBefore(expireDate)) {
    return res.status(403).send("Enquete já expirada");
  }

  const checkTitle = await db
    .collection("choices")
    .findOne({ title: newChoice.title });

  if (checkTitle) return res.status(409).send("Escolha outro título");

  next();
}

export async function checkPollId(req, res, next) {
  const _id = new ObjectId(req.params.id);

  const checkPoll = await db.collection("polls").findOne({ _id });
  if (!checkPoll) return res.status(404).send("Enquete não encontrada");

  res.locals.pollId = _id;
  res.locals.pollTitle = checkPoll.title;

  next();
}

export async function checkChoiceId(req, res, next) {
  const _id = new ObjectId(req.params.id);

  const checkChoice = await db.collection("choices").findOne({ _id });
  if (!checkChoice) return res.status(404).send("Opção de voto não encontrada");

  res.locals._id = checkChoice.poolId;
  res.locals.choiceId = _id;
  next();
}

export async function checkExpiration(req, res, next) {
  const _id = res.locals._id;
  const searchPoll = await db.collection("polls").findOne({ _id });

  const expireDate = dayjs(searchPoll.expireAt, "YYYY-MM-DD HH:mm");
  if (!dayjs().isBefore(expireDate)) {
    return res.status(403).send("Enquete já expirada");
  }

  next();
}
