import { Shield, MapPin, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-800 py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About LandApp</h1>
          <p className="text-white/75 text-lg">
            Nigeria's trusted platform for finding and listing verified land properties.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We make land ownership accessible to every Nigerian by connecting buyers directly with verified sellers —
            no middlemen, no hidden fees, no sign-up required. Browse thousands of plots across all 36 states and
            contact sellers instantly via WhatsApp.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: MapPin,     value: '500+',   label: 'Active Listings'  },
              { icon: TrendingUp, value: '36',     label: 'States Covered'   },
              { icon: Shield,     value: '98%',    label: 'Verified Plots'   },
              { icon: Users,      value: '2,400+', label: 'Happy Buyers'     },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-50 mb-3">
                  <Icon className="w-6 h-6 text-green-700" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose LandApp</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Verified Listings',   desc: 'Every listing is reviewed before going live. No fake or duplicate properties.' },
              { title: 'Direct Contact',      desc: 'Reach sellers directly via WhatsApp. No agents, no commissions.' },
              { title: 'Nationwide Coverage', desc: 'Listings across all 36 states — from Lagos to Maiduguri.' },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-700 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to find your land?</h2>
        <Link href="/listings"
          className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg">
          Browse Listings
        </Link>
      </section>
    </div>
  );
}
