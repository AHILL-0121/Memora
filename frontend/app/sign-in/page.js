import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="container flex min-h-[70vh] items-center justify-center py-10">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </main>
  );
}
