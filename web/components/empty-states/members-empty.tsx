import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface MembersEmptyProps {
  canInvite?: boolean;
  onInviteClick?: () => void;
}

export function MembersEmpty({ canInvite, onInviteClick }: MembersEmptyProps) {
  return (
    <Empty className="border border-dashed border-border/50 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Users />
        </EmptyMedia>
        <EmptyTitle>No members yet</EmptyTitle>
        <EmptyDescription>
          Invite teammates to collaborate on your organization.
        </EmptyDescription>
      </EmptyHeader>
      {canInvite && onInviteClick ? (
        <EmptyContent>
          <Button onClick={onInviteClick} size="sm" type="button">
            Invite member
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
