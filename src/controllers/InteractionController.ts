import { Request, Response } from 'express';
import { InteractionRepository } from '../repositories/InteractionRepository';
import { Interaction } from '../entity/Interaction';
import { sendMessageToQueue } from '../sqs/producer';

export class InteractionController {
  constructor(private interactionRepository: InteractionRepository) {}

  async createInteraction(req: Request, res: Response) {  
    try {
      const interaction: Interaction = req.body;
      const newInteraction = await this.interactionRepository.createInteraction(interaction);
  
      await sendMessageToQueue(JSON.stringify(newInteraction));
  
      res.status(201).json(newInteraction);
    } catch (error) {
      console.error('Error creating interaction', error);
      res.status(500).json({ message: 'Error creating interaction' });
    }
  }

  async getInteractionsByCampaignId(req: Request, res: Response) {
    const campaignId = parseInt(req.params.campaignId);
    const interactions = await this.interactionRepository.getInteractionsByCampaignId(campaignId);
    res.status(200).json(interactions);
  }
}
