import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { ReusableTabs } from "@/components/ui/customTabs";
import { FormInput } from "@/components/ui/formCustomizeInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { House, Mailbox, Mail, Phone, User, Briefcase, Globe, MapPin, Flag, Book, Banknote } from "lucide-react";
import { FieldValues } from "react-hook-form";

interface TabsInformationProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  requiredFields: string[];
  documentOptions: { label: string; value: string; description: string }[];
  militaryOptions: { label: string; value: string }[];
  maritalOptions: { label: string; value: string }[];
  dwellingOptions: { label: string; value: string }[];
  fieldMapping?: Record<string, string>; // แมปชื่อฟิลด์จาก base name ไปยัง real name
}

const iconMap = {
  name: User,
  phone: Phone,
  email: Mail,
  position: Briefcase,
  expectSalary: Banknote,
  houseNumber: House,
  village: MapPin,
  road: MapPin,
  subDistrict: MapPin,
  district: MapPin,
  province: MapPin,
  zipCode: Mailbox,
  country: Flag,
  nationality: Flag,
  religion: Book,
  race: Globe,
};

export function TabsInformation<T extends FieldValues>({
  form,
  requiredFields,
  documentOptions,
  militaryOptions,
  maritalOptions,
  dwellingOptions,
  fieldMapping = {}, // Default เป็น empty object
}: TabsInformationProps<T>) {
  // ฟังก์ชันช่วยในการแมปชื่อฟิลด์
  const getMappedFieldName = (baseName: string) => fieldMapping[baseName] || baseName;
  // ฟังก์ชันตรวจสอบว่าเป็นฟิลด์ที่ต้องกรอกหรือไม่
  const isRequired = (baseName: string) => requiredFields.includes(getMappedFieldName(baseName));

  const personalTabContent: ReactNode = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormInput
          name={getMappedFieldName("person.name")}
          label="Full Name"
          icon={iconMap.name}
          placeholder="Enter full name"
          control={form.control}
          required={isRequired("person.name")}
        />
        <FormInput
          name={getMappedFieldName("person.phone")}
          label="Phone Number"
          icon={iconMap.phone}
          placeholder="0123456789"
          control={form.control}
          component="phone"
          required={isRequired("person.phone")}
        />
        <FormInput
          name={getMappedFieldName("person.email")}
          label="Email"
          icon={iconMap.email}
          placeholder="Enter email address"
          control={form.control}
          type="email"
          required={isRequired("person.email")}
        />
        <FormInput
          name={getMappedFieldName("person.position")}
          label="Position"
          icon={iconMap.position}
          placeholder="Enter position"
          control={form.control}
          required={isRequired("person.position")}
        />
        <FormInput
          name={getMappedFieldName("person.expectSalary")}
          label="Expected Salary"
          icon={iconMap.expectSalary}
          placeholder="Enter expected salary"
          control={form.control}
          component="currency"
          required={isRequired("person.expectSalary")}
        />
        <FormInput
          name={getMappedFieldName("birthdate")}
          label="Birth Date"
          control={form.control}
          required={isRequired("birthdate")}
          component="birthdate"
        />
      </div>
      <div className="grid gap-4 grid-cols-3">
        <Card className="border-0 rounded-r-none shadow-none md:border-r md:border-gray-200">
          <CardContent>
            <FormInput
              name={getMappedFieldName("military")}
              label="Military Status"
              component="radio"
              control={form.control}
              options={militaryOptions}
              required={isRequired("military")}
              className="space-y-2"
            />
          </CardContent>
        </Card>
        <Card className="border-0 rounded-r-none shadow-none md:border-r md:border-gray-200">
          <CardContent>
            <FormInput
              name={getMappedFieldName("marital")}
              label="Marital Status"
              component="radio"
              control={form.control}
              options={maritalOptions}
              required={isRequired("marital")}
              className="space-y-2"
            />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-none">
          <CardContent>
            <FormInput
              name={getMappedFieldName("dwelling")}
              label="Dwelling Type"
              component="radio"
              control={form.control}
              options={dwellingOptions}
              required={isRequired("dwelling")}
              className="space-y-2"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const addressTabContent: ReactNode = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormInput
          name={getMappedFieldName("info.address.houseNumber")}
          label="House Number"
          icon={iconMap.houseNumber}
          placeholder="Enter house number"
          control={form.control}
          required={isRequired("info.address.houseNumber")}
        />
        <FormInput
          name={getMappedFieldName("info.address.village")}
          label="Village"
          icon={iconMap.village}
          placeholder="Enter village (optional)"
          control={form.control}
          required={isRequired("info.address.village")}
        />
        <FormInput
          name={getMappedFieldName("info.address.road")}
          label="Road"
          icon={iconMap.road}
          placeholder="Enter road"
          control={form.control}
          required={isRequired("info.address.road")}
        />
        <FormInput
          name={getMappedFieldName("info.address.subDistrict")}
          label="Sub-District"
          icon={iconMap.subDistrict}
          placeholder="Enter sub-district"
          control={form.control}
          required={isRequired("info.address.subDistrict")}
        />
        <FormInput
          name={getMappedFieldName("info.address.district")}
          label="District"
          icon={iconMap.district}
          placeholder="Enter district"
          control={form.control}
          required={isRequired("info.address.district")}
        />
        <FormInput
          name={getMappedFieldName("info.address.province")}
          label="Province"
          icon={iconMap.province}
          placeholder="Enter province"
          control={form.control}
          required={isRequired("info.address.province")}
        />
        <FormInput
          name={getMappedFieldName("info.address.zipCode")}
          label="Zip Code"
          icon={iconMap.zipCode}
          placeholder="Enter zip code"
          control={form.control}
          required={isRequired("info.address.zipCode")}
        />
        <FormInput
          name={getMappedFieldName("info.address.country")}
          label="Country"
          icon={iconMap.country}
          placeholder="Enter country"
          control={form.control}
          required={isRequired("info.address.country")}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <FormInput
          name={getMappedFieldName("info.nationality")}
          label="Nationality"
          icon={iconMap.nationality}
          placeholder="Enter nationality"
          control={form.control}
          required={isRequired("info.nationality")}
        />
        <FormInput
          name={getMappedFieldName("info.religion")}
          label="Religion"
          icon={iconMap.religion}
          placeholder="Enter religion"
          control={form.control}
          required={isRequired("info.religion")}
        />
        <FormInput
          name={getMappedFieldName("info.race")}
          label="Race"
          icon={iconMap.race}
          placeholder="Enter race"
          control={form.control}
          required={isRequired("info.race")}
        />
      </div>
    </div>
  );

  const documentsTabContent: ReactNode = (
    <ScrollArea className="h-fit pr-4">
      <FormInput
        name={getMappedFieldName("documents")}
        label="Required Documents"
        description="Please ensure all required documents are submitted"
        component="checkbox"
        control={form.control}
        options={documentOptions}
        required={isRequired("documents")}
        className="space-y-4"
      />
    </ScrollArea>
  );

  const tabs = [
    { label: "Personal Information", value: "personal", content: personalTabContent },
    { label: "Address Details", value: "address", content: addressTabContent },
    { label: "Documents", value: "documents", content: documentsTabContent },
  ];

  return <ReusableTabs tabs={tabs} defaultValue="personal" className="space-y-4" />;
}