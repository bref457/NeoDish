import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Dishboard',
  description: 'Dein persönlicher Essenswochenplaner',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`} style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
