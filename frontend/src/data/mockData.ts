// mockData.ts

// 🧍 Mock Users
export const mockUsers = [
  {
    _id: "user1",
    email: "alice@example.com",
    password: "hashedpassword",
    name: "Alice Cohen",
    phone: "0521234567",
    location: {
      type: "Point",
      coordinates: [34.7818, 32.0853],
    },
    hobbies: ["hobby1", "hobby2"],
    availability: [
      { day: "Monday", from: "09:00", to: "12:00" },
      { day: "Wednesday", from: "15:00", to: "18:00" },
    ],
    ownEvents: ["event1"],
    participantEvents: ["event2"],
    messages: [],
    ratings: [],
    profilePicture: "/img/users/alice.jpg",
    notifications: [],
    requestsSent: [],
    requestsReceived: [],
    online: true,
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-08-10"),
  },
  {
    _id: "user2",
    email: "bob@example.com",
    password: "hashedpassword",
    name: "Bob Levi",
    phone: "0539876543",
    profilePicture: "/img/users/bob.jpg",
    online: false,
    createdAt: new Date("2024-07-15"),
    updatedAt: new Date("2024-07-20"),
  },
];

// 📅 Mock Events
export const mockEvents = [
  {
    _id: "event1",
    title: "Beach Volleyball",
    description: "Join us for a fun game by the sea!",
    hobby: "hobby1",
    creator: "user1",
    location: {
      type: "Point",
      coordinates: [34.7615, 32.0876],
    },
    address: "Tel Aviv Beach",
    time: new Date("2025-08-15T17:30:00"),
    minParticipants: 4,
    maxParticipants: 10,
    acceptedParticipants: ["user1", "user2"],
    pendingParticipants: [],
    status: "open",
    isPrivate: false,
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-06"),
  },
  {
    _id: "event2",
    title: "Chess Tournament",
    hobby: "hobby2",
    creator: "user2",
    location: {
      type: "Point",
      coordinates: [34.808, 32.109],
    },
    address: "Community Center, Herzliya",
    time: new Date("2025-08-20T19:00:00"),
    minParticipants: 2,
    maxParticipants: 4,
    acceptedParticipants: [],
    pendingParticipants: ["user1"],
    status: "open",
    isPrivate: true,
    createdAt: new Date("2025-08-03"),
    updatedAt: new Date("2025-08-04"),
  },
];
