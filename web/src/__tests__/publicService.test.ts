// Tests unitaires pour publicService
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { publicService } from '../services/publicService';
import api from '../services/api';
import { API_CONFIG } from '../config/api';

// Mock axios
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('publicService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPublicStats', () => {
    it('should fetch public stats successfully', async () => {
      const mockStats = {
        total: 100,
        deposees: 20,
        enCours: 30,
        acceptees: 40,
        rejetees: 10,
        parCommune: { 'Casablanca': 50 },
        parType: { 'PERMIS_CONSTRUIRE': 60 },
      };

      (api.get as any).mockResolvedValue({ data: mockStats });

      const result = await publicService.getPublicStats();

      expect(result).toEqual(mockStats);
      expect(api.get).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.STATS_PUBLIC);
    });

    it('should handle errors', async () => {
      (api.get as any).mockRejectedValue(new Error('Network error'));

      await expect(publicService.getPublicStats()).rejects.toThrow();
    });
  });

  describe('getPublicDemandes', () => {
    it('should fetch public demandes with pagination', async () => {
      const mockPage = {
        content: [
          { id: '1', status: 'EN_COURS', temps: '2024-01-01', typeAutorization: 'PERMIS_CONSTRUIRE', nomCommune: 'Casablanca' },
        ],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0,
        first: true,
        last: true,
      };

      (api.get as any).mockResolvedValue({ data: mockPage });

      const result = await publicService.getPublicDemandes(0, 10);

      expect(result).toEqual(mockPage);
      expect(api.get).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.PUBLIC_DEMANDES, {
        params: { page: 0, size: 10, status: undefined, type: undefined, nomCommune: undefined },
      });
    });
  });
});
