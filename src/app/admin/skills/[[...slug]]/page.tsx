"use client"

import { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Importing Input component from shadcn
import { Textarea } from '@/components/ui/textarea';

interface SkillPageProps {
    params: { slug?: string };
  }

  
const SkillPage = ({ params }: SkillPageProps) => {
    const [formData, setFormData] = useState({
        description: "",
        image: "",
        longDescription: "",
        technology: "",
        vote: 0,
        years: 0,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await fetch('/api/protected/skills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then((res) => res.json());

        console.log('Reesult', res);
    }

    return (
        <div className="container py-10">
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="description">Description</label>
                    <Textarea required id="description" name="description" value={formData.description}
                        onChange={handleChange} />
                </div>

                <div className="field">
                    <label htmlFor="image">Image URL</label>
                    <Input required id="image" name="image" type="text" value={formData.image}
                        onChange={handleChange} />
                </div>

                <div className="field">
                    <label htmlFor="longDescription">Long Description</label>
                    <Textarea required id="longDescription" name="longDescription" value={formData.longDescription}
                        onChange={handleChange} />
                </div>

                <div className="field">
                    <label htmlFor="technology">Technology headline</label>
                    <Input required id="technology" name="technology" type="text" value={formData.technology}
                        onChange={handleChange} />
                </div>

                <div className="field">
                    <label htmlFor="years">Years</label>
                    <Input required id="years" name="years" type="number" value={formData.years}
                        onChange={handleChange} />
                </div>

                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default SkillPage;