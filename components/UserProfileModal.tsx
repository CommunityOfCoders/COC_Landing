"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
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
import { Loader2, LogOut } from "lucide-react";
import { getCurrentUserProfile } from "@/app/actions/users";
import { posthog } from "@/lib/posthog";

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  branch?: string;
  year?: number;
  graduated?: boolean;
}

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileModal({ open, onOpenChange }: UserProfileModalProps) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && session?.user?.email) {
      fetchProfile();
    }
  }, [open, session]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const result = await getCurrentUserProfile();

      if (result.success && result.data) {
        setProfile(result.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    posthog.capture('sign_out_clicked', { location: 'profile_modal' });
    await signOut({ callbackUrl: '/' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-neutral-950 border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-neutral-100">User Profile</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Your profile information (automatically synced from your account)
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
                  {profile?.name?.[0]?.toUpperCase() || session?.user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-neutral-200">Name</Label>
                <div className="px-3 py-2 bg-neutral-900/50 border border-neutral-800 rounded-md text-neutral-300">
                  {profile?.name || session?.user?.name || "Not set"}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-200">Email</Label>
                <div className="px-3 py-2 bg-neutral-900/50 border border-neutral-800 rounded-md text-neutral-300">
                  {profile?.email || session?.user?.email || "Not set"}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-200">Branch</Label>
                <div className="px-3 py-2 bg-neutral-900/50 border border-neutral-800 rounded-md text-neutral-300">
                  {profile?.branch || "Not set"}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-200">Year</Label>
                <div className="px-3 py-2 bg-neutral-900/50 border border-neutral-800 rounded-md text-neutral-300">
                  {profile?.graduated ? (
                    <span className="flex items-center gap-2">
                      <span>Graduated</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                        🎓 Alumni
                      </span>
                    </span>
                  ) : profile?.year ? (
                    profile.year === 1 ? "First Year" :
                    profile.year === 2 ? "Second Year" :
                    profile.year === 3 ? "Third Year" :
                    profile.year === 4 ? "Fourth Year" :
                    `Year ${profile.year}`
                  ) : "Not set"}
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {profile?.graduated 
                    ? "You have graduated from the program" 
                    : "Year is automatically updated every July"}
                </p>
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
