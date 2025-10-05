# MedPortal

Production-ready full-stack healthcare portal.

## Features
- Homepage: logo, global site search, multi-level navigation, footer with social, newsletter, legal.
- Patient Portal: login with 2FA stubs and dashboard placeholders.
- Doctor Directory & Profiles: filters by specialty/location/rating and detailed profiles.
- Appointment Booking: calendar widget, availability, SendGrid confirmation stub.
- Telemedicine: video-call/chat/file upload placeholders.
- Health Library & Blog: CMS stubs, SEO routes, meta and Open Graph tags.
- Contact & Support: contact form with reCAPTCHA stub, Google Maps embed, live chat widget stub.
- Security & Compliance: GDPR cookie banner, environment variables, CORS; see HIPAA notes below.
- Internationalization & Accessibility: English + Hindi via next-i18next, WCAG-minded ARIA and keyboard navigation.
- Performance & Analytics: Next.js optimization, lazy loading, Google Analytics stub, Lighthouse CI target.
- Deployment & CI/CD: Dockerfiles, docker-compose, GitHub Actions.

## HIPAA Compliance Notes (Non-binding Guidance)
This project includes stubs and placeholders. For real-world HIPAA compliance:
- Ensure all Protected Health Information (PHI) is encrypted at rest and in transit (TLS 1.2+).
- Use a HIPAA-compliant cloud or on-prem infrastructure; sign Business Associate Agreements (BAAs) with vendors (email, video, analytics, chat).
- Implement strong access controls: unique user IDs, role-based access, audit logs, session timeouts.
- Maintain data retention, backup, and disaster recovery policies.
- Conduct periodic risk assessments and vulnerability scans; document administrative, physical, and technical safeguards.
- Disable third-party analytics and chat for PHI screens, or deploy compliant versions.
- Train staff; establish breach notification procedures per regulation.

## Accessibility (WCAG)
- Provide clear focus states and keyboard navigation (Skip to content added).
- Use semantic landmarks and ARIA roles for nav, banner, contentinfo, and dialogs.
- Ensure color contrast and readable font sizes; avoid relying solely on color.
- Provide alt text for images and labels for forms; validate with tooling.

## Environment Variables
See `backend/.env` and `frontend/.env.local` for required variables.

## Local Development
```bash
docker-compose up --build
```
Frontend: `http://localhost:3000`  • Backend: `http://localhost:4000`  • n8n: `http://localhost:5678`

## n8n AI Agent
Import `n8n-workflows/provider-validation-template.json` as "ProviderValidationAgent" and ensure webhooks `/validate` and `/status/:id` are configured.