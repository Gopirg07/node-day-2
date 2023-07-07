const express = require("express");
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let rooms = [];
let bookings = [];

//Home Page
app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to Home Page !!!" });
});

// Get All Rooms
app.get("/getAllRooms", (req, res) => {
  res.status(200).send({ message: "Fetched SuccessFullyy !!!",rooms });
});

// Create room with  number of seats, amenities, and price
app.post("/createRoom", (req, res) => {
  const room = {
    id: rooms.length + 1,
    name:req.body.name,
    seats: req.body.seats,
    amenities: req.body.amenities,
    price: req.body.price,
  };
  rooms.push(room);
  res
    .status(200)
    .send({ message: `Created A New Room ${room.id} Successfully !!!`, rooms });
});

// Book a room with  customer name, date, start time, end time, and room id
app.post("/bookings", (req, res) => {
  const roomId = req.body.roomId;
  const existingBooking = bookings.find(
    (booking) => booking.roomId === roomId && booking.status === "booked"
  );
  if (existingBooking) {
    res
      .status(400)
      .send(
        `Room ${roomId} is already booked at ${existingBooking.date} from ${existingBooking.startTime} to ${existingBooking.endTime} by ${existingBooking.customerName}.`
      );
  } else {
    const booking = {
      id: bookings.length + 1,
      customerName: req.body.customerName,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      roomId: roomId,
      status: "booked",
    };
    bookings.push(booking);
    res.send(
      `Room ${booking.roomId} booked successfully by ${booking.customerName}!`
    );
  }
});

 

// Start the server
app.listen(port, () => {
  console.log(`Server is Listening to ${port}`);
});
