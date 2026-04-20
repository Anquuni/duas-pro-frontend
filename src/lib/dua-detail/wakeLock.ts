let wakeLock: WakeLockSentinel | null = null;

export async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');

      wakeLock.addEventListener('release', () => {
      });

      // Re-request bei Sichtbarkeitswechsel
      document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible' && wakeLock == null) {
          await requestWakeLock();
        }
      });
    }
  } catch (err) {
    console.error('Wake Lock Error:', err);
  }
}

export async function releaseWakeLock() {
  try {
    if (wakeLock !== null) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch (err) {
    console.error('Wake Lock Release Error:', err);
  }
}
