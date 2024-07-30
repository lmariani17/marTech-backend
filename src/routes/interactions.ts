import { Router } from 'express';
import { InteractionController } from '../controllers/InteractionController';
import { InteractionRepository } from '../repositories/InteractionRepository';

const router = Router();
const interactionRepository = new InteractionRepository();
const interactionController = new InteractionController(interactionRepository);

router.post('/interactions', interactionController.createInteraction.bind(interactionController));
router.get('/interactions', interactionController.createInteraction.bind(this));
router.get('/interactions/:id', interactionController.getAllInteractions.bind(this));
router.put('/interactions/:id', interactionController.updateInteraction.bind(this));
router.delete('/interactions/:id', interactionController.deleteInteraction.bind(this));

export default router;
