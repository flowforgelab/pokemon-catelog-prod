import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers/session-provider'
import { ApolloClientProvider } from '@/components/providers/apollo-provider'
import { Navbar } from '@/components/navbar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pokemon Card Catalog',
  description: 'The ultimate Pokemon TCG collection manager and deck builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ApolloClientProvider>
            <Navbar />
            <main>{children}</main>
          </ApolloClientProvider>
        </Providers>
      </body>
    </html>
  )
}