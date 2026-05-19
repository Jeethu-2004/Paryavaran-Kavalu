import { useState, useEffect } from 'react';
import { auth, signInWithGoogle, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { LogIn, Trophy, ShieldCheck, AlertTriangle, Plus, Map as MapIcon } from 'lucide-react';
import MapView from './components/MapView';
import ReportModal from './components/ReportModal';
import Leaderboard from './components/Leaderboard';
import { WasteSpot } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [spots, setSpots] = useState<WasteSpot[]>([]);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [view, setView] = useState<'map' | 'leaderboard'>('map');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WasteSpot[];
      setSpots(docs);
    });
    return () => unsubscribe();
  }, [user]);

  const handleReportSubmit = async (data: { description: string }) => {
    if (!user) return;
    
    // Mock location for demo (In real app we use navigator.geolocation)
    const lat = 12.9716 + (Math.random() - 0.5) * 0.1;
    const lng = 77.5946 + (Math.random() - 0.5) * 0.1;

    await addDoc(collection(db, "reports"), {
      reporterId: user.uid,
      reporterName: user.displayName,
      latitude: lat,
      longitude: lng,
      description: data.description,
      status: 'pending',
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60',
      createdAt: serverTimestamp(),
      upvotes: 0
    });
  };

  const hasConfig = !!import.meta.env.VITE_FIREBASE_API_KEY;

  if (loading) {
    return <div className="h-screen flex items-center justify-center font-black text-emerald-900 tracking-tighter text-2xl animate-pulse italic">KAVALU...</div>;
  }

  if (!hasConfig) {
    return (
      <div className="h-screen flex items-center justify-center p-6 text-center bg-emerald-50">
        <div className="max-w-md bg-white border-4 border-amber-100 p-10 rounded-[2.5rem] shadow-2xl">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-amber-500" size={40} />
          </div>
          <h1 className="text-3xl font-black mb-3 text-emerald-950 italic">SAFE FOR GITHUB</h1>
          <p className="text-gray-500 mb-8 font-medium leading-relaxed italic">
            I have removed your sensitive API keys from the code to keep your account safe. 
            <br/><br/>
            To see the app working, please add your keys to the <b className="text-emerald-600">Secrets</b> panel in Settings.
          </p>
          <div className="text-left bg-emerald-50/50 p-6 rounded-2xl text-xs font-mono text-emerald-700/60 border-2 border-emerald-100">
            VITE_FIREBASE_API_KEY=...<br/>
            VITE_GOOGLE_MAPS_API_KEY=...<br/>
            (Check .env.example for full list)
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border-4 border-emerald-100">
          <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-3">
            <ShieldCheck size={48} className="text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-emerald-950 mb-3 tracking-tight italic">
            KAVALU
          </h1>
          <p className="text-emerald-700/70 font-bold text-sm mb-10 tracking-widest uppercase">
            Guardian of the Environment
          </p>
          <button
            onClick={signInWithGoogle}
            className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-4 hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-200"
          >
            <LogIn size={24} />
            CONNECT ACCOUNT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-gray-100 h-24 bg-white z-20">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tight italic text-emerald-950 leading-none">
            KAVALU
          </h1>
          <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase mt-2">
            Citizen Node ID: {user.uid.slice(0, 8)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 px-4 py-2 rounded-2xl border-2 border-emerald-100 flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            <span className="text-sm font-black text-emerald-700">120 XP</span>
          </div>
          <img src={user.photoURL || ""} className="w-12 h-12 rounded-2xl border-2 border-emerald-100 shadow-md" />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-gray-50 overflow-y-auto">
        {view === 'map' ? (
          <>
            <MapView 
              spots={spots} 
              onMarkerClick={(spot) => alert(`Target: ${spot.description}`)} 
            />
            
            {/* Floating Stats Overlay */}
            <div className="absolute top-6 left-6 right-6 flex gap-3 pointer-events-none">
              <div className="bg-emerald-950/90 backdrop-blur-md px-6 py-4 rounded-[1.5rem] text-white flex-1 border border-emerald-500/20 shadow-2xl pointer-events-auto">
                <div className="text-[10px] font-black tracking-widest text-emerald-400 uppercase mb-1">Active Alerts</div>
                <div className="text-2xl font-black italic">{spots.filter(s => s.status !== 'cleaned').length}</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-[1.5rem] flex-1 border-2 border-emerald-100 shadow-2xl pointer-events-auto">
                <div className="text-[10px] font-black tracking-widest text-emerald-500 uppercase mb-1">Missions Done</div>
                <div className="text-2xl font-black text-emerald-950 italic">{spots.filter(s => s.status === 'cleaned').length}</div>
              </div>
            </div>
          </>
        ) : (
          <Leaderboard />
        )}
      </div>

      {/* Navigation / Actions Bar */}
      <div className="fixed bottom-10 left-10 right-10 flex justify-between items-center z-30 pointer-events-none">
        <button 
          onClick={() => setView(view === 'map' ? 'leaderboard' : 'map')}
          className="w-20 h-20 bg-white border-4 border-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center shadow-2xl pointer-events-auto hover:bg-emerald-50 transition-all active:scale-90"
        >
          {view === 'map' ? <Trophy size={32} /> : <MapIcon size={32} />}
        </button>

        <button 
          onClick={() => setIsReportOpen(true)}
          className="w-24 h-24 bg-emerald-600 text-white rounded-[2rem] flex flex-col items-center justify-center shadow-2xl shadow-emerald-400 hover:scale-110 active:scale-95 transition-all transform hover:-rotate-3 group pointer-events-auto"
        >
          <Plus size={40} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      <ReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}

