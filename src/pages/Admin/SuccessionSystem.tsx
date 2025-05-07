import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";

interface Successor {
  id: string;
  name: string;
  email: string;
  accessLevel: "limited" | "full";
}

const SuccessionSystem = () => {
  const [successors, setSuccessors] = useState<Successor[]>([]);
  const [newSuccessor, setNewSuccessor] = useState<Omit<Successor, "id">>({
    name: "",
    email: "",
    accessLevel: "limited",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Unauthorized",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
      navigate("/");
    } else {
      // Fetch successors data here (replace with your actual data fetching logic)
      const mockSuccessors: Successor[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          accessLevel: "limited",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          accessLevel: "full",
        },
      ];
      setSuccessors(mockSuccessors);
    }
  }, [isAdmin, navigate, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Omit<Successor, "id">
  ) => {
    setNewSuccessor({ ...newSuccessor, [field]: e.target.value });
  };

  const handleFieldChange = (
    id: string,
    field: keyof Omit<Successor, "id">,
    value: string
  ) => {
    setSuccessors((prevSuccessors) =>
      prevSuccessors.map((successor) =>
        successor.id === id ? { ...successor, [field]: value } : successor
      )
    );
  };

  const addSuccessor = () => {
    if (!newSuccessor.name || !newSuccessor.email) {
      setError("Please fill in all fields.");
      return;
    }

    const newId = Math.random().toString(36).substring(2, 15);
    setSuccessors([...successors, { ...newSuccessor, id: newId }]);
    setNewSuccessor({ name: "", email: "", accessLevel: "limited" });
    setOpen(false);
    setError("");
  };

  const removeSuccessor = (id: string) => {
    setSuccessors(successors.filter((successor) => successor.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate API call (replace with your actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Successors Updated",
        description: "Succession plan updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating successors:", error);
      setError(error.message || "Failed to update successors.");
    } finally {
      setLoading(false);
    }
  };

  // Update the type definition to allow both "limited" and "full" values
  const accessLevelOptions = [
    { value: "limited", label: "Limited Access" },
    { value: "full", label: "Full Access" },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Succession System</h1>
      <p className="text-muted-foreground mb-8">
        Manage and configure the succession plan for administrative roles.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Current Successors</CardTitle>
          <CardDescription>
            Manage the list of successors and their access levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {successors.map((successor) => (
                <TableRow key={successor.id}>
                  <TableCell>{successor.name}</TableCell>
                  <TableCell>{successor.email}</TableCell>
                  <TableCell>
                    {/* Fix the property assignment */}
                    <Select
                      value={successor.accessLevel}
                      onValueChange={(value) =>
                        handleFieldChange(successor.id, "accessLevel", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Access Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {accessLevelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSuccessor(successor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Successor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Successor</DialogTitle>
                        <DialogDescription>
                          Add a new successor to the succession plan.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            type="text"
                            id="name"
                            value={newSuccessor.name}
                            onChange={(e) => handleInputChange(e, "name")}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input
                            type="email"
                            id="email"
                            value={newSuccessor.email}
                            onChange={(e) => handleInputChange(e, "email")}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="accessLevel" className="text-right">
                            Access Level
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              handleInputChange(
                                {
                                  target: { value } as any,
                                } as any,
                                "accessLevel"
                              )
                            }
                            defaultValue={newSuccessor.accessLevel}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select Access Level" />
                            </SelectTrigger>
                            <SelectContent>
                              {accessLevelOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button type="submit" onClick={addSuccessor}>
                        Add Successor
                      </Button>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update Succession Plan"}
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessionSystem;
