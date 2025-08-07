import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const availability = [
  { day: "Monday", from: "09:00", to: "17:00" },
  { day: "Wednesday", from: "10:00", to: "14:00" },
];

const hobbies = ["Hiking", "Chess", "Cooking"];
const ownEvents = ["Chess Tournament", "Hiking Trail"];
const participantEvents = ["Cooking Class", "Book Club"];

export default function ProfilePage() {
  const [name, setName] = useState("Alice Brown");
  const [email, setEmail] = useState("alice@example.com");
  const [phone, setPhone] = useState("+1234567890");
  const [editSection, setEditSection] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <Card className="flex flex-col sm:flex-row items-center gap-6 p-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src="/profile.jpg" alt="Profile" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left w-full">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">{name}</h1>
              <p className="text-sm text-gray-500">{email}</p>
              <p className="text-sm">Phone: {phone}</p>
              <p className="text-sm">Location: Tel Aviv, Israel</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditSection("profile")}
            >
              <Pencil size={16} />
            </Button>
          </div>
        </div>
      </Card>

      <Dialog
        open={editSection === "profile"}
        onOpenChange={() => setEditSection(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="mb-2"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-2"
          />
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
          />
        </DialogContent>
      </Dialog>

      {/* Hobbies */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Hobbies</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditSection("hobbies")}
            >
              <Pencil size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((hobby) => (
              <Badge key={hobby}>{hobby}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={editSection === "hobbies"}
        onOpenChange={() => setEditSection(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Hobbies</DialogTitle>
          </DialogHeader>
          {hobbies.map((hobby, index) => (
            <Input key={index} defaultValue={hobby} className="mb-2" />
          ))}
        </DialogContent>
      </Dialog>

      {/* Availability */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Availability</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditSection("availability")}
            >
              <Pencil size={16} />
            </Button>
          </div>
          <ul className="list-disc ml-5">
            {availability.map((slot, index) => (
              <li key={index}>
                {slot.day}: {slot.from} - {slot.to}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog
        open={editSection === "availability"}
        onOpenChange={() => setEditSection(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Availability</DialogTitle>
          </DialogHeader>
          {availability.map((slot, index) => (
            <div key={index} className="space-y-1 mb-2">
              <Input defaultValue={slot.day} placeholder="Day" />
              <Input defaultValue={slot.from} placeholder="From" />
              <Input defaultValue={slot.to} placeholder="To" />
            </div>
          ))}
        </DialogContent>
      </Dialog>

      {/* Own Events */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-medium mb-2">My Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ownEvents.map((event) => (
              <Card key={event} className="p-4 shadow-sm">
                <p>{event}</p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Participating Events */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-medium mb-2">Participating Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {participantEvents.map((event) => (
              <Card key={event} className="p-4 shadow-sm">
                <p>{event}</p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Messages and Rating */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="w-full sm:w-auto">View Messages</Button>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={20}
              className={i <= 4 ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
