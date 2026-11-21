import React, { useState } from 'react';
import FaqItem from '../components/FaqItem';

export default function FaqSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const faqs = [
    { q: 'How long does a typical project take?', a: 'Most standard projects take between 2 to 4 weeks from discovery to final launch. Enterprise solutions may take 6 to 8 weeks depending on complexity.' },
    { q: 'Do you provide hosting and maintenance?', a: 'Yes! All our packages include optional ultra-fast global hosting and 24/7 server monitoring to ensure 100% uptime.' },
    { q: 'Will my website work on mobile devices?', a: 'Absolutely. We use mobile-first architecture. Elements automatically adapt, and heavy 3D effects are optimized to save battery on phones.' }
  ];

  return (
    <section className="py-24 relative z-10 max-w-4xl mx-auto px-6">
      <div className="text-center mb-12 reveal-text relative z-10">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-4 reveal-text relative z-10">
        {faqs.map((faq, idx) => (
          <FaqItem key={idx} question={faq.q} answer={faq.a} isOpen={openFaqIndex === idx} onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)} />
        ))}
      </div>
    </section>
  );
}