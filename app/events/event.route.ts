import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import { getAllEvents ,bookTicket} from "./event.controllers";
import { generateQRCode } from "../common/services/qrcode.generate";
import { verifyUser } from "../common/middleware/verify.user";

const router = Router();

router
        .get("/get-all-events", catchError,getAllEvents)
        .post("/book-event/:id",verifyUser,catchError,bookTicket)
        .get("/tickets/:id",verifyUser,catchError,generateQRCode)

export default router;