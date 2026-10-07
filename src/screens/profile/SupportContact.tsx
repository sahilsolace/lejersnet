import { useState } from 'react';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useToast } from '@/store/useToast';
import { Mail, Phone, ChevronDown, ChevronUp, Send, CheckCircle2 } from 'lucide-react';

const FAQS = [
  {
    q: 'Why should I take photos at move-in?',
    a: 'Under Danish tenancy law (§ 14 in the Tenancy Act), landlords must conduct an entry inspection if they rent out more than one residential unit. Photos taken within the first 14 days serve as your primary defense against unlawful repair charges when you move out.',
  },
  {
    q: 'How does the 14-day notice rule work?',
    a: 'You have 14 days after receiving keys to report any existing defects or issues in writing to your landlord. LejersNet exports all your photos and defect timestamps into a formal report.',
  },
  {
    q: 'Can I cancel my membership anytime?',
    a: 'Yes! LejersNet offers a 14-day satisfaction guarantee and you can cancel anytime from your profile without any lock-in period.',
  },
];

export function SupportContact() {
  const { addToast } = useToast();

  const [category, setCategory] = useState('Deposit dispute');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      addToast('Please fill in subject and message.', 'error');
      return;
    }

    setSubmitted(true);
    addToast('Your support inquiry has been sent! We will reply within 24 hours.', 'success');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="Support & FAQ" />

      <div className="px-4 py-4 space-y-4">
        {/* Contact channels card */}
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wide">
            Get in Touch
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <a
              href="mailto:info@lejersnet.com"
              className="p-3 rounded-xl bg-navy-50 hover:bg-navy-100 flex flex-col gap-1 transition-colors"
            >
              <Mail size={18} className="text-navy-700" />
              <span className="font-bold text-navy-800 mt-1">Email Support</span>
              <span className="text-[11px] text-gray-500">info@lejersnet.com</span>
            </a>

            <a
              href="tel:+4570203040"
              className="p-3 rounded-xl bg-accent-50 hover:bg-accent-100 flex flex-col gap-1 transition-colors"
            >
              <Phone size={18} className="text-accent-700" />
              <span className="font-bold text-navy-800 mt-1">Phone Helpline</span>
              <span className="text-[11px] text-gray-500">+45 70 20 30 40</span>
            </a>
          </div>

          <p className="text-[11px] text-gray-400 text-center pt-1">
            Support hours: Monday – Friday 09:00 - 17:00 CET
          </p>
        </div>

        {/* Message form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wide">
            Send us a message
          </h3>

          {submitted && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
              <span>Inquiry received! Check your email for our team's reply.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Topic</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-navy-800 focus:outline-none bg-white"
            >
              <option value="Deposit dispute">Deposit dispute / Move-out fee</option>
              <option value="Move-in checklist">Move-in checklist question</option>
              <option value="Contract review">Rental contract legal question</option>
              <option value="Technical issue">Technical bug / app feedback</option>
              <option value="Other">Other question</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Summary of your question..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-navy-800 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Describe your situation or question in detail..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-navy-800 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs transition-colors shadow-soft flex items-center justify-center gap-2"
          >
            <Send size={14} />
            Submit Inquiry
          </button>
        </form>

        {/* FAQs */}
        <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
          <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wide">
            Frequently Asked Questions
          </h3>

          <div className="divide-y divide-gray-100">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-2.5">
                <button
                  type="button"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-navy-800"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === idx ? (
                    <ChevronUp size={16} className="text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed bg-brand-light p-2.5 rounded-xl">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
