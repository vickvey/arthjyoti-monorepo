import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">User Registration Page</h1>
      </div>
      <div className="bg-card rounded-lg p-8">
        <SignUpForm />
      </div>
    </div>
  );
}
