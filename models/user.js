import mongoose from 'mongoose';
import bcrypt from "bcrypt";
const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    image: { type: String, default: null },
    role: { 
        type: String, 
        enum: ['student', 'admin', 'co-admin'], 
        default: 'student',
        required: true 
    },
    emailVerified: { type: Boolean, default: true },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });
  UserSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
  };
  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  export default User;