import { Router } from 'express';
import { CampaignController } from '../controllers/CampaignController';
import { CampaignRepository } from '../repositories/CampaignRepository';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const campaignRepository = new CampaignRepository();
const campaignController = new CampaignController(campaignRepository);

router.use(authMiddleware);
router.post('/campaigns', campaignController.createCampaign.bind(campaignController));
router.get('/campaigns', campaignController.getAllCampaigns.bind(campaignController));
router.get('/campaigns/:id', campaignController.getCampaignById.bind(campaignController));
router.put('/campaigns/:id', campaignController.updateCampaign.bind(campaignController));
router.delete('/campaigns/:id', campaignController.deleteCampaign.bind(campaignController));

export default router;
