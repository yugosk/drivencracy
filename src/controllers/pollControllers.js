import { pollSchema } from "../schemas/pollSchema.js";
import db from "../db/mongodb.js";
import dayjs from "dayjs";

export async function registerPoll(req, res) {
  const newPoll = res.locals.poll;

  try {
    if (newPoll.expireAt) {
      await db.collection("polls").insertOne({ ...newPoll });
      res.status(201).send("Enquete criada com sucesso");
    } else {
      const expireDate = dayjs(Date.now() + 30 * 24 * 60 * 60 * 1000).format(
        "YYYY-MM-DD HH:mm"
      );
      await db.collection("polls").insertOne({
        title: newPoll.title,
        expireAt: expireDate,
      });
      res.status(201).send("Enquete criada com sucesso");
    }
  } catch (error) {
    res.status(500).send("Houve um erro ao se conectar ao servidor");
  }
}

export async function getPolls(req, res) {
  try {
    const polls = await db.collection("polls").find().toArray();
    res.send(polls);
  } catch (error) {
    res.status(500).send("Houve um erro ao se conectar ao servidor");
  }
}

export async function getPollResults(req, res) {
  const pollTitle = res.locals.pollTitle;
  const response = {
    _id: res.locals.pollId,
    title: pollTitle,
    expireAt: res.locals.expireAt,
    result: {
      title,
      votes,
    },
  };
  try {
    const results = await db
      .collection(`results-${pollTitle}`)
      .find({})
      .toArray();

    let higher = results[0];
    for (let i = 1; i < results.length; i++) {
      if (higher.votes < results[i].votes) {
        higher = results[i];
      }
    }
    response.result.title = higher.title;
    response.result.votes = higher.votes;

    res.send(response);
  } catch (error) {
    res.sendStatus(500);
  }
}
