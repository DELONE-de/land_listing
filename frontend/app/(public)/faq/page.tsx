const faqs = [
  {
    q: 'Do I need to create an account to browse listings?',
    a: 'No. You can browse all listings and contact sellers without signing up.',
  },
  {
    q: 'How do I contact a seller?',
    a: 'Each listing has a WhatsApp button that connects you directly with the seller.',
  },
  {
    q: 'Are all listings verified?',
    a: 'Yes. Every listing is reviewed by our team before going live to ensure accuracy.',
  },
  {
    q: 'How do I list my land for sale?',
    a: 'Contact us via the Contact page or WhatsApp and our team will assist you.',
  },
  {
    q: 'What documents should I check before buying land?',
    a: 'Always verify the Certificate of Occupancy (C of O), Survey Plan, and Deed of Assignment.',
  },
  {
    q: 'Is LandApp available across all Nigerian states?',
    a: 'Yes. We have listings across all 36 states and the FCT.',
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">FAQs</h1>
        <p className="text-gray-500 text-lg">Answers to common questions about LandApp.</p>
      </div>

      <div className="space-y-4">
        {faqs.map(({ q, a }) => (
          <div key={q} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
            <p className="text-gray-500 text-sm">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
