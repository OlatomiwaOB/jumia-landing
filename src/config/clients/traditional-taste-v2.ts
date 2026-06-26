import { ClientConfig } from '../client-config.types';

export const traditionalTasteV2Config: ClientConfig = {
  branding: {
    clientName: 'Traditional Taste',
    storefront: 'traditional-taste-v2',
    colors: {
      accent: 'F97316',
      accentForeground: 'FFFFFF',
      accentColor2: '967BB6',
      accentColor3: '2F3E33',
      dashboardSidebar: '191970',
    },
    logos: {
      primary: 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/31626_traditional-taste-logo.jpg',
      white: 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/31626_traditional-taste-logo.jpg',
      whiteFull: 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/31626_traditional-taste-logo.jpg',
    },
    images: {
      banner: 'https://mmcpdocs.s3.eu-west-2.amazonaws.com/85471_login-image.png',
      favicon: '/traditional-taste-logo.jpg',
    },
    font: { family: 'roboto' },
    metadata: {
      title: 'Traditional Taste | Home',
      description: 'Traditional Taste Home',
    },
  },
  identifiers: {
    entityCode: {
      development: 'H2P',
      production: 'H2P', // TODO: Replace with production entity code
    },
    storeCode: {
      development: 'STO1575',
      production: 'STO1575', // TODO: Replace with production store code
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
