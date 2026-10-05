import { ClientConfig } from '../client-config.types';
import { varisaConfig } from './varisa';
import { depotConfig } from './depot';
import { vogueConfig } from './vogue';
import { traditionalTasteV2Config } from './traditional-taste-v2';
import { fortitudeConfig } from './fortitude';
import { electroConfig } from './electro';
import { apiPortalConfig } from './api-portal';
import { jumiaConfig } from './jumia';

/**
 * Registry of all available client configurations.
 * 
 * The key must match the value of `NEXT_PUBLIC_STORE_FRONT` in `.env`.
 * To add a new client, create a new file in this directory and add it here.
 */
export const clientRegistry: Record<string, ClientConfig> = {
  'varisa': varisaConfig,
  'depot': depotConfig,
  'vogue': vogueConfig,
  'traditional-taste-v2': traditionalTasteV2Config,
  'fortitude': fortitudeConfig,
  'electro': electroConfig,
  'api-portal': apiPortalConfig,
  'jumia': jumiaConfig,
};
