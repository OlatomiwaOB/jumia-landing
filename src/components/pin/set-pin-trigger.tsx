"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LockIcon } from "@/components/ui/lock-icon";
import TransactionPinModal from "./transaction-pin-modal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SetPinButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsModalOpen(true)}
            className="relative hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <LockIcon className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Set Transaction PIN</p>
        </TooltipContent>
      </Tooltip>
      
      <TransactionPinModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </TooltipProvider>
  );
};

export default SetPinButton;