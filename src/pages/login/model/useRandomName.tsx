import { useState } from "react";

type NicknameLocale = "ko" | "en";

function generateNickname(locale: NicknameLocale = "ko") {
  const adjectives =
    locale === "ko"
      ? [
          "방황하는",
          "춤추는",
          "날아다니는",
          "꿈꾸는",
          "웃고있는",
          "달리는",
          "노래하는",
          "잠든",
          "깨어난",
          "빛나는",
          "신비한",
          "용감한",
          "귀여운",
          "멋진",
          "재빠른",
          "유쾌한",
          "차분한",
          "상냥한",
          "호기심많은",
          "당당한",
          "낭만적인",
          "활기찬",
          "느긋한",
          "엉뚱한",
          "꼼꼼한",
        ]
      : [
          "Wandering",
          "Dancing",
          "Flying",
          "Dreaming",
          "Smiling",
          "Running",
          "Singing",
          "Sleepy",
          "Awake",
          "Shining",
          "Mysterious",
          "Brave",
          "Cute",
          "Cool",
          "Swift",
          "Cheerful",
          "Calm",
          "Gentle",
          "Curious",
          "Confident",
          "Romantic",
          "Lively",
          "Easygoing",
          "Goofy",
          "Meticulous",
        ];

  const colors =
    locale === "ko"
      ? ["파란", "노란", "주황", "빨간", "초록", "보라", "하얀", "검은", "분홍"]
      : [
          "Blue",
          "Yellow",
          "Orange",
          "Red",
          "Green",
          "Purple",
          "White",
          "Black",
          "Pink",
        ];

  const nouns =
    locale === "ko"
      ? [
          "호랑이",
          "사자",
          "고양이",
          "강아지",
          "펭귄",
          "코알라",
          "판다",
          "여우",
          "늑대",
          "곰",
          "토끼",
          "다람쥐",
          "독수리",
          "부엉이",
          "앵무새",
          "고래",
          "돌고래",
          "하마",
          "수달",
          "고슴도치",
          "기린",
          "말",
          "사슴",
          "오리",
          "비버",
          "표범",
          "치타",
        ]
      : [
          "Tiger",
          "Lion",
          "Cat",
          "Dog",
          "Penguin",
          "Koala",
          "Panda",
          "Fox",
          "Wolf",
          "Bear",
          "Rabbit",
          "Squirrel",
          "Eagle",
          "Owl",
          "Parrot",
          "Whale",
          "Dolphin",
          "Hippo",
          "Otter",
          "Hedgehog",
          "Giraffe",
          "Horse",
          "Deer",
          "Duck",
          "Beaver",
          "Leopard",
          "Cheetah",
        ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const useColor = Math.random() < 0.5;
  return useColor ? `${adj} ${color} ${noun}` : `${adj} ${noun}`;
}

export default function useNickname(locale: NicknameLocale = "ko") {
  const [nickname, setNickname] = useState<string>(() =>
    generateNickname(locale),
  );

  return { nickname, setNickname };
}
