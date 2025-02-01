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