import React from 'react';
import { LegalDocument } from './LegalDocument';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const privacyPolicyContent = `PRIVACY POLICY  
Effective Date: 26/01/2026

1. WHO WE ARE Celebration House Entertainment cc t/a SlateOne is the "Responsible Party" (under POPIA) and "Data Controller" (under GDPR) for your information. Address: 62 Roodebloem Street, 3rd Floor CTO Cape Town, 8000. Information Officer Email: [hello@slateone.studio](mailto:hello@slateone.studio)

2. THE INFORMATION WE COLLECT We process two distinct categories of data:

Account Information: Name, email address, company details, VAT number, and billing information (processed by our payment provider).

Script Data: Personal information contained within the scripts you upload (e.g., names of real people in documentaries, contact details on title pages).

3. JURISTIC PERSONS Under South African law (POPIA), we protect the data of companies (Juristic Persons) with the same rigor as we protect individuals.

4. HOW WE USE YOUR DATA (PURPOSE) We process your data for the following purposes:

Service Delivery: To convert your scripts into breakdowns and schedules (Legal Basis: Contractual Necessity).

Billing: To manage your subscription and issue tax invoices (Legal Basis: Contractual Necessity/Legal Obligation).

Communication: To send you service updates or reset passwords (Legal Basis: Legitimate Interest).

Marketing: To send newsletters only if you have opted in (Legal Basis: Consent).

5. INTERNATIONAL TRANSFERS Your data may be stored on servers located outside South Africa (e.g.,).

Safeguards: We ensure these providers are subject to laws or binding agreements (such as GDPR or Standard Contractual Clauses) that provide an adequate level of protection as required by Section 72 of POPIA.

6. DATA RETENTION

Scripts: Deleted 30 days after account closure.

Billing Records: Retained for 5 years as required by SARS.

7. YOUR RIGHTS You have the right to:

Access: Request a copy of the personal data we hold about you.

Correction: Request we update incorrect data.

Deletion: Request we delete your data (subject to legal retention obligations).

Objection: Object to the processing of your data for direct marketing.

To exercise these rights, please contact our Information Officer at [hello@slateone.studio](mailto:hello@slateone.studio).

8. SECURITY We implement reasonable technical and organizational measures to secure your data, including encryption at rest and in transit. In the event of a data breach, we will notify you and the Information Regulator as required by law.

9. COOKIES We use cookies to manage your session. You can manage your cookie preferences via our link.`;

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <LegalDocument
      title="Privacy Policy"
      content={privacyPolicyContent}
      onBack={onBack}
    />
  );
};
