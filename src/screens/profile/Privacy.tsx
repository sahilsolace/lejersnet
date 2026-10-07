import { ScreenHeader } from '@/components/ScreenHeader';

export function Privacy() {
  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="Privacy Policy" />

      <div className="px-4 py-4 space-y-4 text-xs text-gray-700 leading-relaxed">
        <div className="bg-white rounded-2xl p-5 shadow-soft space-y-4">
          <div>
            <h2 className="text-sm font-bold text-navy-800 mb-1">1. Data Controller</h2>
            <p>
              LejersNet ApS is the data controller for the processing of your personal information.
              We are committed to protecting your privacy in full compliance with the EU General Data
              Protection Regulation (GDPR) and the Danish Data Protection Act.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-navy-800 mb-1">2. Information We Collect</h2>
            <p>
              We collect information provided directly by you, including your name, contact details,
              rental addresses, move-in/move-out photographs, notes, and uploaded rental agreements.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-navy-800 mb-1">3. Purpose of Processing</h2>
            <p>
              Your data is processed exclusively to deliver our service: enabling you to document and
              secure evidence regarding your tenancy condition and protecting your deposit against
              unsubstantiated claims.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-navy-800 mb-1">4. Data Sharing & Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal data or uploaded tenancy photos. Your
              evidence is accessible solely by you, unless you explicitly choose to generate a
              shareable public profile or export a report for your landlord or housing authority.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-navy-800 mb-1">5. Your GDPR Rights</h2>
            <p>
              You have the right to request access to, rectification of, or erasure of your personal
              data. You may export all your stored data at any time via the Files & Storage menu.
            </p>
          </div>

          <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-400">
            Version 2.1 · Valid for all LejersNet users
          </div>
        </div>
      </div>
    </div>
  );
}
