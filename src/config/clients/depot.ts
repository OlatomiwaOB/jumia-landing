import { ClientConfig } from '../client-config.types';

export const depotConfig: ClientConfig = {
  branding: {
    clientName: 'Depot',
    storefront: 'depot',
    colors: {
      accent: '000000',
      accentForeground: 'ffffff',
      accentColor2: '967BB6',
      accentColor3: '2F3E33',
      dashboardSidebar: '1A1D23',
    },
    logos: {
      primary: 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/66044_direct-logo.png',
      white: 'https://fortitude-anl.s3.eu-west-1.amazonaws.com/31863_direct-white-logo.png',
      whiteFull: 'https://fortitude-anl.s3.eu-west-1.amazonaws.com/33686_direct-white-full-logo.png',
    },
    images: {
      banner: 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/85471_login-image.png',
      favicon: '/favicons/fortitude.ico',
    },
    font: { family: 'roboto' },
    metadata: {
      title: 'DEPOT | Home',
      description: 'Curated essentials for everyday living.',
    },
  },
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
