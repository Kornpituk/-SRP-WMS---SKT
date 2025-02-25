export function handleVisibilityChange(logoutCallback) {
  if (document.visibilityState === 'hidden') {
    setTimeout(() => {
      logoutCallback()
    }, 5 * 60 * 1000) // 5 นาที
  }
}
