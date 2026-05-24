import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://ramesh:ramesh123@cluster0.ataz1nj.mongodb.net/antivirusdb';

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);

    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      isAdmin: Boolean,
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const hashedPassword = await bcrypt.hash('ananya123', 10);

    const result = await User.findOneAndUpdate(
      { email: 'ananya@ananya.com' },
      {
        name: 'Admin',
        email: 'ananya@ananya.com',
        password: hashedPassword,
        isAdmin: true,
      },
      { upsert: true, new: true }
    );

    console.log('Admin user created/updated:', result.email);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

createAdmin();
