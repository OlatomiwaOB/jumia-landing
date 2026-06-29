// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Upload, Loader2, FileCheck, Eye, AlertCircle } from "lucide-react"
// import { useRef, useState } from "react"
// import { UploadedDocument } from "./UploadedDocumentsList"
// import dynamic from "next/dynamic"

// interface DocumentType {
//     id: string
//     name: string
// }

// interface DocumentManagerProps {
//     documentTypes: DocumentType[]
//     documents: UploadedDocument[]
//     onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
//     isLoading?: boolean
//     currentFilenames: { [key: string]: string }
//     onView: (id: string) => void
//     img: string | null
// }

// const ViewImageModal = dynamic(() => import('./ViewImageModal'), { ssr: false })

// export function DocumentManager({
//     documentTypes,
//     documents,
//     onUpload,
//     isLoading,
//     currentFilenames,
//     onView,
//     img
// }: DocumentManagerProps) {
//     const fileInputRef = useRef<HTMLInputElement>(null)
//     const [open, setOpen] = useState(false)
//     const getDocumentForType = (type: DocumentType) => {
//         return documents.find(d => d.documentType === type.id)
//     }

//     const handleBoxClick = (isDisabled: boolean) => {
//         if (isDisabled || isLoading) return
//         fileInputRef.current?.click()
//     }

//     return (
//         <>
//             <Card className="w-full border-none shadow-sm">
//                 <CardHeader className="pb-4 border-b">
//                     <CardTitle className="text-base text-gray-900">KYC Document</CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-6">
//                     <Tabs defaultValue={documentTypes[0]?.id} className="w-full">
//                         <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent p-0 mb-6">
//                             {documentTypes.map((type) => {
//                                 const doc = getDocumentForType(type)
//                                 const isComplete = doc?.status === 'approved'
//                                 return (
//                                     <TabsTrigger
//                                         key={type.id}
//                                         value={type.id}
//                                         disabled={isComplete}
//                                         className="data-[state=active]:bg-accent/30 data-[state=active]:text-accent data-[state=active]:border-accent border border-transparent rounded-md px-4 py-2"
//                                     >
//                                         {type.name}
//                                         {isComplete && <span className="ml-2 text-accent">✓</span>}
//                                     </TabsTrigger>
//                                 )
//                             })}
//                         </TabsList>

//                         {documentTypes.map((type) => {
//                             const existingDoc = getDocumentForType(type)
//                             const isApproved = existingDoc?.status === "approved"
//                             const isPending = existingDoc?.status === "pending"
//                             const isRejected = existingDoc?.status === "rejected"

//                             // Disable upload if document exists
//                             const isUploadDisabled = !!existingDoc || isLoading
//                             const currentFileName = currentFilenames[type.id]

//                             return (
//                                 <TabsContent key={type.id} value={type.id} className="space-y-6 animate-in fade-in-50 duration-300">
//                                     <div className="space-y-4">
//                                         <div className="flex items-center justify-between">
//                                             <Label className="text-base font-medium text-gray-900">{type.name}</Label>
//                                             {existingDoc && (
//                                                 <Badge
//                                                     className={`
//                                                     ${isApproved ? 'bg-green-100 text-accent hover:bg-green-100' : ''}
//                                                     ${isPending ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' : ''}
//                                                     ${isRejected ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
//                                                     border-none px-3 py-1
//                                                 `}
//                                                 >
//                                                     {isApproved ? 'Approved' : isPending ? 'Pending Review' : 'Rejected'}
//                                                 </Badge>
//                                             )}
//                                         </div>

//                                         {/* Upload Box */}
//                                         <div className="space-y-2">
//                                             <div
//                                                 onClick={() => handleBoxClick(!!isUploadDisabled)}
//                                                 className={`
//                                                 border-2 border-dashed rounded-lg p-8 transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center min-h-[160px]
//                                                 ${isUploadDisabled ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed' : 'border-gray-200 hover:border-accent/50 hover:bg-teal-50/10 cursor-pointer'}
//                                             `}
//                                             >
//                                                 {isLoading && currentFileName ? (
//                                                     <>
//                                                         <Loader2 className="h-8 w-8 text-accent/50 animate-spin" />
//                                                         <p className="text-sm font-medium text-accent">Uploading...</p>
//                                                     </>
//                                                 ) : existingDoc ? (
//                                                     <>
//                                                         <FileCheck className={`h-10 w-10 ${isRejected ? 'text-red-400' : 'text-green-500'}`} />
//                                                         <div>
//                                                             <p className="font-medium text-gray-900">{existingDoc.filename}</p>
//                                                             <p className="text-xs text-gray-500 mt-1">Uploaded on {existingDoc.uploadedAt}</p>
//                                                         </div>
//                                                         {!isApproved && (
//                                                             <p className="text-sm text-accent underline">Tap to replace document</p>
//                                                         )}
//                                                     </>
//                                                 ) : currentFileName ? (
//                                                     <>
//                                                         <FileCheck className="h-8 w-8 text-accent" />
//                                                         <p className="font-medium text-gray-900">{currentFileName}</p>
//                                                         <p className="text-xs text-gray-500">Ready to upload</p>
//                                                     </>
//                                                 ) : (
//                                                     <>
//                                                         <div className="p-3 bg-teal-50 rounded-full">
//                                                             <Upload className="h-6 w-6 text-accent" />
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm font-medium text-gray-900">Click to upload document</p>
//                                                             <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or PDF (max. 5MB)</p>
//                                                         </div>
//                                                     </>
//                                                 )}

//                                                 <input
//                                                     ref={fileInputRef}
//                                                     type="file"
//                                                     name={type.id}
//                                                     className="hidden"
//                                                     onChange={onUpload}
//                                                     disabled={!!isUploadDisabled || !!isLoading}
//                                                     accept="image/*,application/pdf"
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Link/View Button */}
//                                         {existingDoc && (
//                                             <div className="flex justify-end pt-2">
//                                                 <Button
//                                                     variant="outline"
//                                                     onClick={() => {
//                                                         onView(existingDoc.id)
//                                                         setOpen(true)
//                                                     }}
//                                                     className="flex items-center gap-2 text-accent border-accent/50 hover:bg-accent/30"
//                                                 >
//                                                     <Eye className="h-4 w-4" />
//                                                     View Document
//                                                 </Button>
//                                             </div>
//                                         )}

//                                         {isRejected && (
//                                             <div className="bg-red-50 p-4 rounded-md flex items-start gap-3 text-sm text-red-700">
//                                                 <AlertCircle className="h-5 w-5 shrink-0" />
//                                                 <div>
//                                                     <p className="font-medium">Document Rejected</p>
//                                                     <p className="mt-1 opacity-90">Please ensure the document is clear and visible, then try uploading again.</p>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </TabsContent>
//                             )
//                         })}
//                     </Tabs>
//                 </CardContent>
//             </Card>

//             <ViewImageModal
//                 img={img!}
//                 open={open}
//                 setOpen={setOpen}
//             />
//         </>
//     )
// }

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, FileCheck, Eye, AlertCircle } from "lucide-react"
import { useRef, useState } from "react"
import { UploadedDocument } from "./UploadedDocumentsList"
import dynamic from "next/dynamic"
import { CameraIcon } from "@/components/icons/icons"

interface DocumentType {
    id: string
    name: string
}

interface DocumentManagerProps {
    documentTypes: DocumentType[]
    documents: UploadedDocument[]
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    isLoading?: boolean
    currentFilenames: { [key: string]: string }
    onView: (id: string) => void
    img: string | null
}

const ViewImageModal = dynamic(() => import('./ViewImageModal'), { ssr: false })

export function DocumentManager({
    documentTypes,
    documents,
    onUpload,
    isLoading,
    currentFilenames,
    onView,
    img
}: DocumentManagerProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)

    const getDocumentForType = (type: DocumentType) => {
        return documents.find(d => d.documentType === type.id)
    }

    const handleBoxClick = (isDisabled: boolean) => {
        if (isDisabled || isLoading) return
        fileInputRef.current?.click()
    }

    return (
        <>
            <div className="w-full bg-white rounded-2xl">
                <div className="px-6 pt-5 pb-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-dark-gray">KYC Document</h2>
                </div>
                <div className="p-6">
                    <Tabs defaultValue={documentTypes[0]?.id} className="w-full">
                        <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent p-0 mb-6">
                            {documentTypes.map((type) => {
                                const doc = getDocumentForType(type)
                                const isComplete = doc?.status === 'approved'
                                return (
                                    <TabsTrigger
                                        key={type.id}
                                        value={type.id}
                                        disabled={isComplete}
                                        className="data-[state=active]:bg-faded-accent/10 data-[state=active]:text-faded-accent data-[state=active]:border-faded-accent border border-transparent rounded-md px-4 py-2"
                                    >
                                        {type.name}
                                        {isComplete && <span className="ml-2 text-green-500">✓</span>}
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>

                        {documentTypes.map((type) => {
                            const existingDoc = getDocumentForType(type)
                            const isApproved = existingDoc?.status === "approved"
                            const isPending = existingDoc?.status === "pending"
                            const isRejected = existingDoc?.status === "rejected"

                            const isUploadDisabled = !!existingDoc || isLoading
                            const currentFileName = currentFilenames[type.id]

                            return (
                                <TabsContent key={type.id} value={type.id} className="space-y-6 animate-in fade-in-50 duration-300">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium text-dark-gray">{type.name}</Label>
                                            {existingDoc && (
                                                <Badge className={`text-[10px] px-2.5 py-0.5 border font-medium
                                                    ${isApproved ? 'bg-green-100 text-green-700 border-green-200' : ''}
                                                    ${isPending ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
                                                    ${isRejected ? 'bg-red-100 text-red-700 border-red-200' : ''}
                                                `}>
                                                    {isApproved ? 'Approved' : isPending ? 'Pending Review' : 'Rejected'}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div
                                                onClick={() => handleBoxClick(!!isUploadDisabled)}
                                                className={`
                                                    border-2 border-dashed rounded-lg p-8 transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center min-h-[160px]
                                                    ${isUploadDisabled ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' : 'border-faded-accent hover:border-sidebar-accent/50 cursor-pointer'}
                                                `}
                                            >
                                                {isLoading && currentFileName ? (
                                                    <>
                                                        <Loader2 className="h-8 w-8 text-faded-accent animate-spin" />
                                                        <p className="text-sm font-medium text-faded-accent">Uploading...</p>
                                                    </>
                                                ) : existingDoc ? (
                                                    <>
                                                        <FileCheck className={`h-10 w-10 ${isRejected ? 'text-red-400' : 'text-green-500'}`} />
                                                        <div>
                                                            <p className="font-medium text-dark-gray">{existingDoc.filename}</p>
                                                            <p className="text-xs text-medium-gray mt-1">Uploaded on {existingDoc.uploadedAt}</p>
                                                        </div>
                                                        {!isApproved && (
                                                            <p className="text-sm text-faded-accent underline">Tap to replace document</p>
                                                        )}
                                                    </>
                                                ) : currentFileName ? (
                                                    <>
                                                        <FileCheck className="h-8 w-8 text-faded-accent" />
                                                        <p className="font-medium text-dark-gray">{currentFileName}</p>
                                                        <p className="text-xs text-medium-gray">Ready to upload</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="p-3 bg-[#FEF1E7] rounded-full">
                                                            <CameraIcon className="h-6 w-6 text-faded-accent" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-dark-gray">Click to upload document</p>
                                                            <p className="text-xs text-medium-gray mt-1">SVG, PNG, JPG or PDF (max. 5MB)</p>
                                                        </div>
                                                    </>
                                                )}

                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    name={type.id}
                                                    className="hidden"
                                                    onChange={onUpload}
                                                    disabled={!!isUploadDisabled || !!isLoading}
                                                    accept="image/*,application/pdf"
                                                />
                                            </div>
                                        </div>

                                        {existingDoc && (
                                            <div className="flex justify-end pt-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        onView(existingDoc.id)
                                                        setOpen(true)
                                                    }}
                                                    className="rounded-xl"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Document
                                                </Button>
                                            </div>
                                        )}

                                        {isRejected && (
                                            <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3 text-sm text-red-700">
                                                <AlertCircle className="h-5 w-5 shrink-0" />
                                                <div>
                                                    <p className="font-medium">Document Rejected</p>
                                                    <p className="mt-1 opacity-90">Please ensure the document is clear and visible, then try uploading again.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            )
                        })}
                    </Tabs>
                </div>
            </div>

            <ViewImageModal
                img={img!}
                open={open}
                setOpen={setOpen}
            />
        </>
    )
}