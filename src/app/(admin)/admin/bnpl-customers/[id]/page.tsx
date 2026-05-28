// import CustomerDetailScreen from '@/components/Admin/dashboard/bnpl-customers/customer-details/customer-details'
// import { usePermission } from '@/hooks/usePermissionBusiness';
// import React, { Suspense } from 'react'

// const CustomerDetails = () => {
//   const { usePermissionGuard } = usePermission();

//   usePermissionGuard('VIEW_ORDERS', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to manage BNPL customers"
//   });
//   return (
//     <Suspense>
//       <CustomerDetailScreen />
//     </Suspense>
//   )
// }

// export default CustomerDetails