import { z } from "zod";

//DONE : Form Applicant
export const formApplicantSchema = z.object({
    id: z.string()?.optional(),
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
    // birthdate: z.date().refine((date) => date < new Date(), { message: "Birthdate must be in the past." }), // ตรวจสอบว่าไม่ใช่วันในอนาคต
    birthdate: z.preprocess(
        (arg) =>
            typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
        z
            .date()
            .refine((date) => date < new Date(), {
                message: "Birthdate must be in the past.",
            }), // ตรวจสอบว่าไม่ใช่วันในอนาคต
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
    itemsMilitary: z
        .array(z.string())
        .min(1)
        .max(1, { message: "Please select only one military status." }),
    itemsMarital: z
        .array(z.string())
        .min(1)
        .max(1, { message: "Please select only one marital status." }),
    itemsDwelling: z
        .array(z.string())
        .min(1)
        .max(1, { message: "Please select only one dwelling type." }),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    //  เอกสาร (ต้องเลือกอย่างน้อย 1 อย่าง)
    documents: z
        .array(z.string())
        .min(1, { message: "You have to select at least one document." }),
    status: z.string(),
});

export const APPLICANT_FORM_FIELDS = {
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
        },
    },
    person: [
        {
            id: "name",
            label: "Applicant Name",
            type: "text",
            placeholder: "John Doe",
        },
        {
            id: "phone",
            label: "Phone Number",
            type: "tel",
            placeholder: "000-000-0000",
        },
        {
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "JohnDoe@gmail.com",
        },
        {
            id: "position",
            label: "Position",
            type: "text",
            placeholder: "Full-stack developer",
        },
        {
            id: "expectSalary",
            label: "Expect Salary",
            type: "text",
            placeholder: "30,000",
        },
    ],
    military: [
        {
            id: "pass",
            lable: "ได้รับการยกเว้น",
        },
        {
            id: "discharged",
            lable: "ปลดเป็นทหารกองหนุน",
        },
        {
            id: "not pass",
            lable: "ยังไม่ได้รับการยกเว้น",
        },
    ],
    marital: [
        {
            id: "single",
            label: "โสด",
        },
        {
            id: "married",
            label: "แต่งงาน",
        },
        {
            id: "divorced",
            label: "หย่าร้าง",
        },
    ],
    dwelling: [
        {
            id: "familyHouse",
            label: "อาศัยกับครอบครัว",
        },
        {
            id: "Home",
            label: "บ้านตัวเอง",
        },
        {
            id: "RentHouse",
            label: "บ้านเช่า",
        },
        {
            id: "Condo",
            label: "คอนโด",
        },
    ],
} as const;

export const APPLICANT_FORM_DEFAULT_VALUES = {
    id: "",
    person: {
        name: "",
        phone: "",
        email: "",
        position: "",
        expectSalary: "",
    },
    birthdate: new Date(),
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
    documents: [],
    status: "NEW",
}