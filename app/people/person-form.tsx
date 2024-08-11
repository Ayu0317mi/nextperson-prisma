'use client';

import { useState } from "react";
import { Person } from '../lib/model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createPerson, updatePerson } from './actions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const formSchema = z.object({
    firstname: z.string().min(2).max(50),
    lastname: z.string().min(2).max(50),
    phone: z.string().min(10).max(15),
});

interface PersonFormProps {
    person?: Person;
}

export function PersonForm({ person }: PersonFormProps) {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: person?.firstname ?? '',
            lastname: person?.lastname ?? '',
            phone: person?.phone ?? '',
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        let savedPerson: Person;
        if (person) {
            console.log('Updating person:', person);
            savedPerson = await updatePerson({ ...data, id: person.id });
        } else {
            console.log('Creating person:', data);
            savedPerson = await createPerson(data);
            form.reset(); // Reset the form after a successful add
        }
        console.log('Saved person:', savedPerson);
        setIsOpen(false); // Close the dialog after successful submission
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {person ? <Button variant="outline" onClick={() => setIsOpen(true)}>Edit</Button> : <Button onClick={() => setIsOpen(true)}>Add</Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{person ? 'Edit' : 'Add'} Person</DialogTitle>
                    <DialogDescription>
                        {person ? 'Update the details of the person' : 'Enter the details of the person'}
                    </DialogDescription>

                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='First Name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Last Name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder='0422018632' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                                Close
                            </Button>
                            <Button type="submit">
                                {person ? "Save" : "Add"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}