import { NewUser } from '@/components/new-user'

export default function Page() {

    return (
        <div className="flex flex-col gap-4 ml-3 mr-3">
            <div className="flex items-center justify-between scroll-m-20 border-b pb-2 mr-3 text-3xl font-semibold tracking-tight first:mt-0">
                New User
            </div>
            <NewUser />
        </div>
    );
}