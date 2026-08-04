'use client';

import { Button, Input, Select, Spinner, UIColor, UISize, UIVariant } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import useFetcher, { HttpMethod } from '@/lib/hooks/useFetcher';
import { type CreateUserInput, type User, UserRole, createUserSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ROLES = [UserRole.ADMIN, UserRole.STAFF, UserRole.VIEWER] as const;

export function UserForm() {
  const { t } = useTranslation('users');
  const router = useRouter();

  const { fetchData: createUser, isLoading: isSubmitting } = useFetcher<User>({
    url: 'users',
    method: HttpMethod.POST,
    showNotification: false,
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: UserRole.STAFF },
  });

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
    router.push('/users');
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

      <label className="flex flex-col gap-1 text-sm">
        {t('fields.password')}
        <Input
          type="password"
          {...register('password')}
          color={errors.password ? UIColor.Danger : UIColor.Default}
        />
        {errors.password && <span className="text-danger text-xs">{errors.password.message}</span>}
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
        <Button
          type="button"
          variant={UIVariant.Bordered}
          color={UIColor.Default}
          onClick={() => router.push('/users')}
        >
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner size={UISize.Sm} className="text-current" />}
          {t('create.submit')}
        </Button>
      </div>
    </form>
  );
}
