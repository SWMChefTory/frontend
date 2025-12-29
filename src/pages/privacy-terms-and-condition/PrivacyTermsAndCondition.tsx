import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useMarketStore } from "@/src/modules/shared/store/marketStore";
import { getPrivacyPolicyData } from "@/src/locales/privacyPolicy";

const PrivacyTermsAndConditionsPage = () => {
  const { market, cachedMarket } = useMarketStore();
  const privacyPolicyData = getPrivacyPolicyData(market ?? cachedMarket);

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

        {/* 항목 리스트 */}
        {section.items && (
          <View style={styles.itemsContainer}>
            {section.items.map((item: any, index: any) => (
              <Text key={index} style={styles.item}>
                {index + 1}. {item}
              </Text>
            ))}
          </View>
        )}

        {/* 브라우저 리스트 (쿠키 설정용) */}
        {section.browsers && (
          <View style={styles.itemsContainer}>
            {section.browsers.map((browser: any, index: any) => (
              <Text key={index} style={styles.item}>
                • {browser}
              </Text>
            ))}
          </View>
        )}

        {/* 카테고리 (법령에 따른 보유기간용) */}
        {section.categories &&
          section.categories.map((category: any, catIndex: any) => (
            <View key={catIndex} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category.category}</Text>
              {category.items.map((item: any, itemIndex: any) => (
                <Text key={itemIndex} style={styles.categoryItem}>
                  {item.detail}. {item.content}
                </Text>
              ))}
            </View>
          ))}

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

              {/* 기관 정보 */}
              {subsection.organizations && (
                <View style={styles.organizationsContainer}>
                  {subsection.organizations.map((org: any, orgIndex: any) => (
                    <Text key={orgIndex} style={styles.organizationItem}>
                      • {org.name}: {org.phone} ({org.website})
                    </Text>
                  ))}
                </View>
              )}

              {/* 추가 정보 */}
              {subsection.additionalInfo && (
                <Text style={styles.additionalInfo}>
                  {subsection.additionalInfo}
                </Text>
              )}
            </View>
          ))}

        {/* 책임자 정보 */}
        {section.responsiblePerson && (
          <View style={styles.responsiblePersonContainer}>
            <Text style={styles.responsiblePersonItem}>
              성명: {section.responsiblePerson.name}
            </Text>
            <Text style={styles.responsiblePersonItem}>
              직책: {section.responsiblePerson.position}
            </Text>
            <Text style={styles.responsiblePersonItem}>
              전화번호: {section.responsiblePerson.phone}
            </Text>
            <Text style={styles.responsiblePersonItem}>
              이메일: {section.responsiblePerson.email}
            </Text>
          </View>
        )}
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
          <Text style={styles.title}>{privacyPolicyData.title}</Text>
          <Text style={styles.effectiveDate}>
            {privacyPolicyData.effectiveDatePrefix}
            {privacyPolicyData.effectiveDate}
            {privacyPolicyData.effectiveDateSuffix}
          </Text>
        </View>

        {/* 조항들 */}
        {privacyPolicyData.sections.map(renderSection)}
      </ScrollView>
    </SafeAreaView>
  );
};

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
    // borderBottomColor: '#e0e0e0',
    // backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 8,
  },
  effectiveDate: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
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
  itemsContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  item: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333333",
    marginBottom: 6,
    paddingLeft: 8,
  },
  categoryContainer: {
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 6,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c5aa0",
    marginBottom: 8,
  },
  categoryItem: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333333",
    marginBottom: 4,
    paddingLeft: 12,
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
  organizationsContainer: {
    marginTop: 8,
    paddingLeft: 20,
  },
  organizationItem: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333333",
    marginBottom: 4,
  },
  additionalInfo: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666666",
    marginTop: 8,
    paddingLeft: 20,
    fontStyle: "italic",
  },
  responsiblePersonContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: "#e8f4fd",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2c5aa0",
  },
  responsiblePersonItem: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333333",
    marginBottom: 4,
  },
});

export default PrivacyTermsAndConditionsPage;
