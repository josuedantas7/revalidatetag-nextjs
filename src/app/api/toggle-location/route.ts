import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from 'next/cache'
import { prisma } from "@/app/lib/db";

export async function POST(request: NextRequest) {
  const { location } = await request.json();

  const existLocation = await prisma.switchLocation.findFirst();

  if (existLocation) {
    await prisma.switchLocation.update({
      where: {
        id: existLocation.id,
      },
      data: {
        location: location
      },
    });
  }

  revalidateTag('location-data');

  console.log('!@# alterando location para', location);

  return NextResponse.json({ location });
}

export async function GET() {
  const location = await prisma.switchLocation.findFirst();

  console.log('!@# endpoint location', location);

  return NextResponse.json({ location: location?.location });
}