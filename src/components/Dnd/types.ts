export interface CardType {
  id: string; // รหัสของผู้สมัคร
  status: string; // สถานะของผู้สมัคร เช่น "NEW", "PENDING_INTERVIEW", "INTERVIEW_PASSED"
  person: {
    name: string;
    phone: string;
    email: string;
    position: string;
    expectSalary: string;
  };
  info: {
    address: {
      houseNumber: string;
      village: string;
      road: string;
      subDistrict: string;
      district: string;
      province: string;
      zipCode: string;
      country: string;
    };
    nationality: string;
    religion: string;
    race: string;
  };
  birthdate: string;
  itemsMilitary: string;
  itemsMarital: string;
  itemsDwelling: string;
  documents: {
    id: string;
    name: string; // ชื่อเอกสาร
    applicantId: string; // รหัสผู้สมัครที่เกี่ยวข้อง
  }[];
}
// ข้อมูลคอลัมน์
export type ColumnType = "NEW" | "PENDING_INTERVIEW" | "INTERVIEW_PASSED";