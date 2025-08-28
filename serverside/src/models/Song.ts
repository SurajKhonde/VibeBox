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
  role: string;                            // Music Director, Producer, Lyricist, etc.
  artistId: mongoose.Types.ObjectId;       // Ref to Artist
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

export interface ISong extends Document {
  name: string;
  singers: mongoose.Types.ObjectId[];   // Array of Artist IDs
  composers: IComposer[];
  albums: IAlbumRef[];
  genres: string[];
  files: IFile[];
  releaseDate?: Date;
  createdAt: Date;
}

const SongSchema = new Schema<ISong>({
  name: { type: String, required: true },

  // singers now point to Artist collection
  singers: [
    { type: Schema.Types.ObjectId, ref: "Artist", required: true }
  ],

  composers: [ComposerSchema],

  albums: [AlbumRefSchema],

  genres: [{ type: String }],

  files: [FileSchema],

  releaseDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const Song = mongoose.model<ISong>("Song", SongSchema);
