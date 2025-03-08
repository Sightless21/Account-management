export interface Employee {
  person:    Person;
  info:      Info;
  id:        string;
  birthdate: Date;
  military:  string;
  marital:   string;
  dwelling:  string;
  createdAt: Date;
  updatedAt: Date;
  userId:    string;
  user:      User;
  documents: Document[];
}

export interface Document {
  id:          string;
  name:        string;
  applicantId: null;
  employeeId:  string;
}

export interface Info {
  address:     Address;
  nationality: string;
  religion:    string;
  race:        string;
}

export interface Address {
  houseNumber: string;
  village:     string;
  road:        string;
  subDistrict: string;
  district:    string;
  province:    string;
  zipCode:     string;
  country:     string;
}

export interface Person {
  name:         string;
  phone:        string;
  email:        string;
  position:     string;
  expectSalary: number;
}

export interface User {
  id:                   string;
  profileImage:         string;
  profilePublicImageId: string;
  firstName:            string;
  lastName:             string;
  email:                string;
  hashedPassword:       string;
  phone:                string;
  role:                 string;
  isVerify:             boolean;
  employeeId:           string;
  createdAt:            Date;
  updatedAt:            Date;
}
