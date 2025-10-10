"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  branch?: string;
  year?: number;
}

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileModal({ open, onOpenChange }: UserProfileModalProps) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    year: 1,
  });

  useEffect(() => {
    if (open && session?.user?.email) {
      fetchProfile();
    }
  }, [open, session]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user");
      const data = await response.json();

      if (data.user) {
        setProfile(data.user);
        setFormData({
          name: data.user.name || "",
          branch: data.user.branch || "",
          year: data.user.year || 1,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setProfile(data.user);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-neutral-950 border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-neutral-100">User Profile</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Update your profile information here
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-center">
              <Avatar className="h-24 w-24 ring-2 ring-emerald-500/20">
                <AvatarImage src={profile?.picture || session?.user?.image || ""} />
                <AvatarFallback className="bg-emerald-950 text-emerald-200 text-2xl">
                  {formData.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-neutral-200">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-neutral-900 border-neutral-800 text-neutral-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-200">
                  Email
                </Label>
                <Input
                  id="email"
                  value={profile?.email || session?.user?.email || ""}
                  disabled
                  className="bg-neutral-900/50 border-neutral-800 text-neutral-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch" className="text-neutral-200">
                  Branch
                </Label>
                <Input
                  id="branch"
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                  placeholder="e.g., Computer Engineering"
                  className="bg-neutral-900 border-neutral-800 text-neutral-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className="text-neutral-200">
                  Year
                </Label>
                <select
                  id="year"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-neutral-100"
                >
                  <option value={1}>First Year</option>
                  <option value={2}>Second Year</option>
                  <option value={3}>Third Year</option>
                  <option value={4}>Fourth Year</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-neutral-800 text-neutral-200 hover:bg-neutral-900 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
