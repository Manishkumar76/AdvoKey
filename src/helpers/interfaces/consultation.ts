export interface Consultation {
    _id: string;
    client: string;
    lawyer: string;
    date: Date;
    time: string;
    status: string;
    description: string;
    location: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
    };
    createdAt: Date;
    updatedAt: Date;
}