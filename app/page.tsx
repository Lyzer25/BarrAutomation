import type { Metadata } from 'next'
import HomePage from './home-page'

export const metadata: Metadata = {
  title: 'Custom Development Solutions | Barr Automation',
  description: 'Specialized custom development for web applications, internal software, process automation, and AI solutions. Built specifically for your business needs.',
}

export default function Page() {
  return <HomePage />
}
