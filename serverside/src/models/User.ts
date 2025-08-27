import { Schema, model, Document } from "mongoose";
import  bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  age: number;
  password:string;
  isActive: boolean;
  isVerified :boolean;
  favouriteSinger:Schema.Types.ObjectId[];
  favouriteSongs: Schema.Types.ObjectId[];
  role:string;
   // ✅ Declare the method here
   comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: {
      type: String,
      required: true,
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },
    favouriteSinger: [{ type: Schema.Types.ObjectId, ref: "Singer" }],
    favouriteSongs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["admin", "user"],
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

userSchema.methods.comparePassword = async function (password:string) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

export default model<IUser>("User", userSchema);
