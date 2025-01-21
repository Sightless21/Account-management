
import { z } from "zod"

export const formSchema = z.object({
    //  ข้อมูลบุคคล
    person: z.object({
        name: z.string().min(2, { message: "*" }),
        phone: z
            .string()
            .regex(/^0[0-9]{9}$/, { message: "Must be 10 digits and start with 0." }), // ตรวจสอบเบอร์โทรศัพท์
        email: z.string().email({ message: "*" }), // ตรวจสอบว่าเป็นอีเมลที่ถูกต้อง
        position: z.string().min(2, { message: "*" }),
        expectSalary: z.string().min(2, { message: "*" }),
    }),
    birthdate: z.preprocess(
        (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg),
        z.date().refine((date) => date < new Date(), { message: "Birthdate must be in the past." }) // ตรวจสอบว่าไม่ใช่วันในอนาคต
    ),
    info: z.object({
        address: z.object({
            houseNumber: z.string().min(1, { message: "*" }),
            village: z.string().optional(), // อาจไม่ต้องมีถนนในบางกรณี
            road: z.string().optional(),
            subDistrict: z.string().min(2, { message: "*" }),
            district: z.string().min(2, { message: "*" }),
            province: z.string().min(2, { message: "*" }),
            zipCode: z.string().length(5, { message: "*" }),
            country: z.string().min(2, { message: "*" }),
        }),
        nationality: z.string().min(2, { message: "*" }),
        religion: z.string().min(2, { message: "*" }),
        race: z.string().min(2, { message: "*" }),
    }),

    //  รายการที่ต้องเลือก 1 อย่าง
    itemsMilitary: z.array(z.string()).min(1).max(1, { message: "Please select only one military status." }),
    itemsMarital: z.array(z.string()).min(1).max(1, { message: "Please select only one marital status." }),
    itemsDwelling: z.array(z.string()).min(1).max(1, { message: "Please select only one dwelling type." }),

    //  เอกสาร (ต้องเลือกอย่างน้อย 1 อย่าง)
    documents: z.array(z.string()).min(1, { message: "You have to select at least one document." }),
    status: z.string().optional(),
});