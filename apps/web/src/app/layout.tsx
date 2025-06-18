import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers/session-provider'
import { ApolloWrapper } from '@/components/providers/apollo-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Navbar } from '@/components/navbar'
import { Toaster } from '@/components/ui/toaster'
import { SkipLink } from '@/components/ui/skip-link'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Pokemon Card Catalog',
  description: 'The ultimate Pokemon TCG collection manager and deck builder',
  keywords: ['Pokemon', 'TCG', 'Trading Cards', 'Collection', 'Deck Builder'],
  authors: [{ name: 'Pokemon Catalog Team' }],
  openGraph: {
    title: 'Pokemon Card Catalog',
    description: 'The ultimate Pokemon TCG collection manager and deck builder',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <ApolloWrapper>
              <SkipLink />
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main id="main-content" className="flex-1" tabIndex={-1}>
                  {children}
                </main>
              </div>
              <Toaster />
            </ApolloWrapper>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}