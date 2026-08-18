'use client';

import { AlertTriangle } from 'lucide-react';

interface RejectionNoticeProps {
  reason: string | null;
  rejectedAt?: string | null;
}

export function RejectionNotice({ reason, rejectedAt }: RejectionNoticeProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-3">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
        <div>
          <h4 className="font-medium text-red-800">Commande refusée</h4>
          {reason && (
            <p className="text-sm text-red-700 mt-1">{reason}</p>
          )}
          {rejectedAt && (
            <p className="text-xs text-red-600 mt-2">
              Refusée le {new Date(rejectedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
