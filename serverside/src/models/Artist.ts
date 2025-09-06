import mongoose, { Document, Schema ,Types} from "mongoose";
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

  // Relations
  songs: Types.ObjectId[];
  collaborations?: Types.ObjectId[];

  // Languages / Aliases
  languages?: string[];
  aliases?: string[];
  keywords?: string[];

  // Metrics
  followers: number;
  monthlyListeners: number;
  playCount: number;

  // Awards
  awards?: { title: string; year: number }[];

  // Socials
  socials?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    spotify?: string;
    website?: string;
  };

  // Verification
  isVerified: boolean;
  verifiedReason?: string;

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

    // Songs by this artist
    songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],

    // Extra Info
    languages: [{ type: String }],
    aliases: [{ type: String }],
    keywords: [{ type: String }],

    // Metrics
    followers: { type: Number, default: 0 },
    monthlyListeners: { type: Number, default: 0 },
    playCount: { type: Number, default: 0 },

    // Awards & Collabs
    awards: [{ title: String, year: Number }],
    collaborations: [{ type: Schema.Types.ObjectId, ref: "Artist" }],

    // Social Media
    socials: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      youtube: { type: String },
      spotify: { type: String },
      website: { type: String },
    },

    // Verification
    isVerified: { type: Boolean, default: false },
    verifiedReason: { type: String },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export const Artist = mongoose.model<IArtist>("Artist", artistSchema);