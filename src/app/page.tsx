import SignInForm from "@/components/signinbox";

//FIXME : Login Page
export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <div className="mx-auto w-[400px] rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Login
        </h1>
        <SignInForm />
      </div>
    </div>
  );
}
