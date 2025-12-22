// 1. Find event by date range
db.events.find
({
    date:
    {
        $gte: ISODate("2026-01-01"),
        $lte: ISODate("2026-12-31")
    }
}).sort({ date: 1 });


// 2. Find bookings by user
db.bookings.find
({
    userId: ObjectId("<userId>") // Enter a valid user ID from your DB
});

// 2. Find bookings by user and include event details
db.bookings.aggregate
([
    { $match: { userId: ObjectId("<userId>") } }, // Enter a valid user ID from your DB
    {
        $lookup:
        {
            from: "events",
            localField: "eventId",
            foreignField: "_id",
            as: "eventDetails"
        }
    },
    { $unwind: "$eventDetails" }
]);


// 3. Update event price
db.events.updateOne
(
    { _id: ObjectId("<eventId>") }, // Enter a valid event ID from your DB
    { $set: { price: 300 } }
);


// 4. Function to cancel a booking with update totalTicketsSold
function cancelBooking(bookingId)
{
    const booking = db.bookings.findOne
    ({
        _id: bookingId,
        status: "confirmed"
    });
    if (!booking)
    {
        print("Booking not found or already canceled");
        return;
    }

    const ticketsCount = booking.tickets.length;
    db.bookings.updateOne
    (
        { _id: bookingId },
        { $set: { status: "cancelled" } }
    );

    db.events.updateOne
    (
        { _id: booking.eventId },
        { $inc: { totalTicketsSold: -ticketsCount } }
    );
    print("Booking cancelled successfully");
}

cancelBooking(ObjectId("<bookingId>")); // Enter a valid booking ID from your DB
db.bookings.findOne({ _id: ObjectId("<bookinId>") }) // Enter the same booking ID as the previous line


// 5. Get user details and bookings with event info using lookup
db.users.aggregate
([
    { $match: { _id: ObjectId("<userId>") } }, // Enter a valid user ID from your DB
    {
        $lookup:
        {
            from: "bookings",
            localField: "_id",
            foreignField: "userId",
            as: "bookings"
        }
    },
    { $unwind: "$bookings" },
    {
        $lookup:
        {
            from: "events",
            localField: "bookings.eventId",
            foreignField: "_id",
            as: "bookings.eventDetails"
        }
    },
    { $unwind: "$bookings.eventDetails" },
    {
        $group:
        {
            _id: "$_id",
            name: { $first: "$name" },
            email: { $first: "$email" },
            bookings: { $push: "$bookings" }
        }
    }
]);


// 6. Count confirmed bookings for an event
db.bookings.countDocuments
({
    eventId: ObjectId("<eventId>"), // Enter a valid event ID from your DB
    status: "confirmed"
});


// 7, List events with available seats and all its details in other tables
db.events.aggregate
([
    {
        $lookup:
        {
            from: "venues",
            localField: "venueId",
            foreignField: "_id",
            as: "venueDetails"
        }
    },
    { $unwind: "$venueDetails" },
    {
        $addFields:
        {
            availableSeats: { $subtract: ["$venueDetails.capacity", "$totalTicketsSold"] }
        }
    },
    { $match: { availableSeats: { $gt: 0 } } },
    { $sort: { date: 1 } }
]);


// 8. Get total amount for all bookings
db.bookings.aggregate
([
    {
        $group:
        {
            _id: null,
            totalAmount: { $sum: "$totalAmount" },
            bookingCount: { $sum: 1 },
            averageAmount: { $avg: "$totalAmount" }
        }
    },
    {
        $project:
        {
            _id: 0,
            totalAmount: 1,
            bookingCount: 1,
            averageAmount: 1
        }
    }
]);


// 9. Find venues in a specific city
db.venues.find({ city: "New York" });


// 10. List events by venue
db.events.find({ venueId: ObjectId("<venueId>") }); // Enter a valid venue ID from your DB


// 11. Get total tickets sold for an event
db.events.find
(
    { _id: ObjectId("<eventId>") }, // Enter a valid event ID from your DB
    { totalTicketsSold: 1, _id: 0 }
);


// 12. List users who have never booked
db.users.aggregate
([
    {
        $lookup:
        {
            from: "bookings",
            localField: "_id",
            foreignField: "userId",
            as: "userBookings"
        }
    },
    { $match: { userBookings: { $size: 0 } } }
]);


// 13. Get highest priced event
db.events.find().sort({ price: -1 }).limit(1);


// 14. Get most sold out events
db.events.find().sort({ totalTicketsSold: -1 }).limit(5);


// 15. Get most active users by number of bookings
db.bookings.aggregate
([
    {
        $group:
        {
            _id: "$userId",
            bookingCount: { $sum: 1 }
        }
    },
    { $sort: { bookingCount: -1 } },
    { $limit: 5 },
    {
        $lookup:
        {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails"
        }
    },
    { $unwind: "$userDetails" },
    {
        $project:
        {
            _id: 0,
            userId: "$_id",
            name: "$userDetails.name",
            email: "$userDetails.email",
            bookingCount: 1
        }
    }
]);


// 16. Find events that are sold out
db.events.aggregate
([
    {
        $lookup:
        {
            from: "venues",
            localField: "venueId",
            foreignField: "_id",
            as: "venueDetails"
        }
    },
    { $unwind: "$venueDetails" },
    {
        $addFields:
        {
            availableSeats: { $subtract: ["$venueDetails.capacity", "$totalTicketsSold"] }
        }
    },
    { $match: { availableSeats: { $lte: 0 } } }
]);


// 17. List events with revenue generated per event
db.bookings.aggregate
([
    {
        $group:
        {
            _id: "$eventId",
            totalRevenue: { $sum: "$totalAmount" }
        }
    },
    {
        $lookup:
        {
            from: "events",
            localField: "_id",
            foreignField: "_id",
            as: "eventDetails"
        }
    },
    { $unwind: "$eventDetails" },
    {
        $project:
        {
            _id: 0,
            eventId: "$_id",
            eventName: "$eventDetails.name",
            totalRevenue: 1
        }
    },
    { $sort: { totalRevenue: -1 } }
]);
