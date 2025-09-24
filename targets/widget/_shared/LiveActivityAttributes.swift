import Foundation
import ActivityKit

public enum LiveActivityState {
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
            return self.totalSeconds;
        }

        public func getEndAt() -> Date? {
            guard state != LiveActivityState.ACTIVE else { 
                print("ACTIVE가 아닌데 getEndAt 호출")
                return nil }
            return self.endAt;
        }

        public func getRemainingSeconds() -> TimeInterval {
            guard state != LiveActivityState.PAUSED else { 
                print("PAUSED가 아닌데 getRemainingSeconds 호출")
                return 0 }
            return self.remainingSeconds;
        }

        public func getFormattedRemainingTime() -> String {
            let remaining = getRemainingTimeInSeconds()
            return formatTime(remaining)
        }

        private func getRemainingTimeInSeconds() -> TimeInterval {
            switch state {
            case .ACTIVE:
                guard endAt != nil else { return 0 }
                return max(0, endAt.timeIntervalSinceNow)
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

        public func pauseTimer(remainingSeconds: TimeInterval) -> ContentState? {
            guard state == LiveActivityState.ACTIVE else { 
                print("ACTIVE 상태가 아닌데 pauseTimer 호출")
                return nil }
            guard remainingSeconds > 0 else {
                print("0 이하인데 pauseTimer 호출") 
                return nil }
            return ContentState(
                state: LiveActivityState.PAUSED,
                endAt: nil,
                totalSeconds: self.totalSeconds,
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
                endAt: endAt,
                totalSeconds: self.totalSeconds,
                remainingSeconds: -1,
            )
        }

        public func endTimer() -> ContentState? {
            guard state == LiveActivityState.ACTIVE else { 
                print("ACTIVE 상태가 아닌데 endTimer 호출")
                return nil }
            return ContentState(
                state: LiveActivityState.END,
                endAt: nil,
                totalSeconds: self.totalSeconds,
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