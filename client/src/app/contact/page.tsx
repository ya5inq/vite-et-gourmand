'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';
import { MapPin, Mail, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caracteres'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caracteres'),
});

type ContactForm = z.infer<typeof contactSchema>;

const HEADER_IMAGE = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactForm) {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('contact_messages').insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
      } as never);

      if (error) throw error;

      toast.success('Message envoye avec succes ! Nous vous repondrons rapidement.');
      reset();
    } catch {
      toast.error("Erreur lors de l'envoi du message. Veuillez reessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="relative h-48 sm:h-64">
        <Image
          src={HEADER_IMAGE}
          alt="Contactez-nous"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">Contactez-nous</h1>
            <p className="text-lg text-gray-200 drop-shadow">
              Une question, un devis, une demande particuliere ?
            </p>
          </div>
        </div>
      </div>

    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Nom complet *
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                placeholder="Jean Dupont"
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email *
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                placeholder="jean@exemple.fr"
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                Telephone
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone')}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                placeholder="06 12 34 56 78"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                Sujet
              </label>
              <input
                id="subject"
                type="text"
                {...register('subject')}
                className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                placeholder="Demande de devis"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Message *
            </label>
            <textarea
              id="message"
              rows={6}
              {...register('message')}
              className="w-full px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground resize-none"
              placeholder="Decrivez votre demande..."
            />
            {errors.message && (
              <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </form>
      </div>

      <div className="mt-12 grid sm:grid-cols-3 gap-6 text-center">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
            <MapPin size={24} />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Adresse</h3>
          <p className="text-muted-foreground text-sm">Bordeaux, France</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
            <Mail size={24} />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Email</h3>
          <p className="text-muted-foreground text-sm">contact@viteetgourmand.fr</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
            <Phone size={24} />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Telephone</h3>
          <p className="text-muted-foreground text-sm">05 56 00 00 00</p>
        </div>
      </div>
    </div>
    </div>
  );
}
