export interface PaymentDataField {
    id?: number;
    fieldID?: string;
    fieldName: string;
    fieldDescription?: string;
    fieldComment?: string;
    fieldDataType: string;
    fieldValue?: string;
    maxLength: number;
    mandatoryFlag: string;
    inputOrOutput: string;
    lookupData?: string;
    billerCode?: string;
    value?: string;
}

export interface BillerPriceItem {
    amount: number;
    description: string;
}

export interface BillerProduct {
    id: number;
    productId: string;
    productCode: string;
    productDesc: string;
    productName: string;
    amount: number;
    amountType: string;
    charge: number;
    chargeType: string;
    status: string;
    paymentCode: string;
    paymentCode2: string;
    paymentCode3: string;
    billerCode: string;
    serviceProvider: string;
    costPrice: number;
    minAmount: number;
    maxAmount: number;
    agentCommission: number;
    networkCommission: number;
    serviceProviderCommission: number;
    platformCommission: number;
    aggregatorCommission: number;
    settlementBankCode: string;
    settlementBankName: string;
    settlementAccountNo: string;
    settlementAccountName: string;
}

export interface Biller {
    entityCode?: string;
    billerShortName?: string;
    contactEmail?: string;
    billerRef?: string;
    id?: number;
    serviceProvider?: string;
    products?: BillerProduct[];
    paymentData?: PaymentDataField[];
    agentCommission?: number;
    networkCommission?: number;
    serviceProviderCommission?: number;
    platformCommission?: number;
    aggregatorCommission?: number;
    purchaseCommission?: number;
    sharingType?: string;
    merchantGroupCode?: string;
    merchantCode?: string;
    validationRequired?: string;
    denominations?: string[];
    billerCode: string;
    billerName: string;
    billerLogo?: string;
    logoURL?: string;
    billerDescription: string;
    billerCategory: string;
    billerCategoryCode: string;
    countryCode?: string;
    country?: string;
    ccy: string;
    amountType: string;
    amount?: number;
    minAmount?: number;
    maxAmount?: number;
    fee?: number;
    priceList?: BillerPriceItem[];
    paymentDataList?: PaymentDataField[];
    status: string;
}

export interface BillerCategory {
    id: number | null;
    countryCode: string | null;
    status: 'Active' | 'Inactive' | null;
    billerCategoryCode: string;
    billerCategoryName: string;
    billerCategoryDescription: string;
    logoURL: string;
}

export interface ValidateBillRequest {
    billerCode: string | null;
    // billRefNo?: string;
    amount: number;
    // paymentDataList?: PaymentDataField[];
    entityCode: string | null;
    mobileNo: string;
    productCode: string;
    countryCode: string;
}

export interface ValidateBillHeaderInfo {
    responseCode: string;
    responseMessage: string;
    messageDesc: string;
    requestId: string;
    sourceCode: string;
    requestToken: string;
    accountNo: string;
    status: string;
}

export interface ValidateBillResponse {
    headerInfo?: ValidateBillHeaderInfo;
    billerCode: string;
    productCode?: string;
    customerName: string;
    billerCustomerName?: string;
    customerRef?: string;
    customerNo?: string;
    billDetail?: string;
    amount: number;
    partialAllowed?: string;
    amountType?: string;
    status?: string;
    responseCode: string;
    responseMessage: string;
    mobileNo?: string;
    emailID?: string;
    meterNo?: string;
    fee: number;
    agentCommission?: number;
    ccyCode?: string;
    address?: string;
    paymentDataList?: PaymentDataField[];
}

// ─── Post Bill Payment ──────────────────────────────────────────────────

export interface BillPaymentRequest {
    externalRefNo: string;
    billerCode: string;
    billerName: string;
    billRefNo: string;
    amount: number;
    fee: number;
    totalAmount: number;
    customerName: string;
    paymentMethod: 'CRYPTO' | 'CARD' | 'TRANSFER';
    ccy: string;
    entityCode: string;
    paymentDataList?: PaymentDataField[];
}

export interface BillPaymentResponse {
    responseCode: string;
    responseMessage: string;
    externalRefNo: string;
    transactionRef: string;
}

export interface VirtualAccount {
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
    bankLogo?: string;
    expiryTime?: string;
}

export interface CollectionPaymentDto {
    transactionRef: string;
    amount: number;
    fee: number;
    totalAmount: number;
    ccy: string;
    paymentMethod: string;
    paymentStatus: string;
    paymentDate: string;
}

export interface PrintLine {
    label: string;
    value: string;
}

export interface PaymentStatusResponse {
    responseCode: string;
    responseMessage: string;
    externalRefNo: string;
    collectionPaymentDto: CollectionPaymentDto;
    virtualAccount?: VirtualAccount;
    printLines?: PrintLine[];
}

export interface BillCheckoutItem extends ValidateBillResponse {
    id: string; // unique: `${billerCode}_${billRefNo}`
    billerName: string;
    billerLogo: string;
    billerCategory: string;
    billRefNo: string;
    totalAmount: number;
    ccy: string;
    validated: boolean;
}

export type BillPaymentStep = 'browse' | 'cart' | 'checkout' | 'processing' | 'success' | 'failure';
export type BillPaymentMethodType = 'CRYPTO' | 'CARD' | 'TRANSFER' | null;
export type CryptoChain = 'EVM' | 'TRON';
