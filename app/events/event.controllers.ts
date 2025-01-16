import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import e, { type Request, type Response } from 'express'
import Event from "./event.schema";
import Ticket from "./ticket.schema";
import User from "../user/user.schema";
import { EmailModule } from "../common/services/email.service";
import { verifyToken } from "../common/services/token.verify";
import { generateQRCode } from "../common/services/qrcode.generate";
import { saveQRCodeLocally } from "../common/services/qrcode.localsave";
import { JwtPayload } from 'jsonwebtoken';

interface DecodedToken {
    email: string;
}

export const getAllEvents=asyncHandler(async(req:Request,res:Response)=>{
    try {
     
        const events = await Event.find();
    
        if (events.length === 0) {
          res
            .status(404)
            .json({ success: false, message: "No events found", data: null });
        }
    
       
        res
          .status(200)
          .json(createResponse(events, "Events fetched successfully"));
      } catch (error) {
        const errorResponse = {
          success: false,
          message: error,
          data: null,
          error_code: 500,
        };
        res.status(500).json(errorResponse);
      }
})
export const bookTicket = asyncHandler(async (req: Request, res: Response) => {
    const { seatNumber, eventId } = req.body;
    const userId = req.params.id;
    const seatNumers = seatNumber.split(",");

    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json(createResponse(null, "Authorization token is missing"));
            return;
        }

        const decodedToken = verifyToken(token) as JwtPayload;
        if (!decodedToken || !decodedToken.email) {
            res.status(401).json(createResponse(null, "Invalid or expired token"));
            return;
        }

        console.log(decodedToken);

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json(createResponse(null, "User not found"));
            return;
        }

        if (user.email !== decodedToken.email) {
            res.status(403).json(createResponse(null, "Email in token does not match user email"));
            return;
        }

        const event = await Event.findById(eventId);
        if (!event) {
            res.status(404).json(createResponse(null, "Event not found"));
            return;
        }

        
        for (const seat of seatNumers) {
            const seatIndex = parseInt(seat) - 1;
            if (event.seats[seatIndex]?.isAvailable === false) {
                res.status(400).json(createResponse(null, `Seat ${seat} is already booked`));
                return;
            }
        }

        const tickets = [];
        // Book the tickets and update seat availability
        for (const seat of seatNumers) {
            const seatIndex = parseInt(seat) - 1;
            const ticket = new Ticket({
                eventId,
                userId,
                seatNumber: seat,
                price: event.seats[seatIndex].price,
                status: "confirmed",
            });
            const savedTicket = await ticket.save();
            tickets.push(savedTicket);

            // Mark the seat as unavailable
            event.seats[seatIndex].isAvailable = false;
        }

        // Save the event with updated seat availability
        await event.save();

        const userEmail = user.email;
        const url = await generateQRCode(tickets?.[0]._id);
        if (url) {
            const qrCodeBase64 = url;
            const fileName = `ticket_${tickets?.[0]._id}.png`;
            const qrCodeUrl = await saveQRCodeLocally(qrCodeBase64, fileName);

            await EmailModule(userEmail, user.name, qrCodeUrl);
        } else {
            console.error("Failed to generate QR code.");
        }

        res.status(201).json(createResponse("Ticket confirmed successfully. Check your mail for the ticket QR code"));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error,
            data: null,
            error_code: 500,
        });
    }
});
