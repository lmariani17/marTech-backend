import { Request, Response } from 'express';
import { CampaignRepository } from '../repositories/CampaignRepository';
import { Campaign } from '../entity/Campaign';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CampaignDTO } from '../dto/CampaignDTO';

export class CampaignController {
  constructor(private campaignRepository: CampaignRepository) { }

  async createCampaign(req: Request, res: Response) {
    const dto = plainToClass(CampaignDTO, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const campaign = new Campaign(dto.name, dto.startDate, dto.endDate, dto.budget);
    try {
      const newCampaign = await this.campaignRepository.createCampaign(campaign);

      res.status(201).json(newCampaign);
    } catch (error) {
      res.status(500).json({ message: 'Error creating campaign' });
    }
  }

  async getAllCampaigns(req: Request, res: Response) {
    try {
      const campaigns = await this.campaignRepository.getAllCampaigns();
      res.status(200).json(campaigns);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving campaigns' });
    }
  }

  async getCampaignById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const campaign = await this.campaignRepository.getCampaignById(Number(id));
      if (campaign) {
        res.status(200).json(campaign);
      } else {
        res.status(404).json({ message: 'Campaign not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving campaign' });
    }
  }

  async updateCampaign(req: Request, res: Response) {
    const { id } = req.params;
    const dto = plainToClass(CampaignDTO, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updatedCampaign = { ...dto }

    try {
      const campaign = await this.campaignRepository.updateCampaign(Number(id), updatedCampaign);
      if (campaign) {
        res.status(200).json({ message: 'Campaign updated successfully' });
      } else {
        res.status(404).json({ message: 'Campaign not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating campaign' });
    }
  }

  async deleteCampaign(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deleted = await this.campaignRepository.deleteCampaign(Number(id));

      if (deleted) {
        res.status(200).json({ message: 'Campaign deleted successfully' });
      } else {
        res.status(404).json({ message: 'Campaign not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting campaign' });
    }
  }
}
