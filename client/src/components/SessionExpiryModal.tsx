import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw, LogOut } from 'lucide-react';

const SESSION_DURATION = 60 * 60 * 1000;
const WARNING_BEFORE  = 5 * 60 * 1000;
const IDLE_THRESHOLD  = SESSION_DURATION - WARNING_BEFORE; // 55 min idle → show warning

export default function SessionExpiryModal() {
  const { isAuthenticated, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_BEFORE / 1000);

  const warningTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const showWarningRef     = useRef(false);

  // Keep ref in sync with state
  useEffect(() => { showWarningRef.current = showWarning; }, [showWarning]);

  const clearTimers = () => {
    if (warningTimerRef.current) { clearTimeout(warningTimerRef.current); warningTimerRef.current = null; }
    if (countdownIntervalRef.current) { clearInterval(countdownIntervalRef.current); countdownIntervalRef.current = null; }
  };

  const startIdleTimer = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(WARNING_BEFORE / 1000);
    }, IDLE_THRESHOLD);
  }, []);

  const handleActivity = useCallback(() => {
    if (showWarningRef.current) return; // ignore if warning already shown
    startIdleTimer();
  }, [startIdleTimer]);

  const extendSession = useCallback(async () => {
    try {
      await fetch('/api/auth/me', { credentials: 'include' });
    } catch (_) {}
    clearTimers();
    setShowWarning(false);
    startIdleTimer();
  }, [startIdleTimer]);

  const handleLogout = useCallback(() => {
    clearTimers();
    setShowWarning(false);
    logout();
  }, [logout]);

  // Attach activity listeners when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      clearTimers();
      setShowWarning(false);
      return;
    }

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));
    startIdleTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity));
      clearTimers();
    };
  }, [isAuthenticated, handleActivity, startIdleTimer]);

  // Countdown when warning is shown
  useEffect(() => {
    if (!showWarning) {
      if (countdownIntervalRef.current) { clearInterval(countdownIntervalRef.current); countdownIntervalRef.current = null; }
      return;
    }

    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          countdownIntervalRef.current = null;
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) { clearInterval(countdownIntervalRef.current); countdownIntervalRef.current = null; }
    };
  }, [showWarning, handleLogout]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (!isAuthenticated || !showWarning) return null;

  return (
    <Dialog open={showWarning} onOpenChange={() => {}}>
      <DialogContent
        className="bg-zinc-900 border border-white/10 text-white max-w-md rounded-none [&>button]:hidden"
        onInteractOutside={e => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <DialogTitle className="text-white font-light text-lg">
              Phiên đăng nhập sắp hết hạn
            </DialogTitle>
          </div>
          <DialogDescription className="text-white/60 font-light text-sm leading-relaxed">
            Bạn không hoạt động trong <span className="text-white/80">55 phút</span>. Để bảo mật tài khoản, phiên làm việc sẽ tự động kết thúc sau:
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-center">
          <div className={`text-5xl font-light tabular-nums mb-2 transition-colors ${countdown <= 60 ? 'text-red-400' : 'text-yellow-400'}`}>
            {formatTime(countdown)}
          </div>
          <p className="text-white/40 text-xs uppercase tracking-wider">Thời gian còn lại</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={extendSession}
            className="flex-1 bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider uppercase gap-2"
            data-testid="button-extend-session"
          >
            <RefreshCw className="w-4 h-4" />
            Gia hạn phiên
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/10 hover:border-white/40 rounded-none font-light tracking-wider uppercase gap-2"
            data-testid="button-logout-session"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
