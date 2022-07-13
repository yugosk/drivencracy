import { Router } from "express";
import {
  getPollResults,
  getPolls,
  registerPoll,
} from "../controllers/pollControllers.js";
import { checkPoll, validatePoll } from "../middlewares/pollValidation.js";

const pollRouter = Router();

pollRouter.get("/poll", getPolls);
pollRouter.post("/poll", validatePoll, registerPoll);
pollRouter.get("/poll/:id/result", checkPoll, getPollResults);

export default pollRouter;
