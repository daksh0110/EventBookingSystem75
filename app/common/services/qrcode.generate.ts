import QRCode from "qrcode"
import { Request, Response } from "express";
import Ticket from "../../events/ticket.schema"
import Event from "../../events/event.schema";
import { EmailModule } from "./email.service";
import User from "../../user/user.schema";

export const generateQRCode = async (ticketId: string): Promise<string | null> => {
  try {
    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      console.error("Ticket not found");
      return null;
    }

    // Find the event related to the ticket
    const event = await Event.findById(ticket.eventId);
    const eventDate = event?.date;

    // Find the user who purchased the ticket
    const user = await User.findById(ticket.userId);
    if (!user) {
      console.error("User not found");
      return null;
    }

    // Prepare ticket information
    const ticketInfo = {
      ticket_id: ticket._id.toString(),
      event_id: ticket.eventId.toString(),
      user_id: ticket.userId.toString(),
      seat_number: ticket.seatNumber,
      event_date: eventDate?.toISOString(),
    };

    // Check if the ticket is expired
    const currentDate = new Date();
    if (ticket.date < currentDate) {
      console.error("Ticket has expired");
      return null;
    }

    // Convert ticket information to a string and generate the QR code
    const ticketInfoString = JSON.stringify(ticketInfo);
    const qrCodeUrl = await QRCode.toDataURL(ticketInfoString);

    if (!qrCodeUrl) {
      console.error("Error generating QR code");
      return null;
    }

    console.log("QR code generated successfully");
    return qrCodeUrl; 

  } catch (error) {
    console.error("Error:", error);
    return null; 
  }
};