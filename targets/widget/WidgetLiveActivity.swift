import ActivityKit
import WidgetKit
import SwiftUI
import Foundation
import os.log

extension OSLog {
    static let subsystem = Bundle.main.bundleIdentifier!
    static let network = OSLog(subsystem: subsystem, category: "Network")
    static let debug = OSLog(subsystem: subsystem, category: "Debug")
    static let info = OSLog(subsystem: subsystem, category: "Info")
    static let error = OSLog(subsystem: subsystem, category: "Error")
}

struct Log {
    /**
     # (e) Level
     - Authors : suni
     - debug : 디버깅 로그
     - info : 문제 해결 정보
     - network : 네트워크 정보
     - error :  오류
     - custom(category: String) : 커스텀 디버깅 로그
     */
    enum Level {
        /// 디버깅 로그
        case debug
        /// 문제 해결 정보
        case info
        /// 네트워크 로그
        case network
        /// 오류 로그
        case error
        case custom(category: String)
        
        fileprivate var category: String {
            switch self {
            case .debug:
                return "🟡 DEBUG"
            case .info:
                return "🟠 INFO"
            case .network:
                return "🔵 NETWORK"
            case .error:
                return "🔴 ERROR"
            case .custom(let category):
                return "🟢 \(category)"
            }
        }
        
        fileprivate var osLog: OSLog {
            switch self {
            case .debug:
                return OSLog.debug
            case .info:
                return OSLog.info
            case .network:
                return OSLog.network
            case .error:
                return OSLog.error
            case .custom:
                return OSLog.debug
            }
        }
        
        fileprivate var osLogType: OSLogType {
            switch self {
            case .debug:
                return .debug
            case .info:
                return .info
            case .network:
                return .default
            case .error:
                return .error
            case .custom:
                return .debug
            }
        }
    }
    
    static private func log(_ message: Any, _ arguments: [Any], level: Level) {
        #if DEBUG
        if #available(iOS 14.0, *) {
            let extraMessage: String = arguments.map({ String(describing: $0) }).joined(separator: " ")
            let logger = Logger(subsystem: OSLog.subsystem, category: level.category)
            let logMessage = "\(message) \(extraMessage)"
            switch level {
            case .debug,
                 .custom:
                logger.debug("\(logMessage, privacy: .public)")
            case .info:
                logger.info("\(logMessage, privacy: .public)")
            case .network:
                logger.log("\(logMessage, privacy: .public)")
            case .error:
                logger.error("\(logMessage, privacy: .public)")
            }
        } else {
            let extraMessage: String = arguments.map({ String(describing: $0) }).joined(separator: " ")
            os_log("%{public}@", log: level.osLog, type: level.osLogType, "\(message) \(extraMessage)")
        }
        #endif
    }
}

extension Log {
    /**
     # debug
     - Authors : suni
     - Note : 개발 중 코드 디버깅 시 사용할 수 있는 유용한 정보
     */
    static func debug(_ message: Any, _ arguments: Any...) {
        log(message, arguments, level: .debug)
    }

    /**
     # info
     - Authors : suni
     - Note : 문제 해결시 활용할 수 있는, 도움이 되지만 필수적이지 않은 정보
     */
    static func info(_ message: Any, _ arguments: Any...) {
        log(message, arguments, level: .info)
    }

    /**
     # network
     - Authors : suni
     - Note : 네트워크 문제 해결에 필수적인 정보
     */
    static func network(_ message: Any, _ arguments: Any...) {
        log(message, arguments, level: .network)
    }

    /**
     # error
     - Authors : suni
     - Note : 코드 실행 중 나타난 에러
     */
    static func error(_ message: Any, _ arguments: Any...) {
        log(message, arguments, level: .error)
    }

    /**
     # custom
     - Authors : suni
     - Note : 커스텀 디버깅 로그
     */
    static func custom(category: String, _ message: Any, _ arguments: Any...) {
        log(message, arguments, level: .custom(category: category))
    }
}

enum ChefTheme {
    static let primary   = Color(hex: "#FF7A45")
    static let accent    = Color(hex: "#FFC08A")
    static let mint      = Color(hex: "#7ED9B8")
    static let onDark    = Color.white
    static let subtext   = Color.white.opacity(0.7)
    static let cornerR   : CGFloat = 18
    static let glassWhite = Color.white.opacity(0.15)
    static let glassBorder = Color.white.opacity(0.2)
    static let glassText = Color.white
    static let glassSubtext = Color.white.opacity(0.85)
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0; Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:(a, r, g, b) = (1, 1, 1, 0)
        }
        self.init(.sRGB, red: Double(r)/255, green: Double(g)/255, blue: Double(b)/255, opacity: Double(a)/255)
    }
}

struct LiveActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: LiveActivityAttributes.self) { context in
            LockScreenLiveActivityView(context: context) //잠금 화면
                .activityBackgroundTint(.clear)
                .activitySystemActionForegroundColor(ChefTheme.primary)
                .widgetURL(URL(string: context.attributes.deepLink))
        } dynamicIsland: { context in 
            DynamicIsland {
                DynamicIslandExpandedRegion(.bottom) {
                    VStack(alignment: .leading, spacing: 10) {
                        HStack(spacing: 10) {
                            Image("Fox")

                            Text(context.attributes.activityName)
                                .foregroundColor(ChefTheme.onDark)
                                .font(.system(size: 16, weight: .semibold, design: .rounded))
                                .lineLimit(1)
                                .minimumScaleFactor(0.85)

                            Spacer(minLength: 6)
                            StatusChip(state: context.state)
                        }

                        TimerDisplay(state: context.state, size: 26)
                            .frame(maxWidth: .infinity, alignment: .leading)

                        StyledProgress(state: context.state)
                            .frame(maxWidth: .infinity)
                            .frame(height: 5)
                    }
                    .padding(.horizontal, 10)
                }
            } compactLeading: {
                HStack(spacing: 6) {
                    Image("Fox")
                    Text(context.attributes.activityName)
                        .foregroundColor(ChefTheme.onDark)
                        .font(.system(size: 12, weight: .medium, design: .rounded))
                        .lineLimit(1).truncationMode(.tail)
                }
            } compactTrailing: {
                TimerDisplay(state: context.state, size: 12)
            } minimal: {
                Image("Fox")
            }
            .widgetURL(URL(string: context.attributes.deepLink))
        }
    }
}

struct LockScreenLiveActivityView: View {
    let context: ActivityViewContext<LiveActivityAttributes>
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: ChefTheme.cornerR)
                .fill(.ultraThinMaterial)
                .overlay(
                    RoundedRectangle(cornerRadius: ChefTheme.cornerR)
                        .fill(ChefTheme.glassWhite)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: ChefTheme.cornerR)
                        .stroke(ChefTheme.glassBorder, lineWidth: 1)
                )
            VStack(alignment: .leading, spacing: 14) {
                HStack(spacing: 10) {
                    Image("Fox")
                    Text(context.attributes.activityName)
                        .foregroundColor(ChefTheme.onDark)
                        .font(.system(size: 18, weight: .semibold, design: .rounded))
                        .lineLimit(1)
                    Spacer(minLength: 0)
                    StatusChip(state: context.state)
                }
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text("진행률")
                            .font(.system(size: 12, weight: .medium, design: .rounded))
                            .foregroundColor(ChefTheme.subtext)
                    }
                    StyledProgress(state: context.state)
                        .frame(maxWidth: .infinity)
                }
                TimerDisplay(state: context.state, size: 34)
            }
            .padding(16)
        }
    }
}

//진행률 애니메이션 표시.
//멈춤 명령있을 때 멈춰야 함. 이거는 항상 progress가 진행됨.
struct StyledProgress: View {
    let state: LiveActivityAttributes.ContentState
    var body: some View {
        buildContent()
    }

    @ViewBuilder
    private func buildContent() -> some View {
        switch state.getState() {
        case LiveActivityState.ACTIVE:
            if let endDate = state.getEndAt() {
                let adjustedStartDate = endDate.addingTimeInterval(-TimeInterval(state.getTotalSeconds()))
                ProgressView(timerInterval: adjustedStartDate...endDate, countsDown: true) {
                EmptyView()
                } currentValueLabel: {
                    EmptyView()
                }
                .tint(ChefTheme.primary)
                .frame(height: 6)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 2)
                .background(Capsule().fill(Color.white.opacity(0.08)))
                .clipShape(Capsule())
            }else{
                EmptyView()
            }
        case LiveActivityState.PAUSED:
            let progressRate = max(0, min(1, state.getRemainingSeconds() / state.getTotalSeconds()));
            ProgressView(value: progressRate) { EmptyView() } currentValueLabel: { EmptyView() }
            .tint(ChefTheme.primary)
            .frame(height: 6)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 2)
            .background(Capsule().fill(Color.white.opacity(0.08)))
            .clipShape(Capsule())
        
        case LiveActivityState.END:
            Capsule()
                .fill(ChefTheme.primary)
                .frame(height: 6)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 2)
                .background(Capsule().fill(Color.white.opacity(0.08)))
        
        default:
            EmptyView()
        }
    }
}

struct StatusChip: View {
    let state: LiveActivityAttributes.ContentState
    var body: some View {
        let (text, color): (String, Color) = {
            Log.info("TEST1: StatusChip 호출")
            if state.getState() == LiveActivityState.END { return ("완료", ChefTheme.mint) }
            if state.getState() == LiveActivityState.PAUSED { return ("일시정지", ChefTheme.accent) }
            return ("진행중", ChefTheme.primary)
        }()
        return Text(text)
            .font(.system(size: 11, weight: .semibold, design: .rounded))
            .foregroundColor(.black)
            .padding(.horizontal, 10).padding(.vertical, 6)
            .background(Capsule().fill(color))
    }
}

//타이머의 시간을 텍스트로 표시
struct TimerDisplay: View {
    let state: LiveActivityAttributes.ContentState
    let size: CGFloat
    var body: some View {
        buildContent()
    }

    @ViewBuilder
    private func buildContent() -> some View {
        switch state.getState() {
            case LiveActivityState.END:
                HStack(spacing: 8) {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(ChefTheme.mint)
                        .font(.system(size: size * 0.6))
                    Text("완료")
                        .foregroundColor(ChefTheme.mint)
                        .font(.system(size: size, weight: .bold, design: .rounded))
                }
            case LiveActivityState.ACTIVE:
                if let endDate = state.getEndAt() {
                    let adjustedStartDate = endDate.addingTimeInterval(-TimeInterval(state.getTotalSeconds()))
                    Text(timerInterval: adjustedStartDate...endDate, pauseTime: nil, countsDown: true, showsHours: false)
                        .foregroundColor(ChefTheme.onDark)
                        .font(.system(size: size, weight: .medium, design: .rounded))
                        .monospacedDigit()
                }else{
                    EmptyView()
                }
            case LiveActivityState.PAUSED:
                Text(state.getFormattedRemainingTime())
                .foregroundColor(ChefTheme.onDark)
                .font(.system(size: size, weight: .medium, design: .rounded))
                .monospacedDigit()
            default:
                Text("오류")
        }
    }
}


struct ActivityIcon: View {
    let activityIcon: String
    let themeColor: Color
    let size: CGFloat
    var body: some View {
        Image(systemName: activityIcon)
            .font(.system(size: size))
            .foregroundColor(themeColor)
    }
}



// TODO : preview 모드인데 이거 키면 버그 발생해서 만약 사용할거면 버그 수정하고 사용하기.
// extension LiveActivityAttributes {
//     fileprivate static var cookPreview: LiveActivityAttributes { .init(activityName: "요리", deepLink: "cheftory://timer") }
// }
// extension LiveActivityAttributes.ContentState {
//     fileprivate static var runningState: Self { .init(startedAt: Date().addingTimeInterval(-300), pausedAt: nil, duration: 1500, totalPausedTime: 0) }
//     fileprivate static var pausedState: Self  { .init(startedAt: Date().addingTimeInterval(-600), pausedAt: Date().addingTimeInterval(-300), duration: 1500, totalPausedTime: 120) }
//     fileprivate static var almostDoneState: Self { .init(startedAt: Date().addingTimeInterval(-1440), pausedAt: nil, duration: 1500, totalPausedTime: 0) }
//     fileprivate static var completedState: Self { .init(startedAt: Date().addingTimeInterval(-1500), pausedAt: nil, duration: 1500, totalPausedTime: 0) }
// }

// #Preview("Running - Lock Screen", as: .content, using: LiveActivityAttributes.cookPreview, ) { LiveActivityWidget() } contentStates: { LiveActivityAttributes.ContentState.runningState }
// #Preview("Paused - Lock Screen",  as: .content, using: LiveActivityAttributes.cookPreview) { LiveActivityWidget() } contentStates: { LiveActivityAttributes.ContentState.pausedState }
// #Preview("Almost Done - Expanded",as: .dynamicIsland(.expanded), using: LiveActivityAttributes.cookPreview) { LiveActivityWidget() } contentStates: { LiveActivityAttributes.ContentState.almostDoneState }
// #Preview("Completed - Lock Screen",as: .content, using: LiveActivityAttributes.cookPreview) { LiveActivityWidget() } contentStates: { LiveActivityAttributes.ContentState.completedState }
// #Preview("Running - Compact",     as: .dynamicIsland(.compact), using: LiveActivityAttributes.cookPreview) { LiveActivityWidget() } contentStates: { LiveActivityAttributes.ContentState.runningState }
// #Preview("Minimal View",          as: .dynamicIsland(.minimal), using: LiveActivityAttributes.cookPreview) { LiveActivityWidget() } contentStates: { LiveActivityAttributes.ContentState.runningState }
