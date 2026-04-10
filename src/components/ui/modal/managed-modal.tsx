import Modal from '@/components/ui/modal/modal';
import dynamic from 'next/dynamic';
import { MODAL_VIEWS, useModalAction, useModalState } from './modal.context';
import BillerProductEdit from '@/components/biller/biller-product-edit';
import BillerCollectionEdit from '@/components/biller/biller-collection-edit';
const TagDeleteView = dynamic(() => import('@/components/tag/tag-delete-view'));
const TaxDeleteView = dynamic(() => import('@/components/tax/tax-delete-view'));
const BanCustomerView = dynamic(
  () => import('@/components/user/user-ban-view')
);
const UserWalletPointsAddView = dynamic(
  () => import('@/components/user/user-wallet-points-add-view')
);
const MakeAdminView = dynamic(
  () => import('@/components/user/make-admin-view')
);
const ShippingDeleteView = dynamic(
  () => import('@/components/shipping/shipping-delete-view')
);
const CategoryDeleteView = dynamic(
  () => import('@/components/category/category-delete-view')
);
const CouponDeleteView = dynamic(
  () => import('@/components/coupon/coupon-delete-view')
);

const ProductDeleteView = dynamic(
  () => import('@/components/product/product-delete-view')
);
const TypeDeleteView = dynamic(
  () => import('@/components/group/group-delete-view')
);
const AttributeDeleteView = dynamic(
  () => import('@/components/attribute/attribute-delete-view')
);

const ApproveShopView = dynamic(
  () => import('@/components/shop/approve-shop-view')
);
const DisApproveShopView = dynamic(
  () => import('@/components/shop/disapprove-shop-view')
);
const RemoveStaffView = dynamic(
  () => import('@/components/shop/staff-delete-view')
);

const ExportImportView = dynamic(
  () => import('@/components/product/import-export-modal')
);

const AttributeExportImport = dynamic(
  () => import('@/components/attribute/attribute-import-export')
);

const UpdateRefundConfirmationView = dynamic(
  () => import('@/components/refund/refund-confirmation-view')
);
const RefundImageModal = dynamic(
  () => import('@/components/refund/refund-image-modal')
);
const ReviewImageModal = dynamic(
  () => import('@/components/reviews/review-image-modal')
);
const QuestionReplyView = dynamic(
  () => import('@/components/question/question-reply-view')
);
const BillerView = dynamic(() => import('@/components/biller/biller-view'));
const RoleEdit = dynamic(() => import('@/components/permission/edit-role'));
const RoleView = dynamic(() => import('@/components/permission/view-role'));
const BillerEdit = dynamic(() => import('@/components/biller/biller-edit'));
const HostEdit = dynamic(() => import('@/pages/routing_rule/edit-host'));
const RuleEdit = dynamic(() => import('@/pages/routing_rule/edit-rule'));
const QuestionDeleteView = dynamic(
  () => import('@/components/question/question-delete-view')
);
const ReviewDeleteView = dynamic(
  () => import('@/components/reviews/review-delete-view')
);

const AcceptAbuseReportView = dynamic(
  () => import('@/components/reviews/acccpt-report-confirmation')
);

const DeclineAbuseReportView = dynamic(
  () => import('@/components/reviews/decline-report-confirmation')
);

const CreateOrUpdateAddressForm = dynamic(
  () => import('@/components/address/create-or-update')
);
const AddOrUpdateCheckoutContact = dynamic(
  () => import('@/components/checkout/contact/add-or-update')
);
const SelectCustomer = dynamic(
  () => import('@/components/checkout/customer/select-customer')
);

const AuthorDeleteView = dynamic(
  () => import('@/components/author/author-delete-view')
);
const ManufacturerDeleteView = dynamic(
  () => import('@/components/manufacturer/manufacturer-delete-view')
);

const ProductVariation = dynamic(
  () => import('@/components/product/variation/variation')
);
const AbuseReport = dynamic(() => import('@/components/reviews/abuse-report'));

const OrderItem = dynamic(
  () => import('@/components/inventories/orders/order-item')
);

const OrderTracking = dynamic(
  () => import('@/components/inventories/orders/order-tracking')
);

const OrderTrackingUpdate = dynamic(
  () => import('@/components/inventories/orders/order-tracking-update')
);

const VADetails = dynamic(
  () => import('@/components/virtual_accounts/account-details')
);

const UserItem = dynamic(() => import('@/components/user/qr-code-gen'));

const LinkTerminalToMerchant = dynamic(
  () => import('@/components/merchant/link-terminal')
);

const TerminalMonitoringDetails = dynamic(
  () => import('@/components/terminal_monitoring/terminal_monitoring_view')
);

const TerminalGeolocation = dynamic(
  () => import('@/components/terminal_monitoring/terminal_geolocation_view')
);

const UpdateTerminalForm = dynamic(
  () => import('@/components/terminal/updateTerminalForm')
);

const LookupEditModal = dynamic(
  () => import('@/components/lookup_data/lookupEditModal')
);

const SettleTransDetails = dynamic(
  () => import('@/components/reconciled_transaction/settle-trans-details')
);

const TransferDetails = dynamic(
  () => import('@/components/transfers/transfer-details')
);

const MakerCheckerDetails = dynamic(
  () => import('@/components/maker_checker/maker-checker-details')
);

const ApproveRejectMakerChecker = dynamic(
  () => import('@/components/maker_checker/approve-reject')
);

const CreateVirtualAccount = dynamic(
  () => import('@/components/merchant/create-virtual-account')
);

const TerminalTeller = dynamic(
  () => import('@/components/merchant/terminal-teller')
);

const TransactionTypeEdit = dynamic(
  () => import('@/components/transaction_type/edit')
);

const EditCategory = dynamic(
  () => import('@/components/inventories/mutations/editCategory')
);
const ViewDocument = dynamic(
  () => import('@/components/merchant/view-document')
);
const ApproveMerchant = dynamic(
  () => import('@/components/merchant/approve-merchant')
);

const AddSplitSettlement = dynamic(
  () => import('@/components/merchant/split-settlement/add-split-settlement')
);

const EditSplitFee = dynamic(
  () => import('@/components/merchant/split-settlement/edit-split-settlement')
);

function renderModal(view: MODAL_VIEWS | undefined, data: any) {
  switch (view) {
    case 'DELETE_PRODUCT':
      return <ProductDeleteView />;
    case 'DELETE_TYPE':
      return <TypeDeleteView />;
    case 'DELETE_ATTRIBUTE':
      return <AttributeDeleteView />;
    case 'DELETE_CATEGORY':
      return <CategoryDeleteView />;
    // case "DELETE_ORDER":
    //   return <OrderDeleteView />;
    case 'DELETE_COUPON':
      return <CouponDeleteView />;
    case 'DELETE_TAX':
      return <TaxDeleteView />;
    case 'DELETE_SHIPPING':
      return <ShippingDeleteView />;
    // case "DELETE_ORDER_STATUS":
    //   return <OrderStatusDeleteView />;
    case 'DELETE_TAG':
      return <TagDeleteView />;
    case 'DELETE_MANUFACTURER':
      return <ManufacturerDeleteView />;
    case 'DELETE_AUTHOR':
      return <AuthorDeleteView />;
    case 'BAN_CUSTOMER':
      return <BanCustomerView />;
    case 'SHOP_APPROVE_VIEW':
      return <ApproveShopView />;
    case 'SHOP_DISAPPROVE_VIEW':
      return <DisApproveShopView />;
    case 'DELETE_STAFF':
      return <RemoveStaffView />;
    case 'UPDATE_REFUND':
      return <UpdateRefundConfirmationView />;
    case 'ADD_OR_UPDATE_ADDRESS':
      return <CreateOrUpdateAddressForm />;
    case 'ADD_OR_UPDATE_CHECKOUT_CONTACT':
      return <AddOrUpdateCheckoutContact />;
    case 'REFUND_IMAGE_POPOVER':
      return <RefundImageModal />;
    case 'MAKE_ADMIN':
      return <MakeAdminView />;
    case 'EXPORT_IMPORT_PRODUCT':
      return <ExportImportView />;
    case 'EXPORT_IMPORT_ATTRIBUTE':
      return <AttributeExportImport />;
    case 'ADD_WALLET_POINTS':
      return <UserWalletPointsAddView />;
    case 'SELECT_PRODUCT_VARIATION':
      return <ProductVariation productSlug={data} />;
    case 'SELECT_CUSTOMER':
      return <SelectCustomer />;
    case 'REPLY_QUESTION':
      return <QuestionReplyView />;
    case 'BILLER_VIEW':
      return <BillerView />;
    case 'ROLE_EDIT':
      return <RoleEdit />;
    case 'ROLE_VIEW':
      return <RoleView/>
    case 'BILLER_EDIT':
      return <BillerEdit />;
    case 'HOST_EDIT':
      return <HostEdit />;
    case 'RULE_EDIT':
      return <RuleEdit />;
    case 'BILLER_PRODUCT_EDIT':
      return <BillerProductEdit />;
    case 'BILLER_COLLECTION_EDIT':
      return <BillerCollectionEdit />;
    case 'DELETE_QUESTION':
      return <QuestionDeleteView />;
    case 'DELETE_REVIEW':
      return <ReviewDeleteView />;
    case 'ACCEPT_ABUSE_REPORT':
      return <AcceptAbuseReportView />;
    case 'DECLINE_ABUSE_REPORT':
      return <DeclineAbuseReportView />;
    case 'REVIEW_IMAGE_POPOVER':
      return <ReviewImageModal />;
    case 'ABUSE_REPORT':
      return <AbuseReport data={data} />;
    case 'POS_ORDER_VIEW':
      return <OrderItem />;
    case 'POS_ORDER_TRACKING':
      return <OrderTracking />;
    case 'POS_ORDER_TRACKING_UPDATE':
      return <OrderTrackingUpdate />;
    case 'VIRTUAL_ACCOUNT_VIEW_MODAL':
      return <VADetails/>
    case 'QR_CODE_MODAL':
      return <UserItem />;
    case 'LINK_TERMINAL_MODAL':
      return <LinkTerminalToMerchant />;
    case 'TERMINAL_HEALTH_MONITORING_MODAL':
      return <TerminalMonitoringDetails />;
    case 'TERMINAL_GEOLOCATION_MODAL':
      return <TerminalGeolocation />;
    case 'TERMINAL_MODAL':
      return <UpdateTerminalForm />;
    case 'LOOKUP_MODAL':
      return <LookupEditModal />;
    case 'SETTLE_TRANS_MODAL':
      return <SettleTransDetails />;
    case 'TRANSFER_MASTER_MODAL':
      return <TransferDetails />;
    case 'MAKER_CHECKER_DETAILS_MODAL':
      return <MakerCheckerDetails />;
    case 'APPROVE_REJECT_MAKER_CHECKER_MODAL':
      return <ApproveRejectMakerChecker />;
    case 'CREATE_VIRTUAL_ACCOUNT_MODAL':
      return <CreateVirtualAccount />;
    case 'TERMINAL_TELLER_MODAL':
      return <TerminalTeller />;
    case 'TRANSACTION_TYPE_MODAL':
      return <TransactionTypeEdit />;
    case 'EDIT_PRODUCT_CATEGORY_MODAL':
      return <EditCategory />;
    case 'VIEW_DOCUMENT':
      return <ViewDocument />;
    case 'APPROVE_MERCHANT_MODAL':
      return <ApproveMerchant />;
    case 'SPLIT_SETTLEMENT_MODAL':
      return <AddSplitSettlement />;
    case 'SPLIT_FEE_EDIT_MODAL':
      return <EditSplitFee />;
    default:
      return null;
  }
}

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {renderModal(view, data)}
    </Modal>
  );
};

export default ManagedModal;
