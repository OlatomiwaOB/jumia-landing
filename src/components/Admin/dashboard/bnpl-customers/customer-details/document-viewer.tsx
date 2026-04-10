import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Eye, Download, CreditCard, FileImage, Receipt, Building } from "lucide-react";

interface Document {
  id: number;
  type: string;
  link: string;
  title: string;
  verifyStatus: string;
  verifiedDate: string;
}

interface DocumentViewerProps {
  documents: Document[];
}

const documentIcons: Record<string, any> = {
  IDENTITY_CARD: CreditCard,
  UTILITY_BILL: Receipt,
  BANK_STATEMENT: Building,
  PAY_SLIP: FileText,
  default: FileImage,
};

const documentLabels: Record<string, string> = {
  IDENTITY_CARD: "Identity Card",
  UTILITY_BILL: "Utility Bill",
  BANK_STATEMENT: "Bank Statement", 
  PAY_SLIP: "Pay Slip",
};

export function DocumentViewer({ documents }: DocumentViewerProps) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  if (!documents || documents.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            Customer Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-3">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
            <p className="text-muted-foreground font-medium">No documents available</p>
            <p className="text-sm text-muted-foreground">Documents will appear here once uploaded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          Customer Documents
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            {documents.length} {documents.length === 1 ? 'document' : 'documents'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const IconComponent = documentIcons[doc.type] || documentIcons.default;
            const label = documentLabels[doc.type] || doc.title;
            
            return (
              <div
                key={doc.id}
                className="group relative p-6 border border-border rounded-xl bg-gradient-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors duration-200">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <h4 className="font-semibold text-foreground truncate">
                        {label}
                      </h4>
                      <div className="space-y-1">
                        <StatusBadge status={doc.verifyStatus} size="sm" />
                        {doc.verifiedDate && (
                          <p className="text-xs text-muted-foreground">
                            Verified: {doc.verifiedDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0 hover:bg-primary hover:text-primary-foreground"
                          onClick={() => setSelectedDoc(doc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
                        <DialogHeader className="border-b border-border pb-4">
                          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                            <IconComponent className="h-6 w-6 text-primary" />
                            {label}
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="flex items-center justify-center p-6 overflow-auto">
                          <div className="relative w-full max-w-4xl">
                            <img
                              src={doc.link}
                              alt={label}
                              className="w-full h-auto object-contain rounded-lg border border-border shadow-card max-h-[70vh]"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0 hover:bg-success hover:text-success-foreground"
                      asChild
                    >
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}