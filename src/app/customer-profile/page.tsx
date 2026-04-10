'use client'
import React from 'react';
import { User, Mail, Phone, Calendar, Shield, Globe, Building, CreditCard, BadgeCheck, MapPin, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useCustomer from '@/store/customerStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


const ProfilePage = () => {
  const { customer } = useCustomer();
  const router = useRouter();

  if (!customer) {
    return (
      <div className="min-h-screen bg-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-accent-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-accent/5 p-4 lg:p-6">

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-muted-foreground hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </Button>
        </div>
        <div className="bg-accent text-white rounded-2xl p-6 lg:p-8 mb-6 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-white/20">
              <AvatarImage src={customer.photoLink} />
              <AvatarFallback className="bg-white text-accent text-2xl font-semibold">
                {customer.firstname?.charAt(0)}{customer.lastname?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold mb-2">{customer.fullname}</h1>
                  <p className="text-white/80 text-lg">{customer.customerId}</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-end mt-4 lg:mt-0">
                  <Badge className="bg-white text-accent px-3 py-1">
                    {customer.customerTier}
                  </Badge>
                  <Badge className={`${getStatusColor(customer.kycTierStatus ?? null)} text-white px-3 py-1`}>
                    {customer.kycTierStatus || 'KYC Not Started'}
                  </Badge>
                  {customer.twoFaLinked === 'Y' && (
                    <Badge className="bg-blue-500 text-white px-3 py-1">
                      2FA Enabled
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Building className="w-5 h-5" />
                  <span className="text-sm lg:text-base">{customer.entityName}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Globe className="w-5 h-5" />
                  <span className="text-sm lg:text-base">{customer.country}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm lg:text-base">{customer.ccy}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm lg:text-base">{customer.userRole}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="bg-accent/10">
              <CardTitle className="flex items-center gap-2 text-accent">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-lg font-semibold mt-1">{customer.fullname}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-accent" />
                      <p className="text-lg">{customer.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Mobile Number</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-accent" />
                      <p className="text-lg">{customer.mobileNo}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Customer ID</label>
                    <p className="text-lg font-mono font-semibold mt-1">{customer.customerId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Referral Code</label>
                    <p className="text-lg font-mono font-semibold mt-1">{customer.referalCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-accent" />
                      <p className="text-lg">{customer.lastLoginDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-accent/10">
              <CardTitle className="flex items-center gap-2 text-accent">
                <BadgeCheck className="w-5 h-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">KYC Status</span>
                <Badge className={getStatusColor(customer.kycTierStatus ?? null)}>
                  {customer.kycTierStatus || 'Not Started'}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">2FA Status</span>
                <Badge className={customer.twoFaLinked === 'Y' ? 'bg-green-500' : 'bg-red-500'}>
                  {customer.twoFaLinked === 'Y' ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">PIN Set</span>
                <Badge className={customer.pinSet ? 'bg-green-500' : 'bg-yellow-500'}>
                  {customer.pinSet ? 'Yes' : 'No'}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Password Change</span>
                <Badge className={customer.forcePwdChange === 'Y' ? 'bg-red-500' : 'bg-green-500'}>
                  {customer.forcePwdChange === 'Y' ? 'Required' : 'Not Required'}
                </Badge>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Customer Tier</span>
                  <Badge className="bg-accent text-white">
                    {customer.customerTier}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-accent/10">
              <CardTitle className="flex items-center gap-2 text-accent">
                <Building className="w-5 h-5" />
                Entity Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Entity Name</label>
                <p className="text-lg font-semibold mt-1">{customer.entityName}</p>
              </div>

              {/* <div>
                <label className="text-sm font-medium text-muted-foreground">Entity Code</label>
                <p className="text-lg font-mono font-semibold mt-1">{customer.entityCode}</p>
              </div> */}

              <div>
                <label className="text-sm font-medium text-muted-foreground">User Role</label>
                <p className="text-lg font-semibold mt-1">{customer.userRole}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-accent/10">
              <CardTitle className="flex items-center gap-2 text-accent">
                <Globe className="w-5 h-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Language</label>
                <p className="text-lg font-semibold mt-1">{customer.language}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Currency</label>
                <div className="flex items-center gap-2 mt-1">
                  <CreditCard className="w-4 h-4 text-accent" />
                  <p className="text-lg font-semibold">{customer.ccy}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Country</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-accent" />
                  <p className="text-lg font-semibold">{customer.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="bg-accent/10">
              <CardTitle className="flex items-center gap-2 text-accent">
                <Shield className="w-5 h-5" />
                Security & Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Two-Factor Authentication</span>
                    <Badge className={customer.twoFaLinked === 'Y' ? 'bg-green-500' : 'bg-gray-500'}>
                      {customer.twoFaLinked === 'Y' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Setup Required</span>
                    <Badge className={customer.twoFaSetupRequired === 'Y' ? 'bg-yellow-500' : 'bg-green-500'}>
                      {customer.twoFaSetupRequired === 'Y' ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Transaction PIN</span>
                    <Badge className={customer.pinSet ? 'bg-green-500' : 'bg-yellow-500'}>
                      {customer.pinSet ? 'Set' : 'Not Set'}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Password Status</span>
                    <Badge className={customer.forcePwdChange === 'Y' ? 'bg-red-500' : 'bg-green-500'}>
                      {customer.forcePwdChange === 'Y' ? 'Change Required' : 'Secure'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;