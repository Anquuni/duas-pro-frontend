let wakeLock: WakeLockSentinel | null = null;

export async function requestWakeLock() {
  try {
    console.log('Trying to activate Wake Lock');
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock activated');

      wakeLock.addEventListener('release', () => {
        console.log('Wake Lock released');
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
      console.log('Wake Lock manually released');
    }
  } catch (err) {
    console.error('Wake Lock Release Error:', err);
  }
}
