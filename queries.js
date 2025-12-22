//1 find event by date range
db.events.find({
    date: {
        $gte: ISODate("2026-01-01"),
        $lte: ISODate("2026-12-31")
    }
}).sort({ date: 1 });


//2 find bookings by user
db.bookings.find({
    userId: ObjectId("6945b1212dbee611f7892358")
});
// 2 include event details
db.bookings.aggregate([
    { $match: { userId: ObjectId("6945b1212dbee611f7892358") } },
    {
        $lookup: {
            from: "events",
            localField: "eventId",
            foreignField: "_id",
            as: "eventDetails"
        }
    },
    { $unwind: "$eventDetails" }
]);


//3 update event price
db.events.updateOne(
    { _id: ObjectId("6945b1212dbee611f7892363") },
    { $set: { price: 300 } }
);


//4 cancel booking and update available seats
db.bookings.updateOne(
    { _id: ObjectId("6945b1212dbee611f7892369") },
    { $set: { status: "cancelled" } }
);
// decrement tickets sold based on number of tickets in the booking
const booking = db.bookings.findOne({ _id: ObjectId("6945b1212dbee611f7892369") });
db.events.updateOne(
    { _id: booking.eventId },
    { $inc: { totalTicketsSold: -booking.tickets.length } }
);


//5 get user details and bookings with event info using lookup
db.users.aggregate([
    { $match: { _id: ObjectId("6945b1212dbee611f7892358") } },
    {
        $lookup: {
            from: "bookings",
            localField: "_id",
            foreignField: "userId",
            as: "bookings"
        }
    },
    { $unwind: "$bookings" },
    {
        $lookup: {
            from: "events",
            localField: "bookings.eventId",
            foreignField: "_id",
            as: "bookings.eventDetails"
        }
    },
    { $unwind: "$bookings.eventDetails" },
    {
        $group: {
            _id: "$_id",
            name: { $first: "$name" },
            email: { $first: "$email" },
            bookings: { $push: "$bookings" }
        }
    }
]);


//6 count confirmed bookings for an event
db.bookings.countDocuments({
    eventId: ObjectId("6945b1212dbee611f7892365"),
    status: "confirmed"
});


//7 list events with available seats and all its details in other tables
db.events.aggregate([
    {
        $lookup: {
            from: "venues",
            localField: "venueId",
            foreignField: "_id",
            as: "venueDetails"
        }
    },
    { $unwind: "$venueDetails" },
    {
        $addFields: {
            availableSeats: { $subtract: ["$venueDetails.capacity", "$totalTicketsSold"] }
        }
    },
    { $match: { availableSeats: { $gt: 0 } } },
    { $sort: { date: 1 } }
]);


//8 get total amount for all bookings
db.bookings.aggregate([
    {
        $group: {
            _id: null,
            totalAmount: { $sum: "$totalAmount" },
            bookingCount: { $sum: 1 },
            averageAmount: { $avg: "$totalAmount" }
        }
    },
    {
        $project: {
            _id: 0,
            totalAmount: 1,
            bookingCount: 1,
            averageAmount: 1
        }
    }
]);


//9 find venues in a specific city
db.venues.find({ city: "New York" });


//10 list events by venue
db.events.find({ venueId: ObjectId("<venueId>") });


//11 get total tickets sold for an event
db.events.find(
    { _id: ObjectId("<eventId>") },
    { totalTicketsSold: 1, _id: 0 }
);


//12 list users who have never booked
db.users.aggregate([
    {
        $lookup: {
            from: "bookings",
            localField: "_id",
            foreignField: "userId",
            as: "userBookings"
        }
    },
    { $match: { userBookings: { $size: 0 } } }
]);


//13 get highest priced event
db.events.find().sort({ price: -1 }).limit(1);


//14 get most sold out events
db.events.find().sort({ totalTicketsSold: -1 }).limit(5);


//15 get most active users by number of bookings
db.bookings.aggregate([
    {
        $group: {
            _id: "$userId",
            bookingCount: { $sum: 1 }
        }
    },
    { $sort: { bookingCount: -1 } },
    { $limit: 5 },
    {
        $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails"
        }
    },
    { $unwind: "$userDetails" },
    {
        $project: {
            _id: 0,
            userId: "$_id",
            name: "$userDetails.name",
            email: "$userDetails.email",
            bookingCount: 1
        }
    }
]);


//16 Find events that are sold out
db.events.aggregate([
    {
        $lookup: {
            from: "venues",
            localField: "venueId",
            foreignField: "_id",
            as: "venueDetails"
        }
    },
    { $unwind: "$venueDetails" },
    {
        $addFields: {
            availableSeats: { $subtract: ["$venueDetails.capacity", "$totalTicketsSold"] }
        }
    },
    { $match: { availableSeats: { $lte: 0 } } }
]);


//17 list events with revenue generated per event
db.bookings.aggregate([
    {
        $group: {
            _id: "$eventId",
            totalRevenue: { $sum: "$totalAmount" }
        }
    },
    {
        $lookup: {
            from: "events",
            localField: "_id",
            foreignField: "_id",
            as: "eventDetails"
        }
    },
    { $unwind: "$eventDetails" },
    {
        $project: {
            _id: 0,
            eventId: "$_id",
            eventName: "$eventDetails.name",
            totalRevenue: 1
        }
    },
    { $sort: { totalRevenue: -1 } }
]);
