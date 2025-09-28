import ExpoModulesCore
import ActivityKit
import Foundation

//ActivityAttributes에서는 ContentState를 만들면 context에서 state로 호출해서 씀.
public enum LiveActivityState: Codable {
    case ACTIVE
    case PAUSED
    case END
}

//ActivityAttributes에서는 ContentState를 만들면 context에서 state로 호출해서 씀.
@available(iOS 16.1, *)
public struct LiveActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        public var state: LiveActivityState

        private var totalSeconds: TimeInterval
        private var endAt: Date?
        private var remainingSeconds: TimeInterval
        
        //초 단위
        private init(state: LiveActivityState, totalSeconds : TimeInterval, endAt: Date?, remainingSeconds: TimeInterval) {
            self.state = state
            self.totalSeconds = totalSeconds
            self.endAt = endAt
            self.remainingSeconds = remainingSeconds
        }

        public static func createStartTimer(endAt: Date?, totalSeconds: TimeInterval) -> ContentState? {
            guard totalSeconds > 0  else { return nil }
            guard endAt != nil else { return nil }
            return ContentState(
                state: LiveActivityState.ACTIVE,
                totalSeconds: totalSeconds,
                endAt: endAt,
                remainingSeconds: -1,
            )
        }

        public func getState() -> LiveActivityState {
          return self.state;
        }

        public func getTotalSeconds() -> TimeInterval {
            print("getTotalSeconds 호출 시, totalSeconds:", self.totalSeconds)
            return self.totalSeconds;
        }

        public func getEndAt() -> Date? {
            guard state == LiveActivityState.ACTIVE else { 
                print("ACTIVE가 아닌데 getEndAt 호출")
                return nil }
            print("getEndAt 호출 시, endAt:", self.endAt)
            return self.endAt;
        }

        public func getRemainingSeconds() -> TimeInterval {
            guard state == LiveActivityState.PAUSED else { 
                print("PAUSED가 아닌데 getRemainingSeconds 호출")
                return 0 }
            print("getRemainingSeconds 호출 시, remainingSeconds:", self.remainingSeconds)
            return self.remainingSeconds;
        }

        public func getFormattedRemainingTime() -> String {
            let remaining = getRemainingTimeInSeconds()
            return formatTime(remaining)
        }

        private func getRemainingTimeInSeconds() -> TimeInterval {
            switch state {
            case .ACTIVE:
                print("ACTIVE 상태에서 호출하면 안됨.")
                return 0
            case .PAUSED:
                return remainingSeconds
            default:
                return 0
            }
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

        public func pauseTimer(pausedAt: Date?, remainingSeconds: TimeInterval) -> ContentState? {
            guard pausedAt != nil else {
                print("pausedAt가 nil 상태로 pauseTimer 호출")
                return nil }
            guard state == LiveActivityState.ACTIVE else { 
                print("ACTIVE 상태가 아닌데 pauseTimer 호출")
                return nil }
            guard remainingSeconds > 0 else {
                print("0 이하인데 pauseTimer 호출") 
                return nil }
            return ContentState(
                state: LiveActivityState.PAUSED,
                totalSeconds: self.totalSeconds,
                endAt: nil,
                remainingSeconds: remainingSeconds,
            )
        }

        public func resumeTimer(endAt: Date?) -> ContentState? {
            guard state == LiveActivityState.PAUSED else { 
                print("PAUSED 상태가 아닌데 resumeTimer 호출")
                return nil }
            guard endAt != nil else {
                print("endAt가 nil 상태로 resumeTimer 호출")
                return nil }

            return ContentState(
                state: LiveActivityState.ACTIVE,
                totalSeconds: self.totalSeconds,
                endAt: endAt,
                remainingSeconds: -1,
            )
        }

        public func endTimer() -> ContentState? {
            return ContentState(
                state: LiveActivityState.END,
                totalSeconds: self.totalSeconds,
                endAt: nil,
                remainingSeconds: -1,
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

    //endAt에 Date타입으로 넣으면 매핑 안시켜주기 때문에 매개변수 타입 고정 필수
    AsyncFunction("startActivity") { (activityName: String, endAtMilliSec: Double, totalSeconds: TimeInterval, deepLink: String) async throws -> String in
      // ActivityContent, Activity.request는 16.2+
      guard #available(iOS 16.2, *) else {
        throw NSError(domain: "LiveActivity", code: 2,
                      userInfo: [NSLocalizedDescriptionKey: "Live Activities require iOS 16.2+"])
      }
      guard ActivityAuthorizationInfo().areActivitiesEnabled else {
        throw NSError(domain: "LiveActivity", code: 1,
                      userInfo: [NSLocalizedDescriptionKey: "Live Activities are not enabled"])
      }

      let endAt = Date(timeIntervalSince1970: endAtMilliSec / 1000.0)
      print("[LiveActivity] endAt: \(endAt)")

      let attributes = LiveActivityAttributes(activityName: activityName, deepLink: deepLink)
      guard let state = LiveActivityAttributes.ContentState.createStartTimer(endAt: endAt, totalSeconds: totalSeconds) else { 
        throw NSError(domain: "LiveActivity", code: 3,
                      userInfo: [NSLocalizedDescriptionKey: "startActivity 실패. 매개변수 오류(현재 입력 매개변수 : endAt: \(endAt), totalSeconds: \(totalSeconds))로 추정됨."])
      }
      let content = ActivityContent(state: state, staleDate: nil) //activity 등록
      let activity = try Activity<LiveActivityAttributes>.request(attributes: attributes, content: content, pushType: nil) //activity 시작
      return activity.id
    }

    AsyncFunction("pauseActivity") { (activityId: String?, pausedAtMilliSec: Double, remainingSeconds: TimeInterval) async -> Bool in
      guard #available(iOS 16.2, *) else { return false }
      guard let id = activityId,
            let activity = Activity<LiveActivityAttributes>.activities.first(where: { $0.id == id }) else { return false }
      let current = activity.content.state
      guard current.getState() == LiveActivityState.ACTIVE else { return false }
      let pausedAt = Date(timeIntervalSince1970: pausedAtMilliSec / 1000.0)
      guard let paused = current.pauseTimer(pausedAt: pausedAt, remainingSeconds: remainingSeconds) else { return false }
      let content = ActivityContent(state: paused, staleDate: nil)
      await activity.update(content)
      return true
    }

    //endAt에 Date타입으로 넣으면 매핑 안시켜주기 때문에 매개변수 타입 고정 필수
    AsyncFunction("resumeActivity") { (activityId: String?, endAtMilliSec: Double) async -> Bool in
      guard #available(iOS 16.2, *) else { return false }
      let endAt = Date(timeIntervalSince1970: endAtMilliSec / 1000.0)
      guard let id = activityId,
            let activity = Activity<LiveActivityAttributes>.activities.first(where: { $0.id == id }) else { return false }
      let current = activity.content.state
      guard current.getState() == LiveActivityState.PAUSED else { return false }
      guard let resumed = current.resumeTimer(endAt: endAt) else { return false }
      let content = ActivityContent(state: resumed, staleDate: nil)
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
  }
}
