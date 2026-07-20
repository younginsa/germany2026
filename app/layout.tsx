import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '독일 겨울 가족여행 2026',
  description: '두 가족이 함께 준비하는 2026년 독일 크리스마스 여행 일정표',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
