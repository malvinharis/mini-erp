'use client';

import { Button, Input, Modal, Select, Spinner } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import useFetcher, { HttpMethod } from '@/lib/hooks/useFetcher';
import { type CreateUserInput, type User, UserRole, createUserSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ROLES = [UserRole.ADMIN, UserRole.STAFF, UserRole.VIEWER] as const;

export function CreateUserModal() {
  const { t } = useTranslation('users');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { fetchData: createUser, isLoading: isSubmitting } = useFetcher<User>({
    url: 'users',
    method: HttpMethod.POST,
    showNotification: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: UserRole.STAFF },
  });

  const close = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createUser({ data: values });
    } catch (err) {
      // useFetcher normalizes failures to { statusCode, message } internally.
      const apiError = err as { statusCode?: number; message?: string };
      if (apiError.statusCode === 409) {
        setError('email', { message: apiError.message ?? 'Email already in use' });
        return;
      }
      toast.error(apiError.message ?? t('toast.error'));
      return;
    }

    toast.success(t('toast.created'));
    close();
    router.refresh();
  });

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('new')}</Button>
      <Modal open={open} onClose={close}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <h2 className="font-semibold text-lg">{t('create.title')}</h2>

          <label className="flex flex-col gap-1 text-sm">
            {t('fields.name')}
            <Input {...register('name')} color={errors.name ? 'danger' : 'default'} />
            {errors.name && <span className="text-danger text-xs">{errors.name.message}</span>}
          </label>

          <label className="flex flex-col gap-1 text-sm">
            {t('fields.email')}
            <Input
              type="email"
              {...register('email')}
              color={errors.email ? 'danger' : 'default'}
            />
            {errors.email && <span className="text-danger text-xs">{errors.email.message}</span>}
          </label>

          <label className="flex flex-col gap-1 text-sm">
            {t('fields.password')}
            <Input
              type="password"
              {...register('password')}
              color={errors.password ? 'danger' : 'default'}
            />
            {errors.password && (
              <span className="text-danger text-xs">{errors.password.message}</span>
            )}
          </label>

          <label className="flex flex-col gap-1 text-sm">
            {t('fields.role')}
            <Select {...register('role')}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {t(`role.${r}`)}
                </option>
              ))}
            </Select>
          </label>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="bordered" color="default" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner size="sm" className="text-current" />}
              {t('create.submit')}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
