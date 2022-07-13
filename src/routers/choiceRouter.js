import { Router } from "express";
import { postChoice, postVote } from "../controllers/choiceControllers.js";
import {
  checkChoiceId,
  checkExpiration,
  checkPoll,
  checkPollId,
  validateChoiceFormat,
} from "../middlewares/choiceValidation.js";
import { getPollChoices } from "../controllers/choiceControllers.js";

const choiceRouter = Router();

choiceRouter.post("/choice", validateChoiceFormat, checkPoll, postChoice);
choiceRouter.get("/poll/:id/choice", checkPollId, getPollChoices);
choiceRouter.post("/choice/:id/vote", checkChoiceId, checkExpiration, postVote);

export default choiceRouter;
