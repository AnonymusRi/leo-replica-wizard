import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Building,
  Star,
  Edit,
  Trash2
} from "lucide-react";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "@/hooks/useClients";
import { useQuotes } from "@/hooks/useQuotes";
import { Client } from "@/types/client";
import { toast } from "sonner";

interface ClientFormData {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  notes: string;
}

export const ClientsView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    notes: ""
  });

  const { data: clients = [], isLoading } = useClients();
  const { data: quotes = [] } = useQuotes();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const getClientStats = (clientId: string) => {
    const clientQuotes = quotes.filter(quote => quote.client_id === clientId);
    const confirmedQuotes = clientQuotes.filter(quote => quote.status === 'confirmed');
    const totalValue = confirmedQuotes.reduce((sum, quote) => sum + (quote.total_amount || 0), 0);
    
    return {
      totalBookings: clientQuotes.length,
      totalValue,
      lastBooking: clientQuotes[0]?.created_at
    };
  };

  const filteredClients = clients.filter(client =>
    client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClient.mutateAsync(formData);
      setShowCreateModal(false);
      setFormData({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        notes: ""
      });
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    
    try {
      await updateClient.mutateAsync({ id: selectedClient.id, ...formData });
      setShowEditModal(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient.mutateAsync(clientId);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      company_name: client.company_name,
      contact_person: client.contact_person || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      city: client.city || "",
      country: client.country || "",
      notes: client.notes || ""
    });
    setShowEditModal(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading clients...</div>;
  }

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
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Client</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4">
              {/* ... keep existing form fields ... */}
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex space-x-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createClient.isPending}>
                  Create Client
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                <p className="text-sm text-gray-600">Active Quotes</p>
                <p className="text-2xl font-bold text-green-600">
                  {quotes.filter(q => q.status === 'pending').length}
                </p>
              </div>
              <Star className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  €{quotes
                    .filter(q => q.status === 'confirmed' && q.total_amount)
                    .reduce((sum, q) => sum + (q.total_amount || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <Building className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed Bookings</p>
                <p className="text-2xl font-bold text-purple-600">
                  {quotes.filter(q => q.status === 'confirmed').length}
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const stats = getClientStats(client.id);
          return (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {client.company_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{client.company_name}</CardTitle>
                      {client.contact_person && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                          {client.contact_person}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(client)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClient(client.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {client.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {client.email}
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {client.phone}
                    </div>
                  )}
                  {client.city && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {client.city}{client.country && `, ${client.country}`}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Quotes</p>
                    <p className="font-semibold">{stats.totalBookings}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="font-semibold text-green-600">
                      €{(stats.totalValue / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No clients found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search criteria or add a new client</p>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateClient} className="space-y-4">
            {/* ... keep existing form fields ... */}
            <div>
              <Label htmlFor="edit_company_name">Company Name</Label>
              <Input
                id="edit_company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_contact_person">Contact Person</Label>
              <Input
                id="edit_contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_email">Email</Label>
              <Input
                id="edit_email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_phone">Phone</Label>
              <Input
                id="edit_phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_address">Address</Label>
              <Input
                id="edit_address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_city">City</Label>
              <Input
                id="edit_city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_country">Country</Label>
              <Input
                id="edit_country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_notes">Notes</Label>
              <Textarea
                id="edit_notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <div className="flex space-x-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateClient.isPending}>
                Update Client
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
