import './globals.css'
import Providers from '../components/Providers';

export const metadata = {
  title: 'Product Admin Dashboard',
  description: 'Manage your products easily',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
