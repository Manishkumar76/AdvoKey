import mongoose from "mongoose";

export async function connect() {
    try {
    
        // Ensure the environment variable is set
        if (!process.env.MONGO_URI) {
            throw new Error("MongoDB connection URL is not defined in environment variables.");
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI!);

        const connection = mongoose.connection;

        // Log successful connection
        connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

        // Log connection errors
        connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
            process.exit(1); // Exit with failure
        });

        // Log disconnection events
        connection.on("disconnected", () => {
            console.warn("MongoDB disconnected");
        });

        // Log when the connection is reestablished
        connection.on("reconnected", () => {
            console.log("MongoDB reconnected");
        });

    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        return err;
        process.exit(1); // Exit with failure
        
       
    }
}