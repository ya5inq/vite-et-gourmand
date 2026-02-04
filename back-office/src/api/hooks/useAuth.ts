import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/configs/supabase';

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (!profile || (profile.role !== 'admin' && profile.role !== 'employee')) {
        await supabase.auth.signOut();
        throw new Error('Acces refuse. Vous devez etre employe ou administrateur.');
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Connexion reussie');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur de connexion');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur de deconnexion');
    },
  });
};
