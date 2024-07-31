import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Campaign } from '../entity/Campaign';
import { CampaignDTO } from '../dto/CampaignDTO';
import { CampaignRepository } from '../repositories/CampaignRepository';

export class CampaignController {
  constructor(private campaignRepository: CampaignRepository) {}

  /**
   * @openapi
   * tags:
   *   name: Campaigns
   *   description: The campaigns API
   */

  /**
   * @openapi
   * /api/campaigns:
   *   post:
   *     summary: Create a new campaign
   *     tags: [Campaigns]
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: Summer Sale
   *               startDate:
   *                 type: string
   *                 format: date
   *                 example: '2024-07-01'
   *               endDate:
   *                 type: string
   *                 format: date
   *                 example: '2024-07-31'
   *               budget:
   *                 type: number
   *                 example: 1000
   *             required:
   *               - name
   *               - startDate
   *               - endDate
   *               - budget
   *     responses:
   *       '201':
   *         description: Campaign created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 name:
   *                   type: string
   *                   example: Summer Sale
   *                 startDate:
   *                   type: string
   *                   format: date
   *                   example: '2024-07-01'
   *                 endDate:
   *                   type: string
   *                   format: date
   *                   example: '2024-07-31'
   *                 budget:
   *                   type: number
   *                   example: 1000
   *               required:
   *                 - id
   *                 - name
   *                 - startDate
   *                 - endDate
   *                 - budget
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
   *      security:
   *         - bearerAuth: []
   */
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

  /**
   * @openapi
   * /api/campaigns:
   *   get:
   *     summary: Get all campaigns
   *     tags: [Campaigns]
   *     responses:
   *       '200':
   *         description: List of campaigns
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
   *                   name:
   *                     type: string
   *                     example: Summer Sale
   *                   startDate:
   *                     type: string
   *                     format: date
   *                     example: '2024-07-01'
   *                   endDate:
   *                     type: string
   *                     format: date
   *                     example: '2024-07-31'
   *                   budget:
   *                     type: number
   *                     example: 1000
   *                 required:
   *                   - id
   *                   - name
   *                   - startDate
   *                   - endDate
   *                   - budget
   *       '500':
   *         description: Internal server error
   *      security:
   *         - bearerAuth: []
   */
  async getAllCampaigns(req: Request, res: Response) {
    try {
      const campaigns = await this.campaignRepository.getAllCampaigns();
      res.status(200).json(campaigns);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving campaigns' });
    }
  }

  /**
   * @openapi
   * /api/campaigns/{id}:
   *   get:
   *     summary: Get campaign by ID
   *     tags: [Campaigns]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       '200':
   *         description: Campaign found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 name:
   *                   type: string
   *                   example: Summer Sale
   *                 startDate:
   *                   type: string
   *                   format: date
   *                   example: '2024-07-01'
   *                 endDate:
   *                   type: string
   *                   format: date
   *                   example: '2024-07-31'
   *                 budget:
   *                   type: number
   *                   example: 1000
   *               required:
   *                 - id
   *                 - name
   *                 - startDate
   *                 - endDate
   *                 - budget
   *       '404':
   *         description: Campaign not found
   *       '500':
   *         description: Internal server error
   *      security:
   *         - bearerAuth: []
   */
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

  /**
   * @openapi
   * /api/campaigns/{id}:
   *   put:
   *     summary: Update an existing campaign
   *     tags: [Campaigns]
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
   *               name:
   *                 type: string
   *                 example: Winter Sale
   *               startDate:
   *                 type: string
   *                 format: date
   *                 example: '2024-12-01'
   *               endDate:
   *                 type: string
   *                 format: date
   *                 example: '2024-12-31'
   *               budget:
   *                 type: number
   *                 example: 1500
   *             required:
   *               - name
   *               - startDate
   *               - endDate
   *               - budget
   *     responses:
   *       '200':
   *         description: Campaign updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 name:
   *                   type: string
   *                   example: Winter Sale
   *                 startDate:
   *                   type: string
   *                   format: date
   *                   example: '2024-12-01'
   *                 endDate:
   *                   type: string
   *                   format: date
   *                   example: '2024-12-31'
   *                 budget:
   *                   type: number
   *                   example: 1500
   *               required:
   *                 - id
   *                 - name
   *                 - startDate
   *                 - endDate
   *                 - budget
   *       '400':
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: string
   *       '404':
   *         description: Campaign not found
   *       '500':
   *         description: Internal server error
   *      security:
   *         - bearerAuth: []
   */
  async updateCampaign(req: Request, res: Response) {
    const { id } = req.params;
    const dto = plainToClass(CampaignDTO, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const updatedCampaign = await this.campaignRepository.updateCampaign(Number(id), dto);
      if (updatedCampaign) {
        res.status(200).json(updatedCampaign);
      } else {
        res.status(404).json({ message: 'Campaign not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating campaign' });
    }
  }

  /**
   * @openapi
   * /api/campaigns/{id}:
   *   delete:
   *     summary: Delete a campaign
   *     tags: [Campaigns]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       '204':
   *         description: Campaign deleted successfully
   *       '404':
   *         description: Campaign not found
   *       '500':
   *         description: Internal server error
   *      security:
   *         - bearerAuth: []
   */
  async deleteCampaign(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deleteResult = await this.campaignRepository.deleteCampaign(Number(id));
      if (deleteResult) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Campaign not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting campaign' });
    }
  }
}
