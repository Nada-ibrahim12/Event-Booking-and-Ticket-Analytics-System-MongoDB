// 8 Users
var users = db.users.insertMany([
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
var venues = db.venues.insertMany([
  { name: "Opera", capacity: 500, location: "Downtown" },
  { name: "Bibliotheca", capacity: 300, location: "Midtown" },
  { name: "Cairo Stadium", capacity: 800, location: "Uptown" },
  { name: "Egyptian Theater", capacity: 400, location: "Old Town" }
]);


// 6 Events
var events = db.events.insertMany([
  { name: "Concert", date: new Date("2026-01-01"), price: 200, venueId: venues.insertedIds[0], totalTicketsSold: 0 },
  { name: "Tech Talk", date: new Date("2026-03-10"), price: 100, venueId: venues.insertedIds[1], totalTicketsSold: 0 },
  { name: "Football Match", date: new Date("2026-02-01"), price: 300, venueId: venues.insertedIds[2], totalTicketsSold: 0 },
  { name: "Theater Play", date: new Date("2026-02-05"), price: 150, venueId: venues.insertedIds[3], totalTicketsSold: 0 },
  { name: "Art Exhibition", date: new Date("2026-05-01"), price: 80, venueId: venues.insertedIds[1], totalTicketsSold: 0 },
  { name: "Startup Meetup", date: new Date("2026-05-15"), price: 50, venueId: venues.insertedIds[0], totalTicketsSold: 0 }
]);


// 15 Booking — Tickets embedded
db.bookings.insertMany([
  {
    userId: users.insertedIds[0],
    eventId: events.insertedIds[0],
    bookingDate: new Date(),
    tickets: [{ seat: "A1", price: 200 }],
    totalAmount: 200,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[1],
    eventId: events.insertedIds[0],
    bookingDate: new Date(),
    tickets: [{ seat: "A2", price: 200 }],
    totalAmount: 200,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[2],
    eventId: events.insertedIds[1],
    bookingDate: new Date(),
    tickets: [
      { seat: "B1", price: 100 },
      { seat: "B2", price: 100 }
    ],
    totalAmount: 200,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[3],
    eventId: events.insertedIds[2],
    bookingDate: new Date(),
    tickets: [{ seat: "C1", price: 300 }],
    totalAmount: 300,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[4],
    eventId: events.insertedIds[3],
    bookingDate: new Date(),
    tickets: [{ seat: "D1", price: 150 }],
    totalAmount: 150,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[5],
    eventId: events.insertedIds[4],
    bookingDate: new Date(),
    tickets: [{ seat: "E1", price: 80 }],
    totalAmount: 80,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[6],
    eventId: events.insertedIds[5],
    bookingDate: new Date(),
    tickets: [{ seat: "F1", price: 50 }],
    totalAmount: 50,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[7],
    eventId: events.insertedIds[1],
    bookingDate: new Date(),
    tickets: [{ seat: "B3", price: 100 }],
    totalAmount: 100,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[0],
    eventId: events.insertedIds[2],
    bookingDate: new Date(),
    tickets: [{ seat: "C2", price: 300 }],
    totalAmount: 300,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[1],
    eventId: events.insertedIds[3],
    bookingDate: new Date(),
    tickets: [{ seat: "D2", price: 150 }],
    totalAmount: 150,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[2],
    eventId: events.insertedIds[4],
    bookingDate: new Date(),
    tickets: [{ seat: "E2", price: 80 }],
    totalAmount: 80,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[3],
    eventId: events.insertedIds[5],
    bookingDate: new Date(),
    tickets: [{ seat: "F2", price: 50 }],
    totalAmount: 50,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[4],
    eventId: events.insertedIds[0],
    bookingDate: new Date(),
    tickets: [{ seat: "A3", price: 200 }],
    totalAmount: 200,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[5],
    eventId: events.insertedIds[2],
    bookingDate: new Date(),
    tickets: [{ seat: "C3", price: 300 }],
    totalAmount: 300,
    status: "confirmed"
  },
  {
    userId: users.insertedIds[6],
    eventId: events.insertedIds[3],
    bookingDate: new Date(),
    tickets: [{ seat: "D3", price: 150 }],
    totalAmount: 150,
    status: "confirmed"
  }
]);
