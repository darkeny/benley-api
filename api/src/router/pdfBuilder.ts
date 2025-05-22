import { Router } from "express";
import * as controller from '../controllers/PdfBuilder';

const router = Router();

// Define a rota GET com o parâmetro de URL ':id'
router.get('/:id', controller.PdfBuilder);

export { router as PdfBuilder };