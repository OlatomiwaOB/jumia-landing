// 'use client'
// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import Table from "rc-table";
// import {
//   Shield,
//   TrendingUp,
//   Save,
//   Calculator,
//   DollarSign,
//   Lock,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Camera,
//   Eye,
//   ImageIcon,
//   Banknote
// } from "lucide-react";
// import { toast } from "sonner";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import axiosInstance from "@/utils/fetch-function";
// import Loader from "@/components/ui/loader";
// import { useParams } from "next/navigation";
// import placeholder from "@/components/images/placeholder-product.webp"
// import { usePermission } from "@/hooks/usePermissionBusiness";

// // Mock user role - in real app this would come from auth context
// const USER_ROLE = "CREDIT_OFFICER"; // or "CREDIT_ADMIN"

// interface ScoringParameter {
//   id: number;
//   parameter: string;
//   weight: number;
//   status: "Active" | "Inactive";
//   score: number;
//   comment: string;
// }

// interface CreditData {
//   customerId: string;
//   customerName: string;
//   totalScore: number;
//   grading: string;
//   creditLimit: number;
//   currency: string;
//   parameters: ScoringParameter[];
// }

// const CreditScoringScreen = () => {
//   const { usePermissionGuard } = usePermission();

// usePermissionGuard('MANAGE_BNPL', {
//     redirectToNotPermitted: true,
//     toastMessage: "You don't have permission to manage BNPL customers"
//   });

//   const { id } = useParams()

//   // State for form inputs
//   const [creditLimit, setCreditLimit] = useState(0);
//   const [parametersData, setParametersData] = useState([]);
//   const [decision, setDecision] = useState(""); // New state for approve/reject decision
//   const [scoreUpdated, setScoreUpdated] = useState(false)
//   const [isImageModalOpen, setIsImageModalOpen] = useState(false);

//   const { data, isLoading } = useQuery({
//     queryKey: ['customerCreditData', id, scoreUpdated],
//     queryFn: () => axiosInstance.request({
//       url: `/credit-assessments/get-customer-record/${id}`,
//       method: 'GET'
//     })
//   })

//   const assessmentData = data?.data?.assessmentData
//   const parameterData = data?.data?.parameterData

//   // Initialize state when data is loaded
//   useEffect(() => {
//     if (assessmentData?.creditLimit) {
//       setCreditLimit(assessmentData.creditLimit);
//     }
//     if (parameterData) {
//       setParametersData(parameterData);
//     }
//   }, [assessmentData, parameterData]);

//   console.log(data);

//   const { mutate, isPending } = useMutation({
//     mutationFn: (data: any) => axiosInstance.request({
//       url: '/credit-assessments/save-credit-sore',
//       method: 'POST',
//       data
//     }),
//     onSuccess: (data) => {
//       if (data?.data?.code !== '000') {
//         toast.error(data?.data?.desc)
//         return
//       }
//       toast.success(data?.data?.desc || 'Credit Score Saved Successfully')
//       setScoreUpdated(!scoreUpdated)
//     }
//   })

//   // Check if user has access
//   const hasAccess = USER_ROLE === "CREDIT_OFFICER" || USER_ROLE === "CREDIT_ADMIN";

//   // Handle parameter score change
//   const handleScoreChange = (index: any, value: any) => {
//     const updatedParameters = [...parametersData];
//     updatedParameters[index] = {
//       ...updatedParameters[index],
//       score: parseFloat(value) || 0
//     };
//     setParametersData(updatedParameters);
//   };

//   // Handle parameter comment change
//   const handleCommentChange = (index: any, value: any) => {
//     const updatedParameters = [...parametersData];
//     updatedParameters[index] = {
//       ...updatedParameters[index],
//       comment: value
//     };
//     setParametersData(updatedParameters);
//   };

//   // Get decision details for styling and display
//   const getDecisionDetails = () => {
//     switch (data?.data?.approvalStatus?.toLowerCase()) {
//       case "approved":
//         return {
//           label: "Approved",
//           icon: CheckCircle,
//           bgColor: "bg-green-50",
//           borderColor: "border-green-200",
//           textColor: "text-green-700",
//           buttonColor: "bg-green-600 hover:bg-green-700",
//           iconColor: "text-green-600"
//         };
//       case "rejected":
//         return {
//           label: "Rejected",
//           icon: XCircle,
//           bgColor: "bg-red-50",
//           borderColor: "border-red-200",
//           textColor: "text-red-700",
//           buttonColor: "bg-red-600 hover:bg-red-700",
//           iconColor: "text-red-600"
//         };
//       default:
//         return {
//           label: "Pending Decision",
//           icon: AlertTriangle,
//           bgColor: "bg-yellow-50",
//           borderColor: "border-yellow-200",
//           textColor: "text-yellow-700",
//           buttonColor: "bg-accent hover:bg-accent/90",
//           iconColor: "text-yellow-600"
//         };
//     }
//   };

//   const decisionDetails = getDecisionDetails();
//   const DecisionIcon = decisionDetails.icon;

//   // Get image verification details for styling
//   const getImageVerificationDetails = () => {
//     const imageLive = data?.data?.imageLive;
//     const confidenceScore = parseFloat(data?.data?.imageConfidenceScore || "0");

//     if (imageLive) {
//       return {
//         status: "true",
//         statusColor: "text-green-700",
//         bgColor: "bg-green-50",
//         borderColor: "border-green-200",
//         icon: CheckCircle,
//         iconColor: "text-green-600",
//         confidenceColor: "text-green-700"
//       };
//     } else {
//       return {
//         status: "false",
//         statusColor: "text-red-700",
//         bgColor: "bg-red-50",
//         borderColor: "border-red-200",
//         icon: XCircle,
//         iconColor: "text-red-600",
//         confidenceColor: "text-red-700"
//       };
//     }
//   };

//   const imageVerificationDetails = getImageVerificationDetails();
//   const ImageIcon = imageVerificationDetails.icon;

//   const handleSave = () => {
//     if (!decision) {
//       toast.error("Please select a decision (Approve or Reject) before saving.");
//       return;
//     }

//     // Map the parameters data to the required format
//     const mappedParameters = parametersData.map((param: any) => ({
//       parameterCode: param.parameterCode,
//       parameterName: param.parameterName,
//       score: param.score || 0,
//       comment: param.comment || ""
//     }));

//     const payload = {
//       data: mappedParameters,
//       applicationRef: data?.data?.applicationRef,
//       creditLimit: creditLimit,
//       approve: decision === "approve" // Convert decision to boolean
//     };

//     console.log('Payload to send:', payload);
//     mutate(payload);
//   };

//   const getGradingColor = (grading: string) => {
//     switch (grading?.toLowerCase()) {
//       case "excellent": return "text-green-600 bg-green-50 border-green-200";
//       case "good": return "text-blue-600 bg-blue-50 border-blue-200";
//       case "fair": return "text-yellow-600 bg-yellow-50 border-yellow-200";
//       case "poor": return "text-orange-600 bg-orange-50 border-orange-200";
//       case "very poor": return "text-red-600 bg-red-50 border-red-200";
//       default: return "text-gray-600 bg-gray-50 border-gray-200";
//     }
//   };

//   if (!hasAccess) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Card className="w-96">
//           <CardContent className="pt-6">
//             <div className="text-center">
//               <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//               <h2 className="text-lg font-semibold mb-2">Access Restricted</h2>
//               <p className="text-muted-foreground">
//                 This screen is only accessible to Credit Officers and Credit Administrators.
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return <Loader text="Loading credit information" />
//   }

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">Credit Scoring</h1>
//             <p className="text-muted-foreground">Customer: {assessmentData?.customerName} (ID: {assessmentData?.id})</p>
//           </div>
//           <Badge variant="secondary" className="px-3 py-1">
//             <Shield className="h-4 w-4 mr-1" />
//             {USER_ROLE.replace("_", " ")}
//           </Badge>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Total Score */}
//           <Card className="border-primary/20 bg-accent/10">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
//                 <Calculator className="h-4 w-4 mr-2 text-accent" />
//                 Total Score
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-4xl font-bold text-primary mb-2">
//                 {assessmentData?.creditScore?.toFixed(2)}
//               </div>
//               <p className="text-sm text-muted-foreground">Out of 100</p>
//             </CardContent>
//           </Card>

//           {/* Grading */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
//                 <TrendingUp className="h-4 w-4 mr-2" />
//                 Credit Grading
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Badge
//                 variant="outline"
//                 className={`text-lg px-3 py-1 font-semibold ${getGradingColor(assessmentData?.grading)}`}
//               >
//                 {assessmentData?.grading}
//               </Badge>
//             </CardContent>
//           </Card>

//           {/* Credit Limit */}
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
//                 <Banknote className="h-4 w-4 mr-2" />
//                 Credit Limit
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center space-x-2">
//                 <Input
//                   type="number"
//                   value={creditLimit}
//                   onChange={(e) => setCreditLimit(parseFloat(e.target.value) || 0)}
//                   className="text-lg font-semibold"
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Image Verification & Decision Status Row */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Image Verification Card */}
//           <Card className={`${imageVerificationDetails.bgColor} ${imageVerificationDetails.borderColor} border-2`}>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
//                 <div className="flex items-center">
//                   <Camera className={`h-4 w-4 mr-2 ${imageVerificationDetails.iconColor}`} />
//                   Liveness Check Verification
//                 </div>
//                 <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
//                   <DialogTrigger asChild>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="text-xs"
//                     >
//                       <Eye className="h-3 w-3 mr-1" />
//                       View Images
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//                     <DialogHeader>
//                       <DialogTitle className="flex items-center">
//                         <ImageIcon className="h-5 w-5 mr-2" />
//                         Identity Verification Images
//                       </DialogTitle>
//                     </DialogHeader>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
//                       {/* Live Image */}
//                       <div className="space-y-3">
//                         <h3 className="font-semibold text-lg flex items-center">
//                           <Camera className="h-4 w-4 mr-2 text-green-600" />
//                           Live Image
//                         </h3>
//                         {data?.data?.liveImageLink ? (
//                           <div className="relative">
//                             <img
//                               src={data.data.liveImageLink || placeholder.src}
//                               alt="Live verification image"
//                               className="w-full h-auto rounded-lg border-2 border-green-200 shadow-md"
//                             />
//                             <Badge
//                               className="absolute top-2 right-2 bg-green-600 text-white"
//                             >
//                               Live
//                             </Badge>
//                           </div>
//                         ) : (
//                           <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
//                             <div className="text-center text-gray-500">
//                               <Camera className="h-8 w-8 mx-auto mb-2" />
//                               <p>No live image available</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       {/* Document Image */}
//                       <div className="space-y-3">
//                         <h3 className="font-semibold text-lg flex items-center">
//                           <ImageIcon className="h-4 w-4 mr-2 text-blue-600" />
//                           Document Image
//                         </h3>
//                         {data?.data?.documentImageLink ? (
//                           <div className="relative">
//                             <img
//                               src={data.data.documentImageLink || placeholder.src}
//                               alt="Document verification image"
//                               className="w-full h-auto rounded-lg border-2 border-blue-200 shadow-md"
//                               onError={(e) => {
//                                 e.currentTarget.src = "/placeholder.svg";
//                               }}
//                             />
//                             <Badge
//                               className="absolute top-2 right-2 bg-blue-600 text-white"
//                             >
//                               Document
//                             </Badge>
//                           </div>
//                         ) : (
//                           <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
//                             <div className="text-center text-gray-500">
//                               <ImageIcon className="h-8 w-8 mx-auto mb-2" />
//                               <p>No document image available</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Image Details */}
//                     <div className="border-t pt-4">
//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <span className="font-medium text-muted-foreground">Verification Status:</span>
//                           <Badge
//                             variant="outline"
//                             className={`ml-2 ${imageVerificationDetails.statusColor} ${imageVerificationDetails.bgColor} ${imageVerificationDetails.borderColor}`}
//                           >
//                             {imageVerificationDetails.status}
//                           </Badge>
//                         </div>
//                         <div>
//                           <span className="font-medium text-muted-foreground">Confidence Score:</span>
//                           <span className={`ml-2 font-bold ${imageVerificationDetails.confidenceColor}`}>
//                             {parseFloat(data?.data?.imageConfidenceScore || "0").toFixed(1)}%
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               {/* Image Status */}
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-muted-foreground">Status:</span>
//                 <Badge
//                   variant="outline"
//                   className={`${imageVerificationDetails.statusColor} ${imageVerificationDetails.bgColor} ${imageVerificationDetails.borderColor} font-semibold`}
//                 >
//                   <ImageIcon className={`h-3 w-3 mr-1 ${imageVerificationDetails.iconColor}`} />
//                   {imageVerificationDetails.status}
//                 </Badge>
//               </div>

//               {/* Confidence Score */}
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-muted-foreground">Confidence:</span>
//                 <div className="flex items-center space-x-2">
//                   <span className={`text-lg font-bold ${imageVerificationDetails.confidenceColor}`}>
//                     {parseFloat(data?.data?.imageConfidenceScore || "0").toFixed(1)}%
//                   </span>
//                 </div>
//               </div>

//               {/* Additional Info */}
//               <div className={`mt-3 p-2 rounded ${imageVerificationDetails.bgColor} border ${imageVerificationDetails.borderColor}`}>
//                 <p className={`text-xs ${imageVerificationDetails.statusColor}`}>
//                   {data?.data?.imageLive
//                     ? "✓ Live image detected - Higher verification confidence"
//                     : "⚠ Not enough confidence - Additional verification may be required"
//                   }
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Decision Status Card */}
//           <Card className={`${decisionDetails.bgColor} ${decisionDetails.borderColor} border-2`}>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
//                 <DecisionIcon className={`h-4 w-4 mr-2 ${decisionDetails.iconColor}`} />
//                 Decision Status
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="flex items-center justify-center">
//               <Badge
//                 variant="outline"
//                 className={`text-lg px-4 py-2 font-semibold ${decisionDetails.textColor} ${decisionDetails.bgColor} ${decisionDetails.borderColor}`}
//               >
//                 {decisionDetails.label}
//               </Badge>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Decision Selection Card */}
//         <Card className="border-2 border-primary/20">
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <DecisionIcon className={`h-5 w-5 mr-2 ${decisionDetails.iconColor}`} />
//               Credit Assessment Decision
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="decision" className="text-base font-medium">
//                   Select Decision
//                 </Label>
//                 <Select value={decision} onValueChange={setDecision}>
//                   <SelectTrigger className="w-full mt-2 h-12 text-base">
//                     <SelectValue placeholder="Choose to approve or reject this credit application" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="approve" className="text-green-700 focus:text-green-700">
//                       <div className="flex items-center">
//                         <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
//                         Approve Credit Application
//                       </div>
//                     </SelectItem>
//                     <SelectItem value="reject" className="text-red-700 focus:text-red-700">
//                       <div className="flex items-center">
//                         <XCircle className="h-4 w-4 mr-2 text-red-600" />
//                         Reject Credit Application
//                       </div>
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {decision && (
//                 <div className={`p-4 rounded-lg ${decisionDetails.bgColor} ${decisionDetails.borderColor} border`}>
//                   <div className="flex items-center">
//                     <DecisionIcon className={`h-5 w-5 mr-2 ${decisionDetails.iconColor}`} />
//                     <span className={`font-medium ${decisionDetails.textColor}`}>
//                       {decision === "approve"
//                         ? "You have selected to APPROVE this credit application."
//                         : "You have selected to REJECT this credit application."
//                       }
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Scoring Parameters Table */}
//         <Card className="w-full">
//           <CardHeader>
//             <CardTitle>Scoring Parameters</CardTitle>
//           </CardHeader>
//           <CardContent className="w-full">
//             <Table
//               columns={[
//                 {
//                   title: 'S/N',
//                   dataIndex: 'serialNo',
//                   key: 'serialNo',
//                   align: 'center',
//                   width: 50,
//                   render: (text: string, record: any, index: number) => index + 1,
//                 },
//                 {
//                   title: 'Parameter',
//                   dataIndex: 'parameterName',
//                   key: 'parameterName',
//                   className: 'font-medium',
//                   render: (parameter: string) => <span className="font-medium">{parameter}</span>
//                 },
//                 {
//                   title: 'Score (0-10)',
//                   dataIndex: 'score',
//                   key: 'score',
//                   width: 120,
//                   render: (score: number, record: any, index: number) => (
//                     <Input
//                       type="number"
//                       min="0"
//                       max="10"
//                       step="0.1"
//                       value={record.score || 0}
//                       onChange={(e) => handleScoreChange(index, e.target.value)}
//                       className="w-20"
//                     />
//                   )
//                 },
//                 {
//                   title: 'Comment',
//                   dataIndex: 'comment',
//                   key: 'comment',
//                   render: (comment: string, record: any, index: number) => (
//                     <Textarea
//                       value={record.comment || ''}
//                       onChange={(e) => handleCommentChange(index, e.target.value)}
//                       placeholder="Add comment..."
//                       className="min-h-[60px] resize-none"
//                     />
//                   )
//                 }
//               ]}
//               data={parametersData}
//               rowKey="parameterCode"
//               className="rc-table w-full"
//               tableLayout="fixed"
//             />
//           </CardContent>
//         </Card>

//         {/* Save Button */}
//         <div className="flex justify-center pt-4">
//           <Button
//             onClick={handleSave}
//             disabled={isPending || !decision}
//             size="lg"
//             className={`px-8 text-white transition-all duration-200 ${decisionDetails.buttonColor} ${!decision ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
//           >
//             <Save className="h-4 w-4 mr-2" />
//             {isPending
//               ? 'Saving...'
//               : decision
//                 ? `${data?.data?.approvalStatus ? 'Update & ' : 'Save & '}${decision === 'approve' ? 'Approve' : 'Reject'}`
//                 : 'Select Decision First'
//             }
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreditScoringScreen;
