import { validationResult } from 'express-validator';

// Runs after the validator chains. Stops bad input before it reaches a controller.
export default function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array({ onlyFirstError: true }).map((e) => ({ field: e.path, message: e.msg }));
  res.status(400).json({ message: 'Validation failed', errors });
}
