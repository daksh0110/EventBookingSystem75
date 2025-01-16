import mongoose, { Schema, Document } from "mongoose";

interface ITicket extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  seatNumber: string;
  price: number;
  status: "confirmed" | "pending";
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema = new Schema<ITicket>(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
     
      default: "confirmed",
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);

export default Ticket;
