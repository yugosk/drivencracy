import Joi from "joi";

const pollSchema = Joi.object({
  title: Joi.string().required(),
  expireAt: Joi.string().pattern(
    /\d{4}\-[0-1]{1}[0-9]{1}\-[0-3]{1}\d{1}\ [0-2]{1}\d{1}\:[0-5]{1}\d{1}/
  ),
});

const choiceSchema = Joi.object({
  title: Joi.string().required(),
  poolId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export { pollSchema, choiceSchema };
