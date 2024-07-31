import { Request, Response } from 'express';
import { CampaignController } from '../controllers/CampaignController';
import { CampaignRepository } from '../repositories/CampaignRepository';
import { Campaign } from '../entity/Campaign';

const mockCampaignRepository = {
    createCampaign: jest.fn(),
    getAllCampaigns: jest.fn(),
    getCampaignById: jest.fn(),
    updateCampaign: jest.fn(),
    deleteCampaign: jest.fn(),
} as unknown as jest.Mocked<CampaignRepository>;

const mockCampaign = new Campaign('Test Campaign', new Date(), new Date(), 1000);
mockCampaign.id = 1;

describe('CampaignController', () => {
    let controller: CampaignController;

    beforeEach(() => {
        controller = new CampaignController(mockCampaignRepository);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should create a campaign', async () => {
        const req = {
            body: {
                name: 'Test Campaign',
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                budget: 1000,
            },
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        mockCampaignRepository.createCampaign.mockResolvedValue(mockCampaign);

        await controller.createCampaign(req, res);

        expect(mockCampaignRepository.createCampaign).toHaveBeenCalledWith(expect.any(Campaign));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockCampaign);
    });

    it('should return 400 if validation fails', async () => {
        const req = {
            body: {
                name: 'Test Campaign',
                startDate: 'invalid-date',
                endDate: new Date().toISOString(),
                budget: 'invalid-budget',
            },
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        await controller.createCampaign(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should get all campaigns', async () => {
        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        mockCampaignRepository.getAllCampaigns.mockResolvedValue([mockCampaign]);

        await controller.getAllCampaigns(req, res);

        expect(mockCampaignRepository.getAllCampaigns).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([mockCampaign]);
    });

    it('should get campaign by id', async () => {
        const req = {
            params: {
                id: '1',
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        mockCampaignRepository.getCampaignById.mockResolvedValue(mockCampaign);

        await controller.getCampaignById(req, res);

        expect(mockCampaignRepository.getCampaignById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCampaign);
    });

    it('should return 404 if campaign not found', async () => {
        const req = {
            params: {
                id: '1',
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        mockCampaignRepository.getCampaignById.mockResolvedValue(null);

        await controller.getCampaignById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Campaign not found' });
    });

    it('should update a campaign', async () => {
        const req = {
            params: {
                id: '1',
            },
            body: {
                name: 'Updated Campaign',
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                budget: 2000,
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        mockCampaignRepository.updateCampaign.mockResolvedValue(mockCampaign);

        await controller.updateCampaign(req, res);

        expect(mockCampaignRepository.updateCampaign).toHaveBeenCalledWith(1, expect.objectContaining(req.body));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Campaign updated successfully' });
    });

    it('should return 404 if update fails', async () => {
        const req = {
            params: {
                id: '1',
            },
            body: {
                name: 'Updated Campaign',
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                budget: 2000,
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        mockCampaignRepository.updateCampaign.mockResolvedValue(null);

        await controller.updateCampaign(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Campaign not found' });
    });

    it('should delete a campaign', async () => {
        const req = {
            params: {
                id: '1',
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        mockCampaignRepository.deleteCampaign.mockResolvedValue(true);

        await controller.deleteCampaign(req, res);

        expect(mockCampaignRepository.deleteCampaign).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Campaign deleted successfully' });
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

        mockCampaignRepository.deleteCampaign.mockResolvedValue(false);

        await controller.deleteCampaign(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Campaign not found' });
    });
});
