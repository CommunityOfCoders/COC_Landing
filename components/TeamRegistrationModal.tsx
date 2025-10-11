"use client";

import { useState, useEffect, useCallback } from "react";
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
import { X, Plus, Loader2, CheckCircle2, XCircle, Search } from "lucide-react";
import { searchUserByEmail } from "@/app/actions/users";
import { registerForEvent } from "@/app/actions/participants";

interface TeamMember {
  email: string;
  name?: string;
  exists?: boolean;
  searching?: boolean;
}

interface TeamRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventTitle: string;
  minTeamSize: number;
  maxTeamSize: number;
  onSuccess: () => void;
}

export function TeamRegistrationModal({
  open,
  onOpenChange,
  eventId,
  eventTitle,
  minTeamSize,
  maxTeamSize,
  onSuccess,
}: TeamRegistrationModalProps) {
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ email: "", exists: undefined, searching: false }]);
  const [loading, setLoading] = useState(false);
  const [searchTimeouts, setSearchTimeouts] = useState<{ [key: number]: NodeJS.Timeout }>({});

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(searchTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [searchTimeouts]);

  const searchUser = async (email: string, index: number) => {
    if (!email.trim()) {
      const updated = [...teamMembers];
      updated[index] = { email: "", exists: undefined, searching: false };
      setTeamMembers(updated);
      return;
    }

    // Validate email format first
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const updated = [...teamMembers];
      updated[index] = { email, exists: false, searching: false };
      setTeamMembers(updated);
      return;
    }

    try {
      const updated = [...teamMembers];
      updated[index] = { ...updated[index], searching: true };
      setTeamMembers(updated);

      const result = await searchUserByEmail(email);

      const updatedWithResult = [...teamMembers];
      if (result.success && result.data.exists && result.data.user) {
        updatedWithResult[index] = {
          email,
          name: result.data.user.name,
          exists: true,
          searching: false,
        };
      } else {
        updatedWithResult[index] = {
          email,
          exists: false,
          searching: false,
        };
      }
      setTeamMembers(updatedWithResult);
    } catch (error) {
      console.error("Error searching user:", error);
      const updated = [...teamMembers];
      updated[index] = { email, exists: false, searching: false };
      setTeamMembers(updated);
    }
  };

  const addTeamMember = () => {
    if (teamMembers.length < maxTeamSize - 1) {
      setTeamMembers([...teamMembers, { email: "", exists: undefined, searching: false }]);
    }
  };

  const removeTeamMember = (index: number) => {
    // Clear timeout if exists
    if (searchTimeouts[index]) {
      clearTimeout(searchTimeouts[index]);
      const newTimeouts = { ...searchTimeouts };
      delete newTimeouts[index];
      setSearchTimeouts(newTimeouts);
    }
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, email: string) => {
    const updated = [...teamMembers];
    updated[index] = { email, exists: undefined, searching: false };
    setTeamMembers(updated);

    // Clear existing timeout
    if (searchTimeouts[index]) {
      clearTimeout(searchTimeouts[index]);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      searchUser(email, index);
    }, 500); // 500ms debounce

    setSearchTimeouts({ ...searchTimeouts, [index]: timeout });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validMembers = teamMembers.filter(m => m.email.trim());
    const totalTeamSize = validMembers.length + 1; // +1 for the leader

    if (!teamName.trim()) {
      alert("Please enter a team name");
      return;
    }

    if (totalTeamSize < minTeamSize) {
      alert(`Team must have at least ${minTeamSize} members (including you)`);
      return;
    }

    if (totalTeamSize > maxTeamSize) {
      alert(`Team cannot exceed ${maxTeamSize} members (including you)`);
      return;
    }

    // Validate emails and check if users exist
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const member of validMembers) {
      if (!emailRegex.test(member.email)) {
        alert(`Invalid email: ${member.email}`);
        return;
      }
      if (member.exists === false) {
        alert(`User not found: ${member.email}. All team members must be registered users.`);
        return;
      }
      if (member.exists === undefined) {
        alert(`Please wait while we verify all team members`);
        return;
      }
    }

    try {
      setLoading(true);
      const result = await registerForEvent({
        event_id: eventId,
        team_name: teamName,
        team_members: validMembers,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to register team");
      }

      alert("Team registered successfully!");
      setTeamName("");
      setTeamMembers([{ email: "", exists: undefined, searching: false }]);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error registering team:", error);
      alert(error.message || "Failed to register team. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentTeamSize = teamMembers.filter(m => m.email.trim()).length + 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-neutral-950 border-neutral-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-neutral-100">Team Registration</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Register your team for <span className="text-emerald-400">{eventTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Team Size Info */}
          <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
            <div className="text-sm text-neutral-400">
              <div className="flex justify-between mb-2">
                <span>Required team size:</span>
                <span className="text-neutral-200 font-medium">
                  {minTeamSize} - {maxTeamSize} members
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current team size:</span>
                <span className={`font-medium ${
                  currentTeamSize >= minTeamSize && currentTeamSize <= maxTeamSize
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}>
                  {currentTeamSize} members
                </span>
              </div>
            </div>
          </div>

          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="teamName" className="text-neutral-200">
              Team Name *
            </Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
              className="bg-neutral-900 border-neutral-800 text-neutral-100"
              required
            />
          </div>

          {/* Team Members */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-neutral-200">
                Team Members (excluding you) *
              </Label>
              <Button
                type="button"
                onClick={addTeamMember}
                disabled={teamMembers.length >= maxTeamSize - 1}
                size="sm"
                variant="outline"
                className="border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Member
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {teamMembers.map((member, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        value={member.email}
                        onChange={(e) => updateTeamMember(index, e.target.value)}
                        placeholder="member@vjti.ac.in"
                        type="email"
                        className={`bg-neutral-900 border-neutral-800 text-neutral-100 pr-10 ${
                          member.exists === false ? 'border-red-500/50' : 
                          member.exists === true ? 'border-emerald-500/50' : ''
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {member.searching && (
                          <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                        )}
                        {!member.searching && member.exists === true && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                        {!member.searching && member.exists === false && member.email.trim() && (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      variant="outline"
                      size="icon"
                      className="border-neutral-700 text-red-400 hover:bg-red-950/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {member.exists === true && member.name && (
                    <p className="text-xs text-emerald-400 ml-1">
                      ✓ {member.name}
                    </p>
                  )}
                  {member.exists === false && member.email.trim() && (
                    <p className="text-xs text-red-400 ml-1">
                      ✗ User not found - must be registered
                    </p>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-neutral-500">
              Enter the VJTI email addresses of your team members. They must be registered users.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || currentTeamSize < minTeamSize || currentTeamSize > maxTeamSize}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Team"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
