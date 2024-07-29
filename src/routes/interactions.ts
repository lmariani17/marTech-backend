import { Router } from 'express';
import { MockInteractionRepository } from '../repositories/MockInteractionRepository';
import { InteractionController } from '../controllers/InteractionController';

const router = Router();
const interactionRepository = new MockInteractionRepository();
const interactionController = new InteractionController(interactionRepository);

router.post('/interactions', interactionController.createInteraction.bind(interactionController));

export default router;
