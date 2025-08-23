import { Word } from '../types/quiz';

export const words: Word[] = [
  // 비즈니스/경제 관련
  { id: 1, word: 'revenue', meaning: '수익', difficulty: 'intermediate', category: 'business' },
  { id: 2, word: 'expenditure', meaning: '지출', difficulty: 'intermediate', category: 'business' },
  { id: 3, word: 'profit', meaning: '이익', difficulty: 'intermediate', category: 'business' },
  { id: 4, word: 'investment', meaning: '투자', difficulty: 'intermediate', category: 'business' },
  { id: 5, word: 'negotiation', meaning: '협상', difficulty: 'intermediate', category: 'business' },
  { id: 6, word: 'contract', meaning: '계약', difficulty: 'intermediate', category: 'business' },
  { id: 7, word: 'deadline', meaning: '마감일', difficulty: 'intermediate', category: 'business' },
  { id: 8, word: 'efficiency', meaning: '효율성', difficulty: 'intermediate', category: 'business' },
  { id: 9, word: 'productivity', meaning: '생산성', difficulty: 'intermediate', category: 'business' },
  { id: 10, word: 'strategy', meaning: '전략', difficulty: 'intermediate', category: 'business' },

  // 일상생활 관련
  { id: 11, word: 'accommodation', meaning: '숙박시설', difficulty: 'intermediate', category: 'daily' },
  { id: 12, word: 'appointment', meaning: '약속', difficulty: 'intermediate', category: 'daily' },
  { id: 13, word: 'reservation', meaning: '예약', difficulty: 'intermediate', category: 'daily' },
  { id: 14, word: 'maintenance', meaning: '유지보수', difficulty: 'intermediate', category: 'daily' },
  { id: 15, word: 'transportation', meaning: '교통수단', difficulty: 'intermediate', category: 'daily' },
  { id: 16, word: 'entertainment', meaning: '오락', difficulty: 'intermediate', category: 'daily' },
  { id: 17, word: 'recreation', meaning: '레크리에이션', difficulty: 'intermediate', category: 'daily' },
  { id: 18, word: 'cuisine', meaning: '요리법', difficulty: 'intermediate', category: 'daily' },
  { id: 19, word: 'ingredient', meaning: '재료', difficulty: 'intermediate', category: 'daily' },
  { id: 20, word: 'appliance', meaning: '가전제품', difficulty: 'intermediate', category: 'daily' },

  // 기술/IT 관련
  { id: 21, word: 'software', meaning: '소프트웨어', difficulty: 'intermediate', category: 'technology' },
  { id: 22, word: 'hardware', meaning: '하드웨어', difficulty: 'intermediate', category: 'technology' },
  { id: 23, word: 'database', meaning: '데이터베이스', difficulty: 'intermediate', category: 'technology' },
  { id: 24, word: 'algorithm', meaning: '알고리즘', difficulty: 'intermediate', category: 'technology' },
  { id: 25, word: 'interface', meaning: '인터페이스', difficulty: 'intermediate', category: 'technology' },
  { id: 26, word: 'network', meaning: '네트워크', difficulty: 'intermediate', category: 'technology' },
  { id: 27, word: 'server', meaning: '서버', difficulty: 'intermediate', category: 'technology' },
  { id: 28, word: 'encryption', meaning: '암호화', difficulty: 'intermediate', category: 'technology' },
  { id: 29, word: 'firewall', meaning: '방화벽', difficulty: 'intermediate', category: 'technology' },
  { id: 30, word: 'backup', meaning: '백업', difficulty: 'intermediate', category: 'technology' },

  // 의료/건강 관련
  { id: 31, word: 'diagnosis', meaning: '진단', difficulty: 'intermediate', category: 'health' },
  { id: 32, word: 'symptom', meaning: '증상', difficulty: 'intermediate', category: 'health' },
  { id: 33, word: 'treatment', meaning: '치료', difficulty: 'intermediate', category: 'health' },
  { id: 34, word: 'prescription', meaning: '처방전', difficulty: 'intermediate', category: 'health' },
  { id: 35, word: 'vaccination', meaning: '예방접종', difficulty: 'intermediate', category: 'health' },
  { id: 36, word: 'surgery', meaning: '수술', difficulty: 'intermediate', category: 'health' },
  { id: 37, word: 'recovery', meaning: '회복', difficulty: 'intermediate', category: 'health' },
  { id: 38, word: 'prevention', meaning: '예방', difficulty: 'intermediate', category: 'health' },
  { id: 39, word: 'nutrition', meaning: '영양', difficulty: 'intermediate', category: 'health' },
  { id: 40, word: 'hygiene', meaning: '위생', difficulty: 'intermediate', category: 'health' },

  // 교육/학습 관련
  { id: 41, word: 'curriculum', meaning: '교육과정', difficulty: 'intermediate', category: 'education' },
  { id: 42, word: 'scholarship', meaning: '장학금', difficulty: 'intermediate', category: 'education' },
  { id: 43, word: 'graduation', meaning: '졸업', difficulty: 'intermediate', category: 'education' },
  { id: 44, word: 'semester', meaning: '학기', difficulty: 'intermediate', category: 'education' },
  { id: 45, word: 'assignment', meaning: '과제', difficulty: 'intermediate', category: 'education' },
  { id: 46, word: 'research', meaning: '연구', difficulty: 'intermediate', category: 'education' },
  { id: 47, word: 'lecture', meaning: '강의', difficulty: 'intermediate', category: 'education' },
  { id: 48, word: 'seminar', meaning: '세미나', difficulty: 'intermediate', category: 'education' },
  { id: 49, word: 'thesis', meaning: '논문', difficulty: 'intermediate', category: 'education' },
  { id: 50, word: 'academic', meaning: '학술적인', difficulty: 'intermediate', category: 'education' },

  // 여행/관광 관련
  { id: 51, word: 'destination', meaning: '목적지', difficulty: 'intermediate', category: 'travel' },
  { id: 52, word: 'itinerary', meaning: '여행 일정', difficulty: 'intermediate', category: 'travel' },
  { id: 53, word: 'passport', meaning: '여권', difficulty: 'intermediate', category: 'travel' },
  { id: 54, word: 'visa', meaning: '비자', difficulty: 'intermediate', category: 'travel' },
  { id: 55, word: 'luggage', meaning: '수하물', difficulty: 'intermediate', category: 'travel' },
  { id: 56, word: 'sightseeing', meaning: '관광', difficulty: 'intermediate', category: 'travel' },
  { id: 57, word: 'landmark', meaning: '랜드마크', difficulty: 'intermediate', category: 'travel' },
  { id: 58, word: 'tourist', meaning: '관광객', difficulty: 'intermediate', category: 'travel' },
  { id: 59, word: 'guide', meaning: '가이드', difficulty: 'intermediate', category: 'travel' },
  { id: 60, word: 'adventure', meaning: '모험', difficulty: 'intermediate', category: 'travel' },

  // 환경/자연 관련
  { id: 61, word: 'pollution', meaning: '오염', difficulty: 'intermediate', category: 'environment' },
  { id: 62, word: 'recycling', meaning: '재활용', difficulty: 'intermediate', category: 'environment' },
  { id: 63, word: 'conservation', meaning: '보존', difficulty: 'intermediate', category: 'environment' },
  { id: 64, word: 'sustainability', meaning: '지속가능성', difficulty: 'intermediate', category: 'environment' },
  { id: 65, word: 'ecosystem', meaning: '생태계', difficulty: 'intermediate', category: 'environment' },
  { id: 66, word: 'biodiversity', meaning: '생물다양성', difficulty: 'intermediate', category: 'environment' },
  { id: 67, word: 'climate', meaning: '기후', difficulty: 'intermediate', category: 'environment' },
  { id: 68, word: 'wildlife', meaning: '야생동물', difficulty: 'intermediate', category: 'environment' },
  { id: 69, word: 'habitat', meaning: '서식지', difficulty: 'intermediate', category: 'environment' },
  { id: 70, word: 'preservation', meaning: '보존', difficulty: 'intermediate', category: 'environment' },

  // 법률/정치 관련
  { id: 71, word: 'legislation', meaning: '입법', difficulty: 'intermediate', category: 'law' },
  { id: 72, word: 'regulation', meaning: '규정', difficulty: 'intermediate', category: 'law' },
  { id: 73, word: 'amendment', meaning: '수정안', difficulty: 'intermediate', category: 'law' },
  { id: 74, word: 'constitution', meaning: '헌법', difficulty: 'intermediate', category: 'law' },
  { id: 75, word: 'democracy', meaning: '민주주의', difficulty: 'intermediate', category: 'law' },
  { id: 76, word: 'election', meaning: '선거', difficulty: 'intermediate', category: 'law' },
  { id: 77, word: 'parliament', meaning: '의회', difficulty: 'intermediate', category: 'law' },
  { id: 78, word: 'government', meaning: '정부', difficulty: 'intermediate', category: 'law' },
  { id: 79, word: 'policy', meaning: '정책', difficulty: 'intermediate', category: 'law' },
  { id: 80, word: 'citizen', meaning: '시민', difficulty: 'intermediate', category: 'law' },

  // 예술/문화 관련
  { id: 81, word: 'exhibition', meaning: '전시회', difficulty: 'intermediate', category: 'culture' },
  { id: 82, word: 'performance', meaning: '공연', difficulty: 'intermediate', category: 'culture' },
  { id: 83, word: 'audience', meaning: '관객', difficulty: 'intermediate', category: 'culture' },
  { id: 84, word: 'masterpiece', meaning: '걸작', difficulty: 'intermediate', category: 'culture' },
  { id: 85, word: 'heritage', meaning: '유산', difficulty: 'intermediate', category: 'culture' },
  { id: 86, word: 'tradition', meaning: '전통', difficulty: 'intermediate', category: 'culture' },
  { id: 87, word: 'festival', meaning: '축제', difficulty: 'intermediate', category: 'culture' },
  { id: 88, word: 'ceremony', meaning: '의식', difficulty: 'intermediate', category: 'culture' },
  { id: 89, word: 'celebration', meaning: '축하', difficulty: 'intermediate', category: 'culture' },
  { id: 90, word: 'custom', meaning: '관습', difficulty: 'intermediate', category: 'culture' },

  // 스포츠/레저 관련
  { id: 91, word: 'tournament', meaning: '토너먼트', difficulty: 'intermediate', category: 'sports' },
  { id: 92, word: 'championship', meaning: '선수권', difficulty: 'intermediate', category: 'sports' },
  { id: 93, word: 'competition', meaning: '경쟁', difficulty: 'intermediate', category: 'sports' },
  { id: 94, word: 'athlete', meaning: '운동선수', difficulty: 'intermediate', category: 'sports' },
  { id: 95, word: 'coach', meaning: '코치', difficulty: 'intermediate', category: 'sports' },
  { id: 96, word: 'training', meaning: '훈련', difficulty: 'intermediate', category: 'sports' },
  { id: 97, word: 'fitness', meaning: '건강', difficulty: 'intermediate', category: 'sports' },
  { id: 98, word: 'workout', meaning: '운동', difficulty: 'intermediate', category: 'sports' },
  { id: 99, word: 'stadium', meaning: '경기장', difficulty: 'intermediate', category: 'sports' },
  { id: 100, word: 'spectator', meaning: '관중', difficulty: 'intermediate', category: 'sports' }
];

// 단어 카테고리별로 필터링하는 함수
export const getWordsByCategory = (category: string): Word[] => {
  return words.filter(word => word.category === category);
};

// 난이도별로 필터링하는 함수
export const getWordsByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Word[] => {
  return words.filter(word => word.difficulty === difficulty);
};

// 랜덤하게 단어를 선택하는 함수
export const getRandomWords = (count: number): Word[] => {
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, words.length));
};
