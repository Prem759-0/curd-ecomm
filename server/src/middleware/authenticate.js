import jwt from 'jsonwebtoken';

// Reads "Authorization: Bearer <accessToken>", verifies it, and attaches req.user.
export default function authenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Access token missing' });
  }
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { id: payload.sub };
    next();
  } catch {
    res.status(401).json({ message: 'Access token invalid or expired' });
  }
}
