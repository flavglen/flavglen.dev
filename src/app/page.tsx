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

interface IFormData {
  expenseName: string;
  expenseAmount: number;
  expenseDate: string
}

export default function Home() {
  const{user} = useAuth()
  console.log('AUTH', user)
  const [formData, setFormData] = useState<IFormData>({ 
    expenseAmount: 0,
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
      // Set the document with the data
      const docRef = await addDoc(colRef, formData);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
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
          <ToggleGroup type="single" className="flex flex-wrap" onValueChange={(e) =>  updateFormData( {expenseName: e})}>
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

          <ToggleGroupItem value="jianhing" aria-label="Toggle underline">
            Condo Rent
          </ToggleGroupItem>

          <ToggleGroupItem value="jianhing" aria-label="Toggle underline">
            Car parking
          </ToggleGroupItem>

          <ToggleGroupItem value="jianhing" aria-label="Toggle underline">
            Fuel
          </ToggleGroupItem>
        </ToggleGroup>

        <Input  type="number" min={1} onChange={ (e) =>  updateFormData ({ expenseAmount: +e.target.value}) }/>

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
