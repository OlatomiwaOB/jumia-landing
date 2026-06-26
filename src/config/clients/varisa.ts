import { ClientConfig } from '../client-config.types';

export const varisaConfig: ClientConfig = {
  branding: {
    clientName: 'Varisa',
    storefront: 'varisa',
    colors: {
      accent: 'A0522D',
      accentForeground: 'FFFDF5',
      accentColor2: '967BB6',
      accentColor3: '2F3E33',
      dashboardSidebar: '753f26ff',
    },
    logos: {
      primary: 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/80254_varisa.jpeg',
      white: 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/80254_varisa.jpeg',
      whiteFull: 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/80254_varisa.jpeg',
    },
    images: {
      banner: 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/85471_login-image.png',
      favicon: '/favicons/varisa.ico',
    },
    font: { family: 'roboto' },
    metadata: {
      title: 'Varisa',
      description: 'Varisa',
    },
  },
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
