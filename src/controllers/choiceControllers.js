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
    await db.collection("results").insertOne({
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
  const _id = res.locals._id;
  const choiceId = res.locals.choiceId;

  try {
    console.log(await db.collection("results").findOne({ pollId: _id }));
    await db.collection("results").updateOne(
      { pollId: _id },
      {
        $inc: {
          votes: 1,
        },
      }
    );
    console.log(await db.collection("results").findOne({ pollId: _id }));
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}
