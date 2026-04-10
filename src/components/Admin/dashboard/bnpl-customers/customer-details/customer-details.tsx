'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Shield,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/fetch-function";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { getStatusBadge } from "@/utils/helperfns";

interface CreditAssessment {
  score: number;
  grade: string;
  riskLevel: "Low" | "Medium" | "High";
  lastUpdated: string;
  factors: {
    paymentHistory: number;
    creditUtilization: number;
    lengthOfHistory: number;
    creditMix: number;
    newCredit: number;
  };
}

const CustomerDetailScreen = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const {id} = useParams()
  const searchParams = useSearchParams()
  const entityCode = searchParams.get('entityCode')

  const {data,isLoading} = useQuery({
   queryKey: ['customer-detail'],
   queryFn: ()=>axiosInstance.request({
    method: 'GET',
    url: `/customer/detail`,
    params: {
      username: decodeURIComponent(id as string),
      entityCode
    }
   })
  })

  const userInfo = data?.data?.userInfo
  const documentsInfo = data?.data?.documents
  

   if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading customer details...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Customer Header */}
      <Card className="shadow-[var(--shadow-card)] border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                {/* <AvatarImage src={customerAvatar} alt={customer.name} /> */}
                <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                  {userInfo?.fullname.split(' ').map((n:string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {/* <Badge className={`mt-3 ${getStatusBadge(userInfo?.status)}`}>
                {userInfo?.status}
              </Badge> */}
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-card-foreground">{userInfo?.fullname}</h1>
                <p className="text-muted-foreground">Customer ID: {userInfo?.id}</p>
                <p className="text-sm text-muted-foreground mt-1">{userInfo?.userRole}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-accent-foreground" />
                  <span className="text-card-foreground">{userInfo?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-accent-foreground" />
                  <span className="text-card-foreground">{userInfo?.mobileNo}</span>
                </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className={`${!userInfo?.city&&!userInfo?.state?'hidden':''} h-4 w-4 text-accent-foreground`}  />
                  <span className="text-card-foreground">{userInfo?.city||null} {userInfo?.state||null}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-accent-foreground" />
                  <span className="text-card-foreground">Since {userInfo?.createdDate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger value="overview" className="data-[state=active]:bg-card">
            <User className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-card">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                  <p className="text-card-foreground">{userInfo?.fullname}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
                  <p className="text-card-foreground">{userInfo?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Phone Number</label>
                  <p className="text-card-foreground">{userInfo?.mobileNo}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Account Type</label>
                  <p className="text-card-foreground">{userInfo?.userRole}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Street Address</label>
                  <p className="text-card-foreground">{userInfo?.address||'NIL'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">City</label>
                    <p className="text-card-foreground">{userInfo?.city||'NIL'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">State</label>
                    <p className="text-card-foreground">{userInfo?.state||'NIL'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* <div>
                    <label className="text-sm font-medium text-muted-foreground">ZIP Code</label>
                    <p className="text-card-foreground">{customer.address.zipCode}</p>
                  </div> */}
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Country</label>
                    <p className="text-card-foreground">{userInfo?.country||'NIL'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6 mt-6">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Customer Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {
                  documentsInfo?.length===0 ? <p className="text-center text-sm text-muted-foreground">No documents available.</p>
                  :
                  documentsInfo?.map((doc:any) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-accent-foreground" />
                      <div>
                        <h4 className="font-medium text-card-foreground">{doc?.title}</h4>
                        {/* <p className="text-sm text-muted-foreground">{doc.type} • {doc.size}</p> */}
                        {/* <p className="text-xs text-muted-foreground">Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</p> */}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusBadge(doc.verifyStatus)}>
                        {doc.verifyStatus}
                      </Badge>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                            <DialogHeader>
                              <DialogTitle className="text-lg font-semibold mb-4">
                                {doc?.title}
                              </DialogTitle>
                            </DialogHeader>
                            
                            <div className="flex items-center justify-center p-4 overflow-hidden">
                              <div className="relative w-full max-w-3xl">
                                <Image 
                                  src={doc?.link} 
                                  alt={doc?.title}
                                  width={800}
                                  height={600}
                                  className="w-full h-auto object-contain rounded-lg border border-border shadow-sm max-h-[70vh]"
                                  priority={false}
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Link href={doc?.link} target="_blank" download={true}>
                          <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default CustomerDetailScreen;