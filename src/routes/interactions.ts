import { Router } from 'express';
import { InteractionController } from '../controllers/InteractionController';
import { InteractionRepository } from '../repositories/InteractionRepository';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const interactionRepository = new InteractionRepository();
const interactionController = new InteractionController(interactionRepository);

router.post('/interactions', authMiddleware, interactionController.createInteraction.bind(interactionController));
router.get('/interactions', authMiddleware, interactionController.createInteraction.bind(this));
router.get('/interactions/:id', authMiddleware, interactionController.getAllInteractions.bind(this));
router.put('/interactions/:id', authMiddleware, interactionController.updateInteraction.bind(this));
router.delete('/interactions/:id', authMiddleware, interactionController.deleteInteraction.bind(this));

export default router;
