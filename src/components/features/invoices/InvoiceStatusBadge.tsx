import { Badge, type UIColor, type UIVariant } from '@/components/ui';
import { InvoiceStatus } from '@/lib/schemas';

interface Props {
  status: InvoiceStatus;
  label: string;
}

const STATUS_STYLE: Record<
  InvoiceStatus,
  { variant: UIVariant; color: UIColor; className?: string }
> = {
  [InvoiceStatus.DRAFT]: { variant: 'bordered', color: 'default' },
  [InvoiceStatus.SENT]: { variant: 'flat', color: 'default' },
  [InvoiceStatus.PAID]: { variant: 'flat', color: 'success' },
  [InvoiceStatus.OVERDUE]: { variant: 'flat', color: 'warning' },
  [InvoiceStatus.CANCELLED]: { variant: 'flat', color: 'default', className: 'line-through' },
};

export function InvoiceStatusBadge({ status, label }: Props) {
  const style = STATUS_STYLE[status];
  return (
    <Badge variant={style.variant} color={style.color} className={style.className}>
      {label}
    </Badge>
  );
}
