
import { useState } from 'react';

interface SuperAdminFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const useSuperAdminForm = () => {
  const [formData, setFormData] = useState<SuperAdminFormData>({
    email: 'admin@gmail.com',
    password: 'SuperAdmin123!',
    firstName: 'Super',
    lastName: 'Admin'
  });

  const updateFormData = (updates: Partial<SuperAdminFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    updateFormData
  };
};
