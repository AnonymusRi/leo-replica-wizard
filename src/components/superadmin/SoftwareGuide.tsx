
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Book, 
  Video, 
  FileText, 
  Users, 
  Plane, 
  Calendar, 
  Wrench, 
  BarChart3,
  Phone,
  Settings,
  Download,
  Play,
  ExternalLink,
  Mail
} from "lucide-react";

export const SoftwareGuide = () => {
  const [selectedModule, setSelectedModule] = useState("overview");

  const modules = [
    { id: "overview", label: "Panoramica", icon: Book, color: "bg-blue-500" },
    { id: "sched", label: "Schedulazione", icon: Calendar, color: "bg-green-500" },
    { id: "sales", label: "Vendite", icon: Plane, color: "bg-purple-500" },
    { id: "ops", label: "Operazioni", icon: Settings, color: "bg-orange-500" },
    { id: "crew", label: "Equipaggio", icon: Users, color: "bg-indigo-500" },
    { id: "mx", label: "Manutenzione", icon: Wrench, color: "bg-red-500" },
    { id: "reports", label: "Report", icon: BarChart3, color: "bg-teal-500" },
    { id: "phonebook", label: "Rubrica", icon: Phone, color: "bg-pink-500" }
  ];

  const guides = {
    overview: [
      {
        title: "Introduzione al Sistema",
        description: "Panoramica generale delle funzionalità",
        type: "video",
        duration: "15 min",
        level: "Principiante"
      },
      {
        title: "Setup Iniziale Organizzazione",
        description: "Come configurare la tua organizzazione",
        type: "document",
        duration: "10 min",
        level: "Principiante"
      },
      {
        title: "Gestione Utenti e Ruoli",
        description: "Configurazione permissions e accessi",
        type: "video",
        duration: "20 min",
        level: "Intermedio"
      }
    ],
    sched: [
      {
        title: "Creazione Programmazione Voli",
        description: "Come creare e gestire la programmazione",
        type: "video",
        duration: "25 min",
        level: "Principiante"
      },
      {
        title: "Gestione Modifiche e Versioning",
        description: "Tracking delle modifiche alla programmazione",
        type: "document",
        duration: "15 min",
        level: "Intermedio"
      },
      {
        title: "Pubblicazione Programmazione",
        description: "Come pubblicare e condividere la programmazione",
        type: "video",
        duration: "12 min",
        level: "Principiante"
      }
    ],
    sales: [
      {
        title: "Gestione Clienti e Preventivi",
        description: "Creazione e invio preventivi",
        type: "video",
        duration: "30 min",
        level: "Principiante"
      },
      {
        title: "Processo di Vendita",
        description: "Dalla richiesta alla conferma",
        type: "document",
        duration: "20 min",
        level: "Intermedio"
      }
    ]
  };

  const currentGuides = guides[selectedModule as keyof typeof guides] || guides.overview;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      default:
        return <Book className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Principiante":
        return "bg-green-100 text-green-800";
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800";
      case "Avanzato":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Guida al Software</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Scarica PDF Completo
          </Button>
          <Button>
            <ExternalLink className="w-4 h-4 mr-2" />
            Centro Assistenza
          </Button>
        </div>
      </div>

      <Tabs value={selectedModule} onValueChange={setSelectedModule} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <TabsTrigger key={module.id} value={module.id} className="flex items-center space-x-1">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{module.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {modules.map((module) => (
          <TabsContent key={module.id} value={module.id}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sidebar Modulo */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className={`w-8 h-8 ${module.color} rounded-lg flex items-center justify-center mr-3`}>
                      <module.icon className="w-4 h-4 text-white" />
                    </div>
                    {module.label}
                  </CardTitle>
                  <CardDescription>
                    Tutte le guide e risorse per il modulo {module.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Guide disponibili:</span>
                      <Badge variant="outline">{currentGuides.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tempo totale:</span>
                      <Badge variant="outline">
                        {currentGuides.reduce((total, guide) => {
                          const minutes = parseInt(guide.duration.replace(' min', ''));
                          return total + minutes;
                        }, 0)} min
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista Guide */}
              <div className="lg:col-span-2 space-y-4">
                {currentGuides.map((guide, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(guide.type)}
                            <h3 className="font-semibold text-lg">{guide.title}</h3>
                          </div>
                          <p className="text-gray-600 mb-3">{guide.description}</p>
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">{guide.duration}</Badge>
                            <Badge className={getLevelColor(guide.level)}>
                              {guide.level}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            {guide.type === "video" ? (
                              <Play className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Sezione FAQ e Supporto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>FAQ Frequenti</CardTitle>
            <CardDescription>
              Le domande più comuni dei nostri clienti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-4">
                <h4 className="font-medium">Come resettare la password di un utente?</h4>
                <p className="text-sm text-gray-600">Vai in Admin → Utenti → Seleziona utente → Reset Password</p>
              </div>
              <div className="border-l-2 border-green-500 pl-4">
                <h4 className="font-medium">Come aggiungere un nuovo aeromobile?</h4>
                <p className="text-sm text-gray-600">Modulo Aircraft → Nuovo Aeromobile → Compila tutti i campi obbligatori</p>
              </div>
              <div className="border-l-2 border-orange-500 pl-4">
                <h4 className="font-medium">Come configurare le notifiche email?</h4>
                <p className="text-sm text-gray-600">Impostazioni → Notifiche → Configura template e destinatari</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supporto e Contatti</CardTitle>
            <CardDescription>
              Come ottenere assistenza quando necessario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Email Support</h4>
                  <p className="text-sm text-gray-600">support@alidasoft.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Telefono</h4>
                  <p className="text-sm text-gray-600">+39 02 1234567 (Lun-Ven 9-18)</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Centro Assistenza Online</h4>
                  <p className="text-sm text-gray-600">help.alidasoft.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
