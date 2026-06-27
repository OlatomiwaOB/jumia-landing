import { ClientConfig, brandJsonToBranding } from '../client-config.types';
import brand from '../brands/vogue.brand.json';

export const vogueConfig: ClientConfig = {
  branding: brandJsonToBranding(brand),
  identifiers: {
    entityCode: {
      development: 'FTD',
      production: 'FTD', // TODO: Replace with production entity code
    },
    storeCode: {
      development: 'STO4122',
      production: 'STO4122', // TODO: Replace with production store code
    },
  },
  features: {
    enableBNPL: false,
    enableCreditScore: false,
    enableSendMoney: false,
    enableAddBankAccount: false,
    enableStores: false,
    enablePaymentMethods: false,
  },
};
