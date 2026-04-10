'use client'

// import { usePageMetadata } from "@/hooks/usePageMetadata"
import { VerificationProgress } from "./components/VerificationProgress"
import { DocumentManager } from "./components/DocumentManager"
import { IdentityDetailsForm } from "./components/IdentityDetailsForm"
import { useMemo, useState } from "react"
import { useHandleImageUpload } from "@/hooks/handleUploadKyc"
import { toast } from "sonner"
import { UploadedDocument } from "./components/UploadedDocumentsList"
import { useQuery } from "@tanstack/react-query"
import axiosInstance from "@/utils/fetch-function"
import { PendingRequirementsList, KycPendingItem } from "./components/PendingRequirementsList"
import { DirectorInfoModal } from "./components/DirectorInfoModal"
import useUser from "@/store/userStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"


interface KycDocumentResponse {
    id: number;
    entityCode: string;
    username: string;
    documentType: string;
    documentName: string;
    documentPath: string;
    accountNo: string;
    documentTitle: string;
    verifiedStatus: "N" | "Approved";
    verifiedBy: string;
    comment: string;
    documentImg: string | null;
    createdDate: string;
}

const REQUIRED_DOCUMENTS = [
    { id: 'BUSINESS_REGISTRATION_DOC', name: 'Business Registration Document' },
    { id: 'IDENTITY_CARD', name: 'Identity ID of Rep' },
    { id: 'UTILITY_BILL', name: 'Utility Bill' },
    //   { id: 'LIVENESS', name: 'Liveness KYC' },
];

const KYCDocumentsPageContent = () => {
    // usePageMetadata("KYC DOCUMENTS", "Upload and manage your identity verification documents")
    const mutateFile = useHandleImageUpload();
    const [filenames, setFilenames] = useState<{ [key: string]: string }>({});
    const { user } = useUser()
    const [img, setImg] = useState<string | null>(null)

    //Get list of all uploaded documents 
    const { data: documentsData, isLoading: isLoadingDocuments, refetch } = useQuery({
        queryKey: ['borrower-kyc-documents'],
        queryFn: async () => {
            const response = await axiosInstance?.request({
                url: '/document/getDocuments',
                method: 'GET'
            });
            return response.data as KycDocumentResponse[];
        }
    })

    //Get list of all pending documents 
    const { data: kycPendingData, isLoading: isLoadingPending } = useQuery({
        queryKey: ['kyc-pending'],
        queryFn: async () => axiosInstance?.request({
            url: '/corporate/kyc-pending',
            method: 'GET'
        })
    })

    const documents: UploadedDocument[] = documentsData?.map((doc) => ({
        id: doc.id.toString(),
        title: doc.documentTitle || doc.documentName, // Fallback if title empty
        filename: doc.documentName,
        uploadedAt: doc.createdDate,
        status: doc.verifiedStatus === 'Approved' ? 'approved' : 'pending',
        documentType: doc.documentType
    })) || []

    // const [identityData, setIdentityData] = useState({
    //     bvn: "",
    //     nin: ""
    // })

    const verifiedCount = documents?.filter(doc => doc?.status === 'approved')?.length || 0
    const uploadedCount = documents?.length || 0
    const totalCount = REQUIRED_DOCUMENTS.length

    const handleUpload = async function (e: React.ChangeEvent<HTMLInputElement>) {
        const name = e.target.name;
        const files = e.target.files;

        // Store the filename
        if (files?.length) {
            setFilenames(prev => ({ ...prev, [name]: files[0]?.name }));

            mutateFile.mutate(
                { image: files[0], fileType: name },
                {
                    onSuccess: (response) => {
                        if (response) {
                            if (response?.data.desc.includes('SUCCESS')) {
                                // setValue(name as any, response.data.id);
                                toast?.success('Document uploaded successfully')
                                refetch()
                            } else {
                                toast.error(response.data.desc);
                                // Clear filename on error
                                setFilenames(prev => ({ ...prev, [name]: '' }));
                                // Clear the file input value
                                e.target.value = '';
                            }
                        }
                    },
                    onError: () => {
                        // Clear filename on error
                        setFilenames(prev => ({ ...prev, [name]: '' }));
                        // Clear the file input value
                        e.target.value = '';
                    }
                }
            );
        }
    };

    const extractLivenessDoc = useMemo(() => {
        return kycPendingData?.data?.find((doc: KycPendingItem) => doc?.actionCode === 'LIVENESS')
    }, [kycPendingData])

    const handleView = (id: string) => {
        setImg(documentsData?.find(doc => doc.id === Number(id))?.documentImg!)

    }

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto pb-12">
            <VerificationProgress
                verifiedCount={verifiedCount}
                uploadedCount={uploadedCount}
                totalCount={totalCount}
            />

            <PendingRequirementsList
                items={kycPendingData?.data || []}
                isLoading={isLoadingPending}
            />

            <IdentityDetailsForm
            // initialData={identityData}
            // onUpdateBvn={handleBvnUpdate}
            // onUpdateNin={handleNinUpdate}
            />

            <DocumentManager
                documentTypes={REQUIRED_DOCUMENTS}
                documents={documents}
                onUpload={handleUpload}
                isLoading={mutateFile.isPending || isLoadingDocuments}
                currentFilenames={filenames}
                onView={handleView}
                img={img}
            />

            <Card className="w-full border-none shadow-sm mt-6">
                <CardHeader className="pb-4 border-b">
                    <CardTitle className="text-base text-gray-900">Liveness Check</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="font-medium text-gray-900">Identity Verification</h3>
                            <p className="text-sm text-gray-500">
                                Complete a quick video selfie to verify your identity. This process helps us ensure that you are a real person.
                            </p>
                        </div>
                        <Link href={`/liveness?id=${extractLivenessDoc?.url}`} target="_blank">
                            <Button
                                disabled={!extractLivenessDoc}
                                className="bg-accent/50 hover:bg-accent text-white min-w-[200px]">
                                Start Liveness Check
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {
                user?.userRole === 'BUSINESS_ADMIN' && (
                    <div className="pt-4 border-t border-gray-100 flex justify-center">
                        <div className="max-w-md w-full">
                            <DirectorInfoModal />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default KYCDocumentsPageContent