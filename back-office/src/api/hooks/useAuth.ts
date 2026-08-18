import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthContext } from '@/contexts/AuthContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      await login(email, password);
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success('Connexion réussie');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur de connexion');
    },
  });
};

export const useLogout = () => {
  const { signOut } = useAuthContext();

  return useMutation({
    mutationFn: async () => {
      await signOut();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur de déconnexion');
    },
  });
};
