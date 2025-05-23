
import React from "react";
import { FEEDBACK_CATEGORIES } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const CategorySelector = ({ value, onChange }: CategorySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">What aspect of your visit are you commenting on?</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {FEEDBACK_CATEGORIES.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
