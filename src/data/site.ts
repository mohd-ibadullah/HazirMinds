export const contact = {
  email: 'contact@hazirminds.ai',
  phone: '919-924-7608',
  phoneHref: 'tel:+19199247608',
};

export type ServiceKey = 'rec' | 'web' | 'com' | 'pipe' | 'infra';

export const services = [
  { key: 'rec', name: 'AI Receptionist', icon: 'call', href: '/ai-receptionist', line: 'Every call answered, every caller helped' },
  { key: 'web', name: 'AI-Powered Website', icon: 'language', href: '/ai-powered-website', line: 'A website that captures and qualifies visitors' },
  { key: 'com', name: 'Automated Communications', icon: 'forward_to_inbox', href: '/automated-communications', line: 'Follow-up that never forgets' },
  { key: 'pipe', name: 'Client Pipeline & Dashboard', icon: 'view_kanban', href: '/client-pipeline-dashboard', line: 'Every lead, call and deal in one place' },
  { key: 'infra', name: 'Secure, Managed Infrastructure', icon: 'shield_lock', href: '/managed-infrastructure', line: 'Enterprise-grade security, fully managed' },
] as const;

export const customWork = [
  { name: 'Custom Websites & Mobile Apps', href: '/custom-websites-mobile-apps', line: 'Designed around how your business works' },
  { name: 'Custom Integrations & Software', href: '/custom-integrations-software', line: 'Scoped to the problem' },
] as const;

export const mainNav = [
  { key: 'industries', label: 'Industries', href: '/industries' },
  { key: 'security', label: 'Security', href: '/security' },
  { key: 'pricing', label: 'Pricing', href: '/pricing' },
  { key: 'about', label: 'About', href: '/about' },
] as const;

export const legal = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'AI Disclosure', href: '/ai-disclosure' },
  { label: 'Accessibility Statement', href: '/accessibility' },
  { label: 'Free Website Terms', href: '/free-website-terms' },
] as const;

export const bookHref = (solve?: string) => '/book-a-discovery-call' + (solve ? '?solve=' + encodeURIComponent(solve) : '');
