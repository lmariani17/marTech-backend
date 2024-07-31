import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Interaction } from '../entity/Interaction';
import { InteractionDTO } from '../dto/InteractionDTO';
import { sendMessageToQueue } from '../sqs/producer';
import { InteractionRepository } from '../repositories/InteractionRepository';

export class InteractionController {
  constructor(private interactionRepository: InteractionRepository) {}

  /**
   * @openapi
   * tags:
   *   name: Interactions
   *   description: The interactions API
   */

  /**
   * @openapi
   * /api/interactions:
   *   post:
   *     summary: Create a new interaction
   *     tags: [Interactions]
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               campaignId:
   *                 type: integer
   *                 example: 1
   *               userId:
   *                 type: integer
   *                 example: 1
   *               interactionType:
   *                 type: string
   *                 example: click
   *               timestamp:
   *                 type: string
   *                 format: date-time
   *                 example: '2024-07-30T00:00:00Z'
   *             required:
   *               - campaignId
   *               - userId
   *               - interactionType
   *     responses:
   *       '201':
   *         description: Interaction created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 campaignId:
   *                   type: integer
   *                   example: 1
   *                 userId:
   *                   type: integer
   *                   example: 1
   *                 interactionType:
   *                   type: string
   *                   example: click
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: '2024-07-30T00:00:00Z'
   *               required:
   *                 - id
   *                 - campaignId
   *                 - userId
   *                 - interactionType
   *                 - timestamp
   *       '400':
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: string
   *       '500':
   *         description: Internal server error
   *     security:
   *       - bearerAuth: []
   */
  async createInteraction(req: Request, res: Response) {
    const dto = plainToClass(InteractionDTO, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const interaction = new Interaction(
      dto.campaignId,
      dto.userId,
      dto.interactionType,
      dto.timestamp
    );
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

  /**
   * @openapi
   * /api/interactions:
   *   get:
   *     summary: Get all interactions
   *     tags: [Interactions]
   *     responses:
   *       '200':
   *         description: List of interactions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     example: 1
   *                   campaignId:
   *                     type: integer
   *                     example: 1
   *                   userId:
   *                     type: integer
   *                     example: 1
   *                   interactionType:
   *                     type: string
   *                     example: click
   *                   timestamp:
   *                     type: string
   *                     format: date-time
   *                     example: '2024-07-30T00:00:00Z'
   *                 required:
   *                   - id
   *                   - campaignId
   *                   - userId
   *                   - interactionType
   *                   - timestamp
   *       '500':
   *         description: Internal server error
   *     security:
   *       - bearerAuth: []
   */
  async getAllInteractions(req: Request, res: Response) {
    const interactions = await this.interactionRepository.getAllInteractions();
    res.json(interactions);
  }

  /**
   * @openapi
   * /api/interactions/{id}:
   *   get:
   *     summary: Get interaction by ID
   *     tags: [Interactions]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       '200':
   *         description: Interaction found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 campaignId:
   *                   type: integer
   *                   example: 1
   *                 userId:
   *                   type: integer
   *                   example: 1
   *                 interactionType:
   *                   type: string
   *                   example: click
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: '2024-07-30T00:00:00Z'
   *               required:
   *                 - id
   *                 - campaignId
   *                 - userId
   *                 - interactionType
   *                 - timestamp
   *       '404':
   *         description: Interaction not found
   *       '500':
   *         description: Internal server error
   *     security:
   *       - bearerAuth: []
   */
  async getInteractionById(req: Request, res: Response) {
    const { id } = req.params;
    const interaction = await this.interactionRepository.getInteractionById(Number(id));

    if (interaction) {
      res.json(interaction);
    } else {
      res.status(404).json({ message: 'Interaction not found' });
    }
  }

  /**
   * @openapi
   * /api/interactions/{id}:
   *   put:
   *     summary: Update an interaction
   *     tags: [Interactions]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               campaignId:
   *                 type: integer
   *                 example: 1
   *               userId:
   *                 type: integer
   *                 example: 1
   *               interactionType:
   *                 type: string
   *                 example: click
   *               timestamp:
   *                 type: string
   *                 format: date-time
   *                 example: '2024-07-30T00:00:00Z'
   *             required:
   *               - campaignId
   *               - userId
   *               - interactionType
   *     responses:
   *       '200':
   *         description: Interaction updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 campaignId:
   *                   type: integer
   *                   example: 1
   *                 userId:
   *                   type: integer
   *                   example: 1
   *                 interactionType:
   *                   type: string
   *                   example: click
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: '2024-07-30T00:00:00Z'
   *               required:
   *                 - id
   *                 - campaignId
   *                 - userId
   *                 - interactionType
   *                 - timestamp
   *       '404':
   *         description: Interaction not found
   *       '400':
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: string
   *       '500':
   *         description: Internal server error
   *     security:
   *       - bearerAuth: []
   */
  async updateInteraction(req: Request, res: Response) {
    const { id } = req.params;
    const dto = plainToClass(InteractionDTO, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const updatedInteraction = {
      ...dto
    }

    try {
      const interaction = await this.interactionRepository.updateInteraction(Number(id), updatedInteraction);
      if (interaction) {
        res.status(200).json(interaction);
      } else {
        res.status(404).json({ message: 'Campaign not found' });
      }
      res.json(updatedInteraction);
    } catch (error: any) {
      console.error('Error updating interaction', error);
      res.status(500).json({ message: 'Error updating interaction' });
    }
  }

  /**
   * @openapi
   * /api/interactions/{id}:
   *   delete:
   *     summary: Delete an interaction
   *     tags: [Interactions]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       '204':
   *         description: Interaction deleted successfully
   *       '404':
   *         description: Interaction not found
   *       '500':
   *         description: Internal server error
   *     security:
   *       - bearerAuth: []
   */
  async deleteInteraction(req: Request, res: Response) {
    const { id } = req.params;
    const interaction = await this.interactionRepository.getInteractionById(Number(id));

    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }

    try {
      await this.interactionRepository.deleteInteraction(Number(id));
      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting interaction', error);
      res.status(500).json({ message: 'Error deleting interaction' });
    }
  }
}
