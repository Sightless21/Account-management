'use client'
import {
    Dialog,
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
import { DatePickerWithPresets } from '@/components/date-picker'
import { Label } from "@radix-ui/react-label";

// chage type
interface typeForm {
    // Profile card
    person: {
        name: string
        phone: string
        email: string
        position: string
        expectSalary: string
    }
    birthdate: string
    info: {
        address: {
            houseNumber: string
            village: string
            road: string
            subDistrict: string
            district: string
            province: string
            zipCode: string
            country: string
        }
        nationality: string
        religion: string
        race: string
    }
    itemsMilitary: string[]
    itemsMarital: string[]
    itemsDwelling: string[]
    itemsDoc: string[]
}

const formSchema = z.object({
    // Profile card
    person: z.object({
        name: z.string().min(2, {
            message: `*`,
        }),
        phone: z.string().min(2, {
            message: `*`,
        }),
        email: z.string().min(2, {
            message: `*`,
        }),
        position: z.string().min(2, {
            message: `*`,
        }),
        expectSalary: z.string().min(2, {
            message: `*`,
        }),
    }),
    birthdate: z.string().nonempty({
        message: "*",
    }),
    info: z.object({
        address: z.object({
            houseNumber: z.string().min(2, {
                message: `*`,
            }),
            village: z.string().min(2, {
                message: `*`,
            }),
            road: z.string().min(2, {
                message: `*`,
            }),
            subDistrict: z.string().min(2, {
                message: `*`,
            }),
            district: z.string().min(2, {
                message: `*`,
            }),
            province: z.string().min(2, {
                message: `*`,
            }),
            zipCode: z.string().min(2, {
                message: `*`,
            }),
            country: z.string().min(2, {
                message: `*`,
            }),
        }),
        nationality: z.string().min(2, {
            message: `*`,
        }),
        religion: z.string().min(2, {
            message: `*`,
        }),
        race: z.string().min(2, {
            message: `*`,
        }),
    }),
    itemsMilitary: z.array(z.string()).refine((value) => value.length === 1, {
        message: `Required only 1 item.`,
    }),
    itemsMarital: z.array(z.string()).refine((value) => value.length === 1, {
        message: `Required only 1 item.`,
    }),
    itemsDwelling: z.array(z.string()).refine((value) => value.length === 1, {
        message: `Required only 1 item.`,
    }),
    itemsDoc: z.array(z.string()).refine((value) => value.some((item) => item), {
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
    info: {
        address: {
            houseNumber: {
                id: "houseNumber",
                label: "เลขที่",
            },
            village: {
                id: "village",
                label: "หมู่ที่",
            },
            road: {
                id: "road",
                label: "ถนน",
            },
            subDistrict: {
                id: "subDistrict",
                label: "ตําบล/แขวง",
            },
            district: {
                id: "district",
                label: "อําเภอ/เขต",
            },
            province: {
                id: "province",
                label: "จังหวัด",
            },
            zipCode: {
                id: "zipCode",
                label: "รหัสไปรษณีย์",
            },
            country: {
                id: "country",
                label: "ประเทศ",
            },
        },
        nationality: {
            id: "nationality",
            label: "สัญชาติ",
        },
        religion: {
            id: "religion",
            label: "ศาสนา",
        },
        race: {
            id: "race",
            label: "เชื้อชาติ",
        }
    },
    person: [
        {
            id: "name",
            label: "Applicant Name",
            type: "text",
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
            type: "text",
            placeholder: "Full-stack developer"
        },
        {
            id: "expectSalary",
            label: "Expect Salary",
            type: "text",
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


export default function ModalCreateApplicant() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            person: {
                name: "",
                phone: "",
                email: "",
                position: "",
                expectSalary: "",
            },
            birthdate: "",
            info: {
                address: {
                    houseNumber: "",
                    village: "-",
                    road: "",
                    subDistrict: "",
                    district: "",
                    province: "",
                    zipCode: "",
                    country: "",
                },
                nationality: "",
                race: "",
                religion: "",
            },
            itemsMilitary: [],
            itemsMarital: [],
            itemsDwelling: [],
            itemsDoc: ["thaiIdCard", "houseRegis", "diploma", "bookBank"],
        },
    })
    const [applicant, setTasks] = useState<typeForm[]>([form.getValues()])

    async function onSubmit(values: z.infer<typeof formSchema>,) {

        console.log(values)
        setTasks([...applicant, values])
        // form.reset()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">New Applicant</Button>
            </DialogTrigger>
            <DialogContent className="w-[70%] min-h-20 ">
                <DialogHeader>
                    <DialogTitle>New Applicant</DialogTitle>
                    <DialogDescription>Fill in the form below to create a new applicant.</DialogDescription>
                </DialogHeader>
                {/* layout form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Infomation</CardTitle>
                                <CardDescription>ข้อมูลส่วนตัว</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-wrap items-center gap-2">
                                {Object.entries(itemjson.info).map(([key, value]) => {
                                    if (key === "address") {
                                        return Object.values(value).map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name={`info.address.${item.id}` as `info.address.${keyof typeForm['info']['address']}`}
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                                                            <Label>{item.label}</Label>
                                                            <FormControl>
                                                                <Input className="w-40 h-5 text-center"
                                                                    {...field}
                                                                    value={typeof field.value === 'string' ? field.value : ''}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ));
                                    } else {
                                        return (
                                            <FormField
                                                key={key}
                                                control={form.control}
                                                name={`info.${key}` as `info.${keyof typeForm['info']}`}
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={key}
                                                            className="flex flex-row items-start space-x-3 space-y-0 leading-none">
                                                            {'label' in value && <Label>{value.label}</Label>}
                                                            <FormControl>
                                                                <Input className="w-40 h-5 text-center"
                                                                    {...field}
                                                                    value={typeof field.value === 'string' ? field.value : ''}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        );
                                    }
                                })}
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
                                                                        className="mb-3"
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            const currentValue = Array.isArray(field.value) ? field.value : [];
                                                                            return checked ? field.onChange([...currentValue, item.id]) : field.onChange(currentValue.filter((value) => value !== item.id));
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{item.lable}</FormLabel>
                                                                <FormMessage />
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
                                                                        className="mb-3"
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            const currentValue = Array.isArray(field.value) ? field.value : [];
                                                                            return checked ? field.onChange([...currentValue, item.id]) : field.onChange(currentValue.filter((value) => value !== item.id));
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                                                <FormMessage />
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
                                                                        className="mb-3"
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            const currentValue = Array.isArray(field.value) ? field.value : [];
                                                                            return checked ? field.onChange([...currentValue, item.id]) : field.onChange(currentValue.filter((value) => value !== item.id));
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                                                <FormMessage />
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
                                            name={`person.${item.id}`}
                                            render={({ field }) => {
                                                return (
                                                    <FormItem key={item.id}>
                                                        <div className="flex justify-between">
                                                            <FormLabel>{item.label}</FormLabel><FormMessage />
                                                        </div>
                                                        <FormControl>
                                                            <Input placeholder={item.placeholder} {...field} value={typeof field.value === 'string' ? field.value : ''} />
                                                        </FormControl>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                    {/* Birthdate */}
                                    <FormField
                                        control={form.control}
                                        name="birthdate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex justify-between">
                                                    <FormLabel>Birth Date</FormLabel><FormMessage />
                                                </div>
                                                <FormControl>
                                                    <DatePickerWithPresets value={field.value} onChange={(date) => field.onChange(date.toISOString())} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid col-span-2">
                            <div className="flex justify-end gap-2">
                                <Button type="submit"> <TiTick />Submit</Button>
                                <Button type="button" variant={"destructive"} className="bg-red-600"> <TiCancel />Cancel</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}