import { AppDataSource } from '../../data-source'; // Asegúrate de que la ruta sea correcta
import { Interaction } from '../entity/Interaction';

export class InteractionRepository {
  private repository = AppDataSource.getRepository(Interaction);

  async createInteraction(interaction: Interaction): Promise<Interaction> {
    return await this.repository.save(interaction);
  }

  async getInteractionsByCampaignId(campaignId: number): Promise<Interaction[]> {
    return await this.repository.find({ where: { campaignId } });
  }
}
