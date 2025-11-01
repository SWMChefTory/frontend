import { useState } from "react";

function generateKoreanNickname() {
  const adjectives = [
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
  ];

  const nouns = [
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
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
}

export default function useNickname() {
  const [nickname, setNickname] = useState<string>(() =>
    generateKoreanNickname(),
  );

  return { nickname, setNickname };
}
