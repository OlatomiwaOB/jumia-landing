import { ClientConfig, brandJsonToBranding } from '../client-config.types';
import brand from '../brands/varisa.brand.json';

export const varisaConfig: ClientConfig = {
  branding: brandJsonToBranding(brand),
  identifiers: {
    entityCode: {
      development: 'H2P',
      production: 'H2P', // TODO: Replace with production entity code
    },
    storeCode: {
      development: 'STO7056',
      production: 'STO7056', // TODO: Replace with production store code
    },
  },
  features: {
    enableBNPL: true,
    enableCreditScore: true,
    enableSendMoney: true,
    enableAddBankAccount: true,
    enableStores: true,
    enablePaymentMethods: true,
  },
};
