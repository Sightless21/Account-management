import SignInForm from "@/components/signinbox";
import { H1 } from "@/components/ui/typography";
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle";

export default function SignInPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Card>
        <CardHeader className="flex flex-row gap-4">
          <H1>Login</H1>
          <ThemeToggle />
        </CardHeader>
        <CardContent className="w-[500px]">
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
