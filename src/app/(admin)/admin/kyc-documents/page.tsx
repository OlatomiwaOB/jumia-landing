'use client'

import { usePermission } from "@/hooks/usePermissionBusiness";
import KYCDocumentsPageContent from "./pageContent"
import { usePageMetadata } from "@/hooks/usePageMetadata";

const KYCDocumentsPage = () => {
    usePageMetadata("KYC DOCUMENTS", "Upload and manage your identity verification documents")
    const { usePermissionGuard } = usePermission();

    usePermissionGuard('VIEW_KYC', {
        redirectToNotPermitted: true,
        toastMessage: "You don't have permission to view KYC documents"
    });

    return (
        <KYCDocumentsPageContent />
    )
}

export default KYCDocumentsPage