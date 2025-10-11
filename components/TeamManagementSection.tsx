"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Crown, 
  UserPlus, 
  UserMinus, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  AlertCircle 
} from "lucide-react";
import { getMyTeam, addTeamMember, removeTeamMember } from "@/app/actions/teams";
import { searchUserByEmail } from "@/app/actions/users";

interface TeamMember {
  email: string;
  name?: string;
  exists?: boolean;
  searching?: boolean;
}

interface ParticipantData {
  id: string;
  team_name: string;
  team_members: TeamMember[];
  is_team_leader: boolean;
  users: {
    name: string;
    email: string;
    picture: string;
  };
}

interface TeamManagementSectionProps {
  eventId: string;
  minTeamSize: number;
  maxTeamSize: number;
  onTeamUpdate?: () => void;
}

export function TeamManagementSection({
  eventId,
  minTeamSize,
  maxTeamSize,
  onTeamUpdate,
}: TeamManagementSectionProps) {
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState<ParticipantData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberStatus, setNewMemberStatus] = useState<{
    exists?: boolean;
    searching?: boolean;
    name?: string;
  }>({});
  const [updating, setUpdating] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchTeamData();
    
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [eventId]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const result = await getMyTeam(eventId);
      
      if (result.success && result.data) {
        setTeamData(result.data);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchUser = async (email: string) => {
    if (!email.trim()) {
      setNewMemberStatus({});
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setNewMemberStatus({ exists: false, searching: false });
      return;
    }

    try {
      setNewMemberStatus({ searching: true });
      
      const result = await searchUserByEmail(email);

      if (result.success && result.data.exists && result.data.user) {
        setNewMemberStatus({
          exists: true,
          searching: false,
          name: result.data.user.name,
        });
      } else {
        setNewMemberStatus({ exists: false, searching: false });
      }
    } catch (error) {
      console.error("Error searching user:", error);
      setNewMemberStatus({ exists: false, searching: false });
    }
  };

  const handleEmailChange = (email: string) => {
    setNewMemberEmail(email);
    setNewMemberStatus({ searching: false });

    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(() => {
      searchUser(email);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const handleAddTeamMember = async () => {
    if (!newMemberEmail || newMemberStatus.exists !== true || !teamData) {
      return;
    }

    try {
      setUpdating(true);
      const result = await addTeamMember(eventId, newMemberEmail);

      if (!result.success) {
        throw new Error(result.error || "Failed to add team member");
      }

      alert("Team member added successfully!");
      setNewMemberEmail("");
      setNewMemberStatus({});
      await fetchTeamData();
      if (onTeamUpdate) onTeamUpdate();
    } catch (error: any) {
      console.error("Error adding team member:", error);
      alert(error.message || "Failed to add team member");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveTeamMember = async (memberEmail: string) => {
    const wouldBeUnderMinimum = currentTeamSize - 1 < minTeamSize;
    
    const confirmMessage = wouldBeUnderMinimum
      ? `Removing ${memberEmail} will bring your team below the minimum size (${minTeamSize}). This will unregister your entire team from the event. Continue?`
      : `Remove ${memberEmail} from the team?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setUpdating(true);
      console.log('Removing team member:', memberEmail, 'from event:', eventId);
      const result = await removeTeamMember(eventId, memberEmail);

      if (!result.success) {
        throw new Error(result.error || "Failed to remove team member");
      }

      if (result.data.unregistered) {
        alert("Team member removed. Your team has been unregistered as it's below minimum size.");
        // Team is unregistered, so no team data to fetch
        if (onTeamUpdate) onTeamUpdate();
      } else {
        alert("Team member removed successfully!");
        await fetchTeamData();
        if (onTeamUpdate) onTeamUpdate();
      }
    } catch (error: any) {
      console.error("Error removing team member:", error);
      alert(error.message || "Failed to remove team member");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!teamData) {
    return null;
  }

  const currentTeamSize = (teamData.team_members?.length || 0) + 1;
  const canAddMembers = currentTeamSize < maxTeamSize;
  // Allow removing members even if it goes below minimum - will unregister the team
  const canRemoveMembers = teamData.team_members && teamData.team_members.length > 0;

  console.log('Team Management:', {
    currentTeamSize,
    minTeamSize,
    maxTeamSize,
    canRemoveMembers,
    canAddMembers,
    isTeamLeader: teamData.is_team_leader,
    teamMembersCount: teamData.team_members?.length || 0
  });

  return (
    <Card className="bg-neutral-900/30 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-lg text-neutral-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-500" />
          Your Team: {teamData.team_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Team Size Info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-400">Team Size:</span>
          <span className={`font-medium ${
            currentTeamSize >= minTeamSize && currentTeamSize <= maxTeamSize
              ? "text-emerald-400"
              : "text-amber-400"
          }`}>
            {currentTeamSize} / {maxTeamSize} members
          </span>
        </div>

        <Separator className="bg-neutral-800" />

        {/* Team Leader (Current User) */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-300">Team Members</h4>
          
          <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={teamData.users.picture || "/default-avatar.png"}
                alt={teamData.users.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-neutral-200">
                  {teamData.users.name}
                </p>
                <p className="text-xs text-neutral-400">{teamData.users.email}</p>
              </div>
            </div>
            {teamData.is_team_leader && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                <Crown className="w-3 h-3 mr-1" />
                Leader
              </Badge>
            )}
          </div>

          {/* Team Members List */}
          {teamData.team_members && teamData.team_members.length > 0 && (
            <div className="space-y-2">
              {teamData.team_members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-200">
                      {member.name || member.email}
                    </p>
                    <p className="text-xs text-neutral-400">{member.email}</p>
                  </div>
                  {teamData.is_team_leader && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveTeamMember(member.email)}
                      disabled={updating}
                      className="border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                    >
                      <UserMinus className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Member Section (Only for Team Leader) */}
        {teamData.is_team_leader && (
          <>
            <Separator className="bg-neutral-800" />
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-neutral-300">
                Add Team Member
              </h4>

              {canAddMembers ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        value={newMemberEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="member@vjti.ac.in"
                        type="email"
                        className={`bg-neutral-900 border-neutral-800 text-neutral-100 pr-10 ${
                          newMemberStatus.exists === false ? 'border-red-500/50' : 
                          newMemberStatus.exists === true ? 'border-emerald-500/50' : ''
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {newMemberStatus.searching && (
                          <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                        )}
                        {!newMemberStatus.searching && newMemberStatus.exists === true && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                        {!newMemberStatus.searching && newMemberStatus.exists === false && newMemberEmail.trim() && (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={handleAddTeamMember}
                      disabled={updating || newMemberStatus.exists !== true}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {updating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                  {newMemberStatus.exists === true && newMemberStatus.name && (
                    <p className="text-xs text-emerald-400 ml-1">
                      ✓ {newMemberStatus.name}
                    </p>
                  )}
                  {newMemberStatus.exists === false && newMemberEmail.trim() && (
                    <p className="text-xs text-red-400 ml-1">
                      ✗ User not found - must be registered
                    </p>
                  )}
                  <p className="text-xs text-neutral-500">
                    Enter the VJTI email address of a registered user.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-xs text-amber-400">
                    Team is at maximum capacity ({maxTeamSize} members)
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Team Size Warning */}
        {(currentTeamSize < minTeamSize || currentTeamSize > maxTeamSize) && (
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-400">
              {currentTeamSize < minTeamSize
                ? `Your team needs at least ${minTeamSize} members. Please add ${minTeamSize - currentTeamSize} more member(s).`
                : `Your team exceeds the maximum size of ${maxTeamSize}. Please remove ${currentTeamSize - maxTeamSize} member(s).`}
            </p>
          </div>
        )}

        {!teamData.is_team_leader && (
          <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-400">
              Only the team leader can add or remove members.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
