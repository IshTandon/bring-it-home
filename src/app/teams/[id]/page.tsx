import TeamProfile from '@/components/teams/TeamProfile';

export default function TeamPage({ params }: { params: { id: string } }) {
  return <TeamProfile teamId={params.id} />;
}
