"use client";

import React from "react";
import { Search, Grid, Plus } from "lucide-react";
import Link from "next/link";

interface ProfileHeaderProps {
  user: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 select-none">
      {/* User Info (Profile Picture, Name, Email) */}
      <div className="flex items-center gap-4">
        {/* Profile Image */}
        {user.imageUrl ? (
          <div className="w-14 h-14 overflow-hidden rounded-full border border-border bg-muted/20">
            <img
              src={user.imageUrl}
              alt={user.fullName || "Profile"}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center">
            <span className="text-xl font-bold text-foreground">
              {user.fullName?.charAt(0) || "U"}
            </span>
          </div>
        )}

        {/* Name & Email */}
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
            {user.fullName}
          </h1>
          <p className="text-[13px] text-muted-foreground font-medium font-sans mt-0.5">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5">
        {/* Search button */}
        <button className="w-9 h-9 rounded-xl bg-muted/40 border border-border hover:bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
          <Search className="size-4.5" />
        </button>

        {/* Menus button */}
        <button 
        
        className="h-9 px-4 rounded-xl bg-muted/40 border border-border hover:bg-muted/60 flex items-center justify-center gap-1.5 text-xs font-normal text-muted-foreground hover:text-foreground transition-all tracking-wide">
  <img
    src="/neuro.png"
    alt="Neurobot"
    className="w-4 h-4 object-contain"
  />
  <span>Neurobot</span>
</button>

        {/* Quick Actions button */}
        <Link
          href="/program"
          className="h-9 px-4 rounded-xl bg-foreground text-primary-foreground hover:bg-foreground/90 flex items-center justify-center gap-1.5 text-xs font-normal transition-all tracking-wide shadow-lg"
        >
          <Plus className="size-4" />
          <span>Generate Plan</span>
        </Link>
      </div>
    </div>
  );
};

export default ProfileHeader;