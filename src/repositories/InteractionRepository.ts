import { AppDataSource } from '../../data-source';
import { Interaction } from '../entity/Interaction';

export class InteractionRepository {
  private repository = AppDataSource.getRepository(Interaction);

  async createInteraction(interaction: Interaction): Promise<Interaction> {
    return await this.repository.save(interaction);
  }

  async getAllInteractions(): Promise<Interaction[]> {
    return await this.repository.find({ where: { deletedAt: undefined } });
  }

  async getInteractionById(id: number): Promise<Interaction | null> {
    return await this.repository.findOne({ where: { id, deletedAt: undefined } });
  }

  async updateInteraction(id: number, updatedInteraction: Partial<Interaction>): Promise<Interaction | null> {
    const interaction = await this.repository.findOne({ where: { id, deletedAt: undefined } });
    if (interaction) {
      Object.assign(interaction, updatedInteraction);
      return await this.repository.save(interaction);
    }

    return null;
  }

  async deleteInteraction(id: number): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected !== 0;
  }
}
