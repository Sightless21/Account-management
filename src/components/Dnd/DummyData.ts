import { CardType } from "./types";
import axios from "axios";

export const fetchApplicants = async (): Promise<CardType[]> => {
    try {
        console.log("Fetching applicants...");
        const { data } = await axios.get<CardType[]>("/api/applicant");
        console.log("Fetched applicants:", data);
        return data;
    } catch (error) {
        console.error("Error fetching applicants:", error);
        return [];
    }
};

export const CARDS: CardType[] = [
    {
        person: {
            name: "อับดุลเพ",
            phone: "0990798261",
            email: "grgrgrg@gmail.com",
            position: "Boomer Developer",
            expectSalary: "00003"
        },
        info: {
            address: {
                houseNumber: "123",
                village: "-",
                road: "อ่อนนุช",
                subDistrict: "ดอกไม้",
                district: "ประเวศ",
                province: "กรุงเทพมหานคร",
                zipCode: "10250",
                country: "Thailand"
            },
            nationality: "ไทย",
            religion: "อิสลาม",
            race: "ไทย"
        },
        id: "678dd746031295594f9f8330",
        birthdate: "2003-06-06T17:00:00.000Z",
        itemsMilitary: "discharged",
        itemsMarital: "divorced",
        itemsDwelling: "Home",
        status: "NEW",
        createdAt: "2025-01-20T04:55:34.477Z",
        updatedAt: "2025-01-20T04:55:34.477Z",
        documents: [
            {
                id: "678dd746031295594f9f8331",
                name: "houseRegis",
                applicantId: "678dd746031295594f9f8330"
            },
            {
                id: "678dd746031295594f9f8332",
                name: "diploma",
                applicantId: "678dd746031295594f9f8330"
            },
            {
                id: "678dd746031295594f9f8333",
                name: "thaiIdCard",
                applicantId: "678dd746031295594f9f8330"
            },
            {
                id: "678dd746031295594f9f8334",
                name: "bookBank",
                applicantId: "678dd746031295594f9f8330"
            }
        ]
    },
    {
        person: {
            name: "อับดุลเลาะห์",
            phone: "0990798261",
            email: "grgrgrg@gmail.com",
            position: "Boomer Developer",
            expectSalary: "00003"
        },
        info: {
            address: {
                houseNumber: "123",
                village: "-",
                road: "อ่อนนุช",
                subDistrict: "ดอกไม้",
                district: "ประเวศ",
                province: "กรุงเทพมหานคร",
                zipCode: "10250",
                country: "Thailand"
            },
            nationality: "ไทย",
            religion: "อิสลาม",
            race: "ไทย"
        },
        id: "678dd746031295594f9f8330",
        birthdate: "2003-06-06T17:00:00.000Z",
        itemsMilitary: "discharged",
        itemsMarital: "divorced",
        itemsDwelling: "Home",
        status: "PENDING_INTERVIEW",
        createdAt: "2025-01-20T04:55:34.477Z",
        updatedAt: "2025-01-20T04:55:34.477Z",
        documents: [
            {
                id: "678dd746031295594f9f8331",
                name: "houseRegis",
                applicantId: "678dd746031295594f9f8330"
            },
            {
                id: "678dd746031295594f9f8332",
                name: "diploma",
                applicantId: "678dd746031295594f9f8330"
            },
            {
                id: "678dd746031295594f9f8333",
                name: "thaiIdCard",
                applicantId: "678dd746031295594f9f8330"
            },
            {
                id: "678dd746031295594f9f8334",
                name: "bookBank",
                applicantId: "678dd746031295594f9f8330"
            }
        ]
    },
];