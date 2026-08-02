import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { RootLayout } from '../layouts/RootLayout';
import Home from '../pages/Home';

export function App() {
  return (
    <RootLayout>
      <Home />
      <Analytics />
      <SpeedInsights />
    </RootLayout>
  );
}
