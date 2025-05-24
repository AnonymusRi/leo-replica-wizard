
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Building,
  Star,
  Calendar,
  DollarSign
} from "lucide-react";

export const ClientsView = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const clients = [
    {
      id: 1,
      name: "Executive Air Charter",
      company: "EAC Holdings Ltd",
      email: "contact@execaircharter.com",
      phone: "+44 20 7123 4567",
      location: "London, UK",
      rating: 5,
      totalBookings: 12,
      totalValue: 480000,
      lastBooking: "2024-01-15",
      status: "VIP",
      avatar: ""
    },
    {
      id: 2,
      name: "Global Business Jets",
      company: "GBJ International",
      email: "ops@globalbj.com",
      phone: "+1 212 555 0123",
      location: "New York, USA",
      rating: 4,
      totalBookings: 8,
      totalValue: 320000,
      lastBooking: "2024-01-12",
      status: "Premium",
      avatar: ""
    },
    {
      id: 3,
      name: "Private Airways",
      company: "PA Corp",
      email: "booking@privateairways.com",
      phone: "+33 1 42 12 34 56",
      location: "Paris, France",
      rating: 4,
      totalBookings: 15,
      totalValue: 650000,
      lastBooking: "2024-01-10",
      status: "VIP",
      avatar: ""
    },
    {
      id: 4,
      name: "Luxury Flight Solutions",
      company: "LFS GmbH",
      email: "info@luxuryflights.de",
      phone: "+49 30 123456789",
      location: "Berlin, Germany",
      rating: 3,
      totalBookings: 5,
      totalValue: 180000,
      lastBooking: "2024-01-08",
      status: "Standard",
      avatar: ""
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP": return "bg-purple-100 text-purple-800";
      case "Premium": return "bg-blue-100 text-blue-800";
      case "Standard": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Client Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">VIP Clients</p>
                <p className="text-2xl font-bold text-purple-600">
                  {clients.filter(c => c.status === "VIP").length}
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${clients.reduce((sum, client) => sum + client.totalValue, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(clients.reduce((sum, client) => sum + client.rating, 0) / clients.length).toFixed(1)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={client.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Building className="w-3 h-3 mr-1" />
                      {client.company}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(client.status)}>
                  {client.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {client.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {client.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {client.location}
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < client.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">({client.rating})</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Bookings</p>
                  <p className="font-semibold">{client.totalBookings}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="font-semibold text-green-600">
                    ${(client.totalValue / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Last booking: {client.lastBooking}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No clients found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};
