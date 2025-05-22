import { Router } from "express";
import * as controller from '../controllers/auth';

const router = Router();

router.post('/', controller.loginAdminUser);


export { router as AdminLogin };
