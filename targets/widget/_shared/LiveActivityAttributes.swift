enum LiveActivityState {
    case ACTIVE
    case PAUSED
    case END
}

@available(iOS 16.1, *)
public struct LiveActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        public var state: LiveActivityState

        public var totalSeconds: TimeInterval
        public var endAt: Date
        public var remainingSeconds: TimeInterval
        
        //초 단위
        public init(state: LiveActivityState, totalSeconds : TimeInterval, endAt: Date, remainingSeconds: TimeInterval) {
            self.state = state
            self.totalSeconds = totalSeconds
            self.endAt = endAt
            self.remainingSeconds = remainingSeconds
        }

        public static func createStartTimer(endAt: Date, totalSeconds: TimeInterval) -> ContentState {
            return ContentState(
                state: LiveActivityState.ACTIVE,
                totalSeconds: totalSeconds,
                endAt: endAt,
                remainingSeconds: totalSeconds,
            )
        }

        public func getState() -> LiveActivityState {
          return self.state;
        }

        public func getFormattedRemainingTime() -> String {
            let remaining = getRemainingTimeInSeconds()
            return formatTime(remaining)
        }

        private func getRemainingTimeInSeconds() -> TimeInterval {
            switch state {
            case .ACTIVE:
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
            if state != LiveActivityState.ACTIVE {
                return nil;
            }
            return ContentState(
                state: LiveActivityState.PAUSED,
                endAt: nil,
                totalSeconds: self.totalSeconds,
                remainingSeconds: remainingSeconds,
            )
        }

        public func resumeTimer(endAt: Date) -> ContentState? {
            if state != LiveActivityState.PAUSED {
                return nil;
            }

            return ContentState(
                state: LiveActivityState.ACTIVE,
                endAt: endAt,
                totalSeconds: self.totalSeconds,
                remainingSeconds: nil
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