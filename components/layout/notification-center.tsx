"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, FileText, MapPin, MessageCircle, AtSign, CheckSquare, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useNotifications,
  useCurrentUser,
  useProfileById,
  tripStore,
} from "@/hooks/use-app-data";
import type { NotificationType } from "@/lib/types";
import { cn, initialsOf, relativeTimeKo } from "@/lib/utils";

const TYPE_ICON: Record<NotificationType, React.ElementType> = {
  comment: MessageCircle,
  checklist: CheckSquare,
  document: FileText,
  place: MapPin,
  mention: AtSign,
  board: LayoutGrid,
};

export function NotificationCenter() {
  const notifications = useNotifications();
  const me = useCurrentUser();
  const profileById = useProfileById();

  const unread = notifications.filter((n) => !n.readBy.includes(me.id));

  function markAllRead() {
    notifications.forEach((n) => {
      if (!n.readBy.includes(me.id)) {
        tripStore.upsertRow("notifications", { ...n, readBy: [...n.readBy, me.id] });
      }
    });
  }

  function markRead(id: string) {
    const n = notifications.find((x) => x.id === id);
    if (n && !n.readBy.includes(me.id)) {
      tripStore.upsertRow("notifications", { ...n, readBy: [...n.readBy, me.id] });
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="알림">
          <Bell className="h-4 w-4" />
          <AnimatePresence>
            {unread.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground"
              >
                {unread.length}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">알림</h3>
          {unread.length > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="h-7 gap-1 text-xs">
              <CheckCheck className="h-3.5 w-3.5" />
              모두 읽음
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              아직 알림이 없습니다
            </p>
          ) : (
            <ul className="divide-y">
              {notifications.slice(0, 20).map((n) => {
                const actor = profileById(n.actorId);
                const Icon = TYPE_ICON[n.type];
                const isUnread = !n.readBy.includes(me.id);
                return (
                  <li key={n.id}>
                    <Link
                      href={n.href}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "flex gap-3 px-4 py-3 transition-colors hover:bg-accent/50",
                        isUnread && "bg-primary/[0.04]"
                      )}
                    >
                      <div className="relative shrink-0">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback hue={actor?.hue}>
                            {actor ? initialsOf(actor.name) : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border bg-card">
                          <Icon className="h-2.5 w-2.5 text-muted-foreground" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-sm leading-snug", isUnread && "font-medium")}>
                          {n.message}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {relativeTimeKo(n.createdAt)}
                        </p>
                      </div>
                      {isUnread && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
