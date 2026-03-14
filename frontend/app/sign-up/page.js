import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="container flex min-h-[70vh] items-center justify-center py-10">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </main>
  );
}
