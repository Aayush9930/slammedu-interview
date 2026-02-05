"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { updateProfile } from "../actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!session) {
    return null; // Or loading spinner, but session usually loads fast or redirects
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      await updateProfile(formData);
      router.refresh();
      // Optionally show success toast
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-2xl font-bold">User Profile</h1>

        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={session.user.image || undefined} alt={session.user.name} />
            <AvatarFallback>{session.user.name[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-medium">{session.user.name}</p>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={session.user.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Profile Picture</Label>
            <Input id="file" name="file" type="file" accept="image/*" />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
