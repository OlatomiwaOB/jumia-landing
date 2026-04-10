class RexPayClient {
    private baseUrl: string;
    private credentials: { username: string; password: string };
    private clientId: string;

    constructor(mode: 'live' | 'test' = 'test') {
        this.baseUrl = mode === 'live'
            ? 'https://pgs.globalaccelerex.com/api/'
            : 'https://pgs-sandbox.globalaccelerex.com/api/';

        if (mode === 'live') {
            this.credentials = {
                username: process.env.NEXT_PUBLIC_REXPAY_PROD_USERNAME!,
                password: process.env.NEXT_PUBLIC_REXPAY_PROD_SECRET_KEY!
            };
            this.clientId = process.env.NEXT_PUBLIC_REXPAY_PROD_CLIENT_ID!;
        } else {
            this.credentials = {
                username: process.env.NEXT_PUBLIC_REXPAY_USERNAME!,
                password: process.env.NEXT_PUBLIC_REXPAY_SECRET_KEY!
            };
            this.clientId = process.env.NEXT_PUBLIC_REXPAY_CLIENT_ID!;
        }
    }

    private getAuthHeader(): string {
        return 'Basic ' + btoa(`${this.credentials.username}:${this.credentials.password}`);
    }

    async initializePayment(paymentData: any) {
        const completePayload = {
            reference: paymentData.reference,
            amount: paymentData.amount.toString(),
            currency: paymentData.currency,
            userId: paymentData.userId,
            callbackUrl: paymentData.callbackUrl,
            clientId: this.clientId,
            metadata: paymentData.metadata || {},
            isV2: false,
            paymentChannel: paymentData.paymentChannel || 'DEFAULT',
            country: paymentData.country || 'NGA',
            feeBearer: paymentData.feeBearer || 'Merchant',
            mode: paymentData.mode
        };

        const response = await fetch(`${this.baseUrl}pgs/payment/v2/createPayment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getAuthHeader()
            },
            body: JSON.stringify(completePayload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    async verifyPayment(reference: string) {
        const response = await fetch(`https://cps.globalaccelerex.com/api/cps/v1/getTransactionStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getAuthHeader()
            },
            body: JSON.stringify({ transactionReference: reference })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
}

export default RexPayClient;