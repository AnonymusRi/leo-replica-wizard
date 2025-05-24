
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, Square, Plus, User, Clock } from "lucide-react";
import { useChecklistItems, useQuoteChecklistProgress, useUpdateChecklistProgress } from "@/hooks/useSalesChecklists";
import { format } from "date-fns";

interface SalesChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  quoteNumber: string;
}

export const SalesChecklistModal = ({ open, onOpenChange, quoteId, quoteNumber }: SalesChecklistModalProps) => {
  const [newItemText, setNewItemText] = useState("");
  const [selectedItemNotes, setSelectedItemNotes] = useState<Record<string, string>>({});
  
  // For demo purposes, using the default checklist
  const defaultChecklistId = "default-checklist-id";
  const { data: checklistItems = [] } = useChecklistItems(defaultChecklistId);
  const { data: progress = [] } = useQuoteChecklistProgress(quoteId);
  const updateProgress = useUpdateChecklistProgress();

  const handleToggleItem = (itemId: string, isCompleted: boolean) => {
    updateProgress.mutate({
      quote_id: quoteId,
      checklist_item_id: itemId,
      is_completed: isCompleted,
      completed_by: "Current User", // In a real app, this would be the logged-in user
      notes: selectedItemNotes[itemId] || undefined
    });
  };

  const getItemProgress = (itemId: string) => {
    return progress.find(p => p.checklist_item_id === itemId);
  };

  const completedItems = progress.filter(p => p.is_completed).length;
  const totalItems = checklistItems.length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-blue-600" />
              Sales Checklist - {quoteNumber}
            </div>
            <Badge variant="outline">
              {completedItems}/{totalItems} completed ({completionPercentage}%)
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Overview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Checklist Items */}
          <div className="space-y-3">
            {checklistItems.map((item) => {
              const itemProgress = getItemProgress(item.id);
              const isCompleted = itemProgress?.is_completed || false;
              
              return (
                <Card key={item.id} className={`transition-all ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={(checked) => handleToggleItem(item.id, checked as boolean)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${isCompleted ? 'line-through text-gray-600' : ''}`}>
                            {item.item_text}
                            {item.is_required && (
                              <Badge variant="secondary" className="ml-2 text-xs">Required</Badge>
                            )}
                          </p>
                          
                          {isCompleted && itemProgress && (
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="w-4 h-4 mr-1" />
                              {itemProgress.completed_by}
                              <Clock className="w-4 h-4 ml-2 mr-1" />
                              {format(new Date(itemProgress.completed_at || ''), 'dd/MM HH:mm')}
                            </div>
                          )}
                        </div>
                        
                        {/* Notes for this item */}
                        <div className="mt-2">
                          <Textarea
                            placeholder="Add notes for this item..."
                            value={selectedItemNotes[item.id] || itemProgress?.notes || ''}
                            onChange={(e) => setSelectedItemNotes(prev => ({
                              ...prev,
                              [item.id]: e.target.value
                            }))}
                            className="text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Add Custom Item */}
          <Card className="border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Plus className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <Input
                    placeholder="Add custom checklist item for this quote..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                  />
                </div>
                <Button 
                  size="sm" 
                  disabled={!newItemText.trim()}
                  onClick={() => {
                    // In a real implementation, this would create a custom item for this quote
                    console.log("Adding custom item:", newItemText);
                    setNewItemText("");
                  }}
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {completedItems === totalItems ? (
                <span className="text-green-600 font-medium">✓ All items completed!</span>
              ) : (
                <span>{totalItems - completedItems} items remaining</span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              {completedItems === totalItems && (
                <Button>
                  Mark Quote as Ready
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
