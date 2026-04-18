import React, { useState } from 'react';
import { auth } from './firebase'; 
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    FacebookAuthProvider, 
    signOut 
} from 'firebase/auth';

export default function LoginUI() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to log in with Google.');
        }
    };

    const handleFacebookLogin = async () => {
        const provider = new FacebookAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to log in with Facebook.');
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="vision-glass p-8 rounded-[2rem] max-w-md mx-auto text-center soft-glow backdrop-blur-2xl bg-white/30 dark:bg-[#020617]/60 border border-white/40 dark:border-white/10 shadow-2xl">
            
            {user ? (
                <div className="space-y-4 relative z-10">
                    <img 
                        src={user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full mx-auto border-4 border-blue-500 shadow-lg"
                    />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Welcome, {user.displayName?.split(' ')[0]}!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{user.email}</p>
                    
                    <button 
                        onClick={handleLogout} 
                        className="vision-pill px-8 py-3 !bg-red-500/10 !text-red-500 hover:!bg-red-500 hover:!text-white transition-all font-bold mt-4"
                    >
                        Log Out
                    </button>
                </div>
            ) : (
                <div className="space-y-6 relative z-10">
                    <div className="w-16 h-16 mx-auto bg-blue-500/10 text-blue-500 flex items-center justify-center rounded-full text-3xl mb-2 shadow-inner">
                        <i className="fas fa-fingerprint"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Sign In to Webagency
                    </h3>
                    
                    {error && <p className="text-red-500 dark:text-red-400 text-sm font-bold bg-red-500/10 py-2 rounded-lg">{error}</p>}

                    <div className="space-y-3 pt-2">
                        {/* FIXED DARK MODE VISIBILITY HERE */}
                        <button 
                            onClick={handleGoogleLogin} 
                            className="vision-pill w-full py-4 flex justify-center items-center gap-3 soft-glow !bg-white/50 dark:!bg-black/40 border border-white/50 dark:border-white/10 !text-slate-900 dark:!text-white hover:!bg-white/80 dark:hover:!bg-white/10 transition-all font-bold backdrop-blur-md"
                        >
                            <i className="fab fa-google text-red-500 text-lg"></i> 
                            Continue with Google
                        </button>

                        <button 
                            onClick={handleFacebookLogin} 
                            className="vision-pill w-full py-4 flex justify-center items-center gap-3 soft-glow !bg-[#1877F2]/10 dark:!bg-[#1877F2]/20 border border-[#1877F2]/30 !text-[#1877F2] dark:!text-blue-400 hover:!bg-[#1877F2] hover:!text-white transition-all font-bold backdrop-blur-md"
                        >
                            <i className="fab fa-facebook-f text-lg"></i> 
                            Continue with Facebook
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}