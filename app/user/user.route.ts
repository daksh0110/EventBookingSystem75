
import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import { loginUser, registerUser} from "./user.controller";



 const router = Router();

 router
         .post("/register", catchError,registerUser)
         .post("/login", catchError,loginUser);
      


 export default router;

