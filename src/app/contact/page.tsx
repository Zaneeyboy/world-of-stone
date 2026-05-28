import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with World of Stone. Request a quote, ask about stone materials, or plan your installation project. Based in Trinidad & Tobago.',
  openGraph: {
    title: 'Contact World of Stone',
    description: 'Request a quote or ask about our premium stone materials and installation services.',
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
