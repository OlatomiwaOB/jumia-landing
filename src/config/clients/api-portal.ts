import { ClientConfig, brandJsonToBranding } from '../client-config.types';
import brand from '../brands/api-portal.brand.json';

export const apiPortalConfig: ClientConfig = {
  branding: brandJsonToBranding(brand),
  identifiers: {
    entityCode: {
      development: 'API',
      production: 'API',
    },
    storeCode: {
      development: 'STO0000',
      production: 'STO0000',
    },
    sourceCode: {
      development: 'api-portal',
      production: 'api-portal',
    },
  },
  features: {
    enableBNPL: false,
    enableCreditScore: false,
    enableSendMoney: false,
    enableAddBankAccount: false,
    enableStores: false,
    enablePaymentMethods: false,
    enableBundleManagement: false,
  },
};
