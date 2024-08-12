"use server"

import { Person } from '../../lib/model';
import { revalidatePath } from 'next/cache';
import { logger } from '../../lib/logger';

const validation_path: string = "/people";

let mockData: Person[] = [
    { id: 1, firstname: "John", lastname: "Doe", phone: "1234567890" },
    { id: 2, firstname: "Jane", lastname: "Smith", phone: "2345678901" },
    { id: 3, firstname: "Bob", lastname: "Brown", phone: "3456789012" },
];

 async function getPeople(): Promise<Person[]> {
    logger.debug('Fetching persons');
    return mockData;
}

 async function createPerson(person: Person): Promise<Person> {
    const newPerson = { ...person, id: Math.floor(Math.random() * 1000) };
    mockData.push(newPerson); // Add to the array
    logger.debug({ newPerson }, 'Created a new person');
    // Revalidate the path
    revalidatePath(validation_path);
    return newPerson;
}

 async function updatePerson(person: Person): Promise<Person> {
    const index = mockData.findIndex(p => p.id === person.id);
    if (index !== -1) {
        mockData[index] = person; // Update the array
        logger.debug({ person }, 'Updated person');
    } else {
        logger.warn({ person }, 'Person not found for update');
    }
    // Revalidate the path
    revalidatePath(validation_path);
    return person;
}

 async function deletePerson(formData: FormData): Promise<void> {
    const id = parseInt(formData.get("id") as string, 10);
    mockData = mockData.filter(person => person.id !== id);
    logger.debug({ id }, 'Deleted person');
    // Revalidate the path
    revalidatePath(validation_path);
}



export { getPeople, createPerson, updatePerson, deletePerson };