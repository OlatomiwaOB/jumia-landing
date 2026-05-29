import { usePermission } from "@/hooks/usePermissionBusiness";
import KYCDocumentsPageContent from "./pageContent"

const KYCDocumentsPage = () => {
    // const { usePermissionGuard } = usePermission();

    // usePermissionGuard('VIEW_KYC', {
    //     redirectToNotPermitted: true,
    //     toastMessage: "You don't have permission to view KYC documents"
    // });

    return (
        <KYCDocumentsPageContent />
    )
}

export default KYCDocumentsPage