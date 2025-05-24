
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, User, Clock, Mail, Plus, Reply } from "lucide-react";
import { format } from "date-fns";

interface MessagingModuleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId?: string;
}

interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  type: 'internal' | 'client' | 'avinode';
  status: 'sent' | 'delivered' | 'read';
}

export const MessagingModule = ({ open, onOpenChange, quoteId }: MessagingModuleProps) => {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [messageType, setMessageType] = useState<'client' | 'internal'>('client');

  // Mock messages data
  const messages: Message[] = [
    {
      id: "1",
      sender: "Test User",
      recipient: "client@example.com",
      subject: "Quote Request L-FWP45A",
      content: "Thank you for selecting DEMO Airways for your charter. We ask that you carefully check the details below to ensure that they match your requirements.",
      timestamp: "2023-09-07T21:51:00Z",
      type: 'client',
      status: 'read'
    },
    {
      id: "2",
      sender: "Sales Team",
      recipient: "internal",
      subject: "Internal note - L-FWP45A",
      content: "Customer requested additional catering options. Need to follow up with catering department.",
      timestamp: "2023-09-07T20:30:00Z",
      type: 'internal',
      status: 'read'
    }
  ];

  const selectedMessageData = messages.find(m => m.id === selectedMessage);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
              Messages
            </div>
            <Button onClick={() => setIsComposing(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={messageType === 'client' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMessageType('client')}
              >
                Client Messages
              </Button>
              <Button
                variant={messageType === 'internal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMessageType('internal')}
              >
                Internal Messages
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {messageType === 'client' ? 'Client Communication' : 'Internal Notes'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {messages
                    .filter(msg => msg.type === messageType || (messageType === 'client' && msg.type === 'avinode'))
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedMessage === message.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedMessage(message.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{message.subject}</span>
                              {message.type === 'avinode' && (
                                <Badge variant="outline" className="text-xs">Avinode</Badge>
                              )}
                              {message.type === 'internal' && (
                                <Badge variant="secondary" className="text-xs">Internal</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              From: {message.sender}
                            </p>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {message.content}
                            </p>
                          </div>
                          <div className="text-right ml-2">
                            <div className="text-xs text-gray-500">
                              {format(new Date(message.timestamp), 'dd/MM HH:mm')}
                            </div>
                            <Badge 
                              variant={message.status === 'read' ? 'default' : 'secondary'}
                              className="text-xs mt-1"
                            >
                              {message.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Detail/Compose */}
          <div>
            {isComposing ? (
              <ComposeMessage 
                onCancel={() => setIsComposing(false)}
                onSend={() => {
                  setIsComposing(false);
                  // Handle send logic
                }}
                type={messageType}
              />
            ) : selectedMessageData ? (
              <MessageDetail 
                message={selectedMessageData}
                onReply={() => setIsComposing(true)}
              />
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a message to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ComposeMessage = ({ 
  onCancel, 
  onSend, 
  type 
}: { 
  onCancel: () => void; 
  onSend: () => void; 
  type: 'client' | 'internal' 
}) => {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Compose {type === 'internal' ? 'Internal Message' : 'Client Message'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {type === 'client' && (
          <div>
            <Label htmlFor="recipient">To</Label>
            <Input
              id="recipient"
              placeholder="client@example.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
        )}

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Message subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="content">Message</Label>
          <Textarea
            id="content"
            placeholder="Type your message here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
          />
        </div>

        {type === 'client' && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              This message will be sent to the client and logged in the system.
            </p>
          </div>
        )}

        {type === 'internal' && (
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              This internal note will be visible to the sales team only.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={onSend} className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            Send {type === 'internal' ? 'Note' : 'Message'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const MessageDetail = ({ 
  message, 
  onReply 
}: { 
  message: Message; 
  onReply: () => void 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            {message.type === 'internal' ? (
              <User className="w-5 h-5 mr-2 text-yellow-600" />
            ) : (
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
            )}
            <span className="text-lg">{message.subject}</span>
          </div>
          <Badge className={
            message.type === 'internal' ? 'bg-yellow-100 text-yellow-800' : 
            message.type === 'avinode' ? 'bg-purple-100 text-purple-800' :
            'bg-blue-100 text-blue-800'
          }>
            {message.type === 'internal' ? 'Internal' : 
             message.type === 'avinode' ? 'Avinode' : 'Client'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <p><strong>From:</strong> {message.sender}</p>
            {message.type !== 'internal' && (
              <p><strong>To:</strong> {message.recipient}</p>
            )}
          </div>
          <div className="text-right">
            <p className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {format(new Date(message.timestamp), 'dd/MM/yyyy HH:mm')}
            </p>
            <Badge variant="outline" className="mt-1">
              {message.status}
            </Badge>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onReply} className="flex-1">
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
          {message.type === 'client' && (
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Internal Note
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
