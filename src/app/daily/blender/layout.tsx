import type { Metadata } from 'next';

export const metadata: Metadata = {
  icons: {
    icon: '/api/icon/blender'
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
