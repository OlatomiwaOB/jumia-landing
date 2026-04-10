import { Upload, Loader2, FileCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useRef } from "react"

interface DocumentType {
    id: string
    name: string
}

interface DocumentUploadFormProps {
    documentTypes: DocumentType[]
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    selectedType: string
    onTypeSelect: (value: string) => void
    isLoading?: boolean
    fileName?: string
}

export function DocumentUploadForm({
    documentTypes,
    onUpload,
    selectedType,
    onTypeSelect,
    isLoading,
    fileName
}: DocumentUploadFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleBoxClick = () => {
        if (!selectedType || isLoading) {
            return
        }
        fileInputRef.current?.click()
    }

    return (
        <Card className="w-full border-none shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                    <Upload className="h-5 w-5" />
                    <CardTitle className="text-base text-gray-900">Upload Document</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="document-type" className="text-gray-700 font-medium">Document Type</Label>
                        <Select onValueChange={onTypeSelect} value={selectedType} disabled={isLoading}>
                            <SelectTrigger id="document-type" className="w-full bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                                {documentTypes.map((doc, idx) => (
                                    <SelectItem key={idx} value={doc.id}>
                                        {doc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">File</Label>
                        <div
                            onClick={handleBoxClick}
                            className={`border-2 border-dashed border-gray-200 rounded-lg p-4 transition-colors flex items-center justify-center h-[52px] ${selectedType && !isLoading ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2 text-teal-600">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">Uploading...</span>
                                </div>
                            ) : fileName ? (
                                <div className="flex items-center gap-2 text-green-600">
                                    <FileCheck className="h-4 w-4" />
                                    <span className="text-sm truncate max-w-[200px]">{fileName}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Upload className="h-4 w-4" />
                                    <span className="text-sm">Choose File</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                name={selectedType}
                                className="hidden"
                                onChange={onUpload}
                                disabled={!selectedType || isLoading}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
