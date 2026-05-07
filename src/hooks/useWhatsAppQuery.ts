import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whatsappService } from '../services/whatsappService';
import { WhatsAppSettings } from '../types';

export function useWhatsAppQuery() {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['whatsapp-settings'],
    queryFn: () => whatsappService.getSettings(),
  });

  const saveMutation = useMutation({
    mutationFn: (settings: WhatsAppSettings) => whatsappService.saveSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-settings'] });
    },
  });

  const embeddedSignupMutation = useMutation({
    mutationFn: (code: string) => whatsappService.embeddedSignup(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-settings'] });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => whatsappService.disconnect(),
    onSuccess: () => {
      queryClient.setQueryData(['whatsapp-settings'], null);
      queryClient.invalidateQueries({ queryKey: ['whatsapp-settings'] });
    },
  });

  const testMutation = useMutation({
    mutationFn: (phone: string) => whatsappService.testConnection(phone),
  });

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    isError: settingsQuery.isError,
    error: settingsQuery.error,
    refetch: settingsQuery.refetch,
    
    save: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    
    embeddedSignup: embeddedSignupMutation.mutateAsync,
    isSigningUp: embeddedSignupMutation.isPending,
    
    disconnect: disconnectMutation.mutateAsync,
    isDisconnecting: disconnectMutation.isPending,
    
    testConnection: testMutation.mutateAsync,
    isTesting: testMutation.isPending,
  };
}
