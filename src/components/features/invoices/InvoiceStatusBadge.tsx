import { Badge, UIColor, UIVariant, cn } from '@/components/ui';
import { InvoiceStatus } from '@/lib/schemas';

interface Props {
  status: InvoiceStatus;
  label: string;
  className?: string;
}

const STATUS_STYLE: Record<
  InvoiceStatus,
  { variant: UIVariant; color: UIColor; className?: string }
> = {
  [InvoiceStatus.DRAFT]: { variant: UIVariant.Bordered, color: UIColor.Default },
  [InvoiceStatus.SENT]: { variant: UIVariant.Flat, color: UIColor.Primary },
  [InvoiceStatus.PAID]: { variant: UIVariant.Flat, color: UIColor.Success },
  [InvoiceStatus.OVERDUE]: { variant: UIVariant.Flat, color: UIColor.Warning },
  [InvoiceStatus.CANCELLED]: {
    variant: UIVariant.Flat,
    color: UIColor.Default,
    className: 'line-through',
  },
};

export function InvoiceStatusBadge({ status, label, className }: Props) {
  const style = STATUS_STYLE[status];
  return (
    <Badge variant={style.variant} color={style.color} className={cn(style.className, className)}>
      {label}
    </Badge>
  );
}
