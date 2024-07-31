import { Request, Response } from 'express';
import { InteractionController } from '../controllers/InteractionController';
import { InteractionRepository } from '../repositories/InteractionRepository';
import { sendMessageToQueue } from '../sqs/producer';
import { Interaction } from '../entity/Interaction';

const mockInteractionRepository = {
  createInteraction: jest.fn(),
  getAllInteractions: jest.fn(),
  getInteractionById: jest.fn(),
  updateInteraction: jest.fn(),
  deleteInteraction: jest.fn(),
} as unknown as jest.Mocked<InteractionRepository>;

jest.mock('../sqs/producer');
const mockSendMessageToQueue = sendMessageToQueue as jest.MockedFunction<typeof sendMessageToQueue>;

const mockInteraction: Interaction = new Interaction(1, 1, 'click', new Date());
mockInteraction.id = 1;

describe('InteractionController', () => {
  let controller: InteractionController;

  beforeEach(() => {
    controller = new InteractionController(mockInteractionRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create an interaction', async () => {
    const req = {
      body: {
        campaignId: 1,
        userId: 1,
        interactionType: 'click',
        timestamp: new Date().toISOString(),
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    mockInteractionRepository.createInteraction.mockResolvedValue(mockInteraction);
    mockSendMessageToQueue.mockResolvedValue(undefined);

    await controller.createInteraction(req, res);

    expect(mockInteractionRepository.createInteraction).toHaveBeenCalledWith(expect.any(Interaction));
    expect(mockSendMessageToQueue).toHaveBeenCalledWith(expect.any(String));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockInteraction);
  });

  it('should return 400 if validation fails', async () => {
    const req = {
      body: {
        campaignId: 1,
        userId: 'user1',
        interactionType: 'click',
        timestamp: new Date().toISOString(),
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.createInteraction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should get all interactions', async () => {
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    mockInteractionRepository.getAllInteractions.mockResolvedValue([mockInteraction]);

    await controller.getAllInteractions(req, res);

    expect(mockInteractionRepository.getAllInteractions).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([mockInteraction]);
  });

  it('should get interaction by id', async () => {
    const req = {
      params: {
        id: '1',
      },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    mockInteractionRepository.getInteractionById.mockResolvedValue(mockInteraction);

    await controller.getInteractionById(req, res);

    expect(mockInteractionRepository.getInteractionById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockInteraction);
  });

  it('should return 404 if interaction not found', async () => {
    const req = {
      params: {
        id: '1',
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    mockInteractionRepository.getInteractionById.mockResolvedValue(null);

    await controller.getInteractionById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Interaction not found' });
  });

  it('should update an interaction', async () => {
    const req = {
      params: {
        id: '1',
      },
      body: {
        campaignId: 1,
        userId: 1,
        interactionType: 'click',
        timestamp: new Date().toISOString(),
      },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    mockInteractionRepository.updateInteraction.mockResolvedValue(mockInteraction);

    await controller.updateInteraction(req, res);

    expect(mockInteractionRepository.updateInteraction).toHaveBeenCalledWith(1, expect.objectContaining(req.body));
    expect(res.json).toHaveBeenCalledWith(mockInteraction);
  });

  it('should return 404 if update fails', async () => {
    const req = {
      params: {
        id: '1',
      },
      body: {
        campaignId: 1,
        userId: 1,
        interactionType: 'click',
        timestamp: new Date().toISOString(),
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    mockInteractionRepository.updateInteraction.mockResolvedValue(null);

    await controller.updateInteraction(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Interaction not found' });
  });

  it('should delete an interaction', async () => {
    const req = {
      params: {
        id: '1',
      },
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    mockInteractionRepository.deleteInteraction.mockResolvedValue(true);

    await controller.deleteInteraction(req, res);

    expect(mockInteractionRepository.deleteInteraction).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Interaction marked as deleted' });
  });

  it('should return 404 if delete fails', async () => {
    const req = {
      params: {
        id: '1',
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    mockInteractionRepository.deleteInteraction.mockResolvedValue(false);

    await controller.deleteInteraction(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Interaction not found' });
  });
});
