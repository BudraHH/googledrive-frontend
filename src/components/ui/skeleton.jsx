import { cn } from "@/lib/utils"

// Inject shimmer keyframes into document head (only once)
if (typeof document !== 'undefined') {
  const styleId = 'skeleton-shimmer-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-slate-200",
        className
      )}
      {...props}
    >
      {/* Shimmer overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
          animation: 'shimmer 1.5s ease-in-out infinite',
        }}
      />
    </div>
  );
}

export { Skeleton }

