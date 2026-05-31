import LandingPage from "@/components/landing-page";

export const metadata = {
  title: 'Rixora — AI Career & Study Hub',
  description: 'Rise through knowledge. AI-powered career coaching, resume building, mock interviews, cover letters, and study hub.',
  openGraph: {
    title: 'Rixora — AI Career & Study Hub',
    description: 'Rise through knowledge. AI-powered career coaching, resume building, mock interviews, cover letters, and study hub.',
    type: 'website',
  },
};

export default function Page() {
  return <LandingPage />;
}
