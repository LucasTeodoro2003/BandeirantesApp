import { SkeletonCard } from "@/features/skeletons/skeletonCard"

export default function Loading() {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <SkeletonCard />
          </div>
        );
}