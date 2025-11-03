import { Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { validate } from '../middleware/validate.js';
import { verifyAdminToken } from '../middleware/verifyAdminToken.js';

const router = Router();

function sign(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  async (req, res) => {
    const { email, password } = req.body;
    const start = Date.now();
    try {
      const user = await User.findOne({ email });
      if (!user || user.role !== 'admin') {
        // eslint-disable-next-line no-console
        console.warn(`🔐 Admin login failed for ${email} (role mismatch or user not found)`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const ok = await user.comparePassword(password);
      if (!ok) {
        // eslint-disable-next-line no-console
        console.warn(`🔐 Admin login failed for ${email} (bad password)`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = sign(user);
      // eslint-disable-next-line no-console
      console.log(`✅ Admin login success for ${email} in ${Date.now() - start}ms`);
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('❌ Admin login error:', e?.message || e);
      return res.status(500).json({ message: 'Login failed' });
    }
  }
);

router.get('/verify', verifyAdminToken, (req, res) => {
  res.json({ ok: true, user: req.user });
});

export default router;



