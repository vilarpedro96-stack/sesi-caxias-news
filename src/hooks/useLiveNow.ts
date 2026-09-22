import { useEffect, useState } from 'react';

function msUntilNextMidnight(from: Date): number {
  const next = new Date(from);
  next.setHours(24, 0, 0, 0);
  return Math.max(1000, next.getTime() - from.getTime() + 250);
}

export function useLiveNow(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let midnightTimer: ReturnType<typeof setTimeout>;

    const armMidnight = () => {
      midnightTimer = setTimeout(() => {
        setNow(new Date());
        armMidnight();
      }, msUntilNextMidnight(new Date()));
    };

    armMidnight();
    const minuteTimer = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        setNow(new Date());
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearTimeout(midnightTimer);
      clearInterval(minuteTimer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return now;
}
