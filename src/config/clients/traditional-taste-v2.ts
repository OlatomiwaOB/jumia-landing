import { ClientConfig, brandJsonToBranding } from '../client-config.types';
import brand from '../brands/traditional-taste-v2.brand.json';

export const traditionalTasteV2Config: ClientConfig = {
  branding: brandJsonToBranding(brand),
  identifiers: {
    entityCode: {
      development: 'H2P',
      production: 'TTS', // TODO: Replace with production entity code
    },
    storeCode: {
      development: 'STO1575',
      production: 'STO1575', // TODO: Replace with production store code
    },
    sourceCode: {
      development: 'HELP2PAY',
      production: 'TRADITIONAL_TASTE',
    }
  },
  features: {
    enableBNPL: true,
    enableCreditScore: true,
    enableSendMoney: true,
    enableAddBankAccount: true,
    enableStores: true,
    enablePaymentMethods: true,
    enableBundleManagement: false,
  },
};
