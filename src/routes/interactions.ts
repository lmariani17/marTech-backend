import { Router } from 'express';
import { InteractionController } from '../controllers/InteractionController';
import { InteractionRepository } from '../repositories/InteractionRepository';

const router = Router();
const interactionRepository = new InteractionRepository();
const interactionController = new InteractionController(interactionRepository);

router.post('/interactions', interactionController.createInteraction.bind(interactionController));

export default router;
