import { PRECURE_ERAS } from '../data/precure-eras';
import type { EraGraph } from '../types';

export const loadEraData = (): EraGraph[] => {
  return PRECURE_ERAS.map((era) => ({ ...era }));
};
