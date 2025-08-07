import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, User } from "lucide-react";
import { UserService } from "@/services";

export default function UserSearchPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!username.trim()) return;

    setLoading(true);
    try {
      const user = await UserService.getUserByName(username);
      if (user && user._id) {
        navigate(`/user/${user._id}`);
      } else {
        toast.error("User not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("User not found or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4">
        <div className="flex flex-col items-center">
          <User className="w-12 h-12 text-gray-400 mb-2" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Search User by Username</h2>
        </div>

        <Input
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <Button onClick={handleSearch} disabled={loading || !username.trim()} className="w-full">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Searching...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
