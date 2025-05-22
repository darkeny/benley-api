import { Router } from "express";
import * as controller from '../controllers/Users';

const router = Router();

router.get('/', controller.getAll)
router.post('/', controller.createAdminUser);
router.delete('/:id', controller.RemadminUser);


export { router as AdminRouter };
