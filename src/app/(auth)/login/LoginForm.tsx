'use client';
import { Button, Input } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import { useActionState } from 'react';
import { type LoginState, loginAction } from './actions';

const initialState: LoginState = {};

export function LoginForm() {
  const { t } = useTranslation('common');
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label htmlFor="email" className="flex flex-col gap-1.5">
        <span className="font-medium text-sm">{t('auth.email')}</span>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue="admin@mini-erp.local"
        />
      </label>
      <label htmlFor="password" className="flex flex-col gap-1.5">
        <span className="font-medium text-sm">{t('auth.password')}</span>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          defaultValue="changeme123"
        />
      </label>
      {state.error ? <p className="text-danger-600 text-sm">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? t('auth.signingIn') : t('auth.submit')}
      </Button>
    </form>
  );
}
