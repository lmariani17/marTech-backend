import { Router } from 'express';
import { MockCampaignRepository } from '../repositories/MockCampaignRepository';
import { CampaignController } from '../controllers/CampaignController';

const router = Router();
const campaignRepository = new MockCampaignRepository();
const campaignController = new CampaignController(campaignRepository);

router.post('/campaigns', campaignController.createCampaign.bind(campaignController));
router.get('/campaigns', campaignController.getAllCampaigns.bind(campaignController));
router.get('/campaigns/:id', campaignController.getCampaignById.bind(campaignController));
router.put('/campaigns/:id', campaignController.updateCampaign.bind(campaignController));
router.delete('/campaigns/:id', campaignController.deleteCampaign.bind(campaignController));

export default router;
