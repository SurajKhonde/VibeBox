import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import {Moods,Genres,situationalGenres} from "../utils/genres.js"


export interface IUser extends Document {
  name: string;
  email: string;
  password?: string | null;
  googleId?: string;
  isActive: boolean;
  isVerified: boolean;
  role: "admin" | "user";

  // Preferences
  favoriteSingers: Schema.Types.ObjectId[];
  favoriteSongs: Schema.Types.ObjectId[];
  favoriteGenres: string[];
  favoriteMoods: string[];
  favoriteSituations: string[];

  // Activity
  likedSongs: Schema.Types.ObjectId[];
  likedAlbums: Schema.Types.ObjectId[];
  playlists: Schema.Types.ObjectId[];
  recentlyPlayed: { song: Schema.Types.ObjectId; playedAt: Date }[];

  // Recommendation metadata
  searchHistory: string[];
  listeningStats: {
    totalPlays: number;
    lastActive: Date;
  };

  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 🎼 User schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null }, // null if Google auth
    googleId: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["admin", "user"],
    },


    favoriteSingers: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
    favoriteSongs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
    favoriteGenres: [{ type: String, enum: Genres }],
    favoriteMoods: [{ type: String, enum: Moods }],
    favoriteSituations: [{ type: String, enum: situationalGenres }],

    likedSongs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
    likedAlbums: [{ type: Schema.Types.ObjectId, ref: "Album" }],
    playlists: [{ type: Schema.Types.ObjectId, ref: "Playlist" }],
    recentlyPlayed: [
      {
        song: { type: Schema.Types.ObjectId, ref: "Song" },
        playedAt: { type: Date, default: Date.now },
      },
    ],

    // 🔮 Recommendation Metadata
    searchHistory: [{ type: String }],
    listeningStats: {
      totalPlays: { type: Number, default: 0 },
      lastActive: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

// 🔐 Password hashing
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (password: string) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

export default model<IUser>("User", userSchema);
