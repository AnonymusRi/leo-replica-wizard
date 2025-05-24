
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface VersionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionModal = ({ isOpen, onClose }: VersionModalProps) => {
  const [versionData, setVersionData] = useState({
    name: "Summer 2023",
    description: "Alternative timings",
    client: "Tour Operator"
  });

  const handleCreate = () => {
    console.log("Creating new version:", versionData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Create New Version</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={versionData.name}
              onChange={(e) => setVersionData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={versionData.description}
              onChange={(e) => setVersionData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="client">Client</Label>
            <Input
              id="client"
              value={versionData.client}
              onChange={(e) => setVersionData(prev => ({ ...prev, client: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              CANCEL
            </Button>
            <Button 
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-700"
            >
              CREATE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
