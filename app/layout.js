import './globals.css'
import Providers from '../components/Providers';

export const metadata = {
  title: 'Product Admin Dashboard',
  description: 'Manage your products easily',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
