'use client'

/* ------------------------- Lazy Loaded Components ------------------------- */
import dynamic from 'next/dynamic'

const Loader = dynamic(() => import('@/components/ui/loader'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading...</div>,
})

const ErrorMessage = dynamic(() => import('@/components/ui/error-message'), {
  ssr: false,
})



const FaceLivenessDetector = dynamic(
  () => import('@aws-amplify/ui-react-liveness').then(m => m.FaceLivenessDetector),
  { ssr: false }
)

/* ------------------------- Lazy Loaded Icons ------------------------- */
const AlertCircle = dynamic(
  () => import('lucide-react').then(m => m.AlertCircle),
  { ssr: false }
)

const Clock = dynamic(
  () => import('lucide-react').then(m => m.Clock),
  { ssr: false }
)

/* ------------------------- Normal Imports ------------------------- */
import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from 'aws-amplify'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import axiosInstanceNoAuth from '@/utils/fetch-function-no-auth'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'


Amplify.configure({
  Auth:{
    Cognito:{
      identityPoolId:'us-east-1:95edaa87-7402-497b-93c0-2718c509ee5d',
      allowGuestAccess:true,
      region: 'us-east-1'
    }
  }
})

const LivenessCheckPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any|null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [credentialsReady, setCredentialsReady] = useState(false);
  const [clockSkewDetected, setClockSkewDetected] = useState(false);
  const MAX_RETRIES = 3;

  const id = searchParams.get('livenessId')

  // Initialize credentials with clock skew handling
  useEffect(() => {
    const initializeCredentials = async () => {
      try {
        // console.log('Fetching fresh credentials...');
        // console.log('Current device time:', new Date().toISOString());
        await fetchAuthSession({ forceRefresh: true });
        // console.log('Credentials obtained successfully');
        setCredentialsReady(true);
      } catch (error) {
        console.error('Failed to get credentials:', error);
        toast.error('Failed to initialize authentication');
      }
    };

    initializeCredentials();
  }, []);

  // Create session API call
  const createSessionMutation = useMutation({
    mutationFn: async (livenessId: string) => {
      const request = await axiosInstanceNoAuth.request({
        method: 'POST',
        url: `/liveness/create-session`,
        params: { livenessId }
      });
      
      const response = request?.data;
      
      if (response?.status !== 'SUCCESS') {
        throw new Error(response?.desc || 'Failed to create session');
      }
      
      return response;
    },
    onSuccess: (data) => {
      // console.log('Session created successfully:', data);
      setClockSkewDetected(false); // Reset clock skew flag on success
    },
    onError: (error: any) => {
      console.error('Session creation error:', error);
      
      // Check for clock skew errors
      const errorMessage = error?.response?.data?.message || error?.message || '';
      const isClockSkewError = 
        errorMessage.includes('Signature expired') ||
        errorMessage.includes('InvalidSignatureException') ||
        error?.response?.status === 403;
      
      if (isClockSkewError) {
        setClockSkewDetected(true);
        toast.error('Device time synchronization error detected');
      } else if (error?.response?.data) {
        if (error.response.status === 400) {
          const errorMsg = 'Bad request: ' + (error.response.data.message || 'Unknown error');
          toast.error(errorMsg);
        } else if (error.response.status === 422) {
          toast.error('Validation error: Unable to create liveness session');
        } else if (error.response.status === 500) {
          toast.error('Server error: Unable to create liveness session');
        } else {
          toast.error('Error creating liveness session');
        }
      } else {
        toast.error(error.message || 'Network error: Unable to create liveness session');
      }
    }
  });

  // Get analysis result API call
  const getResultMutation = useMutation({
    mutationFn: async ({ sessionId, livenessId }: { sessionId: string, livenessId: string }) => {
      const request = await axiosInstanceNoAuth.request({
        method: 'GET',
        url: `/liveness/get-result/${sessionId}`,
        params: { sessionId, livenessId }
      });

      if (request?.data?.responseCode !== '000') {
        throw new Error(request?.data?.responseMessage || 'Failed to get result');
      }
      
      return request.data;
    },
    onSuccess: (data) => {
      // console.log('Analysis result:', data);
      
      // Check if the person is live
      if (data.live === false) {
        // console.log('Liveness check failed - not live, attempting retry...');
        
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          toast.warning(`Liveness verification failed. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
          
          // Auto-retry after a short delay
          setTimeout(() => {
            handleRetry();
          }, 2000);
        } else {
          // Max retries reached, show failure state
          setAnalysisResult(data);
          setIsAnalysisComplete(true);
          toast.error('Liveness verification failed after multiple attempts. Please try again manually.');
        }
      } else {
        // Successful verification
        setAnalysisResult(data);
        setIsAnalysisComplete(true);
        setRetryCount(0); // Reset retry count on success
        toast.success(data?.responseMessage || 'Verification successful!');
      }
    },
    onError: (error: any) => {
      console.error('Analysis completion error:', error);
      toast.error(error.message || 'Failed to complete analysis');
    }
  });

  // Trigger session creation when credentials are ready
  useEffect(() => {
    if (id && !createSessionMutation.data && !createSessionMutation?.isPending && credentialsReady) {
      createSessionMutation.mutate(id as string);
    }
  }, [id, credentialsReady]);

  const handleAnalysisComplete = async () => {
    if (createSessionMutation.data?.sessionId && id) {
      // console.log('Liveness check completed');
      getResultMutation.mutate({
        sessionId: createSessionMutation.data.sessionId,
        livenessId: id as string
      });
    }
  };

  const handleError = async (error: any) => {
    console.error('Liveness detector error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    console.error('Current device time:', new Date().toISOString());
    
    // Check for clock skew errors
    const isClockSkewError = 
      error?.error?.name === 'InvalidSignatureException' ||
      error?.error?.message?.includes('Signature expired') ||
      error?.message?.includes('Signature expired') ||
      error?.state === 'SERVER_ERROR';
    
    if (isClockSkewError) {
      // console.log('Clock skew error detected, attempting credential refresh...');
      setClockSkewDetected(true);
      
      try {
        // Try to refresh credentials
        await fetchAuthSession({ forceRefresh: true });
        toast.error('Time synchronization issue detected. Please check your device time settings and try again.');
      } catch (refreshError) {
        console.error('Failed to refresh credentials:', refreshError);
        toast.error('Your device time appears to be incorrect. Please sync your system clock.');
      }
      
      return;
    }
    
    if (error?.message) {
      toast.error(`Liveness check failed: ${error.message}`);
    } else if (error?.code) {
      toast.error(`Error code: ${error.code}`);
    } else {
      toast.error('Something went wrong during liveness check!');
    }
  };

  const handleRetry = async () => {
    setIsAnalysisComplete(false);
    setAnalysisResult(null);
    setClockSkewDetected(false);
    
    // Refresh credentials before retry
    try {
      await fetchAuthSession({ forceRefresh: true });
    } catch (error) {
      console.error('Failed to refresh credentials on retry:', error);
    }
    
    // Reset mutations and create new session
    createSessionMutation.reset();
    getResultMutation.reset();
    
    if (id) {
      createSessionMutation.mutate(id as string);
    }
  };

  // Show error if no livenessId in query
  if (!id) {
    return <ErrorMessage message="No liveness ID provided in URL" />;
  }

  // Show error if session creation failed
  if (createSessionMutation.isError && !clockSkewDetected) {
    return <ErrorMessage message={createSessionMutation.error?.message || 'Failed to create session'} />;
  }

  // Show loading while creating session
  const isLoading = createSessionMutation.isPending || getResultMutation.isPending || !credentialsReady;

  // console.log(isLoading);

  return (
    <ThemeProvider>
      {isLoading ? (
        <div className='w-screen flex items-center justify-center'>
          <Loader text={!credentialsReady ? 'Initializing...' : 'Please wait...'} />
        </div>
      ) : (
        <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Identity Verification
              </h1>
              <p className="text-gray-600">
                {isAnalysisComplete 
                  ? (analysisResult?.live ? "Verification completed successfully!" : "Verification failed - please try again")
                  : "Please position your face in the camera frame to begin verification"
                }
              </p>
              {retryCount > 0 && !isAnalysisComplete && (
                <p className="text-orange-600 text-sm mt-2">
                  Retry attempt {retryCount}/{MAX_RETRIES}
                </p>
              )}
            </div>

            {/* Clock Skew Warning */}
            {clockSkewDetected && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                      Device Time Synchronization Issue
                    </h3>
                    <p className="text-sm text-yellow-700 mb-3">
                      Your device clock may not be synchronized correctly. This can prevent verification from working properly.
                    </p>
                    
                    <div className="text-sm text-yellow-800 space-y-2">
                      <p className="font-semibold">How to fix:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                        <li><strong>Windows:</strong> Settings → Time & Language → Date & Time → Set time automatically</li>
                        <li><strong>Mac:</strong> System Preferences → Date & Time → Set date and time automatically</li>
                        <li><strong>Android:</strong> Settings → Date & Time → Automatic date & time</li>
                        <li><strong>iOS:</strong> Settings → General → Date & Time → Set Automatically</li>
                      </ul>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-yellow-200">
                      <p className="text-xs text-yellow-700">
                        Current device time: <strong>{new Date().toLocaleString()}</strong>
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        After fixing your device time, click "Try Again" below.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Liveness Detector Container */}
            <div className="bg-white rounded-2xl shadow-xl h-full p-6 border border-gray-200">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-10 -z-10"></div>

                {!isAnalysisComplete && createSessionMutation.data && !clockSkewDetected ? (
                  <div className="liveness-detector-container w-full">
                    <FaceLivenessDetector
                      sessionId={createSessionMutation.data.sessionId}
                      region="us-east-1"
                      onAnalysisComplete={handleAnalysisComplete}
                      onError={handleError}
                    />
                  </div>
                ) : isAnalysisComplete ? (
                  <div className="text-center py-8">
                    <div className={`w-16 h-16 ${analysisResult?.live ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      {analysisResult?.live ? (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <h3 className={`text-xl font-semibold ${analysisResult?.live ? 'text-gray-900' : 'text-red-600'} mb-2`}>
                      {analysisResult?.live ? 'Verification Successful!' : 'Verification Failed'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {analysisResult?.live 
                        ? 'Your identity has been verified successfully.'
                        : 'Liveness check failed. Please ensure you are a real person and try again.'
                      }
                    </p>
                    <Button className='bg-accent text-white p-4 rounded-md' onClick={()=>router?.push('/')}>
                        Back to home
                    </Button>
                  </div>
                ) : clockSkewDetected ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Time Synchronization Required
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Please sync your device time and click the button below to try again.
                    </p>
                    <Button 
                      className='bg-accent text-white p-4 rounded-md' 
                      onClick={handleRetry}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Loader text="Preparing verification..." />
                  </div>
                )}
              </div>

              {/* Instructions - Only show during verification */}
              {!isAnalysisComplete && createSessionMutation.data && !clockSkewDetected && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Look directly at the camera</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Keep your face within the frame</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Follow the on-screen instructions</span>
                  </div>
                  {retryCount > 0 && (
                    <div className="flex items-center text-sm text-orange-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span>Ensure you are clearly visible and not using any filters</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                Your privacy is protected. This verification is secure and encrypted.
              </p>
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
};

export default LivenessCheckPage;