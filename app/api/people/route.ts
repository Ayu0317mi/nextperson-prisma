import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const people = await prisma.person.findMany();
        return new Response(JSON.stringify(people), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching people:', error);
        return new Response('Error fetching people', {
            status: 500,
        });
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const { firstname, lastname, phone, dob } = body;

        if (!firstname || !lastname || !phone || !dob) {
            return new Response('Missing required fields', {
                status: 400,
            });
        }

        const person = await prisma.person.create({
            data: {
                firstname,
                lastname,
                phone,
                dob: new Date(dob), // Ensure dob is handled as a Date object
            },
        });

        return new Response(JSON.stringify(person), {
            status: 202,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error creating person:', error);
        return new Response('Error creating person', {
            status: 500,
        });
    }
}
