import { Request, Response } from 'express';
import { CampaignRepository, Campaign } from '../repositories/CampaignRepository';

export class CampaignController {
  constructor(private campaignRepository: CampaignRepository) {}

  async createCampaign(req: Request, res: Response) {
    const campaign: Campaign = req.body;
    const newCampaign = await this.campaignRepository.createCampaign(campaign);
    res.status(201).json(newCampaign);
  }

  async getAllCampaigns(req: Request, res: Response) {
    const campaigns = await this.campaignRepository.getAllCampaigns();
    res.status(200).json(campaigns);
  }

  async getCampaignById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const campaign = await this.campaignRepository.getCampaignById(id);
    if (campaign) {
      res.status(200).json(campaign);
    } else {
      res.status(404).send('Campaign not found');
    }
  }

  async updateCampaign(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const campaign: Partial<Campaign> = req.body;
    const updatedCampaign = await this.campaignRepository.updateCampaign(id, campaign);
    if (updatedCampaign) {
      res.status(200).json(updatedCampaign);
    } else {
      res.status(404).send('Campaign not found');
    }
  }

  async deleteCampaign(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const success = await this.campaignRepository.deleteCampaign(id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).send('Campaign not found');
    }
  }
}
