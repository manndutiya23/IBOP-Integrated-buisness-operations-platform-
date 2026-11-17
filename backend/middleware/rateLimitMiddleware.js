import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const apiLimitMessage = {
  message: "Too many requests. Please wait a while and try again.",
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: apiLimitMessage,
  handler: (req, res) => res.status(429).json(apiLimitMessage),
});

// Keyed by account and client IP, so employees sharing office Wi-Fi
// do not consume one another's failed-login allowance.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "missing-email";
    return `${ipKeyGenerator(req.ip)}:${email}`;
  },
  handler: (req, res) => res.status(429).json({
    message: "Too many login attempts for this account. Please try again in 15 minutes.",
  }),
});
