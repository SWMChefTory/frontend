import type { Market } from "@/src/modules/shared/types/market";

export interface TermsOfServiceDetail {
  letter: string;
  content: string;
}

export interface TermsOfServiceSubsection {
  number: number;
  content: string;
  details?: TermsOfServiceDetail[];
}

export interface TermsOfServiceSection {
  article: number;
  title: string;
  content?: string;
  subsections?: TermsOfServiceSubsection[];
}

export interface TermsOfServiceData {
  title: string;
  effectiveDate: string;
  effectiveDatePrefix: string;
  effectiveDateSuffix: string;
  sections: TermsOfServiceSection[];
}

export const TERMS_OF_SERVICE: Record<Market, TermsOfServiceData> = {
  KOREA: {
    title: "서비스 이용약관",
    effectiveDate: "2025.08.29",
    effectiveDatePrefix: "시행일자: ",
    effectiveDateSuffix: "부터 시행됩니다.",
    sections: [
      {
        article: 1,
        title: "목적",
        content:
          "이 약관은 세포토리 (이하 '회사' 라고 합니다)가 제공하는 제반 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.",
      },
      {
        article: 2,
        title: "정의",
        content: "이 약관에서 사용하는 주요 용어의 정의는 다음과 같습니다.",
        subsections: [
          {
            number: 1,
            content:
              "'서비스'란 함은 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 '이용자'가 이용할 수 있는 회사가 제공하는 제반 서비스를 의미합니다.",
          },
          {
            number: 2,
            content:
              "'이용자'란 이 약관에 따라 회사가 제공하는 서비스를 받는 '개인회원', '기업회원' 및 '비회원'을 말합니다.",
          },
          {
            number: 3,
            content:
              "'개인회원'은 회사에 개인정보를 제공하여 회원등록을 한 사람으로, 회사로부터 지속적으로 정보를 제공받고 '회사'가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.",
          },
          {
            number: 4,
            content:
              "'기업회원'은 회사에 기업정보 및 개인정보를 제공하여 회원등록을 한 사람으로, 회사로부터 지속적으로 정보를 제공받고 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.",
          },
          {
            number: 5,
            content:
              "'비회원'은 회원가입 없이 회사가 제공하는 서비스를 이용하는 자를 말합니다.",
          },
          {
            number: 6,
            content:
              "'아이디(ID)'란 함은 회원의 식별과 서비스이용을 위하여 회원이 정하고 회사가 승인하는 문자 또는 문자와 숫자의 조합을 의미합니다.",
          },
          {
            number: 7,
            content:
              "'비밀번호'란 함은 회원이 부여받은 아이디와 일치되는 회원임을 확인하고 비밀의 보호를 위해 회원 자신이 정한 문자(특수문자 포함)와 숫자의 조합을 의미합니다.",
          },
          {
            number: 8,
            content:
              "'콘텐츠'란 정보통신망법의 규정에 따라 정보통신망에서 사용되는 부호·문자·음성·음향·이미지 또는 영상 등으로 정보 형태의 글, 사진, 동영상 및 각종 파일과 링크 등을 말합니다.",
          },
        ],
      },
      {
        article: 3,
        title: "약관 의 준칙",
        content:
          "이 약관에서 정하지 아니한 사항에 대해서는 법령 또는 회사가 정한 서비스의 개별약관, 운영정책 및 규칙 등(이하 세부지침)의 규정에 따릅니다. 또한 본 약관과 세부지침이 충돌할 경우에는 세부지침에 따릅니다.",
      },
      {
        article: 4,
        title: "약관의 효력과 변경",
        subsections: [
          {
            number: 1,
            content:
              "이 약관은 세포토리(이)가 제공하는 모든 인터넷서비스에 게시하여 공시합니다. '회사'는 '전자상거래 등에서의 소비자보호에 관한 법률'(이하 '전자상거래법'이라 함), '약관의 규제에 관한 법률'(이하 '약관규제법'이라 함), '전자문서 및 전자거래 기본법' , '정보통신망 이용촉진 및 정보보호 등에 관한 법률'(이하 '정보통신망법'이라 함) 등 관련법령에 위배되지 않는 법위 내에서 이 약관을 변경할 수 있으며, 회사는 약관이 변경되는 경우에 변경된 약관의 내용과 시행일을 정하여, 그 시행일로부터 최소 7일 (이용자에게 불리하거나 중대한 사항의 변경인 경우에는 30일) 이전부터 시행일 후 상당한 기간 동안 공지하고, 기존 이용자에게는 변경된 약관, 적용일자 및 변경",
          },
          {
            number: 2,
            content:
              "회사가 제1항에 따라 개정약관을 공지 또는 통지하는 경우 '변경에 동의하지 아니한 경우 공지일 또는 통지일로부터 7일(이용자에게 불리하거나 중대한 사항의 변경인 경우에는 30일) 내에 계약을 해지할 수 있으며, 계약해지의 의사표시를 하지 아니한 경우에는 변경에 동의한 것으로 본다.' 라는 취지의 내용을 함께 통지합니다.",
          },
          {
            number: 3,
            content:
              "이용자가 제2항의 공지일 또는 통지를 받은 날로부터 7일(또는 이용자에게 불리하거나 중대한 사항의 변경인 경우에는 30일)내에 변경된 약관에 대해 거절의 의사를 표시하지 않았을 때에는 본 약관의 변경에 동의한 것으로 간주합니다.",
          },
        ],
      },
      {
        article: 5,
        title: "이용자에 대한 통지",
        subsections: [
          {
            number: 1,
            content:
              "회사는 이 약관에 별도 규정이 없는 한 이용자에게 전자우편, 문자메시지(SMS), 전자쪽지, 푸쉬(Push)알림 등의 전자적 수단을 이용하여 통지할 수 있습니다.",
          },
          {
            number: 2,
            content:
              "회사는 이용자 전체에 대한 통지의 경우 7일 이상 회사가 운영하는 웹사이트 내의 게시판에 게시함으로써 제1항의 통지에 갈음할 수 있습니다. 다만, 이용자 본인의 거래와 관련하여 중대한 영향을 미치는 사항에 대하여는 제1항의 개별 통지를 합니다.",
          },
          {
            number: 3,
            content:
              "회사는 이용자에게 통지를 하지만, 법적 요건 미충족, 오기재 등으로 인하여 개별 통지가 어려운 경우에 한하여 전항의 공시를 함으로써 개별 통지를 한 것으로 간주합니다.",
          },
        ],
      },
      {
        article: 6,
        title: "이용 계약의 체결",
        content: "이용 계약은 다음의 경우에 체결됩니다.",
        subsections: [
          {
            number: 1,
            content:
              "이용자가 회원으로 가입하고자 하는 경우 이용자가 약관의 내용에 대하여 동의를 한 다음 회원가입신청을 하고 회사가 이러한 신청에 대하여 승낙한 때",
          },
          {
            number: 2,
            content:
              "이용자가 회원 가입 없이 이용할 수 있는 서비스에 대하여 회원 가입의 신청없이 서비스를 이용하고자 하는 경우에는 회사 서비스 이용을 위해 결제하는 때",
          },
          {
            number: 3,
            content:
              "이용자가 회원가입 없이 이용할 수 있는 서비스에 대하여 회원가입의 신청없이 무료 서비스를 이용하고자 하는 경우에는 그 무료 서비스와 관련된 사항의 저장 등 부가서비스를 이용하면서 위 1호 및 2호의 절차를 진행한 때",
          },
        ],
      },
      {
        article: 7,
        title: "회원가입에 대한 승낙",
        subsections: [
          {
            number: 1,
            content:
              "회사는 이용계약에 대한 요청이 있을 때 서비스 이용을 승낙함을 원칙으로 합니다.",
          },
          {
            number: 2,
            content:
              "전항에도 불구하고, 다음 각호의 사유에 해당하는 경우 회사는 회원가입을 보류하거나 거절하는 등 제한할 수 있습니다.",
            details: [
              {
                letter: "가",
                content:
                  "가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우(단, 회사의 재가입 승낙을 얻은 경우에는 예외로 함)",
              },
              {
                letter: "나",
                content: "실명이 아니거나 타인의 명의를 도용한 경우",
              },
              {
                letter: "다",
                content: "허위 정보를 기재하거나 허위로 기재한 경우",
              },
              {
                letter: "라",
                content:
                  "만 14세 미만의 아동, 만 19세 미만의 미성년자, 피한정후견인, 피성년후견인이 법정대리인의 동의를 얻지 않은 경우",
              },
              {
                letter: "마",
                content:
                  "이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 이 약관 등 회사가 규정한 운영원칙을 위반한 경우",
              },
              {
                letter: "바",
                content:
                  "신용정보의 이용과 보호에 관한 법률에 따라 PC통신, 인터넷서비스의 신용불량자로 등록되어 있는 경우",
              },
              {
                letter: "사",
                content:
                  "정보통신윤리위원회에 PC통신, 인터넷서비스의 불량이용자로 등록되어 있는 경우",
              },
              {
                letter: "아",
                content:
                  "이미 사용 중인 회원정보 또는 공서양속을 저해하는 아이디를 사용하고자 하는 경우",
              },
            ],
          },
          {
            number: 3,
            content:
              "제1항에 따른 신청에 있어 회사는 서비스 제공에 필요한 경우 전문기관을 통한 실명확인 및 본인인증을 요청할 수 있습니다.",
          },
          {
            number: 4,
            content:
              "회사는 서비스 관련 설비의 여유가 없거나, 기술상 또는 업무상 문제가 있는 경우에는 승낙을 유보할 수 있습니다.",
          },
          {
            number: 5,
            content:
              "제2항과 제4항에 따라 서비스 이용을 승낙하지 아니하거나 유보한 경우, 회사는 원칙적으로 이를 서비스 이용 신청자에게 알리도록 합니다. 단, 회사의 귀책사유 없이 이용자에게 알릴 수 없는 경우에는 예외로 합니다.",
          },
          {
            number: 6,
            content:
              "이용계약의 성립 시기는 제6조 제1호의 경우에는 회사가 가입완료를 신청절차 상에서 표시한 시점, 제6조 제2호의 경우에는 결제가 완료되었다는 표시가 된 시점으로 합니다.",
          },
          {
            number: 7,
            content:
              "회사는 회원에 대해 회사정책에 따라 등급별로 구분하여 이용시간, 이용횟수, 서비스 메뉴 등을 세분하여 이용에 차등을 둘 수 있습니다.",
          },
          {
            number: 8,
            content:
              "회사는 회원에 대하여 '영화및비디오물진흥에관한법률' 및 '청소년보호법' 등에 따른 등급 및 연령 준수를 위하여 이용제한이나 등급별 제한을 둘 수 있습니다.",
          },
        ],
      },
      {
        article: 8,
        title: "회원정보의 변경",
        subsections: [
          {
            number: 1,
            content:
              "회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다. 다만, 서비스 관리를 위해 필요한 실명, 아이디 등은 수정이 불가능합니다.",
          },
          {
            number: 2,
            content:
              "회원은 회원가입신청 시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나 전자우편 기타 방법으로 회사에 대하여 그 변경사항을 알려야 합니다.",
          },
          {
            number: 3,
            content:
              "제2항의 변경사항을 회사에 알리지 않아 발생한 불이익에 대하여는 회원에게 책임이 있습니다.",
          },
        ],
      },
      {
        article: 9,
        title: "회원정보의 관리 및 보호",
        subsections: [
          {
            number: 1,
            content:
              "회원의 아이디(ID)와 비밀번호에 관한 관리책임은 회원에게 있으며, 이를 제3자가 이용하도록 하여서는 안 됩니다.",
          },
          {
            number: 2,
            content:
              "회사는 회원의 아이디(ID)가 개인정보 유출 우려가 있거나, 반사회적 또는 공서양속에 어긋나거나, 회사 또는 서비스의 운영자로 오인한 우려가 있는 경우, 해당 아이디(ID)의 이용을 제한할 수 있습니다.",
          },
          {
            number: 3,
            content:
              "회원은 아이디(ID) 및 비밀번호가 도용되거나 제3자가 사용하고 있음을 인지한 경우에는 이를 즉시 회사에 통지하고 안내에 따라야 합니다.",
          },
          {
            number: 4,
            content:
              "제3항의 경우 해당 회원이 회사에 그 사실을 통지하지 않거나, 통지하였으나 회사의 안내에 따르지 않아 발생한 불이익에 대하여는 회사는 책임지지 않습니다.",
          },
        ],
      },
      {
        article: 10,
        title: "회사의 의무",
        subsections: [
          {
            number: 1,
            content:
              "회사는 계속적이고 안정적인 서비스의 제공을 위하여 설비에 장애가 생기거나 멸실된 때에는 이를 지체 없이 수리 또는 복구하며, 다음 각 호의 사유 발생 시 부득이한 경우 예고 없이 서비스의 전부 또는 일부의 제공을 일시 중지할 수 있습니다.",
            details: [
              {
                letter: "가",
                content: "시스템 정기점검, 증설 및 교체를 위하여 필요한 경우",
              },
              {
                letter: "나",
                content:
                  "시스템 또는 기타 서비스 설비의 장애, 유무선 Network 장애 등으로 정상적인 서비스 제공이 불가능한 경우",
              },
              {
                letter: "다",
                content:
                  "국가비상사태, 정전, 천재지변 등의 불가항력적 사유가 있는 경우",
              },
            ],
          },
        ],
      },
    ],
  },
  GLOBAL: {
    title: "Terms of Service",
    effectiveDate: "2025.08.29",
    effectiveDatePrefix: "Effective Date: ",
    effectiveDateSuffix: "",
    sections: [
      {
        article: 1,
        title: "Purpose",
        content:
          "These Terms and Conditions are established to stipulate the rights, obligations, and responsibilities between the Company and Members, and other necessary matters related to the use of all services provided by Sephatory (hereinafter referred to as 'Company').",
      },
      {
        article: 2,
        title: "Definitions",
        content:
          "The definitions of major terms used in these Terms and Conditions are as follows:",
        subsections: [
          {
            number: 1,
            content:
              "'Service' means all services provided by the Company that 'Users' can use regardless of the implemented terminal (including various wired and wireless devices such as PC, TV, portable terminals, etc.).",
          },
          {
            number: 2,
            content:
              "'User' refers to 'Individual Members', 'Corporate Members', and 'Non-Members' who receive services provided by the Company according to these Terms and Conditions.",
          },
          {
            number: 3,
            content:
              "'Individual Member' refers to a person who registers as a member by providing personal information to the Company and can continuously receive information from the Company and continuously use services provided by the Company.",
          },
          {
            number: 4,
            content:
              "'Corporate Member' refers to a person who registers as a member by providing corporate information and personal information to the Company and can continuously receive information from the Company and continuously use services provided by the Company.",
          },
          {
            number: 5,
            content:
              "'Non-Member' refers to a person who uses services provided by the Company without membership registration.",
          },
          {
            number: 6,
            content:
              "'ID' means a combination of letters or letters and numbers determined by the Member and approved by the Company for Member identification and service use.",
          },
          {
            number: 7,
            content:
              "'Password' means a combination of letters (including special characters) and numbers set by the Member to confirm that they are the Member matching the assigned ID and to protect confidentiality.",
          },
          {
            number: 8,
            content:
              "'Content' refers to codes, letters, voice, sound, images, or video used in information and communication networks according to the provisions of the Information and Communications Network Act, including text, photos, videos, various files, and links in the form of information.",
          },
        ],
      },
      {
        article: 3,
        title: "Rules of the Terms and Conditions",
        content:
          "Matters not stipulated in these Terms and Conditions shall be governed by laws or individual terms of service, operating policies, and rules (hereinafter referred to as detailed guidelines) established by the Company. In case of conflict between these Terms and Conditions and detailed guidelines, the detailed guidelines shall prevail.",
      },
      {
        article: 4,
        title: "Effectiveness and Amendment of Terms and Conditions",
        subsections: [
          {
            number: 1,
            content:
              "These Terms and Conditions shall be posted and disclosed on all internet services provided by Sephatory. The Company may amend these Terms and Conditions within the scope not violating relevant laws such as the 'Act on Consumer Protection in Electronic Commerce' (hereinafter referred to as 'Electronic Commerce Act'), 'Act on Regulation of Terms and Conditions' (hereinafter referred to as 'Terms and Conditions Regulation Act'), 'Framework Act on Electronic Documents and Electronic Transactions', and 'Act on Promotion of Information and Communications Network Utilization and Information Protection' (hereinafter referred to as 'Information and Communications Network Act'), and when amending the Terms and Conditions, the Company shall determine the content and effective date of the amended Terms and Conditions and notify from at least 7 days (30 days in case of disadvantageous or significant changes to users) before the effective date until a considerable period after the effective date, and notify existing users of the amended Terms and Conditions, application date, and changes.",
          },
          {
            number: 2,
            content:
              "When the Company announces or notifies the amended Terms and Conditions pursuant to Paragraph 1, it shall also notify that 'If you do not agree to the changes, you may terminate the contract within 7 days (30 days in case of disadvantageous or significant changes to users) from the announcement or notification date, and if you do not express intent to terminate the contract, you will be deemed to have agreed to the changes.'",
          },
          {
            number: 3,
            content:
              "When users do not express refusal regarding the amended Terms and Conditions within 7 days (or 30 days in case of disadvantageous or significant changes to users) from the announcement date or receipt of notification in Paragraph 2, they shall be deemed to have agreed to the amendment of these Terms and Conditions.",
          },
        ],
      },
      {
        article: 5,
        title: "Notification to Users",
        subsections: [
          {
            number: 1,
            content:
              "Unless otherwise specified in these Terms and Conditions, the Company may notify users using electronic means such as email, text messages (SMS), electronic messages, and push notifications.",
          },
          {
            number: 2,
            content:
              "For notification to all users, the Company may replace the notification in Paragraph 1 by posting on the bulletin board within the website operated by the Company for at least 7 days. However, for matters that significantly affect the user's own transactions, individual notification as in Paragraph 1 shall be provided.",
          },
          {
            number: 3,
            content:
              "When the Company notifies users but individual notification is difficult due to failure to meet legal requirements or incorrect entries, the Company may be deemed to have provided individual notification by making the disclosure in the preceding paragraph.",
          },
        ],
      },
      {
        article: 6,
        title: "Conclusion of Use Contract",
        content:
          "Use contracts shall be concluded in the following cases:",
        subsections: [
          {
            number: 1,
            content:
              "When a user wishes to register as a member, the user agrees to the contents of the Terms and Conditions, then applies for membership registration, and the Company approves such application",
          },
          {
            number: 2,
            content:
              "When a user wishes to use a service that can be used without membership registration, at the time of payment for using the Company's service",
          },
          {
            number: 3,
            content:
              "When a user wishes to use a free service that can be used without membership registration and proceeds with the procedures in Items 1 and 2 above while using additional services such as saving matters related to such free service",
          },
        ],
      },
      {
        article: 7,
        title: "Approval of Membership Registration",
        subsections: [
          {
            number: 1,
            content:
              "The Company shall, in principle, approve service use when there is a request for a use contract.",
          },
          {
            number: 2,
            content:
              "Notwithstanding the preceding paragraph, the Company may withhold or refuse membership registration in cases corresponding to any of the following:",
            details: [
              {
                letter: "a",
                content:
                  "When the applicant has previously lost membership qualifications pursuant to these Terms and Conditions (except when the Company has approved re-registration)",
              },
              {
                letter: "b",
                content:
                  "When using a non-real name or another person's identity",
              },
              {
                letter: "c",
                content: "When providing false information or false entries",
              },
              {
                letter: "d",
                content:
                  "When children under 14 years of age, minors under 19 years of age, persons under limited guardianship, or persons under adult guardianship do not obtain consent from their legal representatives",
              },
              {
                letter: "e",
                content:
                  "When approval is impossible due to the user's attributable reasons or when violating operating principles stipulated by the Company including these Terms and Conditions",
              },
              {
                letter: "f",
                content:
                  "When registered as a credit defaulter for PC communication or internet services according to the Act on Use and Protection of Credit Information",
              },
              {
                letter: "g",
                content:
                  "When registered as an improper user of PC communication or internet services with the Information and Communications Ethics Committee",
              },
              {
                letter: "h",
                content:
                  "When attempting to use member information already in use or an ID that harms public order and morals",
              },
            ],
          },
          {
            number: 3,
            content:
              "For applications pursuant to Paragraph 1, the Company may request real name verification and identity authentication through specialized institutions when necessary for service provision.",
          },
          {
            number: 4,
            content:
              "The Company may withhold approval when there is no spare capacity in service-related facilities or when there are technical or operational problems.",
          },
          {
            number: 5,
            content:
              "When service use is not approved or withheld pursuant to Paragraphs 2 and 4, the Company shall, in principle, notify the service use applicant. However, exceptions are made when the Company cannot notify users without the Company's attributable reasons.",
          },
          {
            number: 6,
            content:
              "The time of establishment of the use contract shall be the time when the Company displays membership completion in the application process for Item 1 of Article 6, and the time when payment completion is displayed for Item 2 of Article 6.",
          },
          {
            number: 7,
            content:
              "The Company may differentiate member use by subdividing usage time, usage frequency, service menu, etc. according to Company policy grades.",
          },
          {
            number: 8,
            content:
              "The Company may impose usage restrictions or grade restrictions on members to comply with ratings and age requirements according to the 'Motion Pictures and Video Products Act' and 'Youth Protection Act'.",
          },
        ],
      },
      {
        article: 8,
        title: "Changes to Member Information",
        subsections: [
          {
            number: 1,
            content:
              "Members may view and modify their personal information at any time through the personal information management screen. However, real name, ID, etc. necessary for service management cannot be modified.",
          },
          {
            number: 2,
            content:
              "When matters entered during membership registration application change, members must modify online or notify the Company of such changes by email or other methods.",
          },
          {
            number: 3,
            content:
              "Members are responsible for disadvantages arising from failure to notify the Company of changes in Paragraph 2.",
          },
        ],
      },
      {
        article: 9,
        title: "Management and Protection of Member Information",
        subsections: [
          {
            number: 1,
            content:
              "Responsibility for managing Member IDs and passwords lies with the Member, and they must not allow third parties to use them.",
          },
          {
            number: 2,
            content:
              "The Company may restrict the use of IDs when there is concern about personal information leakage, when they are antisocial or contrary to public order and morals, or when there is concern about being mistaken for the Company or service operator.",
          },
          {
            number: 3,
            content:
              "When Members become aware that their ID and password have been stolen or are being used by a third party, they must immediately notify the Company and follow guidance.",
          },
          {
            number: 4,
            content:
              "In cases of Paragraph 3, the Company is not responsible for disadvantages arising from the Member's failure to notify the Company of such facts or failure to follow the Company's guidance despite notification.",
          },
        ],
      },
      {
        article: 10,
        title: "Company's Obligations",
        subsections: [
          {
            number: 1,
            content:
              "For continuous and stable service provision, the Company shall repair or restore facilities without delay when facilities are damaged or destroyed, and may temporarily suspend provision of all or part of services without notice when unavoidable due to the following reasons:",
            details: [
              {
                letter: "a",
                content:
                  "When necessary for regular system inspection, expansion, and replacement",
              },
              {
                letter: "b",
                content:
                  "When normal service provision is impossible due to system or other service facility failures, wired/wireless network failures, etc.",
              },
              {
                letter: "c",
                content:
                  "When there are force majeure reasons such as national emergency, power outage, or natural disaster",
              },
            ],
          },
        ],
      },
    ],
  },
};

export const getTermsOfServiceData = (market: Market | null): TermsOfServiceData => {
  const currentMarket = market === "GLOBAL" ? "GLOBAL" : "KOREA";
  return TERMS_OF_SERVICE[currentMarket];
};
