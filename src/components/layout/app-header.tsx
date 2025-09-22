"use client";

import { authClient } from "@/lib/auth-client";
import { UserMenu } from "@/components/user-menu";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const { data: session } = authClient.useSession();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 safe-area-pt">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {session?.user && (
            <UserMenu user={session.user} />
          )}
        </div>
      </div>
    </header>
  );
}