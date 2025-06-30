
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, FileText, Download, Mail, Search, AlertCircle, CheckCircle, Clock } from "lucide-react";

export const BillingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const invoices = [
    {
      id: "INV-2024-001",
      organization: "AlidaSoft Aviation",
      amount: 499,
      issueDate: "2024-06-01",
      dueDate: "2024-06-30",
      status: "paid",
      paymentDate: "2024-06-15"
    },
    {
      id: "INV-2024-002",
      organization: "Sky Aviation",
      amount: 299,
      issueDate: "2024-06-01",
      dueDate: "2024-06-30",
      status: "pending",
      paymentDate: null
    },
    {
      id: "INV-2024-003",
      organization: "Eurofly",
      amount: 899,
      issueDate: "2024-05-01",
      dueDate: "2024-05-30",
      status: "overdue",
      paymentDate: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="default" className="bg-green-100 text-green-800">Pagata</Badge>;
      case "pending":
        return <Badge variant="secondary">In Attesa</Badge>;
      case "overdue":
        return <Badge variant="destructive">Scaduta</Badge>;
      default:
        return <Badge variant="outline">Sconosciuta</Badge>;
    }
  };

  const monthlyStats = {
    totalRevenue: 25450,
    paidInvoices: 15,
    pendingInvoices: 5,
    overdueInvoices: 3,
    averagePaymentTime: 12
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestione Fatturazione</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Esporta Report
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Genera Fatture
          </Button>
        </div>
      </div>

      {/* Statistiche Fatturazione */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fatturato Mensile</p>
                <p className="text-2xl font-bold text-green-600">€{monthlyStats.totalRevenue.toLocaleString()}</p>
              </div>
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fatture Pagate</p>
                <p className="text-2xl font-bold text-blue-600">{monthlyStats.paidInvoices}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Attesa</p>
                <p className="text-2xl font-bold text-yellow-600">{monthlyStats.pendingInvoices}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scadute</p>
                <p className="text-2xl font-bold text-red-600">{monthlyStats.overdueInvoices}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Medio Pagamento</p>
                <p className="text-2xl font-bold text-purple-600">{monthlyStats.averagePaymentTime}gg</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Fatture</TabsTrigger>
          <TabsTrigger value="payments">Pagamenti</TabsTrigger>
          <TabsTrigger value="reports">Report</TabsTrigger>
          <TabsTrigger value="settings">Impostazioni</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Fatture</CardTitle>
              <CardDescription>
                Tutte le fatture emesse e il loro stato di pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cerca fattura o organizzazione..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numero Fattura</TableHead>
                    <TableHead>Organizzazione</TableHead>
                    <TableHead>Importo</TableHead>
                    <TableHead>Data Emissione</TableHead>
                    <TableHead>Scadenza</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Data Pagamento</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.id}
                      </TableCell>
                      <TableCell>{invoice.organization}</TableCell>
                      <TableCell className="font-medium">
                        €{invoice.amount}
                      </TableCell>
                      <TableCell>{invoice.issueDate}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>
                        {getStatusBadge(invoice.status)}
                      </TableCell>
                      <TableCell>
                        {invoice.paymentDate || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Cronologia Pagamenti</CardTitle>
              <CardDescription>
                Tutti i pagamenti ricevuti e le transazioni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Sezione in sviluppo - Cronologia pagamenti</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Report Finanziari</CardTitle>
              <CardDescription>
                Analisi e report sui ricavi e pagamenti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Report Mensile
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Analisi Trimestrale
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Previsioni Ricavi
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Report Scadenze
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Fatturazione</CardTitle>
              <CardDescription>
                Configura template, termini di pagamento e notifiche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 flex-col">
                    <FileText className="w-5 h-5 mb-1" />
                    Template Fatture
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Mail className="w-5 h-5 mb-1" />
                    Notifiche Automatiche
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <CreditCard className="w-5 h-5 mb-1" />
                    Metodi Pagamento
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <FileText className="w-5 h-5 mb-1" />
                    Termini e Condizioni
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
