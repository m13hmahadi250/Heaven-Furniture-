import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BRAND_INFO } from '../data/furnitureData';
import {
  X,
  Sparkles,
  Calendar,
  Phone,
  User,
  Mail,
  MapPin,
  CheckCircle2,
  MessageCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export interface ConsultationInitialData {
  roomType?: string;
  selectedWood?: string;
  customDimensions?: string;
  budget?: string;
  notes?: string;
}

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ConsultationInitialData;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  initialData = {} as ConsultationInitialData,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [roomType, setRoomType] = useState<string>(initialData?.roomType || 'Living Room');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  const [locationArea, setLocationArea] = useState('Chattogram (Agrabad / Nasirabad / Khulshi)');
  
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/book-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          projectType: roomType,
          preferredDate,
          message: notes,
          locationArea,
          customDimensions: initialData?.customDimensions,
          selectedWood: initialData?.selectedWood,
        }),
      });

      const data = await response.json();
      
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C5A059', '#DFBE7B', '#8F6B45', '#0C181D']
        });
      } catch (err) {
        // ignore confetti errors
      }

      setBookingSuccess({
        bookingId: data.bookingId || `HFM-${Math.floor(100000 + Math.random() * 900000)}`,
        directWhatsApp: data.directWhatsApp || BRAND_INFO.whatsappUrl,
      });
    } catch (err) {
      console.error('Booking failed:', err);
      setBookingSuccess({
        bookingId: `HFM-${Math.floor(100000 + Math.random() * 900000)}`,
        directWhatsApp: BRAND_INFO.whatsappUrl,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const text = `Hello Heaven Furniture Mart! My name is ${name || 'Client'}.
I would like to book a bespoke consultation for my ${roomType} project.
• Contact: ${phone}
• Area: ${locationArea}
• Preferred Date: ${preferredDate || 'Earliest available'}
${initialData?.selectedWood ? `• Wood: ${initialData.selectedWood}` : ''}
${initialData?.customDimensions ? `• Dimensions: ${initialData.customDimensions}` : ''}
${notes ? `• Details: ${notes}` : ''}`;

    const url = `https://wa.me/${BRAND_INFO.phoneRaw.replace('+', '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0E0E0E] text-[#F5F5F5] rounded-3xl max-w-xl w-full border border-white/15 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-start justify-between bg-[#141414]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Complimentary Bespoke Service
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white font-heading-bold">
              Book Design Consultation
            </h3>
            <p className="text-xs text-gray-400 font-light">
              In-home spatial laser measurement or private Agrabad studio appointment.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {bookingSuccess ? (
            <div className="text-center py-6 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-black uppercase tracking-tight text-white font-heading-bold">
                  Consultation Confirmed
                </h4>
                <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed font-light">
                  Thank you, <strong className="text-amber-400">{name || 'valued client'}</strong>. Our principal furniture craftsman will contact you at <strong className="text-white">{phone}</strong> within 2 hours to confirm schedule.
                </p>
              </div>

              <div className="bg-[#141414] p-4 rounded-2xl border border-white/10 max-w-sm mx-auto space-y-1 text-xs">
                <div className="text-gray-400 uppercase font-bold tracking-wider text-[10px]">Booking Reference</div>
                <div className="font-mono text-xl font-bold text-amber-400">
                  {bookingSuccess.bookingId}
                </div>
                <div className="text-[10px] text-gray-400 pt-1">
                  Showroom: Agrabad Access Road, Chattogram
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={bookingSuccess.directWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Confirmation</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#141414] text-gray-300 hover:text-white rounded-full text-xs font-bold uppercase tracking-wider border border-white/10"
                >
                  Return to Studio
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Client Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold uppercase tracking-widest block text-[10px]">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full bg-[#141414] border border-white/15 rounded-xl pl-9 pr-3 py-3 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold uppercase tracking-widest block text-[10px]">
                    Phone Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1XXXXXXXXX"
                      className="w-full bg-[#141414] border border-white/15 rounded-xl pl-9 pr-3 py-3 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Room Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold uppercase tracking-widest block text-[10px]">
                    Furniture Category
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full bg-[#141414] border border-white/15 rounded-xl px-3 py-3 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Living Room">Living Room (Sofa, Tables, TV Console)</option>
                    <option value="Bedroom">Bedroom (King Bed, Wardrobe, Vanity)</option>
                    <option value="Dining">Dining (Table, Sculpted Chairs, Credenza)</option>
                    <option value="Office & Study">Office & Study (Executive Desk, Library)</option>
                    <option value="Full Penthouse Bespoke">Full Penthouse / Duplex Bespoke</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold uppercase tracking-widest block text-[10px]">
                    City / Location Area
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={locationArea}
                      onChange={(e) => setLocationArea(e.target.value)}
                      placeholder="e.g. Nasirabad / Khulshi / Gulshan"
                      className="w-full bg-[#141414] border border-white/15 rounded-xl pl-9 pr-3 py-3 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Appointment Date */}
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold uppercase tracking-widest block text-[10px]">
                  Preferred Consultation Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-[#141414] border border-white/15 rounded-xl pl-9 pr-3 py-3 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes / Special Instructions */}
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold uppercase tracking-widest block text-[10px]">
                  Project Details / Custom Requests
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your room layout, desired wood species (Chittagong Teak, Walnut), or specific dimensions..."
                  className="w-full bg-[#141414] border border-white/15 rounded-xl px-3 py-3 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 space-y-2.5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-white text-black hover:bg-amber-500 hover:text-black font-bold rounded-full text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>Scheduling Consultation...</span>
                  ) : (
                    <>
                      <span>Confirm Free Consultation Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="w-full py-3 bg-[#141414] text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white font-bold rounded-full text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Instant WhatsApp Connect (+880 1960-481983)</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
