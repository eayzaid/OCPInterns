import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { ChevronDownIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  SelectItem,
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../ui/select";
import React from "react";
import { is } from "date-fns/locale/is";

const InputForm = ({
  control,
  fieldName,
  fieldLabel,
  size,
  placeholder,
  ...props
}) => {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem className={size || "w-9/10"}>
            <FormLabel>{fieldLabel}</FormLabel>
            <FormControl>
              <Input placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

const DatePicker = ({ labelText }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(undefined);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {labelText}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const ButtonForm = ({ isDisabled, children, ...props }) => {
  if (isDisabled)
    return (
      <Button {...props} disabled>
        {children}
      </Button>
    );
  else return <Button {...props}>{children}</Button>;
};

const DatePickerForm = ({
  control,
  fieldName,
  fieldLabel,
  isDisabled,
  ...props
}) => {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{fieldLabel}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <ButtonForm
                  isDisabled={isDisabled}
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "pppp")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </ButtonForm>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
const SelectForm = ({
  control,
  fieldName,
  fieldLabel,
  placeholder,
  selectItems,
  isDisabled,
  className,
  ...props
}) => {

  const SelectModify = ({ children, field }) => {
    if (isDisabled)
      return (
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          className={className}
          disabled
        >
          {children}
        </Select>
      );
    else
      return (
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          className={className}
        >
          {children}
        </Select>
      );
  };

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => {
        const MemoList = React.memo(() => (
          <>
            {selectItems.map((element, idx) => (
              <SelectItem value={element.id || element} key={idx}>
                {element.value || element}
              </SelectItem>
            ))}
          </>
        ));

        return (
          <FormItem>
            <FormLabel className={isDisabled && "text-gray-700"}>
              {fieldLabel}
            </FormLabel>
            <SelectModify field={field}>
              <FormControl>
                <SelectTrigger className={className}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <MemoList />
              </SelectContent>
            </SelectModify>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
export { InputForm, DatePicker, SelectForm, DatePickerForm };
