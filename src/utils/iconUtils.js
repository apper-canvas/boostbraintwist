import * as icons from 'lucide-react';

// Helper function to get icon component by name
export default function getIcon(name) {
  if (icons[name]) {
    return icons[name];
  }
  console.warn(`Icon ${name} not found`);
  return icons.HelpCircle; // Fallback icon
}