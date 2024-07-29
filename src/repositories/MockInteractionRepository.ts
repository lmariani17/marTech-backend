import { Interaction, InteractionRepository } from './InteractionRepository';

export class MockInteractionRepository implements InteractionRepository {
  private interactions: Interaction[] = [];

  async createInteraction(interaction: Interaction): Promise<Interaction> {
    interaction.id = this.interactions.length + 1;
    this.interactions.push(interaction);
    return interaction;
  }

  async getInteractionsByCampaignId(campaignId: number): Promise<Interaction[]> {
    return this.interactions.filter(i => i.campaignId === campaignId);
  }
}
