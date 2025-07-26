"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Video, MessageCircle, Users, Plus } from 'lucide-react';
import Navbar from './Navbar2';

interface Participant {
  _id: string;
  username: string;
}

interface Group {
  _id: string;
  name: string;
  participants: Participant[];
}

export default function GroupChatPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);
  const [newParticipantUsername, setNewParticipantUsername] = useState('');
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  // Fetch active groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch('/api/groups');
        if (!res.ok) {
          console.error('Failed to fetch groups');
          return;
        }
        const data = await res.json();
        setGroups(data.groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroups();
  }, []);

  const createGroup = async () => {
    if (!newGroupName.trim() || selectedUsernames.length === 0) return;
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGroupName,
          participantUsernames: selectedUsernames,
        }),
      });
      if (res.ok) {
        const { group } = await res.json();
        setGroups([...groups, group]);
        setNewGroupName('');
        setSelectedUsernames([]);
        setCurrentGroupId(group._id);
      } else {
        console.error('Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const addParticipant = async () => {
    if (!currentGroupId || !newParticipantUsername.trim()) return;
    try {
      const res = await fetch('/api/groups', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentGroupId,
          newParticipantUsername,
        }),
        credentials: 'include',
      });
      if (res.ok) {
        const { group } = await res.json();
        setGroups(groups.map(g => g._id === group._id ? group : g));
        setNewParticipantUsername('');
      } else {
        console.error('Failed to add participant');
      }
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Black blurred overlay */}
      <div
        className="absolute inset-0 bg-black/40 z-0"
        style={{ backdropFilter: "blur(2px)" }}
      />
      {/* Background image */}
      <div
        className="relative z-10 min-h-screen bg-cover bg-center bg-no-repeat p-6"
        style={{ backgroundImage: `url('images/image.jpg')`, opacity: 0.5}}
      >
        <Navbar />
        <div className="max-w-4xl mx-auto relative">
          <h1 className="text-3xl mb-6 font-valueSerif text-white">Group Chats</h1>

          {/* Create Group Section */}
          <div className="bg-black/80 p-8 rounded-2xl shadow mb-6">
            <h2 className="text-xl mb-4 font-copernicusMedium text-white">Create New Group</h2>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full p-3 pr-32 rounded-2xl bg-white/10 text-white border border-white/20 placeholder-white/60"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={selectedUsernames.join(',')}
                  onChange={(e) =>
                    setSelectedUsernames(
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  placeholder="Participant usernames (comma separated)"
                  className="w-full p-3 rounded-2xl bg-white/10 text-white border border-white/20 placeholder-white/60"
                />
              </div>
              <button
                onClick={createGroup}
                className="bg-purple-600 text-white px-4 py-1.5 rounded-xl font-outfitRegular hover:bg-purple-700 transition-all duration-300"
              >
                Create Group
              </button>
            </div>
          </div>

          {/* Add Participant Section */}
          {currentGroupId && (
            <div className="bg-black/80 p-8 rounded-2xl shadow mb-6 border border-white/10">
              <h3 className="text-lg font-copernicusMedium text-white mb-4">Add a Participant to Group</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newParticipantUsername}
                  onChange={(e) => setNewParticipantUsername(e.target.value)}
                  placeholder="New Participant Username"
                  className="w-full p-3 rounded-2xl bg-white/10 text-white border border-white/20 placeholder-white/60"
                />
                <button
                  onClick={addParticipant}
                  className="bg-green-600 text-white px-4 py-1.5 rounded-xl font-outfitRegular hover:bg-green-700 transition-all duration-300"
                >
                  Add Participant
                </button>
              </div>
            </div>
          )}

          {/* Group List */}
          <div className="bg-black/80 rounded-2xl shadow p-8">
            <h2 className="text-xl mb-4 font-copernicusMedium text-white">Active Groups</h2>
            <div className="space-y-2">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="flex items-center justify-between border border-white/10 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all duration-300"
                >
                  <div>
                    <h3 className="font-medium font-outfitRegular text-white">{group.name}</h3>
                    <p className="text-sm text-white/60 font-outfitRegular">
                      Participants:{' '}
                      {group.participants.length > 0
                        ? group.participants.map((p) => p.username).join(', ')
                        : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/group-chat/${group._id}`}>  
                      <button className="flex items-center gap-1 bg-purple-600 text-white px-4 py-2 rounded-xl font-outfitRegular hover:bg-purple-700 transition-all duration-300">
                        <MessageCircle className="h-4 w-4" />
                        Open Chat
                      </button>
                    </Link>
                    <Link href={`/video-call/${group._id}`}>  
                      <button className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl font-outfitRegular hover:bg-blue-700 transition-all duration-300">
                        <Video className="h-4 w-4" />
                        Video Call
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
