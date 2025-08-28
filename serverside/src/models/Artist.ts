import { Schema, model, Document, Types } from "mongoose";
export type ArtistRole = 
  | "singer" 
  | "composer" 
  | "lyricist" 
  | "music_director" 
  | "producer" 
  | "actor" 
  | "director";

export interface IArtist extends Document {
  name: string;
  roles: ArtistRole[]; 
  genre?: string;
  bio?: string;
  imageUrl?: string;
  birthDate?: Date;
  country?: string;
  songs: Types.ObjectId[];
  isVerified: boolean;
  isActive: boolean;
}
const artistSchema = new Schema<IArtist>(
  {
    name: { type: String, required: true },

    roles: {
      type: [String],
      enum: [
        "singer",
        "composer",
        "lyricist",
        "music_director",
        "producer",
        "actor",
        "director",
      ],
      required: true,
    },
    genre: { type: String },
    bio: { type: String },
    imageUrl: { type: String }, 
    birthDate: { type: Date },
    country: { type: String },
    songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],

    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export default model<IArtist>("Artist", artistSchema);
