import { Request, Response } from 'express';
import { InteractionRepository } from '../repositories/InteractionRepository';
import { Interaction } from '../entity/Interaction';

export class InteractionController {
  constructor(private interactionRepository: InteractionRepository) {}

  async createInteraction(req: Request, res: Response) {
    const interaction: Interaction = req.body;
    const newInteraction = await this.interactionRepository.createInteraction(interaction);
    res.status(201).json(newInteraction);
  }

  async getInteractionsByCampaignId(req: Request, res: Response) {
    const campaignId = parseInt(req.params.campaignId);
    const interactions = await this.interactionRepository.getInteractionsByCampaignId(campaignId);
    res.status(200).json(interactions);
  }
}
