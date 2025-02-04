import { Combobox } from "@/components/ui/combobox";

export default function Page() {
  const employees = [
    { label: "John Doe", value: "john" },
    { label: "Jane Smith", value: "jane" },
    { label: "Bob Johnson", value: "bob" },
  ]

  return (
    <div>
      <Combobox
        name="assignees"
        options={employees}
        placeholder="Select employees"
      />
    </div>
  );
}