import { ClientConfig, brandJsonToBranding } from '../client-config.types';
import brand from '../brands/electro.brand.json';

export const electroConfig: ClientConfig = {
  branding: brandJsonToBranding(brand),
  identifiers: {
    entityCode: {
      development: 'ELC',
      production: 'ELC',
    },
    storeCode: {
      development: 'STO0000',
      production: 'STO0000',
    },
    sourceCode: {
      development: 'ELECTRO',
      production: 'ELECTRO'
    }
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
