// use event_booking

// Create collections
db.createCollection("users");
db.createCollection("venues");
db.createCollection("events");
// db.createCollection("bookings");

db.createCollection("bookings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        tickets: {
        // at least one ticket object
          bsonType: "array",
          minItems: 1,
          items: { bsonType: "object" } 
        }
      }
    }
  }
});


// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.bookings.createIndex({ userId: 1, eventId: 1 }, { unique: true });


