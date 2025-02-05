import React from 'react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';


type FormTextareaWithCountProp = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form? : any
  name? : string
  maxChars? : number
  disabled?: boolean
}
const FormTextareaWithCount = ({ form, name = "description", maxChars = 300, disabled = false } : FormTextareaWithCountProp  ) => {
  const [charCount, setCharCount] = React.useState(0);

  const getCharColor = () => {
    if (charCount >= 300) return "text-red-500";
    if (charCount >= 290) return "text-yellow-500";
    return "text-gray-500";
};

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <div className={`border rounded-md ${charCount > maxChars ? 'border-red-500' : ''}`}>
                <Textarea
                  placeholder="Enter task description"
                  className="min-h-[100px] pr-16"
                  disabled={disabled}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setCharCount(e.target.value.length);
                  }}
                />
              </div>
              <div className={`absolute bottom-2 right-2 text-sm ${getCharColor()}`}>
                {charCount}/{maxChars}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTextareaWithCount;