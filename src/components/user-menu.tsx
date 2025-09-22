"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/signin";
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{user.name}</p>
        <p className="text-xs text-gray-600">{user.email}</p>
      </div>
      <Button
        onClick={handleSignOut}
        disabled={loading}
        variant="outline"
        size="sm"
      >
        {loading ? "Signing out..." : "Sign out"}
      </Button>
    </div>
  );
}