import { Router } from "express";
import * as controller from '../controllers/getUserInfo';
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

router.get('/', authenticateJWT, controller.getUserData);


export { router as UserAuthRouter };
