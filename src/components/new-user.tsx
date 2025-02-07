/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// Actions
import { createUser } from "@/app/action/new-user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  formSchema,
  DEFAULT_FORM_VALUES,
  MIN_PASSWORD_LENGTH,
  PASSWORD_PLACEHOLDER
} from "@/schema/formNewUser";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner"


//FIXME
export const NewUser = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const FormInput = ({
    name,
    label,
    control,
    type = "text",
    placeholder
  }: {
    name: keyof z.infer<typeof formSchema>;
    label: string;
    control: typeof form.control;
    type?: string;
    placeholder?: string;
  }) => (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              onChange={(e) => field.onChange(e.target.value)} // ✅ แก้ไขให้บันทึกค่าได้ถูกต้อง
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Value : ",values)

    if(values.password !== values.confirmPassword) {
      toast.error("Password and Confirm Password does not match") 
      return
    }
    try {
      toast.promise(createUser(values), {
        loading: "Creating user...",
        success: "User created",
        error: "Error creating user"
      })
      // form.reset();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-rows-1 gap-5 p-5">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Please enter your details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-2">
              <FormInput
                name="firstName"
                label="First name"
                control={form.control}
                placeholder="John"
                type="text"
              />
              <FormInput
                name="lastName"
                label="Last name"
                control={form.control}
                placeholder="Doe"
                type="text"
              />
              <FormInput
                name="email"
                label="Email"
                control={form.control}
                type="email"
                placeholder="john@example.com"
              />

              <FormInput
                name="phone"
                label="Phone Number"
                control={form.control}
                placeholder="1234567890"
                type="tel"
              />

              <FormInput
                name="password"
                label="Password"
                control={form.control}
                type="password"
                placeholder={PASSWORD_PLACEHOLDER}
              />
              <FormInput
                name="confirmPassword"
                label="Confirm Password"
                control={form.control}
                type="password"
                placeholder={PASSWORD_PLACEHOLDER}
              />

              {/* Role Selection Dropdown */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EMPLOYEE">Employee</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Accordion type="single" defaultValue="item-1" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>What a difference Role functionality?</AccordionTrigger>
                  <AccordionContent>
                    <ul className="ml-6 list-disc [&>li]:mt-2">
                      <li> <p className="font-bold text-lime-600">EMPLOYEE</p> General Access: Can use standard work functions.</li>
                      <li> <p className="font-bold text-yellow-600">HR</p> Can access and modify employee data within the organization</li>
                      <li> <p className="font-bold text-amber-600">MANAGER</p>Has access to all system functions</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

            </CardContent>
          </Card>
          <Button className="w-full" type="submit">
            Create Account
          </Button>
        </div>
      </form>
    </Form>
  );
};