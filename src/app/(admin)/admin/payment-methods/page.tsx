'use client'
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, AlertCircle } from "lucide-react";
import { PaymentMethod, PaymentMethodsResponse } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { PaymentMethodsTable } from "@/components/Admin/payment-methods/payment-methods-table";
import { PaymentMethodModal } from "@/components/Admin/payment-methods/payment-method-modal";
import axiosInstance from "@/utils/fetch-function";
import useUser from "@/store/userStore";
import { usePermission } from "@/hooks/usePermissionBusiness";

const PaymentMethods: React.FC = () => {
  const { usePermissionGuard } = usePermission();

usePermissionGuard('MANAGE_PAYMENT_METHODS', {
    redirectToNotPermitted: true,
    toastMessage: "You don't have permission to manage payment methods"
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<PaymentMethod | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const isH2P = process.env.NEXT_PUBLIC_ENTITYCODE === 'H2P';


  const { data, isLoading } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => axiosInstance.request<PaymentMethodsResponse>({
      url: '/payment-methods/fetch',
      method: 'GET',
      params: {
        storeCode: user?.storeCode || ''
      }
    })
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => axiosInstance.request({
      url: '/payment-methods/save',
      method: 'POST',
      params: {
        storeCode: user?.storeCode || ''
      },
      data
    }),
    onSuccess: (data) => {
      if (data?.data?.code !== '000') {
        toast({
          title: 'Error',
          description: data?.data?.desc || 'Failed to save payment method',
        })
        return
      }

      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast({
        title: "Success",
        description: editData
          ? "Payment method updated successfully"
          : "Payment method created successfully",
      });
      setModalOpen(false);
      setEditData(null);
      return
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save payment method",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (code: string): Promise<void> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast({
        title: "Success",
        description: "Payment method deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete payment method",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (method: PaymentMethod) => {
    setEditData(method);
    setModalOpen(true);
  };

  const handleDelete = (code: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      deleteMutation.mutate(code);
    }
  };

  const handleAddNew = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paymentMethods = data?.data?.list || [];
  const totalRecords = paymentMethods.length;

  if (!isH2P) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-accent/10 rounded-full p-4">
              <AlertCircle className="w-8 h-8 text-accent/60" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Methods
          </h1>

          <p className="text-gray-600 mb-6">
            This feature is coming soon. We're working hard to bring you a seamless way to manage payments with your preffered payment methods.
          </p>

          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              ✓ Payment management<br />
              ✓ User-friendly features<br />
              ✓ Multiple payment methods
            </p>
          </div>

          <p className="text-xs text-gray-400 mt-8">
            Stay tuned for updates
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Payment Methods
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your store's payment options
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{totalRecords}</p>
                <p className="text-sm text-muted-foreground">Total Methods</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-elevated p-6">
          <div className="flex float-right py-4">
            <Button
              onClick={handleAddNew}
              className="bg-accent text-white hover:opacity-90 transition-opacity shadow-elevated"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Payment Method
            </Button>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <PaymentMethodsTable
              data={paymentMethods}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        <PaymentMethodModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditData(null);
          }}
          editData={editData}
          saveMutation={saveMutation}
        />
      </div>
    </div>
  );
};

export default PaymentMethods;