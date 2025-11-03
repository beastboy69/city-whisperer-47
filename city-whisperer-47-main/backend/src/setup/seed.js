import { User } from '../models/User.js';

export async function seedAdminIfMissing() {
  const email = process.env.ADMIN_EMAIL || 'admin@smartcityfix.local';
  const password = process.env.ADMIN_PASSWORD || 'admin12345';
  let admin = await User.findOne({ email });
  if (!admin) {
    admin = await User.create({ name: 'Administrator', email, password, role: 'admin' });
    // eslint-disable-next-line no-console
    console.log(`🔑 Default admin created: ${email}`);
  } else {
    // eslint-disable-next-line no-console
    console.log('🔑 Admin account exists');
  }
}


