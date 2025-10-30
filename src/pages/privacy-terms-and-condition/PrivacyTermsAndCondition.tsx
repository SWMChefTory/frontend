import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";

// 개인정보처리방침 데이터
const privacyPolicyData = {
  title: "개인정보처리방침",
  effectiveDate: "2025.08.29",
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
};

const PrivacyTermsAndConditionsPage = () => {
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
            시행일자: {privacyPolicyData.effectiveDate}부터 시행됩니다.
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
