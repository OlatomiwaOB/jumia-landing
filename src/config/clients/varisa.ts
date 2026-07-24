import { ClientConfig, brandJsonToBranding } from '../client-config.types';
import brand from '../brands/varisa.brand.json';

export const varisaConfig: ClientConfig = {
  branding: brandJsonToBranding(brand),
  identifiers: {
    entityCode: {
      development: 'H2P',
      production: 'VAR',
    },
    storeCode: {
      development: 'STO7056',
      production: 'STO7056',
    },
    sourceCode: {
      development: 'HELP2PAY',
      production: 'VARISSA'
    }
  },
  features: {
    enableBNPL: true,
    enableCreditScore: true,
    enableSendMoney: true,
    enableAddBankAccount: true,
    enableStores: true,
    enablePaymentMethods: true,
    enableBundleManagement: true,
    enablePickupLocation: true,
    enableQtyInStoreView: false,
    enableAllowPreferenceSettings: true,
    enablePickupLocationDistance: false
  },
};
