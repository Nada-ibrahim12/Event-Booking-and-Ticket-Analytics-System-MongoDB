//1. Tickets sold per event

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
    { $group: { _id: "$event.name", Total_Revenue: { $sum:  "$tickets.price"} } } 
]);

//3. Top users by number of bookings

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
