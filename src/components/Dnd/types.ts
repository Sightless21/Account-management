export interface CardType {
  id: string; // รหัสของผู้สมัคร
  status: string; // สถานะของผู้สมัคร เช่น "NEW", "PENDING_INTERVIEW", "INTERVIEW_PASSED"
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
  updatedAt: string;
  createdAt: string;
  documents: {
    id: string;
    name: string; // ชื่อเอกสาร
    applicantId: string; // รหัสผู้สมัครที่เกี่ยวข้อง
  }[];
}
// ข้อมูลคอลัมน์
export type ColumnType = "NEW" | "PENDING_INTERVIEW" | "INTERVIEW_PASSED";