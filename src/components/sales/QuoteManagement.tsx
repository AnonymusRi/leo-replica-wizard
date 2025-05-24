
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Clock, Plus, Send, MessageSquare, CheckSquare, Calculator, Euro, Share } from "lucide-react";
import { useQuotes } from "@/hooks/useQuotes";
import { useAirports } from "@/hooks/useAirports";
import { format } from "date-fns";
import { SalesChecklistModal } from "./SalesChecklistModal";
import { AdvancedQuoteModal } from "./AdvancedQuoteModal";

export const QuoteManagement = () => {
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showAdvancedQuoteModal, setShowAdvancedQuoteModal] = useState(false);
  const { data: quotes = [], isLoading } = useQuotes();
  const { data: airports = [] } = useAirports();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getTimeFrameUnderlining = (departureDate: string) => {
    const now = new Date();
    const departure = new Date(departureDate);
    const hoursUntilDeparture = (departure.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDeparture < 24) return "border-b-4 border-red-500";
    if (hoursUntilDeparture < 72) return "border-b-4 border-orange-500";
    return "border-b-4 border-green-500";
  };

  const getPricingMethodBadge = (quote: any) => {
    if (quote.pricing_method === 'costs_margin') {
      return <Badge variant="outline" className="text-xs">Costs+Margin</Badge>;
    }
    return <Badge variant="outline" className="text-xs">Price+Margin</Badge>;
  };

  const filteredQuotes = quotes.filter(quote => {
    const statusMatch = filterStatus === "all" || quote.status === filterStatus;
    const searchMatch = quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       quote.client?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       quote.departure_airport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       quote.arrival_airport.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading quotes...</div>;
  }

  const selectedQuoteData = quotes.find(q => q.id === selectedQuote);

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quote Management</h2>
          <p className="text-gray-600">Advanced quote management with marketplace integrations</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAdvancedQuoteModal(true)} className="bg-green-600 hover:bg-green-700">
            <Calculator className="w-4 h-4 mr-2" />
            Advanced Quote
          </Button>
          <Input
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quotes List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Quotes & Requests</span>
                <Badge variant="outline">{filteredQuotes.length} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedQuote === quote.id ? 'ring-2 ring-blue-500' : ''
                    } ${getTimeFrameUnderlining(quote.departure_date)}`}
                    onClick={() => setSelectedQuote(quote.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-blue-600">{quote.quote_number}</span>
                          <Badge className={getStatusColor(quote.status || 'pending')}>
                            {quote.status || 'pending'}
                          </Badge>
                          {getPricingMethodBadge(quote)}
                          {quote.marketplace_source !== 'direct' && (
                            <Badge variant="secondary" className="text-xs">
                              {quote.marketplace_source}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {quote.departure_airport} → {quote.arrival_airport}
                            </div>
                            <div className="flex items-center text-gray-600 mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {format(new Date(quote.departure_date), 'dd/MM/yyyy')}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center text-gray-600">
                              <Users className="w-4 h-4 mr-1" />
                              {quote.passenger_count} passengers
                            </div>
                            <div className="text-gray-600 mt-1">
                              {quote.client?.company_name || 'TBD'}
                            </div>
                          </div>
                        </div>

                        {/* Pricing breakdown preview for costs+margin method */}
                        {quote.pricing_method === 'costs_margin' && (
                          <div className="mt-2 text-xs text-gray-500 grid grid-cols-2 gap-1">
                            {quote.base_cost && <div>Base: €{quote.base_cost.toLocaleString()}</div>}
                            {quote.fuel_cost && <div>Fuel: €{quote.fuel_cost.toLocaleString()}</div>}
                            {quote.crew_cost && <div>Crew: €{quote.crew_cost.toLocaleString()}</div>}
                            {quote.margin_percentage && <div>Margin: {quote.margin_percentage}%</div>}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold flex items-center">
                          <Euro className="w-4 h-4 mr-1" />
                          {quote.total_amount ? `${quote.total_amount.toLocaleString()}` : 'TBD'}
                        </div>
                        {quote.vat_amount && (
                          <div className="text-xs text-gray-500">
                            +VAT €{quote.vat_amount.toLocaleString()}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          {format(new Date(quote.created_at), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quote Details Sidebar */}
        <div className="space-y-4">
          {selectedQuote ? (
            <QuoteDetailsSidebar 
              quoteId={selectedQuote} 
              onOpenChecklist={() => setShowChecklistModal(true)}
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a quote to view details and manage</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <AdvancedQuoteModal 
        open={showAdvancedQuoteModal} 
        onOpenChange={setShowAdvancedQuoteModal} 
      />
      
      {selectedQuoteData && (
        <SalesChecklistModal
          open={showChecklistModal}
          onOpenChange={setShowChecklistModal}
          quoteId={selectedQuote!}
          quoteNumber={selectedQuoteData.quote_number}
        />
      )}
    </div>
  );
};

const QuoteDetailsSidebar = ({ 
  quoteId, 
  onOpenChecklist 
}: { 
  quoteId: string; 
  onOpenChecklist: () => void;
}) => {
  const { data: quotes = [] } = useQuotes();
  const quote = quotes.find(q => q.id === quoteId);

  if (!quote) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Quote Details</span>
          <Badge className={quote.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
            {quote.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Quote Number</Label>
          <p className="text-lg font-semibold text-blue-600">{quote.quote_number}</p>
        </div>

        <div>
          <Label className="text-sm font-medium">Route</Label>
          <p className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {quote.departure_airport} → {quote.arrival_airport}
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium">Client</Label>
          <p>{quote.client?.company_name || 'TBD'}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-medium">Passengers</Label>
            <p className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {quote.passenger_count}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Amount</Label>
            <p className="font-semibold">
              {quote.total_amount ? `€${quote.total_amount.toLocaleString()}` : 'TBD'}
            </p>
          </div>
        </div>

        {/* Pricing details for costs+margin */}
        {quote.pricing_method === 'costs_margin' && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <Label className="text-sm font-medium">Cost Breakdown</Label>
            <div className="text-sm space-y-1 mt-1">
              {quote.base_cost && <div className="flex justify-between"><span>Base:</span><span>€{quote.base_cost.toLocaleString()}</span></div>}
              {quote.fuel_cost && <div className="flex justify-between"><span>Fuel:</span><span>€{quote.fuel_cost.toLocaleString()}</span></div>}
              {quote.crew_cost && <div className="flex justify-between"><span>Crew:</span><span>€{quote.crew_cost.toLocaleString()}</span></div>}
              {quote.margin_percentage && <div className="flex justify-between"><span>Margin:</span><span>{quote.margin_percentage}%</span></div>}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button className="w-full" size="sm" onClick={onOpenChecklist}>
            <CheckSquare className="w-4 h-4 mr-2" />
            Sales Checklist
          </Button>
          <Button className="w-full" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share Trip Details
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            Edit Quote
          </Button>
        </div>

        {quote.notes && (
          <div>
            <Label className="text-sm font-medium">Notes</Label>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {quote.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
