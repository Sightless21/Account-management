'use client'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { TiCancel, TiTick } from "react-icons/ti"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { SquareUserRound } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { DatePickerWithPresets } from '@/components/date-picker'

// chage type
interface typeForm {
    // Profile card
    applicantName: string,
    position: string,
    phone: string,
    email: string,
    expectSalary: string
    birthdate: string
}

const leastChar = {
    applicantName: 2,
    position: 2,
    phone: 10,
    email: 2,
    expectSalary: 4,
    birthdate: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
}

const formSchema = z.object({
    // Profile card
    applicantName: z.string().min(leastChar.applicantName, {
        message: `must be at least ${leastChar.applicantName} characters.`,
    }),
    position: z.string().min(leastChar.position, {
        message: `must be at least ${leastChar.position} characters.`,
    }),
    phone: z.string().min(leastChar.phone, {
        message: `must be at least ${leastChar.phone} characters.`,
    }),
    email: z.string().min(leastChar.email, {
        message: `must be at least ${leastChar.email} characters.`,
    }),
    expectSalary: z.string().min(leastChar.expectSalary, {
        message: `must be at least ${leastChar.expectSalary} characters.`,
    }),
    birthdate: z.string().nonempty({
        message: "Birthdate is required.",
    }),
    itemsDoc: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
    itemsMilitary: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
    itemsMarital: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
    itemsDwelling: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
})

const itemjson = {
    doc: [
        {
            id: "thaiIdCard",
            label: "สำเนาบัตรประชาชน",
        },
        {
            id: "houseRegis",
            label: "สำเนาทะเบียนบ้าน",
        },
        {
            id: "diploma",
            label: "สำเนาประกาศนียบัตร",
        },
        {
            id: "bookBank",
            label: "สำเนาบัญชีธนาคาร",
        },
        {
            id: "other",
            label: "อื่นๆ",
        },
    ],
    info: [
        {
            id: "NumberAddress",
            label: "เลขที่",
        },
        {
            id: "Village",
            label: "หมู่ที่",
        },
        {
            id: "Road",
            label: "ถนน",
        },
        {
            id: "SubDistrict",
            label: "ตําบล/แขวง",
        },
        {
            id: "District",
            label: "อําเภอ/เขต",
        },
        {
            id: "Province",
            label: "จังหวัด",
        },
        {
            id: "ZipCode",
            label: "รหัสไปรษณีย์",
        },
        {
            id: "Country",
            label: "ประเทศ",
        },
        {
            id: "national",
            label: "สัญชาติ",
        },
        {
            id: "race",
            label: "เชื้อชาติ",
        },
        {
            id: "religion",
            label: "ศาสนา",
        }
    ],
    person: [
        {
            id: "applicantName",
            label: "Applicant Name",
            type: "string",
            placeholder: "John Doe"
        },
        {
            id: "phone",
            label: "Phone Number",
            type: "tel",
            placeholder: "000-000-0000"
        },
        {
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "JohnDoe@gmail.com"
        },
        {
            id: "position",
            label: "Position",
            type: "string",
            placeholder: "Full-stack developer"
        },
        {
            id: "expectSalary",
            label: "Expect Salary",
            type: "string",
            placeholder: "30,000"
        },
    ],
    military: [
        {
            id: "pass",
            lable: "ได้รับการยกเว้น"
        },
        {
            id: "discharged",
            lable: "ปลดเป็นทหารกองหนุน"
        },
        {
            id: "not pass",
            lable: "ยังไม่ได้รับการยกเว้น"
        }
    ],
    marital: [
        {
            id: "single",
            label: "โสด"
        },
        {
            id: "married",
            label: "แต่งงาน"
        },
        {
            id: "divorced",
            label: "หย่าร้าง"
        },
    ],
    dwelling: [
        {
            id: "familyHouse",
            label: "อาศัยกับครอบครัว"
        },
        {
            id: "Home",
            label: "บ้านตัวเอง"
        },
        {
            id: "RentHouse",
            label: "บ้านเช่า"
        },
        {
            id: "Condo",
            label: "คอนโด"
        },
    ]
} as const


export default function ModalReadApplicant() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            applicantName: "",
            position: "",
            phone: "",
            email: "",
            expectSalary: "",
            birthdate: "",
            itemsDoc: ["thaiIdCard", "houseRegis", "diploma", "bookBank"],
        },
    })
    const [tasks, setTasks] = useState<typeForm[]>([form.getValues()])
    const [edit, setEdit] = useState<boolean>(true)

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setTasks([...tasks, values])
        form.reset()
    }
    function onEdit() {
        if (edit) {
            setEdit(false)
        } else {
            setEdit(true)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild className="text-sm">
                <Button variant="link">read more</Button>
            </DialogTrigger>
            <DialogContent className="w-[70%] min-h-20 ">
                <DialogHeader>
                    <DialogTitle>New Applicant</DialogTitle>
                    <DialogDescription>Fill in the form below to create a new applicant.</DialogDescription>
                </DialogHeader>
                {/* layout form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                        {/* Profile */}
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Infomation</CardTitle>
                                <CardDescription>ข้อมูลส่วนตัว</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-wrap items-center gap-2">
                                {itemjson.info.map((item) => (
                                    <Label
                                        key={item.id}
                                        htmlFor={item.id}
                                        className="flex items-center gap-2"
                                    >
                                        <span>{item.label}</span>
                                        <Input disabled={edit} className="w-40 h-5 text-center" id={item.id} />
                                    </Label>
                                ))}
                                <div className="flex justify-between w-full gap-4">
                                    <Card className='w-full'>
                                        <CardHeader>
                                            <CardDescription>ภาวะทางการทหาร</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {itemjson.military.map((item,) => (
                                                <FormField
                                                    key={item.id}
                                                    control={form.control}
                                                    name="itemsMilitary"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={item.id}
                                                                className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        disabled={edit}
                                                                        className="mb-3"
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            const currentValue = Array.isArray(field.value) ? field.value : [];
                                                                            return checked ? field.onChange([...currentValue, item.id]) : field.onChange(currentValue.filter((value) => value !== item.id));
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{item.lable}</FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </CardContent>
                                    </Card>
                                    <Card className='w-full'>
                                        <CardHeader>
                                            <CardDescription>สถานภาพ</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {itemjson.marital.map((item) => (
                                                <FormField
                                                    key={item.id}
                                                    control={form.control}
                                                    name="itemsMarital"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={item.id}
                                                                className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        disabled={edit}
                                                                        className="mb-3"
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            const currentValue = Array.isArray(field.value) ? field.value : [];
                                                                            return checked ? field.onChange([...currentValue, item.id]) : field.onChange(currentValue.filter((value) => value !== item.id));
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </CardContent>
                                    </Card>
                                    <Card className='w-full'>
                                        <CardHeader>
                                            <CardDescription>การอยู่อาศัย</CardDescription>
                                        </CardHeader>
                                        <CardContent >
                                            {itemjson.dwelling.map((item) => (
                                                <FormField
                                                    key={item.id}
                                                    control={form.control}
                                                    name="itemsDwelling"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={item.id}
                                                                className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        disabled={edit}
                                                                        className="mb-3"
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            const currentValue = Array.isArray(field.value) ? field.value : [];
                                                                            return checked ? field.onChange([...currentValue, item.id]) : field.onChange(currentValue.filter((value) => value !== item.id));
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-5 col-span-2 gap-3">
                            <Card className="col-span-2 over flow-y-auto">
                                <CardHeader className="flex">
                                    <CardTitle>Documents</CardTitle>
                                    <CardDescription>เอกสารสำหรับสมัครงาน</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-2">
                                        {itemjson.doc.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="itemsDoc"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                                                            <FormControl>
                                                                <Checkbox
                                                                    disabled={edit}
                                                                    checked={field.value?.includes(item.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked ? field.onChange([...field.value, item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">{item.label}</FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                        <FormMessage />
                                    </div>
                                    <div className="flex justify-center mt-10">
                                        <SquareUserRound size={70} />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader className="flex">
                                    <CardTitle>Personal</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-2">
                                    {itemjson.person.map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name={item.id}
                                            render={({ field }) => {
                                                return (
                                                    <FormItem key={item.id}>
                                                        <FormLabel className="font-normal">{item.label}</FormLabel>
                                                        <FormControl>
                                                            <Input disabled={edit} placeholder={item.placeholder} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                    <FormField
                                        control={form.control}
                                        name="birthdate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Birth Date</FormLabel>
                                                <FormControl>
                                                    <DatePickerWithPresets disabled={edit} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid col-span-2">
                            <div className="flex justify-end gap-2">
                                <Button type="button" onClick={() => onEdit()} variant={"secondary"}>{edit ? "Edit" : "Editing"} </Button>
                                <Button type="submit"> <TiTick />Submit</Button>
                                <DialogClose>
                                    <Button type="button" variant={"destructive"} className="bg-red-600"> <TiCancel />Cancel</Button>
                                </DialogClose>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}