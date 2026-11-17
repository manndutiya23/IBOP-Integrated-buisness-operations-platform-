import rateLimit from "express-rate-limit";

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

// Login attempts are limited per normalized email address. This avoids
// locking out colleagues who share the same office Wi-Fi IP address.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "missing-email";
    return email;
  },
  handler: (req, res) => res.status(429).json({
    message: "Too many login attempts for this account. Please try again in 15 minutes.",
  }),
});
