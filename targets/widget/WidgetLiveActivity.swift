import ActivityKit
import WidgetKit
import SwiftUI
import Foundation

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
        let timerState = state.getState();
        switch timerState {
        case LiveActivityState.ACTIVE:
            guard let endDate = state.getEndAt() else { return EmptyView() }
            let adjustedStartDate = endDate.addingTimeInterval(-TimeInterval(state.getTotalSeconds()))
            // 활성 상태 - 정상적인 프로그레스 바
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
            
        case LiveActivityState.PAUSED:
            let progressRate = max(0, min(1, state.getRemainingSeconds() / state.getTotalSeconds()));
            // 일시정지 상태 - 다른 색상이나 효과
            ProgressView(value: progressRate) { EmptyView() } currentValueLabel: { EmptyView() }
            .tint(ChefTheme.primary)
            .frame(height: 6)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 2)
            .background(Capsule().fill(Color.white.opacity(0.08)))
            .clipShape(Capsule())
            
        case LiveActivityState.END:
            // 완료 상태 - 채워진 바 또는 다른 표시
            Capsule()
                .fill(ChefTheme.primary)
                .frame(height: 6)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 2)
                .background(Capsule().fill(Color.white.opacity(0.08)))
            
        default:
            // 기본 상태 또는 에러 상태
            EmptyView()
        }

    }
}

struct TimerDisplay: View {
    let state: LiveActivityAttributes.ContentState
    let size: CGFloat
    var body: some View {
        if state.getState() == LiveActivityState.END {
            HStack(spacing: 8) {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundColor(ChefTheme.mint)
                    .font(.system(size: size * 0.6))
                Text("완료")
                    .foregroundColor(ChefTheme.mint)
                    .font(.system(size: size, weight: .bold, design: .rounded))
            }
            .onAppear { autoEndActivity() }
        } else if state.getState() == LiveActivityState.ACTIVE {//카운트다운 모드
            guard let endDate = state.getEndAt() else { return EmptyView() }
            let adjustedStartDate = endDate.addingTimeInterval(-TimeInterval(state.getTotalSeconds()))
            Text(timerInterval: adjustedStartDate...endDate, pauseTime: nil, countsDown: true, showsHours: false)
                .foregroundColor(ChefTheme.onDark)
                .font(.system(size: size, weight: .medium, design: .rounded))
                .monospacedDigit()
        } else {
            Text(state.getFormattedRemainingTime())
                .foregroundColor(ChefTheme.onDark)
                .font(.system(size: size, weight: .medium, design: .rounded))
                .monospacedDigit()
        }
    }
    private func autoEndActivity() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            Task {
                if let a = Activity<LiveActivityAttributes>.activities.first {
                    await a.end(ActivityContent(state: state, staleDate: nil), dismissalPolicy: .default)
                }
            }
        }
    }
}

struct StatusChip: View {
    let state: LiveActivityAttributes.ContentState
    var body: some View {
        let (text, color): (String, Color) = {
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
