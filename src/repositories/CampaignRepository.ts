import { AppDataSource } from '../../data-source'; // Asegúrate de que la ruta sea correcta
import { Campaign } from '../entity/Campaign';

export class CampaignRepository {
  private repository = AppDataSource.getRepository(Campaign);

  async createCampaign(campaign: Campaign): Promise<Campaign> {
    return await this.repository.save(campaign);
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return await this.repository.find();
  }

  async getCampaignById(id: number): Promise<Campaign | null> {
    return await this.repository.findOneBy({ id }) || null;
  }

  async updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign | null> {
    await this.repository.update(id, campaign);
    return this.getCampaignById(id);
  }

  async deleteCampaign(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}
