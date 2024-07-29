export interface Campaign {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    budget: number;
  }
  
  export interface CampaignRepository {
    createCampaign(campaign: Campaign): Promise<Campaign>;
    getAllCampaigns(): Promise<Campaign[]>;
    getCampaignById(id: number): Promise<Campaign | null>;
    updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign | null>;
    deleteCampaign(id: number): Promise<boolean>;
  }
  