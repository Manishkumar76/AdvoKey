import { NextRequest, NextResponse } from 'next/server';
import {connect} from '@/dbConfig/dbConfig';
import Locations from '@/models/Locations';

export async function GET() {
  await connect();
  try {
    const locations = await Locations.find();
    return NextResponse.json(locations);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req:NextRequest) {
  await connect();
  const body = await req.json();
  try {
    const newLocation = new Locations(body);
    await newLocation.save();
    return NextResponse.json(newLocation, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
