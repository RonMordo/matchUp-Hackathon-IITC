import { useState } from "react";
//import { useAuth } from "@/context/AuthContext";
import { useUpdateUser, useUserMessages, useUserNotifications } from "@/hooks/user.hook";
import { useEvents } from "@/hooks/event.hook";
import { useRatings } from "@/hooks/rating.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Pencil, X, MapPin, Phone, Mail, Users, Clock, Trophy, MessageSquare, Bell, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EventCard } from "@/components/EventCard";
import type { User, AvailabilitySlot, UserResponse } from "@/types";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface ProfileProps {
  user: UserResponse;
  isEditable?: boolean;
  onLogout?: () => void;
}

export function Profile({ user, isEditable = false, onLogout }: ProfileProps) {
  //const { user: currentUser } = useAuth();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { data: allEvents = [] } = useEvents();
  const { data: userMessages = [] } = useUserMessages();
  const { data: userNotifications = [] } = useUserNotifications();
  const { data: allRatings = [] } = useRatings();

  // Form states
  const [editSection, setEditSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    availability: user?.availability || [],
  });

  // Local state for editing
  const [newAvailability, setNewAvailability] = useState<AvailabilitySlot>({
    day: "Monday",
    from: "09:00",
    to: "17:00",
  });

  // Filter participating events
  const participatingEvents = allEvents.filter((event) => event.acceptedParticipants.includes(user?._id || ""));

  // Calculate user rating from real data
  const userRatings = allRatings.filter((rating) => rating.to === user?._id);
  const userRating =
    userRatings.length > 0 ? userRatings.reduce((sum, rating) => sum + rating.score, 0) / userRatings.length : 0;
  const totalRatings = userRatings.length;

  const handleSaveProfile = () => {
    if (!user) return;

    updateUser(formData, {
      onSuccess: () => {
        setEditSection(null);
        window.location.reload();
      },
      onError: (error) => {
        console.error("Failed to update profile:", error);
        alert("Failed to update profile. Please try again.");
      },
    });
  };

  const handleAddAvailability = () => {
    if (newAvailability.from && newAvailability.to) {
      setFormData((prev) => ({
        ...prev,
        availability: [...(prev.availability || []), { ...newAvailability }],
      }));
      setNewAvailability({
        day: "Monday",
        from: "09:00",
        to: "17:00",
      });
    }
  };

  const handleRemoveAvailability = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-10"></div>
        <CardContent className="relative p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={user.profilePicture || "/default-avatar.jpg"} alt="Profile" />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {user.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location?.coordinates ? "Location set" : "No location"}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={star <= userRating ? "text-yellow-400 fill-current" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {userRating.toFixed(1)} ({totalRatings} reviews)
                    </span>
                  </div>
                </div>

                {isEditable && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditSection("profile")}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Logout</AlertDialogTitle>
                          <AlertDialogDescription>Are you sure you want to logout?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{participatingEvents.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Events Joined</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{userMessages.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{userNotifications.filter((n) => n.status === "unread").length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unread Notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hobbies Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Hobbies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.hobbies?.map((hobby) => (
                <Badge key={hobby} variant="secondary">
                  {hobby}
                </Badge>
              ))}
              {(!user.hobbies || user.hobbies.length === 0) && (
                <p className="text-gray-500 text-sm">No hobbies added yet</p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Hobby management will be available in a future update</p>
          </CardContent>
        </Card>

        {/* Availability Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Availability
              </CardTitle>
              {isEditable && (
                <Button variant="ghost" size="sm" onClick={() => setEditSection("availability")}>
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.availability?.map((slot, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="font-medium">{slot.day}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {slot.from} - {slot.to}
                  </span>
                </div>
              ))}
              {(!user.availability || user.availability.length === 0) && (
                <p className="text-gray-500 text-sm">No availability set</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participating Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Participating Events ({participatingEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {participatingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {participatingEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  userId={user._id}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onJoin={() => {}}
                  showJoinButton={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No participating events yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      {isEditable && (
        <Dialog open={editSection === "profile"} onOpenChange={() => setEditSection(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1234567890"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setEditSection(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Availability Dialog */}
      {isEditable && (
        <Dialog open={editSection === "availability"} onOpenChange={() => setEditSection(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Availability</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Availability</Label>
                <div className="space-y-2 mt-2">
                  {formData.availability?.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <span className="font-medium">{slot.day}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {slot.from} - {slot.to}
                      </span>
                      <button
                        onClick={() => handleRemoveAvailability(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Add New Time Slot</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={newAvailability.day}
                    onValueChange={(value) => setNewAvailability((prev) => ({ ...prev, day: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="time"
                    value={newAvailability.from}
                    onChange={(e) => setNewAvailability((prev) => ({ ...prev, from: e.target.value }))}
                  />
                  <Input
                    type="time"
                    value={newAvailability.to}
                    onChange={(e) => setNewAvailability((prev) => ({ ...prev, to: e.target.value }))}
                  />
                </div>
                <Button onClick={handleAddAvailability} size="sm" className="w-full">
                  Add Time Slot
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setEditSection(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
