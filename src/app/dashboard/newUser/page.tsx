import { NewUser } from "@/components/new-user";

//DONE : New User Pages
export default function Page() {
  return (
    <div className="ml-3 mr-3 flex flex-col gap-4">
      <div className="mr-3 flex scroll-m-20 items-center justify-between border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        New User
      </div>
      <NewUser />
    </div>
  );
}
