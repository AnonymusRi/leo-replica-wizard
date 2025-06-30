
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Euro, FileText, AlertTriangle, TrendingUp, Download, Search, Eye, Send } from "lucide-react";

export const BillingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const invoices = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      organization: "AlidaSoft Aviation",
      amount: 499,
      dueDate: "2024-07-01",
      issueDate: "2024-06-01",
      status: "paid",
      paymentDate: "2024-06-28",
      licenseType: "Premium"
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      organization: "Sky Aviation",
      amount: 299,
      dueDate: "2024-07-01",
      issueDate: "2024-06-01",
      status: "overdue",
      paymentDate: null,
      licenseType: "Standard"
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      organization: "Eurofly",
      amount: 699,
      dueDate: "2024-07-05",
      issueDate: "2024-06-05",
      status: "pending",
      paymentDate: null,
      licenseType: "Premium"
    }
  ];

  const revenue = [
    {
      month: "Gennaio 2024",
      amount: 12450,
      invoices: 15,
      growth: 8.5
    },
    {
      month: "Febbraio 2024",
      amount: 13200,
      invoices: 16,
      growth: 12.3
    },
    {
      month: "Marzo 2024",
      amount: 14800,
      invoices: 18,
      growth: 15.7
    },
    {
      month: "Aprile 2024",
      amount: 16200,
      invoices: 20,
      growth: 18.9
    },
    {
      month: "Maggio 2024",
      amount: 17900,
      invoices: 22,
      growth: 22.1
    },
    {
      month: "Giugno 2024",
      amount: 19500,
      invoices: 24,
      growth: 25.4
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="default">Pagato</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">In Attesa</Badge>;
      case "overdue":
        return <Badge variant="destructive">Scaduto</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Annullato</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidInvoices = invoices.filter(inv => inv.status === "paid").length;
  const overdueInvoices = invoices.filter(inv => inv.status === "overdue").length;

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
            Nuova Fattura
          </Button>
        </div>
      </div>

      {/* Statistiche Fatturazione */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fatturato Mensile</p>
                <p className="text-2xl font-bold text-green-600">€{totalRevenue.toLocaleString()}</p>
              </div>
              <Euro className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fatture Pagate</p>
                <p className="text-2xl font-bold text-blue-600">{paidInvoices}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fatture Scadute</p>
                <p className="text-2xl font-bold text-red-600">{overdueInvoices}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crescita Mensile</p>
                <p className="text-2xl font-bold text-purple-600">+25.4%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Fatture</TabsTrigger>
          <TabsTrigger value="revenue">Ricavi</TabsTrigger>
          <TabsTrigger value="reports">Report</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Fatture</CardTitle>
              <CardDescription>
                Monitora tutte le fatture emesse e i pagamenti
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
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
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
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Send className="w-3 h-3" />
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

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Andamento Ricavi</CardTitle>
              <CardDescription>
                Analisi dei ricavi mensili e crescita
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenue.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{month.month}</h4>
                      <p className="text-sm text-gray-600">{month.invoices} fatture emesse</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">€{month.amount.toLocaleString()}</p>
                      <p className="text-sm text-green-600">+{month.growth}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Report Finanziari</CardTitle>
              <CardDescription>
                Genera e scarica report dettagliati
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Report Mensile</h4>
                    <p className="text-sm text-gray-600 mb-4">Riepilogo completo del mese corrente</p>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Scarica PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Report Annuale</h4>
                    <p className="text-sm text-gray-600 mb-4">Analisi completa dell'anno fiscale</p>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Scarica Excel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
