import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AccountSkeleton() {
  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-6 p-6">
      <div className="flex-1">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>

        <div className="space-y-6 mt-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                {i === 2 && <Skeleton className="h-10 w-full" />}
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-6 space-y-4">
          <Skeleton className="h-5 w-24" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 w-40" />
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}

