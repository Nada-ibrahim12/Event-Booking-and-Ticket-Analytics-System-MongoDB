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


// 5. Count confirmed bookings for an event
db.bookings.countDocuments
({
    eventId: ObjectId("<eventId>"), // Enter a valid event ID from your DB
    status: "confirmed"
});


// 6. Find venues in a specific city
db.venues.find({ city: "New York" });


// 7. List events by venue
db.events.find({ venueId: ObjectId("<venueId>") }); // Enter a valid venue ID from your DB


// 8. Get total tickets sold for an event
db.events.find
(
    { _id: ObjectId("<eventId>") }, // Enter a valid event ID from your DB
    { totalTicketsSold: 1, _id: 0 }
);
