import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const distributorSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    min: 5,
    max: 20
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    min: 5,
    max: 20
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  }
});

// Middleware to hash the password before saving
distributorSchema.pre('save', async function(next) {
  try {
      if (this.isModified('password') || this.isNew) {  // Also check if it's a new document
          const salt = await bcrypt.genSalt(12);
          this.password = await bcrypt.hash(this.password, salt);
      }
      next();
  } catch (error) {
      next(error);
  }
});


const Distributor = mongoose.model('Distributor', distributorSchema);

export default Distributor;
