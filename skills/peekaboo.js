module.exports = { skill_peekaboo };

function skill_peekaboo() {
  return {
    name: "Peekaboo",
    description: "macOS screen capture and window visibility tool — peek at window content and screen state",
    when: "Capturing specific application windows, checking what's on screen, monitoring desktop state",
    commands: {
      screencapture: {
        fullScreen: "screencapture ~/Desktop/screen.png",
        specificDisplay: "screencapture -D 2 ~/Desktop/display2.png",
        toClipboard: "screencapture -c",
        timedCapture: "screencapture -T 3 ~/Desktop/timed.png",
        windowNoShadow: "screencapture -wo ~/Desktop/window.png"
      },
      applescript: {
        listWindows: `osascript -e 'tell application "System Events"
  set windowList to {}
  repeat with p in application processes
    if visible of p is true then
      set end of windowList to name of p
    end if
  end repeat
  return windowList
end tell'`,
        windowBounds: `osascript -e 'tell application "Safari" to get bounds of window 1'`
      },
      peekaboo: {
        listWindows: "peekaboo list-windows",
        captureApp: 'peekaboo capture "Safari"',
        watchApp: 'peekaboo watch --app "Terminal"'
      }
    },
    notes: [
      "macOS only",
      "Accessibility permission may be needed for window capture",
      "screencapture -l <windowID> for specific window by ID",
      "Use -x for just window contents without shadow"
    ],
    alternatives: {
      local: ["macOS screencapture (built-in)", "AppleScript automation"],
      free: ["screencapture CLI (free)", "osascript (free)"]
    }
  };
}