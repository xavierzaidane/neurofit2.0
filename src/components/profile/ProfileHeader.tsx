import { motion } from "motion/react";

const ProfileHeader = ({ user }: { user: any }) => {
  if (!user) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-10 relative backdrop-blur-md  p-8 md:p-12 overflow-hidden"
    >

      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
        <div className="relative">
          {user.imageUrl ? (
            <div className="relative w-28 h-28 md:w-25 md:h-25 overflow-hidden rounded-full ">
              <img
                src={user.imageUrl}
                alt={user.fullName || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-orange-500/30 to-orange-500/10 flex items-center justify-center ring-2 ring-orange-500/50">
              <span className="text-4xl font-bold text-orange-500">
                {user.fullName?.charAt(0) || "U"}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h1 className="text-4xl md:text-2xl font-mono font-semibold tracking-tighter text-white font-display">
              {user.fullName}
            </h1>
          </div>
       
          <p className="text-white/70 font-mono text-sm md:text-base -mt-3">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
export default ProfileHeader;