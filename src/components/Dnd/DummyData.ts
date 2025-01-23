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
