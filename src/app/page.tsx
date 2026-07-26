import { redirect } from 'next/navigation';

export default function RootPage() {
  // Phase 2: check a real auth/session cookie here and redirect to
  // '/dashboard' if the user already has a valid session.
  redirect('/login');
}
