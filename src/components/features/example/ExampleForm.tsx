'use client';
import { Button, Input } from '@/components/ui';
import { type CreateExampleInput, createExampleSchema, exampleStatusSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  defaultValues?: Partial<CreateExampleInput>;
  onSubmit: (values: CreateExampleInput) => Promise<void>;
  submitLabel: string;
}

const statuses = exampleStatusSchema.options;

export function ExampleForm({ defaultValues, onSubmit, submitLabel }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateExampleInput>({
    resolver: zodResolver(createExampleSchema),
    defaultValues: { name: '', status: 'DRAFT', amount: 0, ...defaultValues },
  });

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch {
      toast.error('Failed to save');
    }
  });

  return (
    <form onSubmit={submit} className="flex max-w-md flex-col gap-4">
      <label htmlFor="example-name" className="flex flex-col gap-1.5">
        <span className="font-medium text-sm">Name</span>
        <Input id="example-name" {...register('name')} />
        {errors.name ? (
          <span className="text-[--color-danger] text-xs">{errors.name.message}</span>
        ) : null}
      </label>

      <label htmlFor="example-status" className="flex flex-col gap-1.5">
        <span className="font-medium text-sm">Status</span>
        <select
          id="example-status"
          {...register('status')}
          className="h-10 rounded-md border border-[--color-border] bg-[--color-surface] px-3 text-sm"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="example-amount" className="flex flex-col gap-1.5">
        <span className="font-medium text-sm">Amount</span>
        <Input
          id="example-amount"
          type="number"
          step="0.01"
          {...register('amount', { valueAsNumber: true })}
        />
        {errors.amount ? (
          <span className="text-[--color-danger] text-xs">{errors.amount.message}</span>
        ) : null}
      </label>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
