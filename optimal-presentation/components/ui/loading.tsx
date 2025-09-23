"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
    </div>
  )
}

interface ProcessingIndicatorProps {
  message?: string
  className?: string
}

export function ProcessingIndicator({
  message = "Processing your request...",
  className
}: ProcessingIndicatorProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg",
      className
    )}>
      <LoadingSpinner size="sm" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-blue-700 font-medium">{message}</span>
        <LoadingDots />
      </div>
    </div>
  )
}

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
    />
  )
}

interface SlideLoadingSkeletonProps {
  className?: string
}

export function SlideLoadingSkeleton({ className }: SlideLoadingSkeletonProps) {
  return (
    <div className={cn("space-y-4 p-6", className)}>
      {/* Title skeleton */}
      <Skeleton className="h-8 w-3/4" />

      {/* Subtitle skeleton */}
      <Skeleton className="h-4 w-1/2" />

      {/* Content skeletons */}
      <div className="space-y-3 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Metrics skeletons */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  )
}