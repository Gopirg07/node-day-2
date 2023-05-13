const express = require("express");
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let rooms = [];
let bookings = [];

app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to Home Page !!!" });
});

app.get("/getAllRooms", (req, res) => {
  res.status(200).send({ message: "Fetched SuccessFullyy !!!",rooms });
});

// Create room with  number of seats, amenities, and price
app.post("/createRoom", (req, res) => {
  const room = {
    id: rooms.length + 1,
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

// List all rooms with booked data with room name, booked status, customer name, date, start time, and end time
app.get("/rooms", (req, res) => {
  const data = [];
  for (const room of rooms) {
    const roomData = {
      roomName: `Room ${room.id}`,
      bookedStatus: "available",
      customerName: "",
      date: "",
      startTime: "",
      endTime: "",
    };
    for (const booking of bookings) {
      if (booking.roomId === room.id) {
        roomData.bookedStatus = booking.status;
        roomData.customerName = booking.customerName;
        roomData.date = booking.date;
        roomData.startTime = booking.startTime;
        roomData.endTime = booking.endTime;
      }
    }
    data.push(roomData);
  }
  res.send(data);
});

// List all customers with booked data with customer name, room name, date, start time, and end time
app.get("/customers", (req, res) => {
  const data = [];
  for (const booking of bookings) {
    const customerData = {
      customerName: booking.customerName,
      roomName: `Room ${booking.roomId}`,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    };
    data.push(customerData);
  }
  res.send(data);
});

// List how many times a customer has booked the room with below details = Customer name, room name, date, start time, end time, booking ID, booking date, and booking status
app.get("/bookings/:customerName", (req, res) => {
  const customerName = req.params.customerName;
  const data = bookings
    .filter((booking) => booking.customerName === customerName)
    .map((booking) => ({
      customerName: booking.customerName,
      roomName: `Room ${booking.roomId}`,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookingId: booking.id,
      bookingDate: booking.date,
      bookingStatus: booking.status,
    }));
  console.log(bookings);
  res.send(data);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is Listening to ${port}`);
});
