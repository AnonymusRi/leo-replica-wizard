
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface OpsTableHeaderProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
}

export const OpsTableHeader = ({ selectedCount, totalCount, onSelectAll }: OpsTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50">
        <TableHead className="w-12">
          <Checkbox 
            checked={selectedCount === totalCount}
            onCheckedChange={onSelectAll}
          />
        </TableHead>
        <TableHead className="w-20">FW & JL</TableHead>
        <TableHead>Flight No.</TableHead>
        <TableHead className="w-16">ICAO type</TableHead>
        <TableHead className="w-16">Day</TableHead>
        <TableHead className="w-20">Date</TableHead>
        <TableHead className="w-16">STD</TableHead>
        <TableHead className="w-20">ADEP</TableHead>
        <TableHead className="w-20">ADES</TableHead>
        <TableHead>COM</TableHead>
        <TableHead className="w-16">Crew</TableHead>
        <TableHead className="w-16">CPT</TableHead>
        <TableHead className="w-16">CPT2</TableHead>
        <TableHead className="w-16">FO</TableHead>
        <TableHead className="w-16">FA1</TableHead>
        <TableHead>Trip No.</TableHead>
        <TableHead>PAX / Cargo</TableHead>
        <TableHead>Show Properties</TableHead>
        <TableHead>Tags</TableHead>
        <TableHead className="w-12"></TableHead>
      </TableRow>
    </TableHeader>
  );
};
