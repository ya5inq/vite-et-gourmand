import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, UserCheck, UserX } from 'lucide-react';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  useEmployees,
  useCreateEmployee,
  useDeactivateEmployee,
  useReactivateEmployee,
  type EmployeeRow,
} from '@/api/hooks/useEmployees';

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-800',
  EMPLOYEE: 'bg-blue-100 text-blue-800',
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrateur',
  EMPLOYEE: 'Employé',
};

const employeeSchema = z.object({
  email: z.string().email('Email invalide'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  phone: z.string().optional(),
});

type EmployeeForm = z.infer<typeof employeeSchema>;

export const UserListPage = () => {
  const { isAdmin } = useAuthContext();
  const { data: employees, isLoading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const deactivate = useDeactivateEmployee();
  const reactivate = useReactivateEmployee();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema),
  });

  const openCreate = () => {
    reset({ email: '', firstName: '', lastName: '', phone: '' });
    setIsModalOpen(true);
  };

  const onSubmit = (data: EmployeeForm) => {
    createEmployee.mutate(
      {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone?.trim() ? data.phone : undefined,
      },
      { onSuccess: () => setIsModalOpen(false) },
    );
  };

  const toggleActive = (employee: EmployeeRow) => {
    if (employee.isActive) {
      if (window.confirm(`Désactiver ${employee.firstName} ${employee.lastName} ?`)) {
        deactivate.mutate(employee.id);
      }
    } else {
      reactivate.mutate(employee.id);
    }
  };

  return (
    <DashboardPageLayout
      title="Employés"
      description="Gestion des employés (la création envoie un email de configuration du mot de passe)"
      actions={
        isAdmin ? (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Nouvel employé
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
                <th className="px-4 py-3 text-left font-medium">Rôle</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Date de création</th>
                {isAdmin && <th className="px-4 py-3 text-right font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees?.map((employee) => (
                <tr key={employee.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{employee.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {[employee.firstName, employee.lastName].filter(Boolean).join(' ') || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[employee.role] ?? 'bg-gray-100 text-gray-800'}`}
                    >
                      {ROLE_LABELS[employee.role] ?? employee.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {employee.isActive ? 'Actif' : 'Désactivé'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(employee.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleActive(employee)}
                        disabled={deactivate.isPending || reactivate.isPending}
                        className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
                        title={employee.isActive ? 'Désactiver' : 'Réactiver'}
                      >
                        {employee.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {employees?.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun employé
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
            <h2 className="mb-4 text-lg font-bold">Nouvel employé</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Prénom</label>
                  <input
                    {...register('firstName')}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Nom</label>
                  <input
                    {...register('lastName')}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName.message}</p>}
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
                <label className="mb-1 block text-sm font-medium">Téléphone (optionnel)</label>
                <input
                  {...register('phone')}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Un email sera envoyé à l’employé pour qu’il définisse son mot de passe.
              </p>
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
                  disabled={createEmployee.isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {createEmployee.isPending ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardPageLayout>
  );
};
