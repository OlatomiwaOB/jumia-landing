import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Mail, Phone, MapPin, Calendar, User } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

interface CustomerHeaderProps {
  userInfo: {
    fullname: string;
    id: number;
    userRole: string;
    email: string;
    mobileNo: string;
    city?: string;
    state?: string;
    status: string;
    createdDate: string;
  };
}

export function CustomerHeader({ userInfo }: CustomerHeaderProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    } catch {
      return dateString.split(' ')[0] || dateString;
    }
  };

  return (
    <Card className="shadow-header bg-gradient-header border-0 overflow-hidden">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-elevated transition-all duration-300 group-hover:shadow-header">
                <AvatarFallback className="text-xl font-bold bg-gradient-primary text-primary-foreground">
                  {getInitials(userInfo.fullname)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2">
                <StatusBadge status={userInfo.status} size="sm" />
              </div>
            </div>
          </div>
          
          {/* Customer Info */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                {userInfo.fullname}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer ID: {userInfo.id}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="text-sm font-medium text-primary">
                  {userInfo.userRole}
                </span>
              </div>
            </div>
            
            {/* Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50 transition-all duration-200 hover:bg-card hover:shadow-card">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium truncate">{userInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50 transition-all duration-200 hover:bg-card hover:shadow-card">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-foreground font-medium truncate">{userInfo.mobileNo}</p>
                </div>
              </div>

              {(userInfo.city || userInfo.state) && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50 transition-all duration-200 hover:bg-card hover:shadow-card">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-foreground font-medium truncate">
                      {[userInfo.city, userInfo.state].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50 transition-all duration-200 hover:bg-card hover:shadow-card">
                <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="text-foreground font-medium">{formatDate(userInfo.createdDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}