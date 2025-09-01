import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Company Management Dashboard',
  description: 'Professional dashboard for managing company content, services, team members, testimonials, and case studies.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}