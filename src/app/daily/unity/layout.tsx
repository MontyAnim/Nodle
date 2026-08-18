import type { Metadata } from 'next';

export const metadata: Metadata = {
  icons: {
    icon: '/api/icon/unity'
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
