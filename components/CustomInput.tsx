import {
  authFormSchema,
  // cn, formatDateTime
} from "@/lib/utils";
import React from "react";
// import { CalendarIcon } from "lucide-react"
import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
// import { Calendar } from "@/components/ui/calendar"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"

// import { Button } from "./ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = authFormSchema("sign-up");

interface CustomInput {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
}

const CustomInput = ({ control, name, label, placeholder }: CustomInput) => {
  return (
    // <>
    //   {name === "dateOfBirth" ? (
    //     <FormField
    //       control={control}
    //       name={name}
    //       render={({ field }) => (
    //         <FormItem className="form-item">
    //           <FormLabel className="form-label">{label}</FormLabel>
    //           <div className="flex w-full flex-col">
    //             <FormControl>
    //               <Popover>
    //                 <PopoverTrigger asChild>
    //                   <Button
    //                     variant={"outline"}
    //                     className={cn(
    //                       "input-class",
    //                       !field.value && "text-muted-foreground"
    //                     )}
    //                   >
    //                     {field.value ? (
    //                       formatDateTime(field.value).dateOnly
    //                     ) : (
    //                       <span>Pick a date</span>
    //                     )}
    //                     <CalendarIcon className="ml-auto size-4 opacity-50" />
    //                   </Button>
    //                 </PopoverTrigger>
    //                 <PopoverContent className="w-auto p-0" align="start">
    //                   <Calendar
    //                     mode="single"
    //                     selected={field.value}
    //                     onSelect={field.onChange}
    //                     disabled={(date) =>
    //                       date > new Date() || date < new Date("1900-01-01")
    //                     }
    //                     captionLayout="dropdown"
    //                   />
    //                 </PopoverContent>
    //               </Popover>
    //             </FormControl>
    //             <FormMessage className="form-message mt-2" />
    //           </div>
    //           {/* <Popover>
    //             <PopoverTrigger asChild>
    //               <div className="flex w-full flex-col">
    //                 <FormControl>
    //                   <Button
    //                     variant={"outline"}
    //                     className={cn(
    //                       "w-[240px] pl-3 text-left font-normal ",
    //                       !field.value && "text-muted-foreground"
    //                     )}

    //                   >
    //                     {field.value ? (
    //                       formatDateTime(field.value).dateDay
    //                     ) : (
    //                       <span>Pick a date</span>
    //                     )}
    //                     <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />

    //                   </Button>
    //                 </FormControl>
    //               </div>
    //             </PopoverTrigger>
    //             <PopoverContent className="w-auto p-0 " align="start">
    //               <Calendar
    //                 mode="single"
    //                 selected={field.value}
    //                 onSelect={field.onChange}
    //                 disabled={(date) =>
    //                   date > new Date() || date < new Date("1900-01-01")
    //                 }
    //                 captionLayout="dropdown"
    //               />
    //             </PopoverContent>
    //           </Popover>
    //           <FormMessage className="form-message mt-2" /> */}
    //         </FormItem>
    //       )}
    //     />
    //   ) : (
    //     <FormField
    //       control={control}
    //       name={name}
    //       render={({ field }) => (
    //         <FormItem className="form-item">
    //           <FormLabel className="form-label">{label}</FormLabel>
    //           <div className="flex w-full flex-col">
    //             <FormControl>
    //               <Input
    //                 placeholder={placeholder}
    //                 className="input-class"
    //                 type={name === 'password' ? 'password' : 'text'}
    //                 {...field}
    //               />
    //             </FormControl>
    //             <FormMessage className="form-message mt-2" />
    //           </div>
    //         </FormItem>
    //       )}
    //     />
    //   )}
    // </>
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                type={name === "password" ? "password" : "text"}
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CustomInput;
