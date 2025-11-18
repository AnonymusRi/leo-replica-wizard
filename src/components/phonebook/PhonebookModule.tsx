
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Phone, 
  Users, 
  Building2,
  Filter,
  Plus,
  Search,
  Mail,
  MapPin,
  Edit,
  Eye,
  Loader2
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useCrewMembers } from "@/hooks/useCrewMembers";

export const PhonebookModule = () => {
  const [activeTab, setActiveTab] = useState("clients");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: crewMembers = [], isLoading: crewLoading } = useCrewMembers();

  if (clientsLoading || crewLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const filteredClients = clients.filter(client =>
    client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.contact_person && client.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCrew = crewMembers.filter(member =>
    member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPositionBadgeColor = (position: string) => {
    switch (position) {
      case "captain": return "bg-blue-100 text-blue-800";
      case "first_officer": return "bg-green-100 text-green-800";
      case "cabin_crew": return "bg-purple-100 text-purple-800";
      case "mechanic": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <Phone className="w-5 h-5 mr-2 text-green-600" />
            Contact Directory
          </h2>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Filter className="w-4 h-4 mr-1" />
              FILTER
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-1" />
              ADD CONTACT
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clients">Clients ({filteredClients.length})</TabsTrigger>
            <TabsTrigger value="crew">Crew ({filteredCrew.length})</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Client Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.company_name}</TableCell>
                        <TableCell>{client.contact_person || 'N/A'}</TableCell>
                        <TableCell>
                          {client.email ? (
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1 text-gray-400" />
                              <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                                {client.email}
                              </a>
                            </div>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {client.phone ? (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1 text-gray-400" />
                              <a href={`tel:${client.phone}`} className="text-blue-600 hover:underline">
                                {client.phone}
                              </a>
                            </div>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {client.city && client.country ? (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                              {client.city}, {client.country}
                            </div>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredClients.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'Nessun cliente trovato per la ricerca' : 'Nessun cliente presente'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crew" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Crew Directory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Base</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCrew.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.first_name} {member.last_name}
                        </TableCell>
                        <TableCell>
                          <Badge className={getPositionBadgeColor(member.position)}>
                            {member.position.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {member.email ? (
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1 text-gray-400" />
                              <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                                {member.email}
                              </a>
                            </div>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {member.phone ? (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1 text-gray-400" />
                              <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                                {member.phone}
                              </a>
                            </div>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {member.base_location ? (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                              {member.base_location}
                            </div>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.is_active ? "default" : "secondary"}>
                            {member.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredCrew.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'Nessun membro equipaggio trovato per la ricerca' : 'Nessun membro equipaggio presente'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-red-50">
                    <h3 className="font-semibold text-red-800 mb-2">Emergency Services</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Emergency:</span>
                        <a href="tel:112" className="text-red-600 font-medium">112</a>
                      </div>
                      <div className="flex justify-between">
                        <span>Fire Department:</span>
                        <a href="tel:115" className="text-red-600 font-medium">115</a>
                      </div>
                      <div className="flex justify-between">
                        <span>Medical Emergency:</span>
                        <a href="tel:118" className="text-red-600 font-medium">118</a>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h3 className="font-semibold text-blue-800 mb-2">Aviation Authorities</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>ENAC:</span>
                        <a href="tel:+390644596111" className="text-blue-600 font-medium">+39 06 4459 6111</a>
                      </div>
                      <div className="flex justify-between">
                        <span>ENAV:</span>
                        <a href="tel:+390654961" className="text-blue-600 font-medium">+39 06 5496 1</a>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-green-50">
                    <h3 className="font-semibold text-green-800 mb-2">Operations Center</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>24/7 Operations:</span>
                        <a href="tel:+393001234567" className="text-green-600 font-medium">+39 300 123 4567</a>
                      </div>
                      <div className="flex justify-between">
                        <span>Dispatch:</span>
                        <a href="tel:+393001234568" className="text-green-600 font-medium">+39 300 123 4568</a>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <h3 className="font-semibold text-yellow-800 mb-2">Maintenance Support</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>AOG Support:</span>
                        <a href="tel:+393001234569" className="text-yellow-600 font-medium">+39 300 123 4569</a>
                      </div>
                      <div className="flex justify-between">
                        <span>Technical Support:</span>
                        <a href="tel:+393001234570" className="text-yellow-600 font-medium">+39 300 123 4570</a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
