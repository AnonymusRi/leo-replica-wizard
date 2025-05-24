
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal = ({ isOpen, onClose }: ExportModalProps) => {
  const [dateRange, setDateRange] = useState("27 Aug – 03 Sep 2023");

  const navigateDate = (direction: "prev" | "next") => {
    // Handle date navigation logic here
    console.log(`Navigate ${direction}`);
  };

  const handleExport = (format: "excel" | "ssim") => {
    console.log(`Exporting in ${format} format for range: ${dateRange}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Export</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">8 days</div>
            <div className="flex items-center justify-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium">{dateRange}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigateDate("next")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              TODAY
            </Button>
          </div>

          <div className="flex justify-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              CANCEL
            </Button>
            <Button 
              onClick={() => handleExport("excel")}
              className="bg-green-600 hover:bg-green-700"
            >
              EXCEL 🗃
            </Button>
            <Button 
              onClick={() => handleExport("ssim")}
              className="bg-green-600 hover:bg-green-700"
            >
              SSIM
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
