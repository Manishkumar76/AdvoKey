import { getDataFromToken } from "@/helpers/getDataFromToken";
import Locations from "@/models/Locations";
import Users from "@/models/userModel";
import { NextResponse,NextRequest } from "next/server";



export async function GET() {
    try {
        const locations = await Locations.find();
        return NextResponse.json(locations);
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    }
export async function POST(req:NextRequest) {
    const body = await req.json();
    try {
        const newLocation = new Locations(body);
        await newLocation.save();
        return NextResponse.json(newLocation, { status: 201 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
    export async function PUT(req:NextRequest) {
        const body = await req.json();
        try{
            const userId= (await getDataFromToken()).id;

            const userExists= await Users.findById(userId);
            if(!userExists){
                return NextResponse.json({message:"User not found"}, {status:404});
            }
            const locationId= body.locationId;
            const locationExists= await Locations.findById(locationId);
            if(!locationExists){
                return NextResponse.json({message:"Location not found"}, {status:404});
            }

            //update location_id from user 
            const updateUserLocation= await Users.findByIdAndUpdate(userId, {location_id: locationId}, {new:true});
            if(!updateUserLocation){
                return NextResponse.json({message:"User not found"}, {status:404});
            }
            
            return NextResponse.json({message:"Location updated successfully"}, {status:200});
        }
        catch (error:any) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
}