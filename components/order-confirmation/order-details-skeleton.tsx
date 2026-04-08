import { Skeleton } from "@/components/ui/skeleton";

export function OrderDetailsSkeleton() {
  return (
    <>
      <Skeleton className="h-52 w-full rounded-xl mb-6" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </>
  );
}
