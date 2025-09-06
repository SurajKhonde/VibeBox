import mongoose, { Document, Schema } from "mongoose";

interface IFile {
  format: string;
  quality?: string;
  url: string;
  size?: number;
  duration?: number;
}

const FileSchema = new Schema<IFile>(
  {
    format: { type: String, required: true },
    quality: { type: String },
    url: { type: String, required: true },
    size: { type: Number },
    duration: { type: Number },
  },
  { _id: false }
);

interface IComposer {
  role: string;                            
  artistId: mongoose.Types.ObjectId;       
}

const ComposerSchema = new Schema<IComposer>(
  {
    role: { type: String, required: true },
    artistId: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
  },
  { _id: false }
);

interface IAlbumRef {
  albumId: mongoose.Types.ObjectId;
  name?: string;
}

const AlbumRefSchema = new Schema<IAlbumRef>(
  {
    albumId: { type: Schema.Types.ObjectId, ref: "Album", required: true },
    name: { type: String },
  },
  { _id: false }
);

interface IRating {
  userId: mongoose.Types.ObjectId;
  rating: number; // 1-5 stars
}

const RatingSchema = new Schema<IRating>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
  },
  { _id: false }
);

export interface ISong extends Document {
  name: string;
  singers: mongoose.Types.ObjectId[];
  composers: IComposer[];
  albums: IAlbumRef[];
  genres: string[];
  moods: string[];
  situationalGenres: string[];
  files: IFile[];
  releaseDate?: Date;
  createdAt: Date;
  thumbnail?: string;
  lyrics?: string;

  ratings: IRating[];
  averageRating: number;
  playCount: number;
  likes: mongoose.Types.ObjectId[];

  isTopRated?: boolean; // virtual
}

const SongSchema = new Schema<ISong>({
  name: { type: String, required: true },

  singers: [{ type: Schema.Types.ObjectId, ref: "Artist", required: true }],

  composers: [ComposerSchema],

  albums: [AlbumRefSchema],

  genres: [{ type: String }],
  moods: [{ type: String }],
  situationalGenres: [{ type: String }],

  files: [FileSchema],

  thumbnail: { type: String },
  lyrics: { type: String },

  releaseDate: { type: Date },
  createdAt: { type: Date, default: Date.now },

  ratings: [RatingSchema],
  averageRating: { type: Number, default: 0 },

  playCount: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// ✅ Virtual field for top-rated
SongSchema.virtual("isTopRated").get(function (this: ISong) {
  return this.averageRating >= 4.5;
});

// ✅ Middleware to auto-update average rating
SongSchema.pre("save", function (next) {
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = sum / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

export const Song = mongoose.model<ISong>("Song", SongSchema);
