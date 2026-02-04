export const requireAuth = (req, res, next) => {
  // clerkMiddleware attaches auth info to req.auth
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
