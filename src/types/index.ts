export interface ProductProps {
  picture?: string;
  id?: number;
  code?: string;
  category?: string;
  topCategory?: string | null;
  name?: string;
  description?: string;
  qtyInStore?: number;
  costPrice?: number;
  salePrice?: number;
  oldPrice?: number;
  ccy?: string;
  pictureList?: string[];
  color?: string;
  itemSize?: string;
  model?: string | null;
  barCode?: string;
  expiryDate?: string | null;
  unit?: string;
  brand?: string;
  usdPrice?: number;
  banner?: boolean;
  featured?: boolean;
  onSale?: boolean;
  discount?: string | number;
  storeCode?: string | null;
  storeName?: string | null;
  storeLocationCity?: string | null;
  imageClass?: string;
  vat?: string | number | null;
  weight?: number | string | null;
  note?: string | null;
  allowedPreferences?: string[] | string | null;
  selectedPreference?: string | null;
  preference?: string | null;
  itemVariants?: {
    id: number,
    size: string,
    qty: number,
    color: string,
    price: number
  }[] | null
}

/** A single sub-item within a bundle, as returned by the API */
export interface BundleSubItem {
  id: number;
  subItemCode: string;
  subItemName: string;
  /** Defaults to 1 when not provided by API */
  minQty: number;
  /** Defaults to 1 when not provided by API */
  maxQty: number;
  price: number;
  /** Defaults to 1 when not provided by API */
  qtyChosen: number;
}

/** Payload for POST /bundles/save */
export interface BundleSavePayload {
  /** The parent bundle product's code */
  bundleItemCode: string;
  /** The parent bundle product's store code */
  storeCode: string;
  subItems: BundleSubItem[];
}


export interface Category {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  sector?: string | null;
  logo?: string;
  tags?: string | null;
  topCategory?: string | null;
  qty?: number | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoggedInUser {
  accountType?: string | null;
  address?: string;
  appMenuList?: any | null;
  appSettingsDto?: any | null;
  appVersion?: string | null;
  branchID?: string;
  branchName?: string;
  businessName?: string;
  ccy?: string;
  country?: string;
  creditWallet?: boolean;
  customerTier?: string | null;
  deviceID?: string;
  email?: string;
  entityCode?: string;
  entityLogo?: string;
  entityName?: string;
  entityStyle?: string | null;
  entityType?: string;
  expiryDate?: string | null;
  externalAccount?: any | null;
  firstname?: string | null;
  forcePwdChange?: string;
  fullname?: string;
  hardTokenOtpValid?: boolean | null;
  language?: string | null;
  lastLoginDate?: string;
  medium?: string | null;
  menuInfoList?: any | null;
  merchantCode?: string;
  merchantGroupCode?: string;
  messageActionDto?: any | null;
  metaData?: any | null;
  mobileNo?: string;
  paymentMethodAllowed?: any | null;
  photoLinks?: any | null;
  pwd?: string;
  referalCode?: string;
  refreshToken?: string | null;
  responseCode?: string;
  responseMessage?: string;
  retryNo?: number;
  softTokenQrCodeLink?: string | null;
  storeCode?: string | null;
  supervisor?: string;
  supervisorPassword?: string | null;
  terminalId?: string;
  ticketID?: string;
  twoFactorLimit?: number;
  twoFactorType?: string;
  userID?: string;
  userPermissionList?: any | null;
  userRole?: string;
  userRoles?: any | null;
  username?: string;
  walletAcc?: string;
  walletBalance?: number;
  walletType?: number;
  twoFaLinked?: string;
  pinSet?: boolean;
  twoFaSetupRequired?: 'Y' | 'N' | null;
  twoFaLinkData?: string | null;
  twoFaReferenceNo?: string | null;
  subscriptionTierCode?: string;
  subscriptionType?: string;
  userPermissions: string[]
}

export interface UserProfile {
  username?: string;
  userRole?: string;
  entityCode?: string;
  entityName?: string;
  entityLogo?: string;
  language?: string;
  retryNo?: number;
  ticketID?: string;
  deviceID?: string;
  responseMessage?: string;
  responseCode?: string;
  fullname?: string;
  appVersion?: string | null;
  email?: string;
  mobileNo?: string;
  lastLoginDate?: string | null;
  photoLink?: string;
  firstname?: string;
  ccy?: string;
  country?: string;
  forcePwdChange?: string;
  referalCode?: string;
  partnerLink?: string;
  customerId?: string;
  customerTier?: string;
  kycStatus?: string[] | null;
  kycTierStatus?: string;
  notificationMessage?: string | null;
  chatSessionToken?: string;
  onboardType?: string | null;
  pinSet?: boolean;
  twoFaSetupRequired?: 'Y' | 'N' | null;
  twoFaLinkData?: string | null;
  twoFaReferenceNo?: string | null;
  storeCode?: string | null;
  merchantCode?: string | null;
  twoFaLinked?: 'Y' | 'N';
  lastname?: string;
  merchantGroupCode?: string;
  userPermissions: string[]
}

export interface Attachment {
  thumbnail: string;
  original: string;
  id?: string;
}

export interface PaymentPlanResponse {
  responseCode: string;
  responseMessage: string;
  paymentPlanSummary: PaymentPlanSummary;
}

export interface PaymentPlanSummary {
  orderId: string;
  totalAmount: number;
  totalAmountDisplay: string;
  currency: string;
  installments: Installment[];
  paymentPlanText: string;
  firstPaymentDate: string;
  installmentAmount: number;
  installmentAmountDisplay: string;
  creditLimitUsed: string;
  remainingCreditLimit: string;
}

export interface Installment {
  installmentNumber: number;
  scheduleDate: string;
  scheduleAmount: number;
  paymentStatus: string;
  paymentRef: string;
  scheduleDisplayText: string;
  amountDisplay: string;
}

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'upcoming';

export interface PaymentRequest {
  orderId: string;
  paymentRef: string;
  amount: number;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}


export interface ScoreDetail {
  parameterCode: string;
  parameterName: string;
  weight: number;
  score: number;
  comment: string;
}

export interface CreditScoreResponse {
  responseCode: string;
  responseMessage: string;
  username: string;
  entityCode: string;
  scoreDetails: ScoreDetail[];
  rating: string;
  totalScore: number;
  approvedAmount: number;
}

export type ScoreRating = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';

export interface ScoreConfig {
  rating: ScoreRating;
  color: string;
  description: string;
  minScore: number;
  maxScore: number;
}

export interface SelectOption {
  id: string;
  name: string;
  lookupCode?: string;
  description: string;
}

export interface PaymentMethod {
  paymentType: string;
  serviceProvider: string;
  code: string;
  name: string;
  description: string;
  country: string;
  status: string;
  fee: string;
  vat: string | null;
  feeType: "FLAT" | "PERCENT";
  discount: string | null;
  entityCode: string;
  logo: string;
  isRecommended: boolean;
  recommendedTitle: string | null;
  subTitle: string;
  features: string[];
  storeCode?: string | null
}

export interface PaymentMethodsResponse {
  responseCode: string;
  responseMessage: string;
  list: PaymentMethod[];
}

export interface EcomComponent {
  id: number;
  componentType: 'BANNER' | 'CONTENT';
  merchantId: string;
  storeCode: string;
  entityCode: string;
  code: string;
  title: string;
  detail: string;
  subTitle: string;
  link: string;
  image1: string;
  image2: string;
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  modifiedBy: string;
}

export interface EcomComponentListResponse {
  totalCount: number;
  totalPages: number;
  responseCode: string;
  responseMessage: string;
  data: EcomComponent[];
}

export interface EcomComponentSavePayload {
  componentType: 'BANNER' | 'CONTENT';
  title: string;
  detail: string;
  subTitle?: string;
  link?: string;
  image1?: string;
  image2?: string;
  storeCode: string;
  entityCode?: string;
  merchantId?: string;
  createdBy?: string;
}

export interface EcomComponentSaveResponse {
  code: string;
  desc: string;
  nextURL: string;
  id: string;
  refNo: string;
  amount: number;
  code3: string;
  listData: Record<string, unknown>[];
}
