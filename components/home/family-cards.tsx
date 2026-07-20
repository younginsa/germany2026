"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFamilies, useProfiles } from "@/hooks/use-app-data";
import { initialsOf } from "@/lib/utils";

export function FamilyCards() {
  const families = useFamilies();
  const profiles = useProfiles();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {families.map((family) => {
        const members = profiles.filter((p) => p.familyId === family.id);
        return (
          <Card key={family.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: family.color }}
                  aria-hidden
                />
                {family.name}
              </CardTitle>
              <span className="text-xs font-medium text-muted-foreground">
                {members.length}명
              </span>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback hue={family.hue}>
                      {initialsOf(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{member.name}</p>
                    {member.role === "아이" && member.age !== undefined && (
                      <p className="text-xs text-muted-foreground">{member.age}세</p>
                    )}
                  </div>
                  <Badge variant="secondary">{member.role}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
