// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Landmark, FileText, RefreshCw } from "lucide-react"

// export interface UploadedDocument {
//     id: string
//     title: string
//     filename: string
//     uploadedAt: string
//     status: "approved" | "pending" | "rejected"
//     documentType: string
// }

// interface UploadedDocumentsListProps {
//     documents: UploadedDocument[]
//     onView: (id: string) => void
//     // onDelete: (id: string) => void
//     // onReUpload: (id: string) => void
// }

// export function UploadedDocumentsList({ documents, onView }: UploadedDocumentsListProps) {
//     if (documents.length === 0) {
//         return (
//             <Card className="w-full border-none shadow-sm min-h-[300px] flex items-center justify-center text-center">
//                 <CardContent>
//                     <div className="flex justify-center mb-4">
//                         <FileText className="h-16 w-16 text-gray-200" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-400">No Documents Uploaded</h3>
//                     <p className="text-gray-400 mt-2 text-sm">Upload your KYC document to get verified</p>
//                 </CardContent>
//             </Card>
//         )
//     }

//     return (
//         <Card className="w-full border-none shadow-sm">
//             <CardHeader>
//                 <CardTitle className="text-base text-gray-900">Uploaded Documents</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//                 {documents.map((doc) => (
//                     <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
//                         <div className="flex items-start gap-4">
//                             <div className="p-3 bg-gray-100 rounded-lg">
//                                 <Landmark className="h-6 w-6 text-gray-600" />
//                             </div>
//                             <div>
//                                 <div className="flex items-center gap-2 flex-wrap">
//                                     <h4 className="font-semibold text-gray-900">{doc.title}</h4>
//                                     {doc.status === "approved" && (
//                                         <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Approved</Badge>
//                                     )}
//                                     {doc.status === "pending" && (
//                                         <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">Pending Approval</Badge>
//                                     )}
//                                     {doc.status === "rejected" && (
//                                         <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Rejected</Badge>
//                                     )}
//                                 </div>
//                                 <p className="text-sm text-gray-500 mt-1">
//                                     {doc.filename} (Uploaded {doc.uploadedAt})
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-4 mt-4 sm:mt-0 pl-[68px] sm:pl-0">
//                             {doc.status !== "rejected" && (
//                                 <>
//                                     <button onClick={() => onView(doc.id)} className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
//                                         View
//                                     </button>
//                                     {/* {doc.status === "pending" && (
//                                         <button onClick={() => onDelete(doc.id)} className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
//                                             Delete
//                                         </button>
//                                     )} */}
//                                 </>
//                             )}
//                             {doc.status === "rejected" && (
//                                 <>
//                                     <button onClick={() => onView(doc.id)} className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
//                                         View
//                                     </button>
//                                     {/* <button onClick={() => onReUpload(doc.id)} className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
//                                         <RefreshCw className="h-3 w-3" />
//                                         Re-Upload
//                                     </button> */}
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </CardContent>
//         </Card>
//     )
// }


import { Badge } from "@/components/ui/badge"
import { Landmark, FileText } from "lucide-react"

export interface UploadedDocument {
    id: string
    title: string
    filename: string
    uploadedAt: string
    status: "approved" | "pending" | "rejected"
    documentType: string
}

interface UploadedDocumentsListProps {
    documents: UploadedDocument[]
    onView: (id: string) => void
}

export function UploadedDocumentsList({ documents, onView }: UploadedDocumentsListProps) {
    if (documents.length === 0) {
        return (
            <div className="w-full bg-white rounded-2xl p-6 flex items-center justify-center text-center min-h-[300px]">
                <div>
                    <div className="flex justify-center mb-4">
                        <FileText className="h-16 w-16 text-gray-200" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-400">No Documents Uploaded</h3>
                    <p className="text-gray-400 mt-2 text-sm">Upload your KYC document to get verified</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full bg-white rounded-2xl">
            <div className="px-6 pt-5 pb-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-dark-gray">Uploaded Documents</h2>
            </div>
            <div className="p-6 space-y-4">
                {documents.map((doc) => (
                    <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-[#FEF1E7] rounded-lg">
                                <Landmark className="h-6 w-6 text-faded-accent" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-semibold text-dark-gray">{doc.title}</h4>
                                    {doc.status === "approved" && (
                                        <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] px-2 py-0.5">Approved</Badge>
                                    )}
                                    {doc.status === "pending" && (
                                        <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-[10px] px-2 py-0.5">Pending Approval</Badge>
                                    )}
                                    {doc.status === "rejected" && (
                                        <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] px-2 py-0.5">Rejected</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-medium-gray mt-1">
                                    {doc.filename} (Uploaded {doc.uploadedAt})
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4 sm:mt-0 pl-[68px] sm:pl-0">
                            {doc.status !== "rejected" && (
                                <button onClick={() => onView(doc.id)} className="text-sm font-medium text-faded-accent hover:text-accent transition-colors">
                                    View
                                </button>
                            )}
                            {doc.status === "rejected" && (
                                <button onClick={() => onView(doc.id)} className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                                    View
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}