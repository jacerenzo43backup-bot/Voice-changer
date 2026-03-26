import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Cyber background */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/cyber-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="glass-panel p-12 rounded-3xl flex flex-col items-center max-w-md text-center relative z-10">
        <AlertCircle className="w-24 h-24 text-destructive mb-6 shadow-[0_0_30px_rgba(255,51,102,0.4)] rounded-full" />
        <h1 className="text-4xl font-display font-black text-white mb-2">404</h1>
        <h2 className="text-xl font-display text-muted-foreground tracking-widest mb-6 uppercase">System Malfunction</h2>
        <p className="text-sm text-muted-foreground mb-8">
          The audio sector you are trying to access does not exist in this neural network.
        </p>
        <Link 
          href="/" 
          className="px-8 py-4 bg-primary text-primary-foreground font-display tracking-widest font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] transition-all uppercase"
        >
          Return to Matrix
        </Link>
      </div>
    </div>
  );
}
