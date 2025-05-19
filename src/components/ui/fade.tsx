import { ReactNode, useEffect, useState } from "react";
import { cn } from "~/lib/utils";

interface FadeProps {
  show: boolean;
  children: ReactNode;
  className?: string;
  duration?: number;
}

export function Fade({ 
  show, 
  children, 
  className, 
  duration = 200 
}: FadeProps) {
  const [shouldRender, setShouldRender] = useState(show);
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    // Using a single effect for both showing and hiding to avoid lint warnings
    let showTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;
    
    if (show) {
      // When showing, immediately render but delay visibility for transition
      setShouldRender(true);
      // Slight delay to ensure the DOM is updated before we start the transition
      showTimeout = setTimeout(() => setIsVisible(true), 10);
    } else {
      // When hiding, immediately make invisible but delay unmounting
      setIsVisible(false);
      hideTimeout = setTimeout(() => setShouldRender(false), duration);
    }
    
    // Cleanup both timeouts on unmount or when dependencies change
    return () => {
      if (showTimeout) clearTimeout(showTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [show, duration]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "transition-opacity",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
