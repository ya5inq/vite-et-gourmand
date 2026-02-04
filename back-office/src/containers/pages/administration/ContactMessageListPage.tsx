import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, Mail, MailOpen } from 'lucide-react';
import { useState } from 'react';
import { DashboardPageLayout } from '@/components/templates/DashboardPageLayout';
import { supabase } from '@/configs/supabase';
import { CacheKeys } from '@/configs/cacheKeys';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

const useContactMessages = () => {
  return useQuery({
    queryKey: CacheKeys.CONTACT_MESSAGES(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContactMessage[];
    },
  });
};

const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CacheKeys.CONTACT_MESSAGES() });
      toast.success('Statut mis a jour');
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const ContactMessageListPage = () => {
  const { data: messages, isLoading } = useContactMessages();
  const markAsRead = useMarkAsRead();
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

  const handleView = (msg: ContactMessage) => {
    setViewingMessage(msg);
    if (!msg.is_read) {
      markAsRead.mutate({ id: msg.id, is_read: true });
    }
  };

  return (
    <DashboardPageLayout title="Messages de contact" description="Messages recus depuis le formulaire de contact">
      {isLoading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="w-8 px-4 py-3"></th>
                <th className="px-4 py-3 text-left font-medium">Nom</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Sujet</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {messages?.map((msg) => (
                <tr key={msg.id} className={`hover:bg-muted/30 ${!msg.is_read ? 'bg-blue-50/50 font-medium' : ''}`}>
                  <td className="px-4 py-3">
                    {msg.is_read ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary" />
                    )}
                  </td>
                  <td className="px-4 py-3">{msg.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{msg.email}</td>
                  <td className="px-4 py-3">{msg.subject ?? '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleView(msg)}
                      className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                      title="Voir le message"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {msg.is_read && (
                      <button
                        onClick={() => markAsRead.mutate({ id: msg.id, is_read: false })}
                        className="ml-1 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                        title="Marquer comme non lu"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {messages?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun message
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">{viewingMessage.subject ?? 'Sans sujet'}</h2>
                <p className="text-sm text-muted-foreground">
                  De: {viewingMessage.name} ({viewingMessage.email})
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(viewingMessage.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="mb-6 rounded-md bg-muted/50 p-4">
              <p className="whitespace-pre-wrap text-sm">{viewingMessage.message}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setViewingMessage(null)}
                className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardPageLayout>
  );
};
