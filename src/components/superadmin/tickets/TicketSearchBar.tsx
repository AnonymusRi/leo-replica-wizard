
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TicketSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const TicketSearchBar = ({ searchTerm, onSearchChange }: TicketSearchBarProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Search className="w-4 h-4 text-gray-400" />
      <Input
        placeholder="Cerca ticket..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};
