//1. Tickets sold per event
db.bookings.aggregate([
    { $unwind: "$tickets" },
    {
        $lookup: {
        from: "events",
        localField: "eventId",  // field from the bookings collection
        foreignField: "_id", // field from the events collection
        as: "event"
        }
    },
    { $unwind: "$event" },
    { $group: { _id: "$event.name", totalTicketsSold: { $sum: 1 } } },
    { $project: { event: "$_id", totalTicketsSold: 1, _id: 0 } }
]);


//2. Revenue per event
db.bookings.aggregate([
    { $unwind: "$tickets" },
    {
        $lookup: {
        from: "events", 
        localField: "eventId",  // field from the bookings collection
        foreignField: "_id", // field from the events collection
        as: "event"
        }
    },
    { $unwind: "$event" }, 
    { $group: { _id: "$event.name", Total_Revenue: { $sum:  "$tickets.price"} } } ,
    { $project: { Event: "$_id", Total_Revenue: 1, _id: 0 } }
]);


//3. Top users by number of bookings
db.bookings.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    },
    { $unwind: "$user" },
    { $group: { _id: "$user.name", totalBookings: { $sum: 1 } } },
    { $sort: { totalBookings: -1}},
    { $project: { User: "$_id", totalBookings: 1, _id: 0 } },
    { $limit: 5}
])


//4. Event popularity ranking
db.bookings.aggregate([
    {$unwind: "$tickets"},
    {
        $lookup: {
        from: "events",
        localField: "eventId",
        foreignField: "_id",
        as: "event"
        }
    },
    { $unwind: "$event" },
    { $group: { _id: "$event.name", Tickets_Sold: { $sum: 1 } } },
    { $sort: { Tickets_Sold: -1 } }, // Sort by tickets sold in descending order
    {
        $setWindowFields: {
        sortBy: { Tickets_Sold: -1 },
        output: { denseRank: { $denseRank: {} } }
        }
    },
    { $project: { Event: "$_id", Tickets_Sold: 1, Rank: "$denseRank", _id: 0 } }
]);
