import LawyerProfiles from '@/models/LawyerProfiles';
import Reviews from '@/models/Reviews';

// Function to calculate average rating for each lawyer
export async function calculateAverageRating() {
    try {
        // Aggregate ratings for each lawyer
        const lawyersWithRatings = await LawyerProfiles.aggregate([
            {
                $lookup: {
                    from: 'reviews', // Join the Reviews collection
                    localField: '_id',
                    foreignField: 'lawyer_id',
                    as: 'reviews', // Name the array of reviews
                },
            },
            {
                $addFields: {
                    averageRating: {
                        $avg: { $ifNull: ['$reviews.rating', 0] }, // Calculate average rating
                    },
                },
            },
            {
                $project: {
                    username: 1, // Keep necessary fields
                    averageRating: 1, // Add the calculated average rating
                },
            },
        ]);

        return lawyersWithRatings; // Return the array of lawyers with average ratings
    } catch (error) {
        console.error("Error calculating average rating:", error);
        throw new Error("Failed to calculate average rating");
    }
}
