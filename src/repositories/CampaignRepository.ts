import { AppDataSource } from '../../data-source'; // Asegúrate de que la ruta sea correcta
import { Campaign } from '../entity/Campaign';

export class CampaignRepository {
  private repository = AppDataSource.getRepository(Campaign);

  async createCampaign(campaign: Campaign): Promise<Campaign> {
    return await this.repository.save(campaign);
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return await this.repository.find({ where: { deletedAt: undefined } });
  }

  async getCampaignById(id: number): Promise<Campaign | null> {
    return await this.repository.findOne({ where: { id, deletedAt: undefined } });
  }

  async updateCampaign(id: number, updatedCampaign: Partial<Campaign>): Promise<Campaign | null> {
    const campaign = await this.repository.findOne({ where: { id, deletedAt: undefined } });
    if (campaign) {
      Object.assign(campaign, updatedCampaign);
      return await this.repository.save(campaign);
    }
    
    return null;
  }

  async deleteCampaign(id: number): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected !== 0;
  }
}
