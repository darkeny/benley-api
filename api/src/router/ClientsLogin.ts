import { Router } from "express";
import * as controller from '../controllers/auth';

const router = Router();

router.post('/', controller.loginUser);


export { router as UserLogin };
