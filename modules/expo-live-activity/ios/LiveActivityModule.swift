import ExpoModulesCore
import ActivityKit
import Foundation


import ActivityKit
import Foundation

@available(iOS 16.1, *)
public struct LiveActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        public var startedAt: Date
        public var pausedAt: Date?
        public var duration: TimeInterval
        public var totalPausedTime: TimeInterval

        public init(startedAt: Date, pausedAt: Date?, duration: TimeInterval, totalPausedTime: TimeInterval = 0) {
            self.startedAt = startedAt
            self.pausedAt = pausedAt
            self.duration = max(1, duration)
            self.totalPausedTime = totalPausedTime
        }

        func getElapsedTimeInSeconds() -> TimeInterval {
            let currentTime = pausedAt ?? Date()
            let rawElapsed = currentTime.timeIntervalSince(startedAt)
            return max(0, rawElapsed - totalPausedTime)
        }

        func getRemainingTimeInSeconds() -> TimeInterval {
            let elapsed = getElapsedTimeInSeconds()
            return max(0, duration - elapsed)
        }

        public func getProgress() -> Double {
            let elapsed = getElapsedTimeInSeconds()
            return min(100.0, max(0.0, (elapsed / duration) * 100.0))
        }

        public func isCompleted() -> Bool {
            return getElapsedTimeInSeconds() >= duration
        }

        public func isRunning() -> Bool {
            return pausedAt == nil && !isCompleted()
        }

        public func getCurrentState() -> String {
            if isCompleted() {
                return "finished"
            } else if pausedAt != nil {
                return "paused"
            } else {
                return "active"
            }
        }

        public func getFormattedRemainingTime() -> String {
            let remaining = getRemainingTimeInSeconds()
            return formatTime(remaining)
        }

        private func formatTime(_ timeInterval: TimeInterval) -> String {
            let totalSeconds = Int(timeInterval)
            let hours = totalSeconds / 3600
            let minutes = (totalSeconds % 3600) / 60
            let seconds = totalSeconds % 60

            if hours > 0 {
                return String(format: "%d:%02d:%02d", hours, minutes, seconds)
            } else {
                return String(format: "%d:%02d", minutes, seconds)
            }
        }

        public func getFutureDate() -> Date {
            let remainingTime = getRemainingTimeInSeconds()
            return Date().addingTimeInterval(remainingTime + 300)
        }

        public func pauseTimer() -> ContentState {
            return ContentState(
                startedAt: startedAt,
                pausedAt: Date(),
                duration: duration,
                totalPausedTime: totalPausedTime
            )
        }

        public func resumeTimer() -> ContentState {
            guard let pausedTime = pausedAt else { return self }

            let pauseDuration = max(0, Date().timeIntervalSince(pausedTime))
            return ContentState(
                startedAt: startedAt,
                pausedAt: nil,
                duration: duration,
                totalPausedTime: totalPausedTime + pauseDuration
            )
        }
    }

    public let activityName: String
    public let deepLink: String

    public init(activityName: String, deepLink: String) {
        self.activityName = activityName
        self.deepLink = deepLink
    }
}

import ExpoModulesCore
import ActivityKit
import Foundation

public class LiveActivityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoLiveActivity")

    Function("isLiveActivityAvailable") {
      if #available(iOS 16.1, *) {
        return ActivityAuthorizationInfo().areActivitiesEnabled
      } else {
        return false
      }
    }

    AsyncFunction("startActivity") { (activityName: String, duration: Double, deepLink: String) async throws -> String in
      // ActivityContent, Activity.request는 16.2+
      guard #available(iOS 16.2, *) else {
        throw NSError(domain: "LiveActivity", code: 2,
                      userInfo: [NSLocalizedDescriptionKey: "Live Activities require iOS 16.2+"])
      }
      guard ActivityAuthorizationInfo().areActivitiesEnabled else {
        throw NSError(domain: "LiveActivity", code: 1,
                      userInfo: [NSLocalizedDescriptionKey: "Live Activities are not enabled"])
      }

      let attributes = LiveActivityAttributes(activityName: activityName, deepLink: deepLink)
      let state = LiveActivityAttributes.ContentState(startedAt: Date(), pausedAt: nil, duration: duration, totalPausedTime: 0)
      let content = ActivityContent(state: state, staleDate: state.getFutureDate())
      let activity = try Activity<LiveActivityAttributes>.request(attributes: attributes, content: content, pushType: nil)
      return activity.id
    }

    AsyncFunction("pauseActivity") { (activityId: String?) async -> Bool in
      guard #available(iOS 16.2, *) else { return false }
      guard let id = activityId,
            let activity = Activity<LiveActivityAttributes>.activities.first(where: { $0.id == id }) else { return false }
      let current = activity.content.state
      guard current.isRunning() else { return false }
      let paused = current.pauseTimer()
      let content = ActivityContent(state: paused, staleDate: paused.getFutureDate())
      await activity.update(content)
      return true
    }

    AsyncFunction("resumeActivity") { (activityId: String?) async -> Bool in
      guard #available(iOS 16.2, *) else { return false }
      guard let id = activityId,
            let activity = Activity<LiveActivityAttributes>.activities.first(where: { $0.id == id }) else { return false }
      let current = activity.content.state
      guard !current.isRunning() && !current.isCompleted() else { return false }
      let resumed = current.resumeTimer()
      let content = ActivityContent(state: resumed, staleDate: resumed.getFutureDate())
      await activity.update(content)
      return true
    }

    AsyncFunction("endActivity") { (activityId: String?) async -> Bool in
      guard #available(iOS 16.2, *) else { return false }
      guard let id = activityId,
            let activity = Activity<LiveActivityAttributes>.activities.first(where: { $0.id == id }) else { return false }
      let finalState = activity.content.state
      let finalContent = ActivityContent(state: finalState, staleDate: nil)
      await activity.end(finalContent, dismissalPolicy: .immediate)
      return true
    }

    AsyncFunction("updatePayload") { (activityId: String, payload: [String: Any]) async -> Bool in
      guard #available(iOS 16.2, *) else { return false }
      guard let activity = Activity<LiveActivityAttributes>.activities.first(where: { $0.id == activityId }) else { return false }

      func num(_ any: Any?) -> Double? {
        if let d = any as? Double { return d }
        if let i = any as? Int { return Double(i) }
        if let n = any as? NSNumber { return n.doubleValue }
        if let s = any as? String, let d = Double(s) { return d }
        return nil
      }

      guard let durationSec = num(payload["duration"]), durationSec > 0 else { return false }
      guard let remainingSecRaw = num(payload["remainingTime"]) else { return false }
      let remainingSec = max(0, min(durationSec, remainingSecRaw))

      let now = Date()
      let pausedAtMs = num(payload["pausedAt"])
      let pausedDate: Date? = pausedAtMs != nil ? Date(timeIntervalSince1970: (pausedAtMs! / 1000.0)) : nil
      let reference: Date = pausedDate ?? now

      let prev = activity.content.state
      let extraPaused: TimeInterval = {
        if let prevPaused = prev.pausedAt {
          return max(0, reference.timeIntervalSince(prevPaused))
        }
        return 0
      }()
      let accumulatedPaused = max(0, prev.totalPausedTime + extraPaused)
      let effectiveElapsed = max(0, min(durationSec, durationSec - remainingSec))
      let startedDate = reference.addingTimeInterval(-(effectiveElapsed + accumulatedPaused))

      let newState = LiveActivityAttributes.ContentState(startedAt: startedDate, pausedAt: pausedDate, duration: durationSec, totalPausedTime: accumulatedPaused)
      let content = ActivityContent(state: newState, staleDate: newState.getFutureDate())
      await activity.update(content)
      return true
    }
  }
}
