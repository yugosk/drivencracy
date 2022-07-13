import db from "../db/mongodb.js";
import { ObjectId } from "mongodb";

export async function postChoice(req, res) {
  const newChoice = res.locals.choice;
  const pollTitle = res.locals.pollTitle;

  try {
    await db.collection(`choices-${pollTitle}`).insertOne({
      title: newChoice.title,
      poolId: new ObjectId(newChoice.poolId),
    });
    await db.collection(`results-${pollTitle}`).insertOne({
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
  const pollTitle = res.locals.pollTitle;

  try {
    const choices = await db
      .collection(`choices-${pollTitle}`)
      .find({ poolId: _id })
      .toArray();
    res.send(choices);
  } catch (error) {
    res.sendStatus(500);
  }
}

export async function postVote(req, res) {
  const _id = res.locals.choiceId;
  const pollTitle = res.locals.pollTitle;
  const choiceTitle = res.locals.choiceTitle;

  try {
    await db.collection(`results-${pollTitle}`).updateOne(
      { title: choiceTitle },
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
