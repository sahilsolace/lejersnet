import { ScreenHeader } from '@/components/ScreenHeader';

export function TermsConditions() {
  return (
    <div className="min-h-full bg-brand-light pb-8">
      <ScreenHeader title="Terms & Conditions" />

      <div className="px-4 py-4 space-y-4 text-xs text-gray-700 leading-relaxed">
        <div className="bg-white rounded-2xl p-5 shadow-soft space-y-4">
          <div>
            <h2 className="text-sm font-bold text-navy-800 mb-1">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the LejersNet mobile application and online services, you agree
              to be bound by these Terms and Conditions. LejersNet provides digital tools for tenancy
              documentation, move-in/move-out reporting, and tenant legal assistance in Denmark.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-navy-800 mb-1">2. Membership & Subscription</h2>
            <p>
              LejersNet Membership is billed on a monthly subscription basis (DKK 49/month including
              applicable VAT). You may cancel your subscription at any time without penalty or
              commitment period. Subscriptions renewed automatically until cancelled.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-navy-800 mb-1">3. 14-Day Right of Withdrawal</h2>
            <p>
              In accordance with Danish consumer legislation (Forbrugeraftaleloven), you are entitled
              to a 14-day statutory right of withdrawal from the date of your initial subscription
              purchase.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-navy-800 mb-1">4. Storage & Document Integrity</h2>
            <p>
              LejersNet stores your uploaded photographs and contractual documents with verifiable
              timestamps. While LejersNet maintains high availability and security, users are advised
              to keep local backups of essential contracts.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-navy-800 mb-1">5. Legal Guidance Disclaimer</h2>
            <p>
              Guidance provided within the application is based on the Danish Tenancy Act (Lejeloven).
              Complex litigation or specific Rent Assessment Committee (Huslejenævn) hearings may
              require formal representation by licensed counsel.
            </p>
          </div>

          <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-400">
            Last updated: October 2024 · LejersNet ApS, Copenhagen, Denmark
          </div>
        </div>
      </div>
    </div>
  );
}
