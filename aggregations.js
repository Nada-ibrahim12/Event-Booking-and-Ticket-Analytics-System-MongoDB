// 1. Tickets sold per event
db.bookings.aggregate
([
    { $unwind: "$tickets" },
    {
        $lookup:
        {
            from: "events",
            localField: "eventId",
            foreignField: "_id",
            as: "event"
        }
    },
    { $unwind: "$event" },
    { $group: { _id: "$event.name", totalTicketsSold: { $sum: 1 } } },
    { $project: { event: "$_id", totalTicketsSold: 1, _id: 0 } }
]);


// 2. Revenue per event
db.bookings.aggregate
([
    { $unwind: "$tickets" },
    {
        $lookup:
        {
            from: "events",
            localField: "eventId",
            foreignField: "_id",
            as: "event"
        }
    },
    { $unwind: "$event" }, 
    { $group: { _id: "$event.name", totalRevenue: { $sum:  "$tickets.price"} } },
    { $project: { event: "$_id", totalRevenue: 1, _id: 0 } }
]);


// 3. Top users by number of bookings
db.bookings.aggregate
([
    {
        $lookup:
        {
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


// 4. Event popularity ranking
db.bookings.aggregate
([
    { $unwind: "$tickets" },
    {
        $lookup:

        {
            from: "events",
            localField: "eventId",
            foreignField: "_id",
            as: "event"
        }
    },
    { $unwind: "$event" },
    { $group: { _id: "$event.name", ticketsSold: { $sum: 1 } } },
    { $sort: { ticketsSold: -1 } },
    {
        $setWindowFields:
        {
            sortBy: { ticketsSold: -1 },
            output: { denseRank: { $denseRank: {} } }
        }
    },
    { $project: { event: "$_id", ticketsSold: 1, Rank: "$denseRank", _id: 0 } }
]);
