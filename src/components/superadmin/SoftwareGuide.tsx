
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BookOpen, Video, Download, Search, ChevronDown, ExternalLink, Play, FileText } from "lucide-react";

export const SoftwareGuide = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState<string[]>(["getting-started"]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const guideCategories = [
    {
      id: "getting-started",
      title: "Primi Passi",
      description: "Guida introduttiva all'utilizzo del software",
      items: [
        {
          title: "Configurazione Iniziale",
          type: "article",
          duration: "5 min",
          description: "Come configurare il sistema per la prima volta"
        },
        {
          title: "Tour dell'Interfaccia",
          type: "video",
          duration: "12 min",
          description: "Video introduttivo alle funzionalità principali"
        },
        {
          title: "Creazione Primo Volo",
          type: "tutorial",
          duration: "8 min",
          description: "Guida step-by-step per inserire il primo volo"
        }
      ]
    },
    {
      id: "schedule",
      title: "Modulo Schedule",
      description: "Gestione programmazione voli",
      items: [
        {
          title: "Pianificazione Voli",
          type: "article",
          duration: "10 min",
          description: "Come pianificare e gestire i voli"
        },
        {
          title: "Gestione Equipaggio",
          type: "video",
          duration: "15 min",
          description: "Assegnazione equipaggio ai voli"
        },
        {
          title: "Pubblicazione Schedule",
          type: "tutorial",
          duration: "7 min",
          description: "Come pubblicare e condividere gli orari"
        }
      ]
    },
    {
      id: "sales",
      title: "Modulo Sales",
      description: "Gestione vendite e preventivi",
      items: [
        {
          title: "Creazione Preventivi",
          type: "article",
          duration: "12 min",
          description: "Come creare e gestire i preventivi"
        },
        {
          title: "Gestione Clienti",
          type: "video",
          duration: "18 min",
          description: "Anagrafica e gestione della clientela"
        },
        {
          title: "Report Vendite",
          type: "tutorial",
          duration: "10 min",
          description: "Analisi e reportistica delle vendite"
        }
      ]
    },
    {
      id: "ops",
      title: "Modulo Operations",
      description: "Gestione operazioni di volo",
      items: [
        {
          title: "Checklist Operative",
          type: "article",
          duration: "8 min",
          description: "Utilizzo delle checklist per le operazioni"
        },
        {
          title: "Gestione Documenti",
          type: "video",
          duration: "14 min",
          description: "Caricamento e gestione documenti di volo"
        },
        {
          title: "Handling Requests",
          type: "tutorial",
          duration: "6 min",
          description: "Gestione richieste di handling aeroportuale"
        }
      ]
    },
    {
      id: "maintenance",
      title: "Modulo Maintenance",
      description: "Gestione manutenzione aeromobili",
      items: [
        {
          title: "Pianificazione Manutenzioni",
          type: "article",
          duration: "15 min",
          description: "Come pianificare le manutenzioni"
        },
        {
          title: "Tracking Componenti",
          type: "video",
          duration: "20 min",
          description: "Monitoraggio ore e cicli componenti"
        },
        {
          title: "Hold Items Management",
          type: "tutorial",
          duration: "12 min",  
          description: "Gestione degli hold items MEL/CDL"
        }
      ]
    },
    {
      id: "crew",
      title: "Modulo Crew",
      description: "Gestione equipaggio e FTL",
      items: [
        {
          title: "Gestione Qualifiche",
          type: "article",
          duration: "10 min",
          description: "Tracking delle qualifiche equipaggio"
        },
        {
          title: "FTL Compliance",
          type: "video",
          duration: "22 min",
          description: "Conformità ai limiti di tempo di volo"
        },
        {
          title: "Training Records",
          type: "tutorial",
          duration: "8 min",
          description: "Gestione record di addestramento"
        }
      ]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "tutorial":
        return <Play className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "video":
        return <Badge className="bg-red-100 text-red-800">Video</Badge>;
      case "tutorial":
        return <Badge className="bg-blue-100 text-blue-800">Tutorial</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Articolo</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Guida Software</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Scarica PDF
          </Button>
          <Button>
            <ExternalLink className="w-4 h-4 mr-2" />
            Centro Assistenza
          </Button>
        </div>
      </div>

      {/* Statistiche Utilizzo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Guide Totali</p>
                <p className="text-2xl font-bold text-blue-600">24</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Video Tutorial</p>
                <p className="text-2xl font-bold text-purple-600">8</p>
              </div>
              <Video className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Totale</p>
                <p className="text-2xl font-bold text-green-600">3h 25min</p>
              </div>
              <Play className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aggiornamenti</p>
                <p className="text-2xl font-bold text-orange-600">2</p>
              </div>
              <ExternalLink className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="guides" className="space-y-4">
        <TabsList>
          <TabsTrigger value="guides">Guide</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorial</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="updates">Aggiornamenti</TabsTrigger>
        </TabsList>

        <TabsContent value="guides">
          <Card>
            <CardHeader>
              <CardTitle>Guide Utente</CardTitle>
              <CardDescription>
                Documentazione completa per tutti i moduli del software
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-6">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cerca nelle guide..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="space-y-4">
                {guideCategories.map((category) => (
                  <Collapsible 
                    key={category.id}
                    open={openSections.includes(category.id)}
                    onOpenChange={() => toggleSection(category.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{category.title}</h3>
                              <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                            <ChevronDown className={`w-5 h-5 transition-transform ${
                              openSections.includes(category.id) ? 'rotate-180' : ''
                            }`} />
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="ml-4 mt-2 space-y-2">
                        {category.items.map((item, index) => (
                          <Card key={index} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  {getTypeIcon(item.type)}
                                  <div>
                                    <h4 className="font-medium">{item.title}</h4>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {getTypeBadge(item.type)}
                                  <Badge variant="outline">{item.duration}</Badge>
                                  <Button variant="outline" size="sm">
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>Video Tutorial</CardTitle>
              <CardDescription>
                Playlist video per imparare velocemente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                        <Play className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="font-medium mb-1">Tutorial Video {i}</h4>
                      <p className="text-sm text-gray-600 mb-2">Descrizione del video tutorial</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">15 min</Badge>
                        <Button variant="outline" size="sm">
                          <Play className="w-3 h-3 mr-1" />
                          Guarda
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Domande Frequenti</CardTitle>
              <CardDescription>
                Risposte alle domande più comuni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Come posso reimpostare la mia password?",
                  "Come aggiungo un nuovo utente all'organizzazione?",
                  "Come posso esportare i dati dei voli?",
                  "Quali sono i limiti di tempo di volo EASA?",
                  "Come configurare le notifiche email?"
                ].map((question, index) => (
                  <Collapsible key={index}>
                    <CollapsibleTrigger asChild>
                      <Card className="cursor-pointer hover:bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{question}</h4>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-4 mt-2 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Risposta dettagliata alla domanda frequente. Qui verrebbe inserita 
                          una spiegazione completa e chiara per aiutare l'utente.
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates">
          <Card>
            <CardHeader>
              <CardTitle>Aggiornamenti Recenti</CardTitle>
              <CardDescription>
                Ultime novità e aggiornamenti del software
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    version: "v2.4.1",
                    date: "28 Giugno 2024",
                    title: "Miglioramenti FTL e Nuove Funzionalità",
                    changes: [
                      "Nuovo algoritmo calcolo FTL più preciso",
                      "Interfaccia crew dashboard migliorata",
                      "Correzioni bug minori"
                    ]
                  },
                  {
                    version: "v2.4.0",
                    date: "15 Giugno 2024",
                    title: "Modulo SuperAdmin e Gestione Licenze",
                    changes: [
                      "Nuovo modulo SuperAdmin completo",
                      "Sistema gestione licenze SaaS",
                      "Miglioramenti sicurezza autenticazione"
                    ]
                  }
                ].map((update, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{update.title}</h4>
                          <p className="text-sm text-gray-600">{update.date}</p>
                        </div>
                        <Badge variant="outline">{update.version}</Badge>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {update.changes.map((change, changeIndex) => (
                          <li key={changeIndex}>{change}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
