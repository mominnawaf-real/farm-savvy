import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";

const animalSchema = z.object({
  tagNumber: z.string().min(1, "Tag number is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["cattle", "sheep", "goat", "pig", "chicken", "other"]),
  breed: z.string().min(1, "Breed is required"),
  weight: z.number().min(0, "Weight must be positive"),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female"]),
  status: z.enum(["healthy", "sick", "quarantine", "sold", "deceased"]).default("healthy"),
  notes: z.string().optional(),
});

type AnimalFormData = z.infer<typeof animalSchema>;

interface AddAnimalSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const AddAnimalSidebar = ({ open, onOpenChange, onSuccess }: AddAnimalSidebarProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      status: "healthy",
    },
  });

  const onSubmit = async (data: AnimalFormData) => {
    setIsLoading(true);
    try {
      // For now, we'll use a placeholder farmId. In a real app, this would come from user's selected farm
      // Create the animal data object matching the API expectations
      const animalData = {
        tagNumber: data.tagNumber,
        name: data.name,
        type: data.type,
        breed: data.breed,
        weight: data.weight,
        gender: data.gender,
        status: data.status,
        dateOfBirth: data.dateOfBirth,
        notes: data.notes,
        farmId: "685ec0974bb3eb74e28f4a0b",
      };

      const createdAnimal = await apiClient.createAnimal(animalData);
      console.log("Animal created:", createdAnimal);

      toast({
        title: "Success",
        description: `Animal ${data.name} has been added successfully`,
      });

      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add animal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Animal</SheetTitle>
          <SheetDescription>
            Enter the details of the new animal to add to your farm.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tagNumber">Tag Number*</Label>
              <Input
                id="tagNumber"
                placeholder="e.g., A001"
                {...register("tagNumber")}
                disabled={isLoading}
              />
              {errors.tagNumber && (
                <p className="text-sm text-red-500">{errors.tagNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name*</Label>
              <Input
                id="name"
                placeholder="e.g., Bessie"
                {...register("name")}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type*</Label>
              <Select
                disabled={isLoading}
                onValueChange={(value) => setValue("type", value as AnimalFormData["type"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cattle">Cattle</SelectItem>
                  <SelectItem value="sheep">Sheep</SelectItem>
                  <SelectItem value="goat">Goat</SelectItem>
                  <SelectItem value="pig">Pig</SelectItem>
                  <SelectItem value="chicken">Chicken</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed*</Label>
              <Input
                id="breed"
                placeholder="e.g., Holstein"
                {...register("breed")}
                disabled={isLoading}
              />
              {errors.breed && (
                <p className="text-sm text-red-500">{errors.breed.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)*</Label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g., 1200"
                {...register("weight", { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.weight && (
                <p className="text-sm text-red-500">{errors.weight.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender*</Label>
              <Select
                disabled={isLoading}
                onValueChange={(value) => setValue("gender", value as AnimalFormData["gender"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                disabled={isLoading}
                defaultValue="healthy"
                onValueChange={(value) => setValue("status", value as AnimalFormData["status"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="sick">Sick</SelectItem>
                  <SelectItem value="quarantine">Quarantine</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="deceased">Deceased</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional information about the animal..."
              {...register("notes")}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <SheetFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Animal
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};