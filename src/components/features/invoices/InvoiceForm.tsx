'use client';

import { Button, Input, Select, Spinner, UIColor, UISize, UIVariant } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import useFetcher, { HttpMethod } from '@/lib/hooks/useFetcher';
import {
  type CreateInvoiceInput,
  type Customer,
  type Invoice,
  InvoiceStatus,
  createInvoiceSchema,
} from '@/lib/schemas';
import { formatCurrency } from '@/lib/utils/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  invoice?: Invoice;
  customers: Customer[];
  defaultCustomerId?: string;
}

type FormValues = CreateInvoiceInput;

const EMPTY_ITEM = { description: '', quantity: 1, unitPrice: 0 };

/** ISO datetime → yyyy-MM-dd for <input type="date">. */
function toDateInput(value?: string): string {
  if (!value) return '';
  return value.slice(0, 10);
}

export function InvoiceForm({ invoice, customers, defaultCustomerId }: Props) {
  const { t } = useTranslation('invoices');
  const router = useRouter();
  const isEdit = Boolean(invoice);

  const { fetchData: submitInvoice, isLoading: isSubmitting } = useFetcher<Invoice>({
    url: isEdit ? `invoices/${invoice?.id}` : 'invoices',
    method: isEdit ? HttpMethod.PATCH : HttpMethod.POST,
    showNotification: false,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      customerId: invoice?.customer.id ?? defaultCustomerId ?? '',
      issueDate: toDateInput(invoice?.issueDate) || toDateInput(new Date().toISOString()),
      dueDate: toDateInput(invoice?.dueDate),
      taxRate: invoice ? Number(invoice.taxRate) : 0,
      status: InvoiceStatus.DRAFT,
      items: invoice
        ? invoice.items.map((it) => ({
            description: it.description,
            quantity: Number(it.quantity),
            unitPrice: Number(it.unitPrice),
          }))
        : [EMPTY_ITEM],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const items = watch('items');
  const taxRate = Number(watch('taxRate')) || 0;
  const subtotal = (items ?? []).reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0,
  );
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  async function persist(values: FormValues, status: InvoiceStatus) {
    const payload = isEdit
      ? {
          customerId: values.customerId,
          issueDate: values.issueDate,
          dueDate: values.dueDate,
          taxRate: values.taxRate,
          items: values.items,
        }
      : { ...values, status };
    try {
      const { data } = await submitInvoice({ data: payload });
      toast.success(isEdit ? t('toast.updated') : t('toast.created'));
      router.push(`/invoices/${data.id}`);
      router.refresh();
    } catch (err) {
      const apiError = err as { message?: string };
      toast.error(apiError.message ?? t('toast.error'));
    }
  }

  const submitDraft = handleSubmit((values) => persist(values, InvoiceStatus.DRAFT));
  const submitSent = handleSubmit((values) => persist(values, InvoiceStatus.SENT));

  return (
    <form onSubmit={submitDraft} className="flex max-w-3xl flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          {t('form.customer')}
          <Select
            {...register('customerId')}
            color={errors.customerId ? UIColor.Danger : UIColor.Default}
          >
            <option value="">{t('form.selectCustomer')}</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          {errors.customerId && (
            <span className="text-danger text-xs">{errors.customerId.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          {t('form.issueDate')}
          <Input
            type="date"
            {...register('issueDate')}
            color={errors.issueDate ? UIColor.Danger : UIColor.Default}
          />
          {errors.issueDate && (
            <span className="text-danger text-xs">{errors.issueDate.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          {t('form.dueDate')}
          <Input
            type="date"
            {...register('dueDate')}
            color={errors.dueDate ? UIColor.Danger : UIColor.Default}
          />
          {errors.dueDate && <span className="text-danger text-xs">{errors.dueDate.message}</span>}
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{t('form.items')}</span>
          <Button
            type="button"
            variant={UIVariant.Flat}
            color={UIColor.Default}
            size={UISize.Md}
            onClick={() => append(EMPTY_ITEM)}
          >
            {t('form.addItem')}
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {fields.map((field, index) => {
            const line =
              (Number(items?.[index]?.quantity) || 0) * (Number(items?.[index]?.unitPrice) || 0);
            return (
              <div key={field.id} className="flex items-start gap-2">
                <label className="flex flex-1 flex-col gap-1 text-sm">
                  {index === 0 ? t('form.description') : null}
                  <Input
                    {...register(`items.${index}.description` as const)}
                    color={errors.items?.[index]?.description ? UIColor.Danger : UIColor.Default}
                  />
                </label>
                <label className="flex w-24 flex-col gap-1 text-sm">
                  {index === 0 ? t('form.quantity') : null}
                  <Input
                    type="number"
                    step="any"
                    {...register(`items.${index}.quantity` as const)}
                    color={errors.items?.[index]?.quantity ? UIColor.Danger : UIColor.Default}
                  />
                </label>
                <label className="flex w-32 flex-col gap-1 text-sm">
                  {index === 0 ? t('form.unitPrice') : null}
                  <Input
                    type="number"
                    step="any"
                    {...register(`items.${index}.unitPrice` as const)}
                    color={errors.items?.[index]?.unitPrice ? UIColor.Danger : UIColor.Default}
                  />
                </label>
                <div className="flex w-28 flex-col gap-1 text-sm">
                  {index === 0 ? <span>{t('form.amount')}</span> : null}
                  <span className="flex h-10 items-center justify-end tabular-nums">
                    {formatCurrency(line)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {index === 0 ? <span className="text-sm">&nbsp;</span> : null}
                  <Button
                    type="button"
                    variant={UIVariant.Flat}
                    color={UIColor.Danger}
                    size={UISize.Md}
                    aria-label={t('form.removeItem')}
                    disabled={fields.length <= 1}
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <input type="hidden" {...register('taxRate')} />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={taxRate === 11}
          onChange={(e) => setValue('taxRate', e.target.checked ? 11 : 0, { shouldValidate: true })}
        />
        {t('form.tax')}
      </label>

      <div className="flex flex-col items-end gap-1 text-sm">
        <div className="flex w-56 justify-between">
          <span className="text-gray-500 dark:text-gray-400">{t('form.subtotal')}</span>
          <span className="tabular-nums">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex w-56 justify-between">
          <span className="text-gray-500 dark:text-gray-400">{t('form.taxAmount')}</span>
          <span className="tabular-nums">{formatCurrency(taxAmount)}</span>
        </div>
        <div className="flex w-56 justify-between font-semibold">
          <span>{t('form.total')}</span>
          <span className="tabular-nums">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant={UIVariant.Bordered}
          color={UIColor.Default}
          onClick={() => router.push('/invoices')}
        >
          {t('cancel')}
        </Button>
        {isEdit ? (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner size={UISize.Sm} className="text-current" />}
            {t('form.save')}
          </Button>
        ) : (
          <>
            <Button
              type="submit"
              variant={UIVariant.Bordered}
              color={UIColor.Primary}
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner size={UISize.Sm} className="text-current" />}
              {t('form.saveDraft')}
            </Button>
            <Button type="button" onClick={submitSent} disabled={isSubmitting}>
              {isSubmitting && <Spinner size={UISize.Sm} className="text-current" />}
              {t('form.saveSend')}
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
