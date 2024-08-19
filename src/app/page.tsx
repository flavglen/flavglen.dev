"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import {  useState } from "react";
import {  db } from "@/lib/firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import useAuth from "@/lib/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast";

interface IFormData {
  expenseName: string;
  expenseAmount: number |  string;
  expenseDate: string
}

export default function Home() {
  const{user} = useAuth();
  const { toast } = useToast()

  const [formData, setFormData] = useState<IFormData>({ 
    expenseAmount: '',
    expenseDate: '',
    expenseName: ''
  });

  const updateFormData = (newData: Partial<IFormData>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...newData,
    }));
  };

  const SaveData = async () => {
    try {
      const colRef = collection(db, "expense");
      const formDataCopy = {...formData};

      if(!formDataCopy.expenseDate) formDataCopy.expenseDate = new Date().toISOString()

      const docRef = await addDoc(colRef, formDataCopy);
      console.log("Document written with ID: ", docRef.id);
      toast({
        title: "Success",
        description: "Expense has been saved",
        variant: "default",
        className: 'bg-green-300'
      })

      setFormData({ 
        expenseAmount: 0,
        expenseDate: '',
        expenseName: ''
      })
      
    } catch (e) {
      toast({
        title: "Failed",
        description: "Failed to add expense",
        variant: "destructive",
      })

      console.error("Error adding document: ", e);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <ToggleGroup type="single" className="flex flex-wrap" value={formData.expenseName} onValueChange={(e) =>  updateFormData( {expenseName: e})}>
          <ToggleGroupItem value="nofrills" aria-label="Toggle bold">
            No Frills
          </ToggleGroupItem>
          <ToggleGroupItem value="Freshco" aria-label="Toggle italic">
            Freshco
          </ToggleGroupItem>
          <ToggleGroupItem value="batala" aria-label="Toggle underline">
            Batala
          </ToggleGroupItem>
          <ToggleGroupItem value="walmart" aria-label="Toggle underline">
            Walmart
          </ToggleGroupItem>
          <ToggleGroupItem value="tim" aria-label="Toggle underline">
            Tim
          </ToggleGroupItem>
          <ToggleGroupItem value="yal" aria-label="Toggle underline">
            Yal
          </ToggleGroupItem>
          <ToggleGroupItem value="fusion" aria-label="Toggle underline">
            Fusion
          </ToggleGroupItem>
          <ToggleGroupItem value="jianhing" aria-label="Toggle underline">
            Jian Hing
          </ToggleGroupItem>

          <ToggleGroupItem value="condorent" aria-label="Toggle underline">
            Condo Rent
          </ToggleGroupItem>

          <ToggleGroupItem value="parking" aria-label="Toggle underline">
            Car parking
          </ToggleGroupItem>

          <ToggleGroupItem value="fuel" aria-label="Toggle underline">
            Fuel
          </ToggleGroupItem>

          <ToggleGroupItem value="costco" aria-label="Toggle underline">
            Costco
          </ToggleGroupItem>
          
          <ToggleGroupItem value="ubereats" aria-label="Toggle underline">
            Uber Eats
          </ToggleGroupItem>

          <ToggleGroupItem value="restaurant" aria-label="Toggle underline">
            Restaurant
          </ToggleGroupItem>

          <ToggleGroupItem value="airbnb" aria-label="Toggle underline">
            Airbnb
          </ToggleGroupItem>

          <ToggleGroupItem value="presto" aria-label="Toggle underline">
            Presto
          </ToggleGroupItem>
          
          <ToggleGroupItem value="movie" aria-label="Toggle underline">
            Movie
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile" aria-label="Toggle underline">
            Mobile
          </ToggleGroupItem>
          <ToggleGroupItem value="ott" aria-label="Toggle underline">
            ott
          </ToggleGroupItem>
        </ToggleGroup>

        <Input  type="number" min={1}  value={formData.expenseAmount || ''} onChange={ (e) =>  updateFormData ({ expenseAmount: +e.target.value}) }/>

        <Calendar
            mode="single"
            initialFocus
            selected={new Date(formData.expenseDate) || new Date()}
            onSelect={(e)=>  updateFormData ({ expenseDate:  e?.toISOString()})  }
          />

        </CardContent>
        <CardFooter>
          <Button onClick={SaveData}>Save</Button>
        </CardFooter>
      </Card>
      
    </main>
  );
}
