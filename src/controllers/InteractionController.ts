import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Interaction } from '../entity/Interaction';
import { InteractionDTO } from '../dto/InteractionDTO';
import { sendMessageToQueue } from '../sqs/producer';
import { InteractionRepository } from '../repositories/InteractionRepository';

export class InteractionController {
  constructor(private interactionRepository: InteractionRepository) {}

  async createInteraction(req: Request, res: Response) {
    const dto = plainToClass(InteractionDTO, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const interaction = new Interaction(dto.campaignId, dto.userId, dto.interactionType, dto.timestamp);
    try {
      const createdInteraction = await this.interactionRepository.createInteraction(interaction);

      const messageBody = JSON.stringify({
        campaignId: dto.campaignId,
        userId: dto.userId,
        interactionType: dto.interactionType,
        timestamp: createdInteraction.timestamp.toISOString(),
      });

      await sendMessageToQueue(messageBody);

      res.status(201).json(createdInteraction);
    } catch (error: any) {
      console.error('Error creating interaction', error);
      res.status(500).json({ message: 'Error creating interaction' });
    }
  }

  async getAllInteractions(req: Request, res: Response) {
    const interactions = await this.interactionRepository.getAllInteractions();
    res.json(interactions);
  }

  async getInteractionById(req: Request, res: Response) {
    const { id } = req.params;
    const interaction = await this.interactionRepository.getInteractionById(Number(id));

    if (interaction) {
      res.json(interaction);
    } else {
      res.status(404).json({ message: 'Interaction not found' });
    }
  }

  async updateInteraction(req: Request, res: Response) {
    const { id } = req.params;
    const dto = plainToClass(InteractionDTO, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const updatedInteraction = {
      ...dto
    };

    try {
      const interaction = await this.interactionRepository.updateInteraction(Number(id), updatedInteraction);

      if (!interaction) {
        res.status(404).json({ message: 'Interaction not found' });
        
      } 

      res.json(interaction);
    } catch (error: any) {
      console.error('Error creating interaction', error);
      res.status(500).json({ message: 'Error creating interaction' });
    }
  }

  async deleteInteraction(req: Request, res: Response) {
    const { id } = req.params;
    const success = await this.interactionRepository.deleteInteraction(Number(id));

    if (success) {
      res.json({ message: 'Interaction marked as deleted' });
    } else {
      res.status(404).json({ message: 'Interaction not found' });
    }
  }
}
