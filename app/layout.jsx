import './globals.css';
import '@salilvnair/convengine-chat/style.css';

export const metadata = {
  title: 'ConvEngine Chat Demo — Dashboard',
  description: 'Demo app showing the convengine-chat library integrated into a Next.js dashboard.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
