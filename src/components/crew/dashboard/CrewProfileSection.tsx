
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Camera
} from "lucide-react";
import { useCrewProfile, useCreateOrUpdateCrewProfile } from "@/hooks/useCrewProfiles";
import { format } from "date-fns";

interface CrewProfileSectionProps {
  crewMember: any;
}

export const CrewProfileSection = ({ crewMember }: CrewProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: '',
    personal_notes: '',
    notification_settings: {
      email: true,
      push: true,
      sms: false
    }
  });

  const { data: profile } = useCrewProfile(crewMember.id);
  const updateProfile = useCreateOrUpdateCrewProfile();

  const handleEdit = () => {
    setEditData({
      bio: profile?.bio || '',
      personal_notes: profile?.personal_notes || '',
      notification_settings: profile?.notification_settings || {
        email: true,
        push: true,
        sms: false
      }
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateProfile.mutateAsync({
      crew_member_id: crewMember.id,
      ...editData
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    return `${crewMember.first_name?.[0] || ''}${crewMember.last_name?.[0] || ''}`.toUpperCase();
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case "captain": return "Comandante";
      case "first_officer": return "Primo Ufficiale";
      case "cabin_crew": return "Assistente di Volo";
      case "mechanic": return "Meccanico";
      default: return position;
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case "captain": return "bg-blue-100 text-blue-800";
      case "first_officer": return "bg-indigo-100 text-indigo-800";
      case "cabin_crew": return "bg-purple-100 text-purple-800";
      case "mechanic": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile?.avatar_url} alt={`${crewMember.first_name} ${crewMember.last_name}`} />
                <AvatarFallback className="text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full p-2"
              >
                <Camera className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {crewMember.first_name} {crewMember.last_name}
                </h2>
                <Badge className={getPositionColor(crewMember.position)}>
                  {getPositionLabel(crewMember.position)}
                </Badge>
                <Badge variant={crewMember.is_active ? "default" : "secondary"}>
                  {crewMember.is_active ? "Attivo" : "Inattivo"}
                </Badge>
              </div>
              
              {profile?.bio && (
                <p className="text-gray-600 mb-4">{profile.bio}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{crewMember.email}</span>
                </div>
                {crewMember.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{crewMember.phone}</span>
                  </div>
                )}
                {crewMember.base_location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{crewMember.base_location}</span>
                  </div>
                )}
                {crewMember.license_expiry && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Licenza scade: {format(new Date(crewMember.license_expiry), 'dd/MM/yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              {!isEditing ? (
                <Button onClick={handleEdit} className="flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Modifica Profilo</span>
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleSave} className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Salva</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Annulla</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable Profile Information */}
      {isEditing && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Personali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  placeholder="Racconta qualcosa di te..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="notes">Note Personali</Label>
                <Textarea
                  id="notes"
                  value={editData.personal_notes}
                  onChange={(e) => setEditData({ ...editData, personal_notes: e.target.value })}
                  placeholder="Note private (visibili solo a te)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Notifiche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Notifiche Email</Label>
                <Switch
                  id="email-notifications"
                  checked={editData.notification_settings.email}
                  onCheckedChange={(checked) => 
                    setEditData({
                      ...editData,
                      notification_settings: {
                        ...editData.notification_settings,
                        email: checked
                      }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Notifiche Push</Label>
                <Switch
                  id="push-notifications"
                  checked={editData.notification_settings.push}
                  onCheckedChange={(checked) => 
                    setEditData({
                      ...editData,
                      notification_settings: {
                        ...editData.notification_settings,
                        push: checked
                      }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">Notifiche SMS</Label>
                <Switch
                  id="sms-notifications"
                  checked={editData.notification_settings.sms}
                  onCheckedChange={(checked) => 
                    setEditData({
                      ...editData,
                      notification_settings: {
                        ...editData.notification_settings,
                        sms: checked
                      }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
