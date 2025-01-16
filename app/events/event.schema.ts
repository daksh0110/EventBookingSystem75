import mongoose, { Schema, Document } from "mongoose";


interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  location: string;
  seats: {
    number: number;
    isAvailable: boolean;
    price: number;
    bookedBy?: mongoose.Types.ObjectId; // Reference to a user
  }[];
  createdAt: Date;
  updatedAt: Date;
}


const EventSchema: Schema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    seats: [
      {
        number: { type: Number, required: true },
        isAvailable: { type: Boolean, default: true },
        price: { type: Number, required: true },
        bookedBy: { type: mongoose.Types.ObjectId, ref: "User" },
      },
    ],
   
  },
  {
    timestamps: true, 
  }
);


const Event = mongoose.model<IEvent>("Event", EventSchema);

export default Event;
