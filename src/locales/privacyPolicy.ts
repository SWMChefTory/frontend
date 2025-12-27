import type { Market } from "@/src/modules/shared/types/market";

export interface PrivacyPolicyDetail {
  letter: string;
  content: string;
}

export interface PrivacyPolicySubsection {
  number: number;
  content: string;
  details?: PrivacyPolicyDetail[];
  organizations?: Array<{
    name: string;
    phone: string;
    website: string;
  }>;
  additionalInfo?: string;
}

export interface PrivacyPolicyCategory {
  category: string;
  items: Array<{
    detail: string;
    content: string;
  }>;
}

export interface PrivacyPolicySection {
  article: number;
  title: string;
  content?: string;
  items?: string[];
  browsers?: string[];
  categories?: PrivacyPolicyCategory[];
  subsections?: PrivacyPolicySubsection[];
  responsiblePerson?: {
    name: string;
    position: string;
    phone: string;
    email: string;
  };
}

export interface PrivacyPolicyData {
  title: string;
  effectiveDate: string;
  effectiveDatePrefix: string;
  effectiveDateSuffix: string;
  sections: PrivacyPolicySection[];
}

export const PRIVACY_POLICY: Record<Market, PrivacyPolicyData> = {
  KOREA: {
    title: "개인정보처리방침",
    effectiveDate: "2025.08.29",
    effectiveDatePrefix: "시행일자: ",
    effectiveDateSuffix: "부터 시행됩니다.",
    sections: [
      {
        article: 1,
        title: "목적",
        content:
          "쉐프토리(이하 '회사'라고 함)는 회사가 제공하고자 하는 서비스(이하 '회사 서비스')를 이용하는 개인(이하 '이용자' 또는 '개인')의 정보(이하 '개인정보')를 보호하기 위해, 개인정보보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 '정보통신망법') 등 관련 법령을 준수하고, 서비스 이용자의 개인정보 보호 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침(이하 '본 방침')을 수립합니다.",
      },
      {
        article: 2,
        title: "개인정보 처리의 원칙",
        content:
          "개인정보 관련 법령 및 본 방침에 따라 회사는 이용자의 개인정보를 수집할 수 있으며 수집된 개인정보는 개인의 동의가 있는 경우에 한해 제3자에게 제공할 수 있습니다. 단, 법령의 규정 등에 의해 적법하게 강제되는 경우 회사는 수집한 이용자의 개인정보를 사전에 개인의 동의 없이 제3자에게 제공할 수도 있습니다.",
      },
      {
        article: 3,
        title: "본 방침의 공개",
        subsections: [
          {
            number: 1,
            content:
              "회사는 이용자가 언제든지 쉽게 본 방침을 확인할 수 있도록 회사 홈페이지 첫 화면 또는 첫 화면과의 연결화면을 통해 본 방침을 공개하고 있습니다.",
          },
          {
            number: 2,
            content:
              "회사는 제1항에 따라 본 방침을 공개하는 경우 글자 크기, 색상 등을 활용하여 이용자가 본 방침을 쉽게 확인할 수 있도록 합니다.",
          },
        ],
      },
      {
        article: 4,
        title: "본 방침의 변경",
        subsections: [
          {
            number: 1,
            content:
              "본 방침은 개인정보 관련 법령, 지침, 고시 또는 정부나 회사 서비스의 정책이나 내용의 변경에 따라 개정될 수 있습니다.",
          },
          {
            number: 2,
            content:
              "회사는 제1항에 따라 본 방침을 개정하는 경우 다음 각 호 하나 이상의 방법으로 공지합니다.",
            details: [
              {
                letter: "가",
                content:
                  "회사가 운영하는 인터넷 홈페이지의 첫 화면의 공지사항란 또는 별도의 창을 통하여 공지하는 방법",
              },
              {
                letter: "나",
                content:
                  "서면·모사전송·전자우편 또는 이와 비슷한 방법으로 이용자에게 공지하는 방법",
              },
            ],
          },
          {
            number: 3,
            content:
              "회사는 제2항의 공지는 본 방침 개정의 시행일로부터 최소 7일 이전에 공지합니다. 다만, 이용자 권리의 중요한 변경이 있을 경우에는 최소 30일 전에 공지합니다.",
          },
        ],
      },
      {
        article: 5,
        title: "회원 가입을 위한 정보",
        content:
          "회사는 이용자의 회사 서비스에 대한 회원가입을 위하여 다음과 같은 정보를 수집합니다.",
        items: [
          "필수 수집 정보: 닉네임 및 생년월일",
          "선택 수집 정보: 음성 키워드(토리아)",
        ],
      },
      {
        article: 6,
        title: "기타 수집 정보",
        content: "회사는 아래와 같이 정보를 수집합니다.",
        items: [
          "수집목적: 레시피 이용 패턴 학습, 모델 학습",
          "수집정보: 음성 명령",
        ],
      },
      {
        article: 7,
        title: "개인정보 수집 방법",
        content: "회사는 다음과 같은 방법으로 이용자의 개인정보를 수집합니다.",
        items: [
          "이용자가 회사의 홈페이지에 자신의 개인정보를 입력하는 방식",
          "어플리케이션 등 회사가 제공하는 홈페이지 외의 서비스 등에 이용자가 자신의 개인정보를 입력하는 방식",
          "레시피를 조작할 때 사용자의 음성",
        ],
      },
      {
        article: 8,
        title: "개인정보의 이용",
        content: "회사는 개인정보를 다음 각 호의 경우에 이용합니다.",
        items: [
          "공지사항의 전달 등 회사운영에 필요한 경우",
          "이용문의에 대한 회신, 불만의 처리 등 이용자에 대한 서비스 개선을 위한 경우",
          "회사의 서비스를 제공하기 위한 경우",
          "법령 및 회사 약관을 위반하는 회원에 대한 이용 제한 조치, 부정 이용 행위를 포함하여 서비스의 원활한 운영에 지장을 주는 행위에 대한 방지 및 제재를 위한 경우",
          "신규 서비스 개발을 위한 경우",
        ],
      },
      {
        article: 9,
        title: "개인정보의 보유 및 이용기간",
        subsections: [
          {
            number: 1,
            content:
              "회사는 이용자의 개인정보에 대해 개인정보의 수집·이용 목적 달성을 위한 기간 동안 개인정보를 보유 및 이용합니다.",
          },
          {
            number: 2,
            content:
              "전항에도 불구하고 회사는 내부 방침에 의해 서비스 부정이용기록은 부정 가입 및 이용 방지를 위하여 회원 탈퇴 시점으로부터 최대 1년간 보관합니다.",
          },
        ],
      },
      {
        article: 10,
        title: "법령에 따른 개인정보의 보유 및 이용기간",
        content:
          "회사는 관계법령에 따라 다음과 같이 개인정보를 보유 및 이용합니다.",
        categories: [
          {
            category:
              "전자상거래 등에서의 소비자보호에 관한 법률에 따른 보유정보 및 보유기간",
            items: [
              {
                detail: "가",
                content: "계약 또는 청약철회 등에 관한 기록 : 5년",
              },
              {
                detail: "나",
                content: "대금결제 및 재화 등의 공급에 관한 기록 : 5년",
              },
              {
                detail: "다",
                content: "소비자의 불만 또는 분쟁처리에 관한 기록 : 3년",
              },
              { detail: "라", content: "표시·광고에 관한 기록 : 6개월" },
            ],
          },
          {
            category: "통신비밀보호법에 따른 보유정보 및 보유기간",
            items: [{ detail: "가", content: "웹사이트 로그 기록 자료 : 3개월" }],
          },
          {
            category: "전자금융거래법에 따른 보유정보 및 보유기간",
            items: [{ detail: "가", content: "전자금융거래에 관한 기록 : 5년" }],
          },
          {
            category: "위치정보의 보호 및 이용 등에 관한 법률",
            items: [
              { detail: "가", content: "개인위치정보에 관한 기록 : 6개월" },
            ],
          },
        ],
      },
      {
        article: 11,
        title: "개인정보의 파기원칙",
        content:
          "회사는 원칙적으로 이용자의 개인정보 처리 목적의 달성, 보유·이용기간의 경과 등 개인정보가 필요하지 않을 경우에는 해당 정보를 지체 없이 파기합니다.",
      },
      {
        article: 12,
        title: "개인정보파기절차",
        subsections: [
          {
            number: 1,
            content:
              "이용자가 회원가입 등을 위해 입력한 정보는 개인정보 처리 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기 되어집니다.",
          },
          {
            number: 2,
            content:
              "회사는 파기 사유가 발생한 개인정보를 개인정보보호 책임자의 승인절차를 거쳐 파기합니다.",
          },
        ],
      },
      {
        article: 13,
        title: "개인정보파기방법",
        content:
          "회사는 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이로 출력된 개인정보는 분쇄기로 분쇄하거나 소각 등을 통하여 파기합니다.",
      },
      {
        article: 14,
        title: "광고성 정보의 전송 조치",
        subsections: [
          {
            number: 1,
            content:
              "회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우 이용자의 명시적인 사전동의를 받습니다. 다만, 다음 각호 어느 하나에 해당하는 경우에는 사전 동의를 받지 않습니다.",
            details: [
              {
                letter: "가",
                content:
                  "회사가 재화 등의 거래관계를 통하여 수신자로부터 직접 연락처를 수집한 경우, 거래가 종료된 날로부터 6개월 이내에 회사가 처리하고 수신자와 거래한 것과 동종의 재화 등에 대한 영리목적의 광고성 정보를 전송하려는 경우",
              },
              {
                letter: "나",
                content:
                  "「방문판매 등에 관한 법률」에 따른 전화권유판매자가 육성으로 수신자에게 개인정보의 수집출처를 고지하고 전화권유를 하는 경우",
              },
            ],
          },
          {
            number: 2,
            content:
              "회사는 전항에도 불구하고 수신자가 수신거부의사를 표시하거나 사전 동의를 철회한 경우에는 영리목적의 광고성 정보를 전송하지 않으며 수신거부 및 수신동의 철회에 대한 처리 결과를 알립니다.",
          },
          {
            number: 3,
            content:
              "회사는 오후 9시부터 그 다음 날 오전 8시까지의 시간에 전자적 전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우에는 제1항에도 불구하고 그 수신자로부터 별도의 사전 동의를 받습니다.",
          },
          {
            number: 4,
            content:
              "회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우 다음의 사항 등을 광고성 정보에 구체적으로 밝힙니다.",
            details: [
              { letter: "가", content: "회사명 및 연락처" },
              {
                letter: "나",
                content:
                  "수신 거부 또는 수신 동의의 철회 의사표시에 관한 사항의 표시",
              },
            ],
          },
          {
            number: 5,
            content:
              "회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우 다음 각 호의 어느 하나에 해당하는 조치를 하지 않습니다.",
            details: [
              {
                letter: "가",
                content:
                  "광고성 정보 수신자의 수신거부 또는 수신동의의 철회를 회피·방해하는 조치",
              },
              {
                letter: "나",
                content:
                  "숫자·부호 또는 문자를 조합하여 전화번호·전자우편주소 등 수신자의 연락처를 자동으로 만들어 내는 조치",
              },
              {
                letter: "다",
                content:
                  "영리목적의 광고성 정보를 전송할 목적으로 전화번호 또는 전자우편주소를 자동으로 등록하는 조치",
              },
              {
                letter: "라",
                content:
                  "광고성 정보 전송자의 신원이나 광고 전송 출처를 감추기 위한 각종 조치",
              },
              {
                letter: "마",
                content:
                  "영리목적의 광고성 정보를 전송할 목적으로 수신자를 기망하여 회신을 유도하는 각종 조치",
              },
            ],
          },
        ],
      },
      {
        article: 15,
        title: "개인정보 조회 및 수집동의 철회",
        subsections: [
          {
            number: 1,
            content:
              "이용자 및 법정 대리인은 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 개인정보수집 동의 철회를 요청할 수 있습니다.",
          },
          {
            number: 2,
            content:
              "이용자 및 법정 대리인은 자신의 가입정보 수집 등에 대한 동의를 철회하기 위해서는 개인정보보호책임자 또는 담당자에게 서면, 전화 또는 전자우편주소로 연락하시면 회사는 지체 없이 조치하겠습니다.",
          },
        ],
      },
      {
        article: 16,
        title: "개인정보 정보변경 등",
        subsections: [
          {
            number: 1,
            content:
              "이용자는 회사에게 전조의 방법을 통해 개인정보의 오류에 대한 정정을 요청할 수 있습니다.",
          },
          {
            number: 2,
            content:
              "회사는 전항의 경우에 개인정보의 정정을 완료하기 전까지 개인정보를 이용 또는 제공하지 않으며 잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체 없이 통지하여 정정이 이루어지도록 하겠습니다.",
          },
        ],
      },
      {
        article: 17,
        title: "이용자의 의무",
        subsections: [
          {
            number: 1,
            content:
              "이용자는 자신의 개인정보를 최신의 상태로 유지해야 하며, 이용자의 부정확한 정보 입력으로 발생하는 문제의 책임은 이용자 자신에게 있습니다.",
          },
          {
            number: 2,
            content:
              "타인의 개인정보를 도용한 회원가입의 경우 이용자 자격을 상실하거나 관련 개인정보보호 법령에 의해 처벌받을 수 있습니다.",
          },
          {
            number: 3,
            content:
              "이용자는 전자우편주소, 비밀번호 등에 대한 보안을 유지할 책임이 있으며 제3자에게 이를 양도하거나 대여할 수 없습니다.",
          },
        ],
      },
      {
        article: 18,
        title: "개인정보 유출 등에 대한 조치",
        content:
          '회사는 개인정보의 분실·도난·유출(이하 "유출 등"이라 한다) 사실을 안 때에는 지체 없이 다음 각 호의 모든 사항을 해당 이용자에게 알리고 방송통신위원회 또는 한국인터넷진흥원에 신고합니다.',
        items: [
          "유출 등이 된 개인정보 항목",
          "유출 등이 발생한 시점",
          "이용자가 취할 수 있는 조치",
          "정보통신서비스 제공자 등이 대응 조치",
          "이용자가 상담 등을 접수할 수 있는 부서 및 연락처",
        ],
      },
      {
        article: 19,
        title: "개인정보 유출 등에 대한 조치의 예외",
        content:
          "회사는 전조에도 불구하고 이용자의 연락처를 알 수 없는 등 정당한 사유가 있는 경우에는 회사의 홈페이지에 30일 이상 게시하는 방법으로 전조의 통지를 갈음하는 조치를 취할 수 있습니다.",
      },
      {
        article: 20,
        title: "국외 이전 개인정보의 보호",
        subsections: [
          {
            number: 1,
            content:
              "회사는 이용자의 개인정보에 관하여 개인정보보호법 등 관계 법규를 위반하는 사항을 내용으로 하는 국제계약을 체결하지 않습니다.",
          },
          {
            number: 2,
            content:
              '회사는 이용자의 개인정보를 국외에 제공(조회되는 경우를 포함)·처리위탁·보관(이하 "이전"이라 함)하려면 이용자의 동의를 받습니다. 다만, 본조 제3항 각 호의 사항 모두를 개인정보보호법 등 관계 법규에 따라 공개하거나 전자우편 등 대통령령으로 정하는 방법에 따라 이용자에게 알린 경우에는 개인정보 처리위탁·보관에 따른 동의절차를 거치지 아니할 수 있습니다.',
          },
          {
            number: 3,
            content:
              "회사는 본조 제2항 본문에 따른 동의를 받아 이전하거나 미리 다음 각 호의 사항 모두를 이용자에게 고지합니다.",
            details: [
              { letter: "가", content: "이전되는 개인정보 항목" },
              {
                letter: "나",
                content: "개인정보가 이전되는 국가, 이전일시 및 이전방법",
              },
              {
                letter: "다",
                content:
                  "개인정보를 이전받는 자의 성명(법인인 경우 그 명칭 및 정보관리 책임자의 연락처를 말한다)",
              },
              {
                letter: "라",
                content:
                  "개인정보를 이전받는 자의 개인정보 이용목적 및 보유·이용 기간",
              },
            ],
          },
          {
            number: 4,
            content:
              "회사는 본조 제2항 본문에 따른 동의를 받아 개인정보를 국외로 이전하는 경우 개인정보보호법 대통령령 등 관계법규에서 정하는 바에 따라 보호조치를 합니다.",
          },
        ],
      },
      {
        article: 21,
        title: "개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항",
        subsections: [
          {
            number: 1,
            content:
              "회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용 정보를 저장하고 수시로 불러오는 개인정보 자동 수집장치(이하 '쿠키')를 사용합니다. 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 웹브라우저(PC 및 모바일을 포함)에게 보내는 소량의 정보이며 이용자의 저장공간에 저장되기도 합니다.",
          },
          {
            number: 2,
            content:
              "이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.",
          },
          {
            number: 3,
            content:
              "다만, 쿠키의 저장을 거부할 경우에는 로그인이 필요한 회사의 일부 서비스는 이용에 어려움이 있을 수 있습니다.",
          },
        ],
      },
      {
        article: 22,
        title: "쿠키 설치 허용 지정 방법",
        content:
          "웹브라우저 옵션 설정을 통해 쿠키 허용, 쿠키 차단 등의 설정을 할 수 있습니다.",
        browsers: [
          "Edge : 웹브라우저 우측 상단의 설정 메뉴 > 쿠키 및 사이트 권한 > 쿠키 및 사이트 데이터 관리 및 삭제",
          "Chrome : 웹브라우저 우측 상단의 설정 메뉴 > 개인정보 및 보안 > 쿠키 및 기타 사이트 데이터",
          "Whale : 웹브라우저 우측 상단의 설정 메뉴 > 개인정보 보호 > 쿠키 및 기타 사이트 데이터",
        ],
      },
      {
        article: 23,
        title: "회사의 개인정보 보호 책임자 지정",
        content:
          "회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보 보호 책임자를 지정하고 있습니다.",
        responsiblePerson: {
          name: "황교준",
          position: "팀장",
          phone: "01040556415",
          email: "hwangkyojun7806@gmail.com",
        },
      },
      {
        article: 24,
        title: "권익침해에 대한 구제방법",
        subsections: [
          {
            number: 1,
            content:
              "정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.",
            organizations: [
              {
                name: "개인정보분쟁조정위원회",
                phone: "(국번없이) 1833-6972",
                website: "www.kopico.go.kr",
              },
              {
                name: "개인정보침해신고센터",
                phone: "(국번없이) 118",
                website: "privacy.kisa.or.kr",
              },
              {
                name: "대검찰청",
                phone: "(국번없이) 1301",
                website: "www.spo.go.kr",
              },
              {
                name: "경찰청",
                phone: "(국번없이) 182",
                website: "ecrm.cyber.go.kr",
              },
            ],
          },
          {
            number: 2,
            content:
              "회사는 정보주체의 개인정보자기결정권을 보장하고, 개인정보침해로 인한 상담 및 피해 구제를 위하여 노력하고 있으며, 신고나 상담이 필요한 경우 제1항의 담당부서로 연락해주시기 바랍니다.",
          },
          {
            number: 3,
            content:
              "개인정보 보호법 제35조(개인정보의 열람), 제36조(개인정보의 정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대 하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의 침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다.",
            additionalInfo:
              "중앙행정심판위원회 : (국번없이) 110 (www.simpan.go.kr)",
          },
        ],
      },
    ],
  },
  GLOBAL: {
    title: "Privacy Policy",
    effectiveDate: "2025.08.29",
    effectiveDatePrefix: "Effective Date: ",
    effectiveDateSuffix: "",
    sections: [
      {
        article: 1,
        title: "Purpose",
        content:
          "Cheftory (hereinafter referred to as 'Company') establishes this Privacy Policy (hereinafter referred to as 'Policy') to protect the personal information of individuals (hereinafter referred to as 'User' or 'Individual') who use the services provided by the Company (hereinafter referred to as 'Company Services'), comply with relevant laws such as the Personal Information Protection Act and the Act on Promotion of Information and Communications Network Utilization and Information Protection (hereinafter referred to as 'Information and Communications Network Act'), and promptly and smoothly handle grievances related to the protection of users' personal information.",
      },
      {
        article: 2,
        title: "Principles of Personal Information Processing",
        content:
          "In accordance with personal information-related laws and this Policy, the Company may collect users' personal information, and collected personal information may be provided to third parties only with individual consent. However, in cases legally mandated by laws and regulations, the Company may provide users' personal information to third parties without prior individual consent.",
      },
      {
        article: 3,
        title: "Disclosure of this Policy",
        subsections: [
          {
            number: 1,
            content:
              "The Company discloses this Policy through the Company's homepage main screen or screens linked to the main screen so that users can easily check this Policy at any time.",
          },
          {
            number: 2,
            content:
              "When disclosing this Policy pursuant to Paragraph 1, the Company uses font size, color, etc. to ensure that users can easily check this Policy.",
          },
        ],
      },
      {
        article: 4,
        title: "Changes to this Policy",
        subsections: [
          {
            number: 1,
            content:
              "This Policy may be amended according to changes in personal information-related laws, guidelines, notifications, or government or Company service policies or contents.",
          },
          {
            number: 2,
            content:
              "When amending this Policy pursuant to Paragraph 1, the Company notifies by one or more of the following methods:",
            details: [
              {
                letter: "a",
                content:
                  "Notice through the announcement section on the main screen of the Company's internet homepage or a separate window",
              },
              {
                letter: "b",
                content:
                  "Notice to users through written notice, facsimile transmission, email, or similar methods",
              },
            ],
          },
          {
            number: 3,
            content:
              "The Company provides the notice in Paragraph 2 at least 7 days prior to the effective date of the Policy amendment. However, in case of important changes to users' rights, the Company provides notice at least 30 days in advance.",
          },
        ],
      },
      {
        article: 5,
        title: "Information for Membership Registration",
        content:
          "The Company collects the following information for users' membership registration for Company Services:",
        items: [
          "Required information: Nickname and date of birth",
          "Optional information: Voice keyword (Toria)",
        ],
      },
      {
        article: 6,
        title: "Other Collection Information",
        content: "The Company collects information as follows:",
        items: [
          "Collection purpose: Recipe usage pattern learning, model training",
          "Collection information: Voice commands",
        ],
      },
      {
        article: 7,
        title: "Personal Information Collection Methods",
        content:
          "The Company collects users' personal information by the following methods:",
        items: [
          "Method where users enter their personal information on the Company's homepage",
          "Method where users enter their personal information on services other than the homepage provided by the Company, such as applications",
          "Users' voice when operating recipes",
        ],
      },
      {
        article: 8,
        title: "Use of Personal Information",
        content:
          "The Company uses personal information in the following cases:",
        items: [
          "When necessary for Company operations, such as delivering notices",
          "For service improvement for users, such as responding to inquiries and handling complaints",
          "To provide Company services",
          "To prevent and sanction acts that interfere with smooth service operation, including measures to restrict use of members who violate laws and Company terms, and fraudulent use",
          "For new service development",
        ],
      },
      {
        article: 9,
        title: "Retention and Use Period of Personal Information",
        subsections: [
          {
            number: 1,
            content:
              "The Company retains and uses users' personal information for the period necessary to achieve the purpose of collecting and using personal information.",
          },
          {
            number: 2,
            content:
              "Notwithstanding the preceding paragraph, the Company retains service misuse records for up to one year from the date of membership withdrawal to prevent fraudulent registration and use according to internal policies.",
          },
        ],
      },
      {
        article: 10,
        title:
          "Retention and Use Period of Personal Information According to Laws",
        content:
          "The Company retains and uses personal information as follows in accordance with relevant laws:",
        categories: [
          {
            category:
              "Information and retention period according to the Act on Consumer Protection in Electronic Commerce",
            items: [
              {
                detail: "a",
                content: "Records on contracts or withdrawal of offers: 5 years",
              },
              {
                detail: "b",
                content:
                  "Records on payment and supply of goods, etc.: 5 years",
              },
              {
                detail: "c",
                content:
                  "Records on consumer complaints or dispute resolution: 3 years",
              },
              {
                detail: "d",
                content: "Records on indication and advertising: 6 months",
              },
            ],
          },
          {
            category:
              "Information and retention period according to the Protection of Communications Secrets Act",
            items: [
              { detail: "a", content: "Website log record data: 3 months" },
            ],
          },
          {
            category:
              "Information and retention period according to the Electronic Financial Transactions Act",
            items: [
              {
                detail: "a",
                content: "Records on electronic financial transactions: 5 years",
              },
            ],
          },
          {
            category:
              "Act on the Protection and Use of Location Information",
            items: [
              {
                detail: "a",
                content: "Records on personal location information: 6 months",
              },
            ],
          },
        ],
      },
      {
        article: 11,
        title: "Principles of Personal Information Destruction",
        content:
          "The Company, in principle, destroys personal information without delay when it is no longer needed, such as when the purpose of processing personal information has been achieved or the retention and use period has elapsed.",
      },
      {
        article: 12,
        title: "Personal Information Destruction Procedures",
        subsections: [
          {
            number: 1,
            content:
              "Information entered by users for membership registration, etc. is transferred to a separate database (separate filing cabinet in case of paper) after the purpose of personal information processing is achieved, and is destroyed after being stored for a certain period according to internal policies and information protection reasons under other relevant laws (refer to retention and use period).",
          },
          {
            number: 2,
            content:
              "The Company destroys personal information for which reasons for destruction have arisen through the approval process of the person responsible for personal information protection.",
          },
        ],
      },
      {
        article: 13,
        title: "Personal Information Destruction Methods",
        content:
          "The Company deletes personal information stored in electronic file format using technical methods that make records irreproducible, and destroys personal information printed on paper by shredding with a shredder or by incineration.",
      },
      {
        article: 14,
        title: "Measures for Transmitting Advertising Information",
        subsections: [
          {
            number: 1,
            content:
              "When transmitting commercial advertising information for profit-making purposes using electronic transmission media, the Company obtains users' explicit prior consent. However, prior consent is not required in any of the following cases:",
            details: [
              {
                letter: "a",
                content:
                  "When the Company directly collects contact information from recipients through transaction relationships for goods, etc., and intends to transmit commercial advertising information for profit-making purposes regarding goods of the same type as those processed by the Company and traded with recipients within 6 months from the date the transaction ended",
              },
              {
                letter: "b",
                content:
                  'When a telephone solicitor under the "Door-to-Door Sales, etc. Act" verbally notifies the recipient of the source of personal information collection and makes a telephone solicitation',
              },
            ],
          },
          {
            number: 2,
            content:
              "Notwithstanding the preceding paragraph, the Company does not transmit commercial advertising information for profit-making purposes when recipients express refusal to receive or withdraw prior consent, and notifies processing results for refusal to receive and withdrawal of consent.",
          },
          {
            number: 3,
            content:
              "When transmitting commercial advertising information for profit-making purposes using electronic transmission media between 9 PM and 8 AM the next day, the Company obtains separate prior consent from recipients notwithstanding Paragraph 1.",
          },
          {
            number: 4,
            content:
              "When transmitting commercial advertising information for profit-making purposes using electronic transmission media, the Company specifically discloses the following matters in the advertising information:",
            details: [
              { letter: "a", content: "Company name and contact information" },
              {
                letter: "b",
                content:
                  "Display of matters regarding expression of refusal to receive or withdrawal of consent to receive",
              },
            ],
          },
          {
            number: 5,
            content:
              "When transmitting commercial advertising information for profit-making purposes using electronic transmission media, the Company does not take any of the following measures:",
            details: [
              {
                letter: "a",
                content:
                  "Measures to avoid or interfere with advertising information recipients' refusal to receive or withdrawal of consent to receive",
              },
              {
                letter: "b",
                content:
                  "Measures to automatically create recipients' contact information such as phone numbers and email addresses by combining numbers, symbols, or letters",
              },
              {
                letter: "c",
                content:
                  "Measures to automatically register phone numbers or email addresses for the purpose of transmitting commercial advertising information for profit-making purposes",
              },
              {
                letter: "d",
                content:
                  "Various measures to hide the identity of advertising information senders or sources of advertising transmission",
              },
              {
                letter: "e",
                content:
                  "Various measures to deceive recipients and induce responses for the purpose of transmitting commercial advertising information for profit-making purposes",
              },
            ],
          },
        ],
      },
      {
        article: 15,
        title: "Personal Information Inquiry and Withdrawal of Collection Consent",
        subsections: [
          {
            number: 1,
            content:
              "Users and legal representatives may inquire or modify their own registered personal information at any time and may request withdrawal of consent to personal information collection.",
          },
          {
            number: 2,
            content:
              "To withdraw consent for collection of their registration information, users and legal representatives may contact the person responsible for personal information protection or the person in charge by mail, telephone, or email, and the Company will take action without delay.",
          },
        ],
      },
      {
        article: 16,
        title: "Personal Information Modification",
        subsections: [
          {
            number: 1,
            content:
              "Users may request correction of errors in personal information to the Company through the method in the preceding article.",
          },
          {
            number: 2,
            content:
              "In the case of the preceding paragraph, the Company does not use or provide personal information until correction of personal information is completed, and if incorrect personal information has already been provided to third parties, the Company promptly notifies third parties of correction processing results to ensure correction is made.",
          },
        ],
      },
      {
        article: 17,
        title: "Users' Obligations",
        subsections: [
          {
            number: 1,
            content:
              "Users must keep their personal information up-to-date, and responsibility for problems arising from users' inaccurate information input lies with the users themselves.",
          },
          {
            number: 2,
            content:
              "In case of membership registration using others' personal information, users may lose user qualifications or be punished according to relevant personal information protection laws.",
          },
          {
            number: 3,
            content:
              "Users are responsible for maintaining security of email addresses, passwords, etc., and may not transfer or lend them to third parties.",
          },
        ],
      },
      {
        article: 18,
        title: "Measures for Personal Information Leakage",
        content:
          'When the Company becomes aware of loss, theft, or leakage (hereinafter referred to as "Leakage, etc.") of personal information, it promptly notifies all of the following matters to the relevant user and reports to the Korea Communications Commission or Korea Internet & Security Agency:',
        items: [
          "Personal information items that were leaked",
          "Time when leakage occurred",
          "Measures users can take",
          "Response measures by information and communications service providers",
          "Department and contact information where users can receive consultation",
        ],
      },
      {
        article: 19,
        title: "Exceptions to Measures for Personal Information Leakage",
        content:
          "Notwithstanding the preceding article, when there are legitimate reasons such as not knowing users' contact information, the Company may take measures to replace notification in the preceding article by posting on the Company's homepage for at least 30 days.",
      },
      {
        article: 20,
        title: "Protection of Personal Information Transferred Overseas",
        subsections: [
          {
            number: 1,
            content:
              "The Company does not conclude international contracts with contents that violate the Personal Information Protection Act and other relevant laws regarding users' personal information.",
          },
          {
            number: 2,
            content:
              'The Company obtains users\' consent to provide (including when inquired), process entrustment, or store (hereinafter referred to as "Transfer") users\' personal information overseas. However, when all matters in each subparagraph of Paragraph 3 of this Article are disclosed according to the Personal Information Protection Act and other relevant laws or notified to users by methods prescribed by Presidential Decree such as email, consent procedures for personal information processing entrustment and storage may be omitted.',
          },
          {
            number: 3,
            content:
              "When transferring with consent pursuant to the main text of Paragraph 2 of this Article, or in advance, the Company notifies users of all of the following matters:",
            details: [
              {
                letter: "a",
                content: "Personal information items to be transferred",
              },
              {
                letter: "b",
                content:
                  "Country, date and time, and method to which personal information is transferred",
              },
              {
                letter: "c",
                content:
                  "Name of the person receiving personal information (in case of corporation, its name and contact information of information management officer)",
              },
              {
                letter: "d",
                content:
                  "Purpose of use and retention/use period of personal information by the person receiving personal information",
              },
            ],
          },
          {
            number: 4,
            content:
              "When transferring personal information overseas with consent pursuant to the main text of Paragraph 2 of this Article, the Company takes protective measures as prescribed by the Presidential Decree of the Personal Information Protection Act and other relevant laws.",
          },
        ],
      },
      {
        article: 21,
        title:
          "Installation, Operation, and Refusal of Automatic Personal Information Collection Devices",
        subsections: [
          {
            number: 1,
            content:
              "The Company uses automatic personal information collection devices (hereinafter referred to as 'Cookies') that store and frequently retrieve usage information to provide users with individualized customized services. Cookies are small pieces of information sent by the server (http) used to operate a website to users' web browsers (including PC and mobile) and may be stored in users' storage space.",
          },
          {
            number: 2,
            content:
              "Users have the right to choose cookie installation. Therefore, users can allow all cookies, go through confirmation each time cookies are stored, or refuse storage of all cookies by setting options in their web browser.",
          },
          {
            number: 3,
            content:
              "However, if users refuse cookie storage, there may be difficulties in using some Company services that require login.",
          },
        ],
      },
      {
        article: 22,
        title: "Methods to Specify Cookie Installation Permission",
        content:
          "You can configure settings such as cookie permission and cookie blocking through web browser option settings:",
        browsers: [
          "Edge: Settings menu in the upper right corner of the web browser > Cookies and site permissions > Manage and delete cookies and site data",
          "Chrome: Settings menu in the upper right corner of the web browser > Privacy and security > Cookies and other site data",
          "Whale: Settings menu in the upper right corner of the web browser > Privacy > Cookies and other site data",
        ],
      },
      {
        article: 23,
        title: "Designation of Company's Personal Information Protection Officer",
        content:
          "The Company designates relevant departments and persons responsible for personal information protection as follows to protect users' personal information and handle complaints related to personal information:",
        responsiblePerson: {
          name: "Hwang Gyo-jun",
          position: "Team Leader",
          phone: "01040556415",
          email: "hwangkyojun7806@gmail.com",
        },
      },
      {
        article: 24,
        title: "Remedies for Rights Infringement",
        subsections: [
          {
            number: 1,
            content:
              "Data subjects may apply for dispute resolution or consultation to the Personal Information Dispute Mediation Committee, Korea Internet & Security Agency Personal Information Infringement Report Center, etc. to receive remedies for personal information infringement. For other reports and consultations on personal information infringement, please contact the following organizations:",
            organizations: [
              {
                name: "Personal Information Dispute Mediation Committee",
                phone: "1833-6972 (without area code)",
                website: "www.kopico.go.kr",
              },
              {
                name: "Personal Information Infringement Report Center",
                phone: "118 (without area code)",
                website: "privacy.kisa.or.kr",
              },
              {
                name: "Supreme Prosecutors' Office",
                phone: "1301 (without area code)",
                website: "www.spo.go.kr",
              },
              {
                name: "National Police Agency",
                phone: "182 (without area code)",
                website: "ecrm.cyber.go.kr",
              },
            ],
          },
          {
            number: 2,
            content:
              "The Company strives to ensure data subjects' right to self-determination of personal information and to provide consultation and relief for damages caused by personal information infringement. If you need to report or consult, please contact the department in charge in Paragraph 1.",
          },
          {
            number: 3,
            content:
              "Those whose rights or interests have been infringed by dispositions or omissions made by the head of a public institution in response to requests pursuant to Article 35 (Inspection of Personal Information), Article 36 (Correction and Deletion of Personal Information), and Article 37 (Suspension of Personal Information Processing, etc.) of the Personal Information Protection Act may file an administrative appeal as prescribed by the Administrative Appeals Act.",
            additionalInfo:
              "Central Administrative Appeals Commission: 110 (without area code) (www.simpan.go.kr)",
          },
        ],
      },
    ],
  },
};

export const getPrivacyPolicyData = (market: Market | null): PrivacyPolicyData => {
  const currentMarket = market === "GLOBAL" ? "GLOBAL" : "KOREA";
  return PRIVACY_POLICY[currentMarket];
};
