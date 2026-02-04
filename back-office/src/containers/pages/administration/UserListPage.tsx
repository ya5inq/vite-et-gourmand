import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Plus, Pencil } from 'lucide-react';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { supabase } from '@/configs/supabase';
import { CacheKeys } from '@/configs/cacheKeys';
import { useAuthContext } from '@/contexts/AuthContext';

type UserProfile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  employee: 'bg-blue-100 text-blue-800',
  user: 'bg-gray-100 text-gray-800',
  visitor: 'bg-yellow-100 text-yellow-800',
};

const useUsers = () => {
  return useQuery({
    queryKey: CacheKeys.USERS(),
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_users_with_email');

      if (error) throw error;
      return data as UserProfile[];
    },
  });
};

const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.USERS() });
      toast.success('Role mis a jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
};

const employeeSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caracteres'),
  first_name: z.string().min(1, 'Le prenom est requis'),
  last_name: z.string().min(1, 'Le nom est requis'),
  role: z.enum(['employee', 'admin']),
});

type EmployeeForm = z.infer<typeof employeeSchema>;

export const UserListPage = () => {
  const { isAdmin } = useAuthContext();
  const { data: users, isLoading } = useUsers();
  const updateRole = useUpdateUserRole();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { role: 'employee' },
  });

  const [isCreating, setIsCreating] = useState(false);

  const openCreate = () => {
    reset({ email: '', password: '', first_name: '', last_name: '', role: 'employee' });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: EmployeeForm) => {
    setIsCreating(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        await supabase
          .from('profiles')
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role,
          })
          .eq('id', authData.user.id);
      }

      toast.success('Employe cree avec succes');
      setIsModalOpen(false);
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRoleChange = (userId: string, role: string) => {
    updateRole.mutate({ id: userId, role }, {
      onSuccess: () => {
        setEditingUserId(null);
      },
    });
  };

  return (
    <DashboardPageLayout
      title="Utilisateurs"
      description="Gestion des utilisateurs"
      actions={
        isAdmin ? (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Nouvel employe
          </button>
        ) : undefined
      }
    >
      {isLoading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Nom</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Date de creation</th>
                {isAdmin && <th className="px-4 py-3 text-right font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {[user.first_name, user.last_name].filter(Boolean).join(' ') || '-'}
                  </td>
                  <td className="px-4 py-3">
                    {editingUserId === user.id ? (
                      <select
                        value={editingRole}
                        onChange={(e) => setEditingRole(e.target.value)}
                        onBlur={() => {
                          if (editingRole !== user.role) {
                            handleRoleChange(user.id, editingRole);
                          } else {
                            setEditingUserId(null);
                          }
                        }}
                        className="rounded-md border border-input px-2 py-1 text-sm"
                        autoFocus
                      >
                        <option value="visitor">Visiteur</option>
                        <option value="user">Utilisateur</option>
                        <option value="employee">Employe</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-800'}`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setEditingUserId(user.id);
                          setEditingRole(user.role);
                        }}
                        className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {users?.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun utilisateur
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Nouvel employe</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Prenom</label>
                  <input
                    {...register('first_name')}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                  />
                  {errors.first_name && <p className="mt-1 text-xs text-destructive">{errors.first_name.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Nom</label>
                  <input
                    {...register('last_name')}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                  />
                  {errors.last_name && <p className="mt-1 text-xs text-destructive">{errors.last_name.message}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Mot de passe</label>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                />
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Role</label>
                <select
                  {...register('role')}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                >
                  <option value="employee">Employe</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isCreating ? 'Creation...' : 'Creer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardPageLayout>
  );
};
