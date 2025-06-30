
import React, { useState } from 'react';
import { useSuperAdminForm } from '@/hooks/useSuperAdminForm';
import { SuperAdminService } from '@/services/superAdminService';
import SuperAdminForm from './SuperAdminForm';
import SuperAdminSuccess from './SuperAdminSuccess';

const SuperAdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { formData, updateFormData } = useSuperAdminForm();

  const createSuperAdmin = async () => {
    setIsLoading(true);
    setDebugInfo([]);
    
    const service = new SuperAdminService(setDebugInfo);
    const success = await service.createSuperAdmin(formData);
    
    if (success) {
      setIsCreated(true);
    }
    
    setIsLoading(false);
  };

  const handleCreateAnother = () => {
    setIsCreated(false);
    setDebugInfo([]);
  };

  if (isCreated) {
    return (
      <SuperAdminSuccess
        formData={formData}
        debugInfo={debugInfo}
        onCreateAnother={handleCreateAnother}
      />
    );
  }

  return (
    <SuperAdminForm
      formData={formData}
      onFormDataChange={updateFormData}
      onSubmit={createSuperAdmin}
      isLoading={isLoading}
      debugInfo={debugInfo}
    />
  );
};

export default SuperAdminSetup;
