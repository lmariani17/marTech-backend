export interface Interaction {
    id: number;
    campaignId: number;
    userId: number;
    interactionType: string;
    timestamp: Date;
  }
  
  export interface InteractionRepository {
    createInteraction(interaction: Interaction): Promise<Interaction>;
    getInteractionsByCampaignId(campaignId: number): Promise<Interaction[]>;
  }
  