import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { useState } from "react";

interface LeaveButtonProps {
  roomId?: string;
  playerEmail?: string;
  className?: string;
  variant?: "default" | "small" | "icon";
  showConfirmation?: boolean;
}

const LeaveButton: React.FC<LeaveButtonProps> = ({ 
  roomId, 
  playerEmail, 
  className = "",
  variant = "default",
  showConfirmation = true
}) => {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLeave = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (showConfirmation && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsLeaving(true);

    try {
      const socket = getSocket();
      
      // Emit leave room event if we have room context
      if (roomId && playerEmail) {
        socket.emit("leaveRoom", { roomId, playerEmail });
      }
      
      // Disconnect socket
      socket.disconnect();
      
      // Navigate to home
      router.push("/");
    } catch (error) {
      console.error("Error leaving room:", error);
      // Still navigate even if socket cleanup fails
      router.push("/");
    } finally {
      setIsLeaving(false);
      setShowConfirm(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  // Variant styles
  const getButtonStyles = () => {
    const base = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    switch (variant) {
      case "small":
        return `${base} px-3 py-1.5 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white`;
      case "icon":
        return `${base} p-2 rounded-full bg-red-500 hover:bg-red-600 text-white`;
      default:
        return `${base} px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white w-full`;
    }
  };

  const getContent = () => {
    if (isLeaving) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Leaving...
        </div>
      );
    }

    switch (variant) {
      case "icon":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        );
      case "small":
        return "Leave";
      default:
        return "Leave the Room";
    }
  };

  if (showConfirm) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-red-200 rounded-xl p-4 shadow-lg"
      >
        <div className="text-center">
          <div className="mb-3">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Leave Room?
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to leave the room? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLeave}
              disabled={isLeaving}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLeaving ? "Leaving..." : "Leave"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLeave}
      disabled={isLeaving}
      className={`${getButtonStyles()} ${className}`}
      title={variant === "icon" ? "Leave Room" : undefined}
    >
      {getContent()}
    </motion.button>
  );
};

export default LeaveButton;