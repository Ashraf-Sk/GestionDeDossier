// Configuration globale pour les tests
import { afterEach, vi } from 'vitest';

// Nettoyer après chaque test si nécessaire
afterEach(() => {
  vi.clearAllMocks();
});
