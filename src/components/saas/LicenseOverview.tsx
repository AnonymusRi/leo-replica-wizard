
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, Calendar, CheckCircle, AlertTriangle, User, Plane } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export const LicenseOverview = () => {
  const { data: license, isLoading: licenseLoading } = useQuery({
    queryKey: ['saas-license'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saas_licenses')
        .select(`
          *,
          organizations (
            name,
            email,
            slug
          )
        `)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: users } = useQuery({
    queryKey: ['license-users'],
    queryFn: async () => {
      if (!license?.organization_id) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role,
            module_permissions
          )
        `)
        .eq('organization_id', license.organization_id)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!license?.organization_id
  });

  const { data: crewMembers } = useQuery({
    queryKey: ['license-crew'],
    queryFn: async () => {
      if (!license?.organization_id) return [];
      
      const { data, error } = await supabase
        .from('crew_members')
        .select(`
          *,
          crew_certifications (
            certification_type,
            expiry_date,
            is_active
          )
        `)
        .eq('organization_id', license.organization_id)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!license?.organization_id
  });

  if (licenseLoading) {
    return <div>Caricamento licenza...</div>;
  }

  if (!license) {
    return <div>Nessuna licenza trovata</div>;
  }

  const isExpiringSoon = license.expires_at && new Date(license.expires_at) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const daysUntilExpiry = license.expires_at ? Math.ceil((new Date(license.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  // Type guard and cast for active_modules
  const activeModules = Array.isArray(license.active_modules) ? license.active_modules : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Licenza SaaS - {license.organizations?.name}</h1>
        <Badge variant={license.is_active ? "default" : "destructive"} className="text-lg px-4 py-2">
          {license.is_active ? "Attiva" : "Disattivata"}
        </Badge>
      </div>

      {/* License Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tipo Licenza</p>
                <p className="text-2xl font-bold text-blue-600 capitalize">{license.license_type}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utenti</p>
                <p className="text-2xl font-bold text-green-600">{users?.length || 0}/{license.max_users}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scadenza</p>
                <p className="text-sm font-bold text-orange-600">
                  {license.expires_at ? format(new Date(license.expires_at), 'dd/MM/yyyy', { locale: it }) : 'N/A'}
                </p>
                {daysUntilExpiry && (
                  <p className="text-xs text-gray-500">{daysUntilExpiry} giorni</p>
                )}
              </div>
              <div className="flex items-center">
                {isExpiringSoon ? (
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                ) : (
                  <Calendar className="w-8 h-8 text-orange-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Moduli Attivi</p>
                <p className="text-2xl font-bold text-purple-600">{activeModules.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Moduli Attivi</CardTitle>
          <CardDescription>
            Moduli disponibili con questa licenza
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {activeModules.map((module: string, index: number) => (
              <Badge key={index} variant="outline" className="text-sm">
                {module}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* License Managers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Gestori Licenza ({users?.length || 0})</span>
          </CardTitle>
          <CardDescription>
            Utenti autorizzati a gestire questa licenza
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Permessi Moduli</TableHead>
                <TableHead>Accesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => {
                // Type guard for user_roles
                const userRoles = Array.isArray(user.user_roles) ? user.user_roles : [];
                const primaryRole = userRoles[0];
                
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {primaryRole?.role || 'viewer'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {primaryRole?.module_permissions && Array.isArray(primaryRole.module_permissions) ? (
                          <>
                            {primaryRole.module_permissions.slice(0, 3).map((perm: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                            {primaryRole.module_permissions.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{primaryRole.module_permissions.length - 3}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <Badge variant="outline" className="text-xs">Nessun permesso</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Accedi come {user.first_name}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Crew Members / Pilots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="w-5 h-5" />
            <span>Equipaggio & Piloti ({crewMembers?.length || 0})</span>
          </CardTitle>
          <CardDescription>
            Membri dell'equipaggio con accesso alla dashboard crew
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Posizione</TableHead>
                <TableHead>Licenza</TableHead>
                <TableHead>Base</TableHead>
                <TableHead>Certificazioni</TableHead>
                <TableHead>Accesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crewMembers?.map((member) => {
                // Type guard for crew_certifications
                const certifications = Array.isArray(member.crew_certifications) ? member.crew_certifications : [];
                const activeCertifications = certifications.filter((cert: any) => cert.is_active);
                
                return (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.first_name} {member.last_name}
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Badge variant={member.position === 'captain' ? 'default' : 'secondary'}>
                        {member.position === 'captain' ? 'Comandante' : 'Primo Ufficiale'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {member.license_number}
                      <div className="text-xs text-gray-500">
                        Scad: {member.license_expiry ? format(new Date(member.license_expiry), 'dd/MM/yy') : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>{member.base_location}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {activeCertifications.slice(0, 2).map((cert: any, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {cert.certification_type}
                          </Badge>
                        ))}
                        {activeCertifications.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{activeCertifications.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Dashboard Pilota
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Warning if expiring soon */}
      {isExpiringSoon && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">Attenzione: Licenza in Scadenza</h3>
                <p className="text-orange-700">
                  La licenza scadrà tra {daysUntilExpiry} giorni. Contatta il team commerciale per il rinnovo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
