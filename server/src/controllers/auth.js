import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';

const DAYS = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7);
const prod = process.env.NODE_ENV === 'production';
const cookieOpts = {
  httpOnly: true, // JavaScript in the page cannot read it
  secure: prod,
  sameSite: prod ? 'none' : 'lax',
  path: '/api/auth', // only sent to auth routes
  maxAge: DAYS * 24 * 60 * 60 * 1000,
};
const { maxAge, ...clearOpts } = cookieOpts;

const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
const signAccess = (id) =>
  jwt.sign({ sub: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });
// jti makes every refresh token unique, even if two are signed in the same second
const signRefresh = (id) =>
  jwt.sign({ sub: id, jti: crypto.randomUUID() }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: `${DAYS}d` });

async function startSession(res, user) {
  const refreshToken = signRefresh(user.id);
  await User.updateOne({ _id: user.id }, { refreshTokenHash: sha(refreshToken) }); // stored server-side so it can be revoked
  res.cookie('refreshToken', refreshToken, cookieOpts);
  return signAccess(user.id);
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const taken = { message: 'Email already registered', errors: [{ field: 'email', message: 'An account with this email already exists' }] };
    if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json(taken);
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hash });
    res.status(201).json({ user }); // no tokens on register, as the assignment asks
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Email already registered' });
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) return res.status(401).json({ message: 'Email or password is incorrect' }); // same message for both cases
    const accessToken = await startSession(res, user);
    res.json({ accessToken, user });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token missing. Sign in again.' });

    let payload;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(401).json({ message: 'Refresh token expired or invalid. Sign in again.' });
    }

    const user = await User.findById(payload.sub).select('+refreshTokenHash');
    if (!user || user.refreshTokenHash !== sha(token)) {
      // A valid signature but not the token we stored: an old token was replayed. End the session.
      if (user) await User.updateOne({ _id: user.id }, { refreshTokenHash: null });
      res.clearCookie('refreshToken', clearOpts);
      return res.status(403).json({ message: 'Refresh token was already used. Sign in again.' });
    }

    const accessToken = await startSession(res, user); // rotation: new refresh token, old one is now dead
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    await User.updateOne({ _id: req.user.id }, { refreshTokenHash: null });
    res.clearCookie('refreshToken', clearOpts).json({ message: 'Signed out' });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'Account no longer exists' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
