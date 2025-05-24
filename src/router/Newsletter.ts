import { Router } from "express";
import * as controller from '../controllers/Newsletter';

const router = Router();

router.get('/', controller.getAll);
router.post('/', controller.IBuildNews);
router.delete('/:id', controller.deleteSubscriber);

export { router as NewsletterRouter };
