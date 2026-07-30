import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardBody>
        <LoginForm />
      </CardBody>
    </Card>
  );
}
