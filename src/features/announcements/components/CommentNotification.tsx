import { useState, useEffect } from "react";
import { Fade } from "~/components/ui/fade";
import { cn } from "~/lib/utils";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface CommentNotificationProps {
  type: "success" | "error" | "info";
  message: string;
  show: boolean;
  onClose?: () => void;
  autoHideDuration?: number;
  className?: string;
}

export function CommentNotification({
  type = "success",
  message,
  show,
  onClose,
  autoHideDuration = 4000,
  className,
}: CommentNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Using a variable to track the state change to avoid direct setState call in useEffect
    const shouldBeVisible = show;
    let timer: NodeJS.Timeout;
    
    // Only set state if it's different to avoid unnecessary rerenders
    if (isVisible !== shouldBeVisible) {
      setIsVisible(shouldBeVisible);
    }
    
    // Set up auto-hide timer if needed
    if (shouldBeVisible && autoHideDuration > 0) {
      timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoHideDuration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [show, autoHideDuration, onClose, isVisible]);  // Added isVisible as dependency

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const Icon = type === "success" 
    ? CheckCircle 
    : type === "error" 
      ? XCircle 
      : AlertCircle;

  const bgColor = type === "success" 
    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30" 
    : type === "error" 
      ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30" 
      : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30";

  const textColor = type === "success" 
    ? "text-green-700 dark:text-green-400" 
    : type === "error" 
      ? "text-red-700 dark:text-red-400" 
      : "text-blue-700 dark:text-blue-400";

  const iconColor = type === "success" 
    ? "text-green-500" 
    : type === "error" 
      ? "text-red-500" 
      : "text-blue-500";

  return (
    <Fade show={isVisible} className="pointer-events-none fixed bottom-6 inset-x-0 z-50 flex justify-center">
      <div 
        className={cn(
          "pointer-events-auto max-w-md rounded-lg px-4 py-3 shadow-lg",
          "border flex items-center justify-between",
          "animate-slide-up",
          bgColor,
          className
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("h-5 w-5", iconColor)} />
          <p className={cn("text-sm font-medium", textColor)}>{message}</p>
        </div>
        <button 
          type="button"
          onClick={handleClose} 
          className={cn(
            "ml-4 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10",
            textColor
          )}
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </Fade>
  );
}
