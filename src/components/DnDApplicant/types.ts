export interface CardType {
  id: string;
  status: string; // สถานะของผู้สมัคร "NEW", "PENDING_INTERVIEW", "INTERVIEW_PASSED"
  person: {
    email: string;
    expectSalary: string;
    name: string;
    phone: string;
    position: string;
  };
  info: {
    address: {
      country: string;
      district: string;
      houseNumber: string;
      province: string;
      road: string;
      subDistrict: string;
      village: string;
      zipCode: string;
    };
    nationality: string;
    race: string;
    religion: string;
  };
  birthdate: string;
  itemsMilitary: string;
  itemsMarital: string;
  itemsDwelling: string;
  documents: {
    id: string;
    name: string; 
    applicantId: string;
  }[];
}
// ข้อมูลคอลัมน์
export type ColumnType = "NEW" | "PENDING_INTERVIEW" | "INTERVIEW_PASSED";