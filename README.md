# Event Booking and Ticket Analytics System - MongoDB

## 1. Database Schema and Design Decisions
The database is designed around four main collections:

- **users**
  - Stores user information such as `name` and `email`.
  - An index enforces **unique emails** to prevent duplicate accounts.

- **venues**
  - Stores venue details including `name`, `capacity`, and `location`.
  - Capacity is used to enforce ticket limits for events.

- **events**
  - Stores event details such as `name`, `date`, and `venueId`.
  - References the venue where the event is hosted.
  - Tracks `totalTicketsSold` to ensure bookings do not exceed venue capacity.

- **bookings**
  - Stores booking records made by users for events.
  - Contains `userId`, `eventId`, `bookingDate`, `tickets`, `totalAmount`, and `status`.
  - Tickets are embedded as an array of objects inside each booking.
  - A unique compound index on `(userId, eventId)` ensures a user cannot book the same event multiple times.

**Design decisions:**
- **Embedding** was chosen for tickets because they are tightly coupled with a booking and do not need to exist independently.
- **Referencing** was chosen for users, events, and venues to avoid duplication and allow reuse across multiple bookings and events.

---

## 2. Where Embedding Was Used and Why
- **Tickets inside bookings**:
  - Each booking contains an array of ticket objects (`seat`, `price`).
  - Embedding makes sense because tickets only exist in the context of a booking.
  - This design simplifies queries for booking details and avoids unnecessary joins.

---

## 3. Where Referencing Was Used and Why
- **Bookings → Users**:
  - Each booking stores a `userId` that references the `users` collection.
  - This avoids duplicating user details in every booking.

- **Bookings → Events**:
  - Each booking stores an `eventId` that references the `events` collection.
  - This allows multiple users to book the same event without duplicating event data.

- **Events → Venues**:
  - Each event stores a `venueId` that references the `venues` collection.
  - This ensures venue details are centralized and consistent across events.

Referencing was chosen in these cases to maintain **data integrity**, reduce duplication, and allow efficient joins using `$lookup`.

---

## 4. Explanation of Each Aggregation Pipeline

### 1. Tickets Sold per Event
```js
db.bookings.aggregate
([
    { $unwind: "$tickets" }, 
    { $lookup: { from: "events", localField: "eventId", foreignField: "_id", as: "event" } }, 
    { $unwind: "$event" }, 
    { $group: { _id: "$event.name", totalTicketsSold: { $sum: 1 } } }, 
    { $project: { event: "$_id", totalTicketsSold: 1, _id: 0 } }
]);
```
- Unwinds tickets so each ticket is counted individually.
- Joins events to attach event names.
- Groups by event name and counts tickets using `$sum: 1`.

### 2. Revenue per Event
```js
db.bookings.aggregate
([
    { $unwind: "$tickets" },
    { $lookup: { from: "events", localField: "eventId", foreignField: "_id", as: "event" } },
    { $unwind: "$event" },
    { $group: { _id: "$event.name", totalRevenue: { $sum: "$tickets.price" } } },
    { $project: { event: "$_id", totalRevenue: 1, _id: 0 } }
]);
```
- Unwinds tickets to access individual prices.
- Joins events to attach event names.
- Groups by event name and sums ticket prices to calculate revenue.

### 3. Top Users by Number of Bookings
```js
db.bookings.aggregate
([
    { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } }, 
    { $unwind: "$user" }, 
    { $group: { _id: "$user.name", totalBookings: { $sum: 1 } } }, 
    { $sort: { totalBookings: -1 } },
    { $project: { User: "$_id", totalBookings: 1, _id: 0 } },
    { $limit: 5 }
]);
```
- Joins users to get users' names.
- Groups by user's name and counts bookings.
- Sorts descendingly and limits to top 5 users.

### 4. Event Popularity Ranking
```js
db.bookings.aggregate
([
    { $unwind: "$tickets" }, 
    { $lookup: { from: "events", localField: "eventId", foreignField: "_id", as: "event" } }, 
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
```
- Counts tickets sold per event.
- Sorts events by tickets sold.
- Ranks events using `$setWindowFields` with `denseRank` to assign popularity ranking.

---
