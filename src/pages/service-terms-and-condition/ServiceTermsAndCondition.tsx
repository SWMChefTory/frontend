import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useMarketStore } from "@/src/modules/shared/store/marketStore";
import { getTermsOfServiceData } from "@/src/locales/termsOfService";

export default function ServiceTermsAndConditionsPage() {
  const { market, cachedMarket } = useMarketStore();
  const termsOfServiceData = getTermsOfServiceData(market ?? cachedMarket);

  // 조항 렌더링 함수
  const renderSection = (section: any) => {
    return (
      <View key={section.article} style={styles.sectionContainer}>
        <Text style={styles.articleTitle}>
          제{section.article}조({section.title})
        </Text>

        {/* 기본 내용 */}
        {section.content && (
          <Text style={styles.content}>{section.content}</Text>
        )}

        {/* 하위 조항들 */}
        {section.subsections &&
          section.subsections.map((subsection: any, subIndex: any) => (
            <View key={subIndex} style={styles.subsectionContainer}>
              <Text style={styles.subsectionNumber}>{subsection.number}.</Text>
              <Text style={styles.subsectionContent}>{subsection.content}</Text>

              {/* 세부 사항 */}
              {subsection.details && (
                <View style={styles.detailsContainer}>
                  {subsection.details.map((detail: any, detailIndex: any) => (
                    <Text key={detailIndex} style={styles.detailItem}>
                      {detail.letter}. {detail.content}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{termsOfServiceData.title}</Text>
          <Text style={styles.effectiveDate}>
            {termsOfServiceData.effectiveDatePrefix}
            {termsOfServiceData.effectiveDate}
            {termsOfServiceData.effectiveDateSuffix}
          </Text>
        </View>

        {/* 조항들 */}
        {termsOfServiceData.sections.map(renderSection)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 12,
  },
  effectiveDate: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 2,
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c5aa0",
    marginBottom: 12,
    marginTop: 16,
  },
  content: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333333",
    marginBottom: 12,
  },
  subsectionContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  subsectionNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c5aa0",
    marginBottom: 6,
  },
  subsectionContent: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333333",
    marginBottom: 8,
    paddingLeft: 12,
  },
  detailsContainer: {
    marginTop: 8,
    paddingLeft: 20,
  },
  detailItem: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333333",
    marginBottom: 6,
  },
});
