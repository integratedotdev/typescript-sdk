import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface ApiKeysEmptyProps {
  canManage?: boolean;
  onCreateClick?: () => void;
}

export function ApiKeysEmpty({ canManage, onCreateClick }: ApiKeysEmptyProps) {
  return (
    <Empty className="border border-dashed border-border/50">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <KeyRound />
        </EmptyMedia>
        <EmptyTitle>No API keys yet</EmptyTitle>
        <EmptyDescription>
          Create an API key to authenticate requests to the Integrate platform.
        </EmptyDescription>
      </EmptyHeader>
      {canManage && onCreateClick ? (
        <EmptyContent>
          <Button onClick={onCreateClick} size="sm" type="button">
            Create your first key
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
