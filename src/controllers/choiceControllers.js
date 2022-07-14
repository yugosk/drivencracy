import db from "../db/mongodb.js";
import { ObjectId } from "mongodb";

export async function postChoice(req, res) {
  const newChoice = res.locals.choice;
  const pollId = new ObjectId(newChoice.poolId);

  try {
    await db.collection("choices").insertOne({
      title: newChoice.title,
      poolId: new ObjectId(newChoice.poolId),
    });

    const teste = await db.collection("choices").findOne({
      title: newChoice.title,
      poolId: new ObjectId(newChoice.poolId),
    });

    const choiceId = teste._id;

    await db.collection("results").insertOne({
      choiceId,
      pollId,
      title: newChoice.title,
      votes: 0,
    });
    res.status(201).send("Opção de voto criada");
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function getPollChoices(req, res) {
  const _id = res.locals.pollId;

  try {
    const choices = await db
      .collection("choices")
      .find({ poolId: _id })
      .toArray();
    res.send(choices);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function postVote(req, res) {
  const choiceId = res.locals.choiceId;
  try {
    await db.collection("results").updateOne(
      { choiceId },
      {
        $inc: {
          votes: 1,
        },
      }
    );
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}
