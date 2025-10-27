import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Celebration Diamond - TV Display',
  description: 'Premium diamond collection display for television',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="overflow-hidden">
        {children}
      </body>
    </html>
  )
}
