import { Campaign, CampaignRepository } from './CampaignRepository';

export class MockCampaignRepository implements CampaignRepository {
  private campaigns: Campaign[] = [];

  async createCampaign(campaign: Campaign): Promise<Campaign> {
    campaign.id = this.campaigns.length + 1;
    this.campaigns.push(campaign);
    return campaign;
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return this.campaigns;
  }

  async getCampaignById(id: number): Promise<Campaign | null> {
    const campaign = this.campaigns.find(c => c.id === id);
    return campaign || null;
  }

  async updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign | null> {
    const index = this.campaigns.findIndex(c => c.id === id);
    if (index === -1) {
      return null;
    }
    this.campaigns[index] = { ...this.campaigns[index], ...campaign };
    return this.campaigns[index];
  }

  async deleteCampaign(id: number): Promise<boolean> {
    const index = this.campaigns.findIndex(c => c.id === id);
    if (index === -1) {
      return false;
    }
    this.campaigns.splice(index, 1);
    return true;
  }
}
