
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarIcon, Calculator, Percent, DollarSign } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useClients } from "@/hooks/useClients";
import { useVatRates } from "@/hooks/useVatRates";
import { useCreateFlight } from "@/hooks/useFlights";
import { toast } from "sonner";

interface AdvancedQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdvancedQuoteModal = ({ open, onOpenChange }: AdvancedQuoteModalProps) => {
  const [pricingMethod, setPricingMethod] = useState<'price_margin' | 'costs_margin'>('price_margin');
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  
  // Pricing fields
  const [basePrice, setBasePrice] = useState<number>(0);
  const [marginPercentage, setMarginPercentage] = useState<number>(15);
  const [baseCost, setBaseCost] = useState<number>(0);
  const [fuelCost, setFuelCost] = useState<number>(0);
  const [crewCost, setCrewCost] = useState<number>(0);
  const [handlingCost, setHandlingCost] = useState<number>(0);
  const [otherCosts, setOtherCosts] = useState<number>(0);

  const { data: clients = [] } = useClients();
  const { data: vatRates = [] } = useVatRates();
  const createFlight = useCreateFlight();

  const selectedVatRate = vatRates.find(vr => vr.country_code === selectedCountry)?.vat_rate || 0;

  const calculateTotal = () => {
    if (pricingMethod === 'price_margin') {
      const total = basePrice * (1 + marginPercentage / 100);
      const vatAmount = total * (selectedVatRate / 100);
      return { subtotal: total, vatAmount, total: total + vatAmount };
    } else {
      const totalCosts = baseCost + fuelCost + crewCost + handlingCost + otherCosts;
      const subtotal = totalCosts * (1 + marginPercentage / 100);
      const vatAmount = subtotal * (selectedVatRate / 100);
      return { subtotal, vatAmount, total: subtotal + vatAmount };
    }
  };

  const { subtotal, vatAmount, total } = calculateTotal();

  const handleSubmit = async () => {
    try {
      // Here you would create the quote with all the pricing details
      console.log("Creating quote with advanced pricing", {
        pricingMethod,
        basePrice,
        marginPercentage,
        baseCost,
        fuelCost,
        crewCost,
        handlingCost,
        otherCosts,
        vatRate: selectedVatRate,
        vatAmount,
        total
      });
      
      toast.success('Quote created successfully with advanced pricing');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create quote');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-blue-600" />
            Create Advanced Quote
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Flight Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="country">Country (for VAT)</Label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {vatRates.map((vr) => (
                          <SelectItem key={vr.country_code} value={vr.country_code}>
                            {vr.country_name} ({vr.vat_rate}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="departure">Departure Airport</Label>
                    <Input id="departure" placeholder="EGLL" />
                  </div>
                  <div>
                    <Label htmlFor="arrival">Arrival Airport</Label>
                    <Input id="arrival" placeholder="KJFK" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Departure Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !departureDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {departureDate ? format(departureDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={departureDate}
                          onSelect={setDepartureDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="passengers">Passengers</Label>
                    <Input id="passengers" type="number" placeholder="8" />
                  </div>
                  <div>
                    <Label htmlFor="aircraft">Aircraft Type</Label>
                    <Input id="aircraft" placeholder="Citation CJ3+" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={pricingMethod} onValueChange={(value) => setPricingMethod(value as 'price_margin' | 'costs_margin')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="price_margin" className="flex items-center">
                      <Percent className="w-4 h-4 mr-2" />
                      Price + Margin
                    </TabsTrigger>
                    <TabsTrigger value="costs_margin" className="flex items-center">
                      <Calculator className="w-4 h-4 mr-2" />
                      Costs + Margin
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="price_margin" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="basePrice">Base Price (€)</Label>
                        <Input
                          id="basePrice"
                          type="number"
                          value={basePrice}
                          onChange={(e) => setBasePrice(Number(e.target.value))}
                          placeholder="15000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="margin">Margin (%)</Label>
                        <Input
                          id="margin"
                          type="number"
                          value={marginPercentage}
                          onChange={(e) => setMarginPercentage(Number(e.target.value))}
                          placeholder="15"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="costs_margin" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="baseCost">Base Cost (€)</Label>
                        <Input
                          id="baseCost"
                          type="number"
                          value={baseCost}
                          onChange={(e) => setBaseCost(Number(e.target.value))}
                          placeholder="8000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fuelCost">Fuel Cost (€)</Label>
                        <Input
                          id="fuelCost"
                          type="number"
                          value={fuelCost}
                          onChange={(e) => setFuelCost(Number(e.target.value))}
                          placeholder="3000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="crewCost">Crew Cost (€)</Label>
                        <Input
                          id="crewCost"
                          type="number"
                          value={crewCost}
                          onChange={(e) => setCrewCost(Number(e.target.value))}
                          placeholder="2000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="handlingCost">Handling Cost (€)</Label>
                        <Input
                          id="handlingCost"
                          type="number"
                          value={handlingCost}
                          onChange={(e) => setHandlingCost(Number(e.target.value))}
                          placeholder="800"
                        />
                      </div>
                      <div>
                        <Label htmlFor="otherCosts">Other Costs (€)</Label>
                        <Input
                          id="otherCosts"
                          type="number"
                          value={otherCosts}
                          onChange={(e) => setOtherCosts(Number(e.target.value))}
                          placeholder="500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="margin2">Margin (%)</Label>
                        <Input
                          id="margin2"
                          type="number"
                          value={marginPercentage}
                          onChange={(e) => setMarginPercentage(Number(e.target.value))}
                          placeholder="15"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Pricing Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pricingMethod === 'costs_margin' && (
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Base Cost:</span>
                      <span>€{baseCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuel Cost:</span>
                      <span>€{fuelCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crew Cost:</span>
                      <span>€{crewCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Handling Cost:</span>
                      <span>€{handlingCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Costs:</span>
                      <span>€{otherCosts.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-medium">
                      <span>Total Costs:</span>
                      <span>€{(baseCost + fuelCost + crewCost + handlingCost + otherCosts).toLocaleString()}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Margin ({marginPercentage}%):</span>
                  <span>€{(subtotal - (pricingMethod === 'price_margin' ? basePrice : (baseCost + fuelCost + crewCost + handlingCost + otherCosts))).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between font-medium">
                  <span>Subtotal:</span>
                  <span>€{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>VAT ({selectedVatRate}%):</span>
                  <span>€{vatAmount.toLocaleString()}</span>
                </div>
                
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>€{total.toLocaleString()}</span>
                </div>

                <div className="mt-4">
                  <Badge variant="outline" className="w-full justify-center">
                    {pricingMethod === 'price_margin' ? 'Price + Margin Method' : 'Costs + Margin Method'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button onClick={handleSubmit} className="w-full">
                Create Quote
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
