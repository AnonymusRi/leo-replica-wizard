
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Mail, 
  MailOpen,
  AlertTriangle,
  Clock,
  User
} from "lucide-react";
import { useCrewMessages, useUnreadMessagesCount, useMarkMessageAsRead } from "@/hooks/useCrewMessages";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface CrewMessagesSectionProps {
  crewMemberId: string;
}

export const CrewMessagesSection = ({ crewMemberId }: CrewMessagesSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const { data: messages = [] } = useCrewMessages(crewMemberId);
  const { data: unreadCount = 0 } = useUnreadMessagesCount(crewMemberId);
  const markAsRead = useMarkMessageAsRead();

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || 
                         (filterType === "unread" && !message.is_read) ||
                         message.message_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleMessageClick = async (message: any) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      await markAsRead.mutateAsync(message.id);
    }
  };

  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case 'personal': return 'Personale';
      case 'official': return 'Ufficiale';
      case 'training': return 'Formazione';
      case 'schedule': return 'Programma';
      default: return type;
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'personal': return 'bg-blue-100 text-blue-800';
      case 'official': return 'bg-red-100 text-red-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'schedule': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'normal':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'low':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
      {/* Messages List */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Messaggi</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca messaggi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex space-x-2 overflow-x-auto">
                {[
                  { value: "all", label: "Tutti" },
                  { value: "unread", label: "Non letti" },
                  { value: "personal", label: "Personali" },
                  { value: "official", label: "Ufficiali" },
                  { value: "training", label: "Formazione" },
                  { value: "schedule", label: "Programma" }
                ].map(filter => (
                  <Button
                    key={filter.value}
                    variant={filterType === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType(filter.value)}
                    className="whitespace-nowrap"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 h-[calc(100%-140px)] overflow-y-auto">
            <div className="space-y-1">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                  } ${!message.is_read ? 'bg-blue-25 font-medium' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {message.is_read ? (
                        <MailOpen className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Mail className="w-4 h-4 text-blue-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {message.sender_name}
                      </span>
                      {getPriorityIcon(message.priority)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getMessageTypeColor(message.message_type)} variant="secondary">
                        {getMessageTypeLabel(message.message_type)}
                      </Badge>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                    {message.subject}
                  </h4>
                  
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {message.content}
                  </p>
                  
                  <div className="text-xs text-gray-500">
                    {format(new Date(message.created_at), "dd MMM yyyy 'alle' HH:mm", { locale: it })}
                  </div>
                </div>
              ))}
              
              {filteredMessages.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>Nessun messaggio trovato</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Detail */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          {selectedMessage ? (
            <>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getMessageTypeColor(selectedMessage.message_type)} variant="secondary">
                        {getMessageTypeLabel(selectedMessage.message_type)}
                      </Badge>
                      {getPriorityIcon(selectedMessage.priority)}
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {selectedMessage.subject}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Da: {selectedMessage.sender_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {format(new Date(selectedMessage.created_at), "dd MMMM yyyy 'alle' HH:mm", { locale: it })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {selectedMessage.content}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Seleziona un messaggio</h3>
                <p>Clicca su un messaggio nella lista per leggerlo qui</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};
