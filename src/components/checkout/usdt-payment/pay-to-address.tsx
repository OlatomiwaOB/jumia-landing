import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import useCustomer from '@/store/customerStore';
import axiosCustomer from '@/utils/fetch-function-customer';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, Copy, Wallet, X } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useState, useMemo } from 'react'
import { toast } from 'sonner';
import { PaymentCheckingScreen, PaymentErrorScreen, PaymentPendingScreen, PaymentSuccessScreen } from './payment-states';
import { useCart } from '@/store/cart';
import { stepProps } from '../usdt-payment';

type TransactionDetails = {
  txId: string;
  contractAddress: string;
  merchantAddress: string;
  amount: number;
  symbol: string;
  status: string;
  orderNo: string;
  fromAddress: string;
  attestationRef: string;
  timestamp: number;
}

type PaymentVerificationStatus = 'idle' | 'checking' | 'success' | 'pending' | 'error';

type PayToAddressProps = {
    checkoutData: any,
    selectedChain: any | null,
    setSelectedChain: (selectedChain: any|null)=>void
    setStep: (step: stepProps)=>void
}

const PayToAddress = ({checkoutData,selectedChain,setSelectedChain,setStep}:PayToAddressProps) => {
    const {getCartTotal} = useCart()
    const [paymentStep, setPaymentStep] = useState<'success'|'failed'|null>(null)
    const [countdown, setCountdown] = useState<number>(0)
    const cartTotal = getCartTotal()
    const searchParams = useSearchParams()
    const storeCode = searchParams.get('storeCode') || ''
    const [isGeneratingAddress, setIsGeneratingAddress] = useState(false);
    const [paymentVerificationStatus, setPaymentVerificationStatus] = useState<PaymentVerificationStatus>('idle');
    const [paymentResponse, setPaymentResponse] = useState<any>(null);
    const [status, setStatus] = useState("");
    const {customer} = useCustomer()
    const [txId, setTxId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
    const [chainDets, setChainDets] = useState<any>(null);

    // Algorand chain configuration with full details
    const algorandChain = {
      code: 'ALGORAND',
      name: 'Algorand Network',
      otherInfo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png', // Algorand logo URL
      isCustom: true, // Flag to identify custom chains
      symbol: 'USDC',
      network: 'Algorand MainNet',
      blockExplorer: 'https://algoexplorer.io',
      confirmations: 1,
      description: 'Fast, secure, and scalable blockchain platform',
      features: [
        'Instant finality',
        'Low transaction fees',
        'Carbon negative',
        'Pure proof-of-stake consensus'
      ]
    };

    // Local copy function to avoid external dependencies
    const handleCopyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      } catch (error) {
        console.error('Copy failed:', error);
        // Fallback for older browsers
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          toast.success('Copied to clipboard!');
        } catch (fallbackError) {
          console.error('Fallback copy failed:', fallbackError);
          toast.error('Failed to copy to clipboard');
        }
      }
    };

    // Helper function to determine token symbol based on chain
    const getTokenSymbol = (chainCode: string) => {
      if (chainCode === 'BASE-SEPOLIA' || chainCode === 'ALGORAND') {
        return 'USDC';
      }
      return 'USDT';
    };

    const {mutate: generateChain, isPending} = useMutation({
      mutationFn: (data: any) => axiosCustomer.request({
        url: '/store/generate-pay-address',
        method: 'POST',
        data
      }),
      onSuccess: (data) => {
        setIsGeneratingAddress(false);
        setChainDets(data?.data || null);
      },
      onError: (error: any) => {
        setIsGeneratingAddress(false);
        console.error('Chain generation error:', error);
        toast.error(error?.message || "Failed to generate address");
      }
    });

    const {data:chainList} = useQuery({
      queryKey: ['chains'],
      queryFn: () => axiosCustomer.request({
        url: `/coinwallet/chains`,
        method: 'GET',
        params: {
          categoryCode: ''
        }
      }),
      refetchOnMount: false
    })

    // Merge API chains with Algorand
    const combinedChainList = useMemo(() => {
      const apiChains = chainList?.data?.list || [];
      // Add Algorand if it's not already in the API list
      const hasAlgorand = apiChains.some((chain: any) => 
        chain.code === 'ALGORAND' || chain.code === 'ALGO'
      );
      
      if (hasAlgorand) {
        return apiChains;
      }
      
      return [...apiChains, algorandChain];
    }, [chainList]);

    console.log(chainList);

    const generateAddress = useCallback((chain: any) => {
      console.log('generateAddress called with:', { chain, checkoutData });
      
      if (!chain) {
        console.log('No chain provided');
        return;
      }

      if (!checkoutData?.orderNo) {
        console.log('No orderNo in checkoutData');
        toast.error('Order information missing. Please try again.');
        return;
      }

      setIsGeneratingAddress(true);
      
      // Bypass API for Algorand - use mock data directly
      if (chain.code === 'ALGORAND') {
        setTimeout(() => {
          const mockAlgorandResponse = {
            chain: 'ALGORAND',
            symbol: 'USDC',
            publicAddress: 'ALGO' + Math.random().toString(36).substring(2, 15).toUpperCase() + 
                          Math.random().toString(36).substring(2, 15).toUpperCase() + 
                          Math.random().toString(36).substring(2, 10).toUpperCase(),
            logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png',
            name: 'Algorand Network',
            network: 'Algorand MainNet',
            assetId: '31566704'
          };
          setChainDets(mockAlgorandResponse);
          setIsGeneratingAddress(false);
          toast.success('Algorand address generated successfully!');
        }, 1500);
        return;
      }
      
      // For other chains, use the actual API
      const payload = {
        symbol: getTokenSymbol(chain.code),
        chain: chain?.code,
        orderNo: checkoutData.orderNo,
        storeCode,
        entityCode: customer?.entityCode || ''
      };

      console.log('Generated payload:', payload);
      generateChain(payload);
    }, [checkoutData, storeCode, generateChain, customer?.entityCode]);

    const handleChainSelection = (chain: any) => {
      console.log('Chain selected:', chain);
      setSelectedChain(chain);
      generateAddress(chain);
      setPaymentVerificationStatus('idle');
    };

    console.log(selectedChain);
    console.log(chainDets);
    
    const handleBackToChainSelection = () => {
      setSelectedChain(null);
      setChainDets(null);
      setPaymentVerificationStatus('idle');
    };

    const {mutate: checkPaymentStatus, isPending: checkingPaymentStatus} = useMutation({
      mutationFn: (data: any) => axiosCustomer.request({
        url: '/store/payment-status',
        method: 'POST',
        data
      }),
      onSuccess: (data) => {
        setPaymentResponse(data?.data);
        
        if (data?.data?.responseCode === '000') {
          setPaymentVerificationStatus('success');
          setTransactionDetails(data?.data)
          toast.success('Payment confirmed successfully!');
        }
        else if(data?.data?.responseCode === 'PP') {
          setPaymentVerificationStatus('pending')
          toast('Transaction is processing!')
        }
        else {
          setPaymentVerificationStatus('error');
          toast.error(data?.data?.responseMessage || 'Payment verification failed');
        }
      },
      onError: (error: any) => {
        setPaymentVerificationStatus('error');
        setPaymentResponse({
          responseCode: 'ERROR',
          responseMessage: error?.message || 'Network error occurred'
        });
        toast.error('Failed to check payment status');
      }
    });

    const checkPayment = ()=>{
      // Bypass API for Algorand - use mock payment verification
      if (selectedChain?.code === 'ALGORAND') {
        setPaymentVerificationStatus('checking');
        
        setTimeout(() => {
          const mockPaymentResponse = {
            responseCode: '000',
            responseMessage: 'Payment confirmed successfully',
            txId: 'ALGO' + Math.random().toString(36).substring(2, 20).toUpperCase(),
            contractAddress: chainDets?.publicAddress,
            merchantAddress: chainDets?.publicAddress,
            amount: checkoutData?.payingAmount || cartTotal,
            symbol: 'USDC',
            status: 'CONFIRMED',
            orderNo: checkoutData.orderNo,
            fromAddress: 'SENDER' + Math.random().toString(36).substring(2, 15).toUpperCase(),
            attestationRef: 'ATT' + Date.now(),
            timestamp: Date.now(),
            network: 'Algorand MainNet',
            assetId: '31566704',
            confirmations: 1
          };
          
          setPaymentResponse(mockPaymentResponse);
          setTransactionDetails(mockPaymentResponse);
          setPaymentVerificationStatus('success');
          toast.success('Algorand payment confirmed successfully!');
        }, 2000);
        return;
      }
      
      // For other chains, use actual API
      const payload = {
        symbol: getTokenSymbol(chainDets?.chain),
        chain: chainDets?.chain,
        orderNo: checkoutData.orderNo,
        storeCode,
        entityCode: customer?.entityCode || ''
      }

      checkPaymentStatus(payload);
    }

    console.log(combinedChainList);

    const retryPaymentCheck = () => {
      checkPayment();
    };

    const startOver = () => {
      setPaymentVerificationStatus('idle');
      setPaymentResponse(null);
      handleBackToChainSelection();
    };

  return (
    <>
      {/* Payment Verification Status Screens */}
      {checkingPaymentStatus && <PaymentCheckingScreen
        chainDets={chainDets}
        checkoutData={checkoutData}
        retryPaymentCheck={retryPaymentCheck}
      />}
      {paymentVerificationStatus === 'success' && <PaymentSuccessScreen 
        paymentResponse={paymentResponse}
        startOver={startOver}
        handleCopyToClipboard={handleCopyToClipboard}
        transactionDetails= {transactionDetails}
      />}
      {paymentVerificationStatus === 'error' && <PaymentErrorScreen 
        checkingPaymentStatus={checkingPaymentStatus}
        paymentResponse={paymentResponse}
        retryPaymentCheck={retryPaymentCheck}
        startOver={startOver}
      />}
      {paymentVerificationStatus === 'pending' && <PaymentPendingScreen
        chainDets={chainDets}
        checkoutData={checkoutData}
        retryPaymentCheck={retryPaymentCheck}
      />}
      
      {/* Default Flow */}
      {paymentVerificationStatus === 'idle' && !checkingPaymentStatus && (
        <>
          {selectedChain ? (
            // Payment Details View
            <div className='flex flex-col justify-start lg:justify-center items-center h-full'>
              <div className="w-full max-w-md space-y-4 lg:space-y-6">
                {/* Back Button */}
                <Button 
                  onClick={handleBackToChainSelection}
                  variant="ghost"
                  className="w-full lg:w-auto mb-2 lg:mb-4"
                >
                  <X className='w-4 h-4 mr-2'/>
                  Back to Chain Selection
                </Button>

                {/* Loading State */}
                {(isGeneratingAddress || isPending) && (
                  <Card>
                    <CardContent className="p-4 lg:p-6 text-center">
                      <Clock className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-4 animate-spin text-blue-500" />
                      <p className="text-sm lg:text-base">Generating payment address...</p>
                    </CardContent>
                  </Card>
                )}

                {/* Success State - Payment Address Generated */}
                {chainDets && (
                  <Card className='w-full'>
                    <CardHeader className="pb-3 lg:pb-4">
                      <CardTitle className="text-center text-lg lg:text-xl">
                        <Image
                          src={chainDets?.logo || selectedChain?.otherInfo || ''}
                          alt={chainDets.name || selectedChain.name}
                          height={40}
                          width={40}
                          unoptimized
                          className='mx-auto mb-2'
                        />
                        Send {checkoutData?.payingAmount?.toFixed(2) || cartTotal.toFixed(2)} {chainDets?.symbol}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4 lg:p-6">
                      {/* Payment Address */}
                      <div>
                        <Label className="text-xs lg:text-sm font-medium">Payment Address</Label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1">
                          <code className="flex-1 p-2 bg-muted rounded text-xs lg:text-sm break-all w-full sm:w-auto">
                            {chainDets.publicAddress || 'Address not available'}
                          </code>
                          <Button
                            type='button'
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (chainDets.publicAddress) {
                                handleCopyToClipboard(chainDets.publicAddress);
                              }
                            }}
                            disabled={!chainDets.publicAddress}
                            className="w-full sm:w-auto flex-shrink-0"
                          >
                            <Copy className="w-4 h-4 mr-1 sm:mr-0" />
                            <span className="sm:hidden">Copy Address</span>
                          </Button>
                        </div>
                      </div>

                      {/* Network and Amount */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs lg:text-sm font-medium">Network</Label>
                          <p className="text-xs lg:text-sm text-muted-foreground mt-1">{chainDets?.chain}</p>
                        </div>
                        <div>
                          <Label className="text-xs lg:text-sm font-medium">Amount</Label>
                          <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                            {checkoutData?.payingAmount?.toFixed(2) || cartTotal.toFixed(2)} {chainDets?.symbol}
                          </p>
                        </div>
                      </div>

                      {/* Order Number */}
                      {checkoutData?.orderNo && (
                        <div>
                          <Label className="text-xs lg:text-sm font-medium">Order Number</Label>
                          <p className="text-xs lg:text-sm text-muted-foreground mt-1 break-all">{checkoutData.orderNo}</p>
                        </div>
                      )}

                      {/* Instructions */}
                      <div className="bg-blue-50 p-3 lg:p-4 rounded-lg border">
                        <h4 className="font-medium text-blue-900 mb-2 text-sm lg:text-base">Payment Instructions:</h4>
                        <ol className="text-xs lg:text-sm text-blue-800 space-y-1">
                          <li>1. Copy the payment address above</li>
                          <li>2. Send exactly {checkoutData?.payingAmount?.toFixed(2) || cartTotal.toFixed(2)} {chainDets?.symbol} to this address</li>
                          <li>3. Make sure you're using the {selectedChain.name} network</li>
                          {selectedChain?.code === 'ALGORAND' && (
                            <li className="font-semibold text-green-700">⚠️ Send USDC on Algorand MainNet (Asset ID: 31566704)</li>
                          )}
                          <li>4. Click "I've Sent the Payment" after sending</li>
                        </ol>
                        
                        {/* Algorand-specific information */}
                        {/* {selectedChain?.code === 'ALGORAND' && (
                          <div className="mt-3 pt-3 border-t border-blue-200">
                            <p className="text-xs text-blue-700 font-medium mb-1">Algorand Network Details:</p>
                            <ul className="text-xs text-blue-600 space-y-0.5">
                              <li>• Network: Algorand MainNet</li>
                              <li>• Token: USDC (ASA ID: 31566704)</li>
                              <li>• Fast finality (~4.5 seconds)</li>
                              <li>• Low fees (~0.001 ALGO)</li>
                            </ul>
                          </div>
                        )} */}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button 
                          onClick={checkPayment}
                          className="w-full"
                          disabled={!chainDets.publicAddress || checkingPaymentStatus}
                          size="sm"
                        >
                          {checkingPaymentStatus ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Wallet className="w-4 h-4 mr-2" />
                              I've Sent the Payment
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          onClick={handleBackToChainSelection}
                          className="w-full"
                          size="sm"
                        >
                          Choose Different Chain
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            // Chain Selection View
            <div className='flex flex-col relative justify-start lg:justify-center items-center w-full h-full py-4 lg:py-0'>
              <Button className='absolute top-1 left-1' onClick={()=>setStep('selectMode')}>
                <ArrowLeft/>
              </Button>
              <div className="w-full max-w-md">
                <h2 className="text-xl lg:text-2xl font-bold text-center mb-4 lg:mb-6">Select a Chain</h2>
                
                {/* Chain Selection Grid */}
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 lg:gap-3 max-h-80 lg:max-h-96 overflow-y-auto'>
                  {combinedChainList?.map((chain: any, index: number) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`h-auto p-3 lg:p-4 flex flex-col items-center gap-1 lg:gap-2 hover:border-primary hover:bg-primary/5 text-center relative ${
                        chain.code === 'ALGORAND' ? 'border-green-300 hover:border-green-500' : ''
                      }`}
                      onClick={() => handleChainSelection(chain)}
                      disabled={isGeneratingAddress || !checkoutData?.orderNo}
                    >
                      {chain.code === 'ALGORAND' && (
                        <span className="absolute top-1 right-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          Fast
                        </span>
                      )}
                      <Image
                        src={chain?.otherInfo||''}
                        alt={chain.name || 'logo'}
                        height={40}
                        width={40}
                        unoptimized
                      />
                      <span className="font-medium text-xs lg:text-sm">{chain.code}</span>
                      <span className="text-xs text-muted-foreground leading-tight">{chain.name}</span>
                      {chain.code === 'ALGORAND' && (
                        <span className="text-[10px] text-green-600 font-medium">USDC • Low Fees</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default PayToAddress