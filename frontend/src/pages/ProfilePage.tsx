import { useAuth } from "@/context/AuthContext";
import { Profile } from "@/components/Profile";
//import { Button } from "@/components/ui/button";
//import type { User } from "@/types";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <Profile user={user} isEditable={true} onLogout={logout} />;
}
