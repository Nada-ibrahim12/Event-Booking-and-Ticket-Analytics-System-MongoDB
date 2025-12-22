// 8 Users
var users = db.users.insertMany
([
  { name: "Ali", email: "ali@mail.com" },
  { name: "Sara", email: "sara@mail.com" },
  { name: "Omar", email: "omar@mail.com" },
  { name: "Mona", email: "mona@mail.com" },
  { name: "Youssef", email: "youssef@mail.com" },
  { name: "Nour", email: "nour@mail.com" },
  { name: "Hassan", email: "hassan@mail.com" },
  { name: "Laila", email: "laila@mail.com" }
]);


// 4 Venues
var venues = db.venues.insertMany
([
  { name: "Opera", capacity: 500, location: "Downtown" },
  { name: "Bibliotheca", capacity: 300, location: "Midtown" },
  { name: "Cairo Stadium", capacity: 800, location: "Uptown" },
  { name: "Egyptian Theater", capacity: 400, location: "Old Town" }
]);


// 6 Events
var events = db.events.insertMany
([
  { name: "Concert", date: new Date("2026-01-01"), venueId: venues.insertedIds[0], totalTicketsSold: 0 },
  { name: "Tech Talk", date: new Date("2026-03-10"), venueId: venues.insertedIds[1], totalTicketsSold: 0 },
  { name: "Football Match", date: new Date("2026-02-01"), venueId: venues.insertedIds[2], totalTicketsSold: 0 },
  { name: "Theater Play", date: new Date("2026-02-05"), venueId: venues.insertedIds[3], totalTicketsSold: 0 },
  { name: "Art Exhibition", date: new Date("2026-05-01"), venueId: venues.insertedIds[1], totalTicketsSold: 0 },
  { name: "Startup Meetup", date: new Date("2026-05-15"), venueId: venues.insertedIds[0], totalTicketsSold: 0 }
]);


// Function to create a booking with seat availability check and update totalTicketsSold
function createBooking(userId, eventId, tickets)
{
  const event = db.events.findOne({ _id: eventId });
  if (!event)
  {
    print("Event not found");
    return;
  }

  const venue = db.venues.findOne({ _id: event.venueId });
  if (!venue)
  {
    print("Venue not found");
    return;
  }

  const ticketsCount = tickets.length;
  if (event.totalTicketsSold + ticketsCount > venue.capacity)
  {
    print("Booking failed: Not enough available seats");
    return;
  }

  db.bookings.insertOne
  ({
    userId: userId,
    eventId: eventId,
    bookingDate: new Date(),
    tickets: tickets,
    totalAmount: tickets.reduce((sum, t) => sum + t.price, 0),
    status: "confirmed"
  });

  db.events.updateOne
  (
    { _id: eventId },
    { $inc: { totalTicketsSold: ticketsCount } }
  );

  print("Booking confirmed");
}


// 15 Bookings — Tickets embedded
createBooking
(
  users.insertedIds[0],
  events.insertedIds[0],
  [{ seat: "A1", price: 200 }]
);
createBooking
(
  users.insertedIds[1],
  events.insertedIds[0],
  [{ seat: "A2", price: 200 }]
);
createBooking
(
  users.insertedIds[2],
  events.insertedIds[1],
  [{ seat: "B1", price: 100 }, { seat: "B2", price: 100 }]
);
createBooking
(
  users.insertedIds[3],
  events.insertedIds[2],
  [{ seat: "C1", price: 300 }]
);
createBooking
(
  users.insertedIds[3],
  events.insertedIds[3],
  [{ seat: "D1", price: 150 }]
);
createBooking
(
  users.insertedIds[5],
  events.insertedIds[4],
  [{ seat: "E1", price: 80 }]
);
createBooking
(
  users.insertedIds[3],
  events.insertedIds[5],
  [{ seat: "F1", price: 50 }]
);
createBooking
(
  users.insertedIds[7],
  events.insertedIds[1],
  [{ seat: "B3", price: 100 }]
);
createBooking
(
  users.insertedIds[5],
  events.insertedIds[2],
  [{ seat: "C2", price: 300 }, { seat: "C3", price: 300 }]
);
createBooking
(
  users.insertedIds[1],
  events.insertedIds[3],
  [{ seat: "D2", price: 150 }]
);
createBooking
(
  users.insertedIds[4],
  events.insertedIds[4],
  [{ seat: "E2", price: 80 }, { seat: "E3", price: 80 }]
);
createBooking
(
  users.insertedIds[6],
  events.insertedIds[5],
  [{ seat: "F2", price: 50 }]
);
createBooking
(
  users.insertedIds[4],
  events.insertedIds[0],
  [{ seat: "A3", price: 200 }]
);
createBooking
(
  users.insertedIds[5],
  events.insertedIds[1],
  [{ seat: "C3", price: 300 }]
);
createBooking
(
  users.insertedIds[2],
  events.insertedIds[3],
  [{ seat: "D3", price: 150 }]
);
