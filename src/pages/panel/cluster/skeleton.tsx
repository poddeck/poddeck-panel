import {
  Card, CardContent,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

export default function ClusterCardSkeleton() {
  return (
    <div className="relative w-full rounded-xl pt-0 shadow-lg aspect-video">
      <Card
        className="border-none bg-linear-to-b from-zinc-800 to-zinc-950 pb-0 aspect-video">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-md"/>
              <Skeleton className="h-5 w-32"/>
            </CardTitle>
            <Skeleton className="h-8 w-8 rounded-full"/>
          </div>

          <CardDescription className="flex items-center gap-4">
            <Skeleton className="h-4 w-28"/>
            <Skeleton className="h-4 w-20"/>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 justify-center items-center border rounded-lg p-2"
              >
                <Skeleton className="h-8 w-12"/>
                <Skeleton className="h-4 w-20"/>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="bg-sidebar rounded-b-xl p-6 mt-auto">
          <div className="flex items-center gap-8 w-full">
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-full"/>
                <Skeleton className="h-3 w-full"/>
                <Skeleton className="h-3 w-full"/>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}