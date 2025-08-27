import { Schema, model, Document, Types } from "mongoose";

// Interface
export interface ISinger extends Document {
  name: string;
  genre: string;
  bio?: string;
  imageUrl?: string;
  birthDate?: Date;
  country?: string;
  songs: Types.ObjectId[]; // References to Song model
  isVerified:boolean

  isActive: boolean;
}

// Schema
const singerSchema = new Schema<ISinger>(
  {
    name: { type: String, required: true },
    genre: { type: String, required: true },
    bio: { type: String },
    imageUrl: { type: String }, // Can use this to show singer's image in UI
    birthDate: { type: Date },
    country: { type: String },
    songs: [{ type: Schema.Types.ObjectId, ref: "Song" }], // One-to-many with Song
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<ISinger>("Singer", singerSchema);
