'use client';

import { Button, Input, Spinner, Textarea, UIColor, UISize, UIVariant } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import useFetcher, { HttpMethod } from '@/lib/hooks/useFetcher';
import {
  type CreateCustomerInput,
  type Customer,
  type UpdateCustomerInput,
  createCustomerSchema,
  updateCustomerSchema,
} from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  customer?: Customer;
}

type FormValues = CreateCustomerInput | UpdateCustomerInput;

export function CustomerForm({ customer }: Props) {
  const { t } = useTranslation('customers');
  const router = useRouter();
  const isEdit = Boolean(customer);

  const { fetchData: submitCustomer, isLoading: isSubmitting } = useFetcher<Customer>({
    url: isEdit ? `customers/${customer?.id}` : 'customers',
    method: isEdit ? HttpMethod.PATCH : HttpMethod.POST,
    showNotification: false,
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(isEdit ? updateCustomerSchema : createCustomerSchema),
    defaultValues: {
      name: customer?.name ?? '',
      email: customer?.email ?? '',
      phone: customer?.phone ?? '',
      npwp: customer?.npwp ?? '',
      address: customer?.address ?? '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await submitCustomer({ data: values });
    } catch (err) {
      const apiError = err as { statusCode?: number; message?: string };
      if (apiError.statusCode === 409) {
        setError('email', { message: apiError.message ?? 'Email already in use' });
        return;
      }
      toast.error(apiError.message ?? t('toast.error'));
      return;
    }

    toast.success(isEdit ? t('toast.updated') : t('toast.created'));
    router.push('/customers');
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        {t('fields.name')}
        <Input {...register('name')} color={errors.name ? UIColor.Danger : UIColor.Default} />
        {errors.name && <span className="text-danger text-xs">{errors.name.message}</span>}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        {t('fields.email')}
        <Input
          type="email"
          {...register('email')}
          color={errors.email ? UIColor.Danger : UIColor.Default}
        />
        {errors.email && <span className="text-danger text-xs">{errors.email.message}</span>}
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          {t('fields.phone')}
          <Input {...register('phone')} color={errors.phone ? UIColor.Danger : UIColor.Default} />
          {errors.phone && <span className="text-danger text-xs">{errors.phone.message}</span>}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          {t('fields.npwp')}
          <Input {...register('npwp')} color={errors.npwp ? UIColor.Danger : UIColor.Default} />
          {errors.npwp && <span className="text-danger text-xs">{errors.npwp.message}</span>}
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        {t('fields.address')}
        <Textarea
          {...register('address')}
          color={errors.address ? UIColor.Danger : UIColor.Default}
        />
        {errors.address && <span className="text-danger text-xs">{errors.address.message}</span>}
      </label>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant={UIVariant.Bordered}
          color={UIColor.Default}
          onClick={() => router.push('/customers')}
        >
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner size={UISize.Sm} className="text-current" />}
          {isEdit ? t('edit.submit') : t('create.submit')}
        </Button>
      </div>
    </form>
  );
}
