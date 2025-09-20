import ActivityKit
import Foundation

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

        // 시간 포맷 헬퍼 함수
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

        // 일시정지 해제
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