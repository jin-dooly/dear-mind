import { getProfile } from '@/app/lib/db';
import { SettingsForm } from './SettingsForm';

export default async function SettingsPage() {
  const profile = await getProfile();
  return <SettingsForm profile={profile} />;
}
