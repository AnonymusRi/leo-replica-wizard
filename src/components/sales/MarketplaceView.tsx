
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Globe, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  MapPin,
  Users,
  Euro,
  Send,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useQuotes } from "@/hooks/useQuotes";
import { useMessages } from "@/hooks/useMessages";
import { format } from "date-fns";

export const MarketplaceView = () => {
  const [activeTab, setActiveTab] = useState("avinode");
  const { data: quotes = [] } = useQuotes();
  const { data: messages = [] } = useMessages();

  const avinodeQuotes = quotes.filter(q => q.marketplace_source === 'avinode');
  const directQuotes = quotes.filter(q => q.marketplace_source === 'direct');
  const avinodeMessages = messages.filter(m => m.message_type === 'avinode');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const marketplaceStats = {
    avinode: {
      requests: avinodeQuotes.length,
      responseRate: avinodeQuotes.length > 0 ? Math.round((avinodeQuotes.filter(q => q.status !== 'pending').length / avinodeQuotes.length) * 100) : 0,
      revenue: avinodeQuotes.filter(q => q.status === 'confirmed').reduce((sum, q) => sum + (q.total_amount || 0), 0),
      avgResponseTime: '2.5 hours'
    },
    direct: {
      requests: directQuotes.length,
      conversionRate: directQuotes.length > 0 ? Math.round((directQuotes.filter(q => q.status === 'confirmed').length / directQuotes.length) * 100) : 0,
      revenue: directQuotes.filter(q => q.status === 'confirmed').reduce((sum, q) => sum + (q.total_amount || 0), 0),
      avgValue: directQuotes.length > 0 ? Math.round(directQuotes.reduce((sum, q) => sum + (q.total_amount || 0), 0) / directQuotes.length) : 0
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketplace Management</h2>
          <p className="text-gray-600">Manage Avinode integration and direct bookings</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Globe className="w-4 h-4 mr-2" />
          Sync with Avinode
        </Button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avinode Requests</p>
                <p className="text-2xl font-bold text-blue-600">{marketplaceStats.avinode.requests}</p>
              </div>
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-green-600">{marketplaceStats.avinode.responseRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Direct Bookings</p>
                <p className="text-2xl font-bold text-purple-600">{marketplaceStats.direct.requests}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  €{(marketplaceStats.avinode.revenue + marketplaceStats.direct.revenue).toLocaleString()}
                </p>
              </div>
              <Euro className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketplace Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avinode Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Avinode Integration
              </span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Weekly Requests:</span>
                <span className="ml-2 font-semibold">{avinodeQuotes.filter(q => new Date(q.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}</span>
              </div>
              <div>
                <span className="text-gray-600">Response Rate:</span>
                <span className="ml-2 font-semibold">{marketplaceStats.avinode.responseRate}%</span>
              </div>
              <div>
                <span className="text-gray-600">Avg Response Time:</span>
                <span className="ml-2 font-semibold">{marketplaceStats.avinode.avgResponseTime}</span>
              </div>
              <div>
                <span className="text-gray-600">Win Rate:</span>
                <span className="ml-2 font-semibold">
                  {avinodeQuotes.length > 0 ? Math.round((avinodeQuotes.filter(q => q.status === 'confirmed').length / avinodeQuotes.length) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Recent Avinode Requests</h4>
              {avinodeQuotes.slice(0, 3).map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(quote.status || 'pending')}
                      <span className="font-medium text-sm">{quote.quote_number}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {quote.departure_airport} → {quote.arrival_airport} | {quote.passenger_count} pax
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {quote.total_amount ? `€${quote.total_amount.toLocaleString()}` : 'TBD'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(quote.created_at), 'dd/MM')}
                    </div>
                  </div>
                </div>
              ))}
              
              {avinodeQuotes.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No Avinode requests yet</p>
                </div>
              )}
            </div>

            <Button className="w-full" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View All Avinode Requests
            </Button>
          </CardContent>
        </Card>

        {/* Direct Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Direct Bookings
              </span>
              <Badge className="bg-blue-100 text-blue-800">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">This Month:</span>
                <span className="ml-2 font-semibold">{directQuotes.filter(q => new Date(q.created_at).getMonth() === new Date().getMonth()).length}</span>
              </div>
              <div>
                <span className="text-gray-600">Conversion Rate:</span>
                <span className="ml-2 font-semibold">{marketplaceStats.direct.conversionRate}%</span>
              </div>
              <div>
                <span className="text-gray-600">Avg Booking Value:</span>
                <span className="ml-2 font-semibold">€{marketplaceStats.direct.avgValue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Repeat Clients:</span>
                <span className="ml-2 font-semibold">65%</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Recent Direct Quotes</h4>
              {directQuotes.slice(0, 3).map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(quote.status || 'pending')}
                      <span className="font-medium text-sm">{quote.quote_number}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {quote.client?.company_name || 'TBD'} | {quote.passenger_count} pax
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {quote.total_amount ? `€${quote.total_amount.toLocaleString()}` : 'TBD'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(quote.created_at), 'dd/MM')}
                    </div>
                  </div>
                </div>
              ))}
              
              {directQuotes.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No direct bookings yet</p>
                </div>
              )}
            </div>

            <Button className="w-full" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View All Direct Bookings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Recent Marketplace Communications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {avinodeMessages.slice(0, 5).map((message) => (
              <div key={message.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">{message.subject}</div>
                    <div className="text-xs text-gray-600">
                      From: {message.sender_name} | Avinode Ref: {message.avinode_reference}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={message.status === 'read' ? 'default' : 'secondary'}>
                    {message.status}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(message.created_at), 'dd/MM HH:mm')}
                  </div>
                </div>
              </div>
            ))}
            
            {avinodeMessages.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No marketplace messages yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
