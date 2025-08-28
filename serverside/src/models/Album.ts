import mongoose, { Document, Schema } from "mongoose";

export interface IAlbum extends Document {
  name: string;
  artistId: mongoose.Types.ObjectId;  
  songs: mongoose.Types.ObjectId[];      
  releaseDate?: Date;
  genres: string[];
  coverArtUrl?: string;
  label?: string;                        
  description?: string;
  createdAt: Date;
}

const AlbumSchema = new Schema<IAlbum>({
  name: { type: String, required: true },
  artistId: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
  releaseDate: { type: Date },
  genres: [{ type: String }],
  coverArtUrl: { type: String },        
  label: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Album = mongoose.model<IAlbum>("Album", AlbumSchema);
