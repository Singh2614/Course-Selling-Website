import jwt from "jsonwebtoken";

export function adminauth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("token ")) {
      return res.status(401).json({ message: "Admin authentication required" });
    }

    const token = header.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decode;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
}
