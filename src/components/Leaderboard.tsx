import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { name: 'Jithesh', xp: 2450, rank: 1 },
  { name: 'Rahul', xp: 2100, rank: 2 },
  { name: 'Priya', xp: 1850, rank: 3 },
  { name: 'Amit', xp: 1200, rank: 4 },
  { name: 'Sita', xp: 950, rank: 5 },
];

export default function Leaderboard() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-emerald-950 italic">TOP GUARDIANS</h2>
        <Trophy className="text-amber-500" size={32} />
      </div>

      <div className="space-y-4">
        {MOCK_LEADERBOARD.map((user, index) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-5 rounded-3xl border-2 shadow-sm ${
              index === 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-emerald-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center font-black text-emerald-700">
                {index === 0 ? <Crown size={20} className="text-amber-600" /> : index + 1}
              </div>
              <div>
                <div className="font-black text-emerald-950 text-lg uppercase tracking-tight">{user.name}</div>
                <div className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase">Verified Volunteer</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xl font-black text-emerald-900">{user.xp}</div>
              <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Points</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
