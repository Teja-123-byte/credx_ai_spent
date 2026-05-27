const requests = new Map();

export function rateLimiter({ limit = 100, windowMs = 15 * 60 * 1000 } = {}) {
  return (req, res, next) => {
    const key = req.ip || "unknown";
    const now = Date.now();

    const record = requests.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + windowMs;
    }

    record.count++;
    requests.set(key, record);

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - record.count));
    res.setHeader("X-RateLimit-Reset", Math.floor(record.resetAt / 1000));

    if (record.count > limit) {
      return res.status(429).json({
        success: false,
        error: "Too Many Requests",
        message: "Please slow down and try again later.",
      });
    }

    next();
  };
}
