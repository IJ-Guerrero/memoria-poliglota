import {
  PawPrint,
  UtensilsCrossed,
  Palette,
  Hash,
  Hand,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  PawPrint,
  UtensilsCrossed,
  Palette,
  Hash,
  Hand,
};

export default function CategoryIcon({
  name,
  className,
}: {
  name: string | null;
  className?: string;
}) {
  const Icon = (name && iconMap[name]) || LayoutGrid;
  return <Icon className={className} />;
}
