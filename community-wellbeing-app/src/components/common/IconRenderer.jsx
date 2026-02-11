import * as LucideIcons from 'lucide-react'

export default function IconRenderer({ name, size = 20, className = '', ...props }) {
  const Icon = LucideIcons[name]
  if (!Icon) return null
  return <Icon size={size} strokeWidth={2.5} className={className} {...props} />
}
