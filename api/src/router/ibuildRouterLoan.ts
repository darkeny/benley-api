import { Router } from "express";
import * as controller from '../controllers/ibuildLoan';

const router = Router();

router.post('/', controller.IBuildLoan);
router.get('/', controller.getAll);
router.delete('/:id', controller.deleteLoan);
router.put('/:id', controller.updateLoan);
router.put('/pawn/:id', controller.updatePawnStatus);

export { router as IbuildRouterLoan };
