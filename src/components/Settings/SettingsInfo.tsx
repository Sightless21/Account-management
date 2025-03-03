"use client"

import { SettingsForm } from "@/schema/formSettings"
import { UseFormReturn } from "react-hook-form"
import { TabsInformation } from "@/components/TabInformation";
interface SettingsInfoProps {
  form: UseFormReturn<SettingsForm>;
  defaultValues: SettingsForm;
}

export default function SettingsInfo({ form }: SettingsInfoProps) {
  const requiredFields = [
    "profile.person.fullName",
    "profile.person.phone",
    "profile.person.email",
    "profile.person.position",
    "profile.person.salary",
    "birthdate",
    "info.address.houseNumber",
    "info.address.village",
    "info.address.road",
    "info.address.subDistrict",
    "info.address.district",
    "info.address.province",
    "info.address.zipCode",
    "info.address.country",
    "info.nationality",
    "info.religion",
    "info.race",
    "military",
    "marital",
    "dwelling",
    "documents",
  ];

  const documentOptions = [
    { label: "National ID Card Copy", value: "national_id", description: "Clear copy of your national ID card (front and back)" },
    { label: "House Registration Copy", value: "house_registration", description: "Official copy of your house registration document" },
    { label: "Bank Account Details", value: "bank_details", description: "Copy of bank book or bank statement" },
    { label: "Educational Certificates", value: "education_cert", description: "Copies of your educational certificates and transcripts" },
    { label: "Resume/CV", value: "resume", description: "Updated resume or curriculum vitae" },
  ];

  const militaryOptions = [
    { label: "Exempted", value: "pass" },
    { label: "Discharged", value: "discharged" },
    { label: "Not Exempted", value: "not pass" },
  ];

  const maritalOptions = [
    { label: "Single", value: "single" },
    { label: "Married", value: "married" },
    { label: "Divorced", value: "divorced" },
  ];

  const dwellingOptions = [
    { label: "Family House", value: "familyHouse" },
    { label: "Own Home", value: "Home" },
    { label: "Rented House", value: "RentHouse" },
    { label: "Condo", value: "Condo" },
  ];

  return (
    <div className="space-y-4">
      <TabsInformation
        form={form}
        requiredFields={requiredFields}
        documentOptions={documentOptions}
        militaryOptions={militaryOptions}
        maritalOptions={maritalOptions}
        dwellingOptions={dwellingOptions}
        fieldMapping={{
          "person.name": "profile.person.fullName",
          "person.phone": "profile.person.phone",
          "person.email": "profile.person.email",
          "person.position": "profile.person.position",
          "person.expectSalary": "profile.person.salary",
          "birthdate": "birthdate",
          "info.address.houseNumber": "info.address.houseNumber",
          "info.address.village": "info.address.village",
          "info.address.road": "info.address.road",
          "info.address.subDistrict": "info.address.subDistrict",
          "info.address.district": "info.address.district",
          "info.address.province": "info.address.province",
          "info.address.zipCode": "info.address.zipCode",
          "info.address.country": "info.address.country",
          "info.nationality": "info.nationality",
          "info.religion": "info.religion",
          "info.race": "info.race",
          "military": "military",
          "marital": "marital",
          "dwelling": "dwelling",
          "documents": "documents",
        }}
      />
    </div>
  );
}