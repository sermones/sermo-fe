import { Sentence } from '../types/quiz';

export const sentences: Sentence[] = [
  // 일상생활 관련
  { id: 1, sentence: "I love to read books in my free time.", meaning: "나는 여가 시간에 책 읽는 것을 좋아한다.", difficulty: 'beginner', category: 'daily' },
  { id: 2, sentence: "She wants to give him one more chance.", meaning: "그녀는 그에게 한 번 더 기회를 주고 싶어한다.", difficulty: 'beginner', category: 'daily' },
  { id: 3, sentence: "The weather is beautiful today.", meaning: "오늘 날씨가 아름답다.", difficulty: 'beginner', category: 'daily' },
  { id: 4, sentence: "We should meet for coffee sometime.", meaning: "언젠가 커피 마시러 만나야겠다.", difficulty: 'beginner', category: 'daily' },
  { id: 5, sentence: "He always arrives on time.", meaning: "그는 항상 시간에 맞춰 도착한다.", difficulty: 'beginner', category: 'daily' },
  { id: 6, sentence: "Can you help me with this problem?", meaning: "이 문제를 도와줄 수 있나요?", difficulty: 'beginner', category: 'daily' },
  { id: 7, sentence: "I need to buy some groceries.", meaning: "식료품을 좀 사야 한다.", difficulty: 'beginner', category: 'daily' },
  { id: 8, sentence: "The movie was really interesting.", meaning: "그 영화는 정말 흥미로웠다.", difficulty: 'beginner', category: 'daily' },
  { id: 9, sentence: "She likes to cook Italian food.", meaning: "그녀는 이탈리아 요리하는 것을 좋아한다.", difficulty: 'beginner', category: 'daily' },
  { id: 10, sentence: "We went to the park yesterday.", meaning: "우리는 어제 공원에 갔다.", difficulty: 'beginner', category: 'daily' },

  // 가족/관계 관련
  { id: 11, sentence: "My family lives in Seoul.", meaning: "내 가족은 서울에 산다.", difficulty: 'beginner', category: 'family' },
  { id: 12, sentence: "She is my best friend.", meaning: "그녀는 내 가장 친한 친구다.", difficulty: 'beginner', category: 'family' },
  { id: 13, sentence: "I miss my parents very much.", meaning: "나는 부모님이 정말 그립다.", difficulty: 'beginner', category: 'family' },
  { id: 14, sentence: "He has two younger sisters.", meaning: "그는 여동생이 두 명 있다.", difficulty: 'beginner', category: 'family' },
  { id: 15, sentence: "We celebrate birthdays together.", meaning: "우리는 함께 생일을 축하한다.", difficulty: 'beginner', category: 'family' },
  { id: 16, sentence: "My brother works at a hospital.", meaning: "내 형은 병원에서 일한다.", difficulty: 'beginner', category: 'family' },
  { id: 17, sentence: "She looks like her mother.", meaning: "그녀는 어머니를 닮았다.", difficulty: 'beginner', category: 'family' },
  { id: 18, sentence: "I love spending time with my family.", meaning: "나는 가족과 시간을 보내는 것을 좋아한다.", difficulty: 'beginner', category: 'family' },
  { id: 19, sentence: "He is married to my sister.", meaning: "그는 내 누나와 결혼했다.", difficulty: 'beginner', category: 'family' },
  { id: 20, sentence: "We have dinner together every Sunday.", meaning: "우리는 매주 일요일마다 함께 저녁을 먹는다.", difficulty: 'beginner', category: 'family' },

  // 학교/교육 관련
  { id: 21, sentence: "I study English every day.", meaning: "나는 매일 영어를 공부한다.", difficulty: 'beginner', category: 'education' },
  { id: 22, sentence: "The teacher is very kind.", meaning: "그 선생님은 매우 친절하다.", difficulty: 'beginner', category: 'education' },
  { id: 23, sentence: "We have a test tomorrow.", meaning: "우리는 내일 시험이 있다.", difficulty: 'beginner', category: 'education' },
  { id: 24, sentence: "She is good at mathematics.", meaning: "그녀는 수학을 잘한다.", difficulty: 'beginner', category: 'education' },
  { id: 25, sentence: "I need to finish my homework.", meaning: "나는 숙제를 끝내야 한다.", difficulty: 'beginner', category: 'education' },
  { id: 26, sentence: "The library is open until 10 PM.", meaning: "도서관은 오후 10시까지 열려있다.", difficulty: 'beginner', category: 'education' },
  { id: 27, sentence: "He wants to become a doctor.", meaning: "그는 의사가 되고 싶어한다.", difficulty: 'beginner', category: 'education' },
  { id: 28, sentence: "We learn about history in class.", meaning: "우리는 수업에서 역사에 대해 배운다.", difficulty: 'beginner', category: 'education' },
  { id: 29, sentence: "She helps me with my studies.", meaning: "그녀는 내 공부를 도와준다.", difficulty: 'beginner', category: 'education' },
  { id: 30, sentence: "I enjoy learning new languages.", meaning: "나는 새로운 언어를 배우는 것을 즐긴다.", difficulty: 'beginner', category: 'education' },

  // 취미/여가 관련
  { id: 31, sentence: "I like playing the guitar.", meaning: "나는 기타를 치는 것을 좋아한다.", difficulty: 'beginner', category: 'hobby' },
  { id: 32, sentence: "She loves watching movies.", meaning: "그녀는 영화 보는 것을 좋아한다.", difficulty: 'beginner', category: 'hobby' },
  { id: 33, sentence: "We go hiking on weekends.", meaning: "우리는 주말에 등산을 간다.", difficulty: 'beginner', category: 'hobby' },
  { id: 34, sentence: "He enjoys playing soccer.", meaning: "그는 축구를 하는 것을 즐긴다.", difficulty: 'beginner', category: 'hobby' },
  { id: 35, sentence: "I want to learn how to swim.", meaning: "나는 수영하는 법을 배우고 싶다.", difficulty: 'beginner', category: 'hobby' },
  { id: 36, sentence: "She likes taking photographs.", meaning: "그녀는 사진을 찍는 것을 좋아한다.", difficulty: 'beginner', category: 'hobby' },
  { id: 37, sentence: "We often go to the beach.", meaning: "우리는 자주 해변에 간다.", difficulty: 'beginner', category: 'hobby' },
  { id: 38, sentence: "He is interested in painting.", meaning: "그는 그림 그리기에 관심이 있다.", difficulty: 'beginner', category: 'hobby' },
  { id: 39, sentence: "I love listening to music.", meaning: "나는 음악을 듣는 것을 좋아한다.", difficulty: 'beginner', category: 'hobby' },
  { id: 40, sentence: "She enjoys cooking new recipes.", meaning: "그녀는 새로운 요리법을 만드는 것을 즐긴다.", difficulty: 'beginner', category: 'hobby' },

  // 음식/요리 관련
  { id: 41, sentence: "I love eating Korean food.", meaning: "나는 한국 음식을 먹는 것을 좋아한다.", difficulty: 'beginner', category: 'food' },
  { id: 42, sentence: "She makes delicious cookies.", meaning: "그녀는 맛있는 쿠키를 만든다.", difficulty: 'beginner', category: 'food' },
  { id: 43, sentence: "We had pizza for dinner.", meaning: "우리는 저녁으로 피자를 먹었다.", difficulty: 'beginner', category: 'food' },
  { id: 44, sentence: "He likes spicy food very much.", meaning: "그는 매운 음식을 정말 좋아한다.", difficulty: 'beginner', category: 'food' },
  { id: 45, sentence: "I want to try Japanese sushi.", meaning: "나는 일본 스시를 먹어보고 싶다.", difficulty: 'beginner', category: 'food' },
  { id: 46, sentence: "She is a vegetarian.", meaning: "그녀는 채식주의자다.", difficulty: 'beginner', category: 'food' },
  { id: 47, sentence: "We cook together on Sundays.", meaning: "우리는 일요일에 함께 요리한다.", difficulty: 'beginner', category: 'food' },
  { id: 48, sentence: "He doesn't like vegetables.", meaning: "그는 채소를 좋아하지 않는다.", difficulty: 'beginner', category: 'food' },
  { id: 49, sentence: "I need to buy some bread.", meaning: "나는 빵을 좀 사야 한다.", difficulty: 'beginner', category: 'food' },
  { id: 50, sentence: "She knows how to make pasta.", meaning: "그녀는 파스타 만드는 법을 안다.", difficulty: 'beginner', category: 'food' },

  // 여행/관광 관련
  { id: 51, sentence: "I want to visit Paris someday.", meaning: "나는 언젠가 파리를 방문하고 싶다.", difficulty: 'beginner', category: 'travel' },
  { id: 52, sentence: "She loves traveling to new places.", meaning: "그녀는 새로운 곳을 여행하는 것을 좋아한다.", difficulty: 'beginner', category: 'travel' },
  { id: 53, sentence: "We went to Japan last summer.", meaning: "우리는 작년 여름에 일본에 갔다.", difficulty: 'beginner', category: 'travel' },
  { id: 54, sentence: "He takes many photos when traveling.", meaning: "그는 여행할 때 많은 사진을 찍는다.", difficulty: 'beginner', category: 'travel' },
  { id: 55, sentence: "I like exploring different cultures.", meaning: "나는 다른 문화를 탐험하는 것을 좋아한다.", difficulty: 'beginner', category: 'travel' },
  { id: 56, sentence: "She always packs light for trips.", meaning: "그녀는 여행할 때 항상 가볍게 짐을 싼다.", difficulty: 'beginner', category: 'travel' },
  { id: 57, sentence: "We stayed at a nice hotel.", meaning: "우리는 좋은 호텔에 머물렀다.", difficulty: 'beginner', category: 'travel' },
  { id: 58, sentence: "He enjoys learning local languages.", meaning: "그는 현지 언어를 배우는 것을 즐긴다.", difficulty: 'beginner', category: 'travel' },
  { id: 59, sentence: "I love trying local food when traveling.", meaning: "나는 여행할 때 현지 음식을 먹어보는 것을 좋아한다.", difficulty: 'beginner', category: 'travel' },
  { id: 60, sentence: "She likes to plan trips carefully.", meaning: "그녀는 여행을 신중하게 계획하는 것을 좋아한다.", difficulty: 'beginner', category: 'travel' },

  // 감정/기분 관련
  { id: 61, sentence: "I feel happy today.", meaning: "나는 오늘 행복하다고 느낀다.", difficulty: 'beginner', category: 'emotion' },
  { id: 62, sentence: "She looks sad about something.", meaning: "그녀는 무언가에 대해 슬퍼 보인다.", difficulty: 'beginner', category: 'emotion' },
  { id: 63, sentence: "We are excited about the party.", meaning: "우리는 파티에 대해 흥미진진해한다.", difficulty: 'beginner', category: 'emotion' },
  { id: 64, sentence: "He seems worried about his exam.", meaning: "그는 시험에 대해 걱정하는 것 같다.", difficulty: 'beginner', category: 'emotion' },
  { id: 65, sentence: "I am grateful for your help.", meaning: "나는 당신의 도움에 감사하다.", difficulty: 'beginner', category: 'emotion' },
  { id: 66, sentence: "She feels nervous before presentations.", meaning: "그녀는 발표 전에 긴장한다.", difficulty: 'beginner', category: 'emotion' },
  { id: 67, sentence: "We are proud of our achievements.", meaning: "우리는 우리의 성취에 자랑스럽다.", difficulty: 'beginner', category: 'emotion' },
  { id: 68, sentence: "He looks tired after work.", meaning: "그는 일한 후에 피곤해 보인다.", difficulty: 'beginner', category: 'emotion' },
  { id: 69, sentence: "I am surprised by the news.", meaning: "나는 그 소식에 놀랐다.", difficulty: 'beginner', category: 'emotion' },
  { id: 70, sentence: "She feels confident about her skills.", meaning: "그녀는 자신의 기술에 대해 자신감을 느낀다.", difficulty: 'beginner', category: 'emotion' },

  // 시간/일정 관련
  { id: 71, sentence: "I wake up at 7 AM every day.", meaning: "나는 매일 오전 7시에 일어난다.", difficulty: 'beginner', category: 'time' },
  { id: 72, sentence: "She goes to bed early on weekdays.", meaning: "그녀는 평일에 일찍 잠자리에 든다.", difficulty: 'beginner', category: 'time' },
  { id: 73, sentence: "We have a meeting at 3 PM.", meaning: "우리는 오후 3시에 회의가 있다.", difficulty: 'beginner', category: 'time' },
  { id: 74, sentence: "He arrives home late every evening.", meaning: "그는 매일 저녁 늦게 집에 도착한다.", difficulty: 'beginner', category: 'time' },
  { id: 75, sentence: "I need to leave in 10 minutes.", meaning: "나는 10분 안에 떠나야 한다.", difficulty: 'beginner', category: 'time' },
  { id: 76, sentence: "She spends two hours at the gym.", meaning: "그녀는 체육관에서 2시간을 보낸다.", difficulty: 'beginner', category: 'time' },
  { id: 77, sentence: "We usually have lunch at noon.", meaning: "우리는 보통 정오에 점심을 먹는다.", difficulty: 'beginner', category: 'time' },
  { id: 78, sentence: "He works from 9 AM to 6 PM.", meaning: "그는 오전 9시부터 오후 6시까지 일한다.", difficulty: 'beginner', category: 'time' },
  { id: 79, sentence: "I study for three hours every night.", meaning: "나는 매일 밤 3시간씩 공부한다.", difficulty: 'beginner', category: 'time' },
  { id: 80, sentence: "She takes a break every hour.", meaning: "그녀는 매시간마다 휴식을 취한다.", difficulty: 'beginner', category: 'time' },

  // 날씨/계절 관련
  { id: 81, sentence: "It is raining outside today.", meaning: "오늘 밖에 비가 온다.", difficulty: 'beginner', category: 'weather' },
  { id: 82, sentence: "She loves sunny weather.", meaning: "그녀는 맑은 날씨를 좋아한다.", difficulty: 'beginner', category: 'weather' },
  { id: 83, sentence: "We enjoy skiing in winter.", meaning: "우리는 겨울에 스키를 즐긴다.", difficulty: 'beginner', category: 'weather' },
  { id: 84, sentence: "He likes autumn because of the colors.", meaning: "그는 색깔 때문에 가을을 좋아한다.", difficulty: 'beginner', category: 'weather' },
  { id: 85, sentence: "I prefer warm weather to cold.", meaning: "나는 추운 것보다 따뜻한 날씨를 선호한다.", difficulty: 'beginner', category: 'weather' },
  { id: 86, sentence: "She wears a coat when it's cold.", meaning: "그녀는 추울 때 코트를 입는다.", difficulty: 'beginner', category: 'weather' },
  { id: 87, sentence: "We go swimming in summer.", meaning: "우리는 여름에 수영을 간다.", difficulty: 'beginner', category: 'weather' },
  { id: 88, sentence: "He doesn't like rainy days.", meaning: "그는 비 오는 날을 좋아하지 않는다.", difficulty: 'beginner', category: 'weather' },
  { id: 89, sentence: "I love spring because flowers bloom.", meaning: "나는 꽃이 피기 때문에 봄을 좋아한다.", difficulty: 'beginner', category: 'weather' },
  { id: 90, sentence: "She enjoys walking in the snow.", meaning: "그녀는 눈 속을 걷는 것을 즐긴다.", difficulty: 'beginner', category: 'weather' },

  // 기술/인터넷 관련
  { id: 91, sentence: "I use my computer every day.", meaning: "나는 매일 컴퓨터를 사용한다.", difficulty: 'beginner', category: 'technology' },
  { id: 92, sentence: "She loves using social media.", meaning: "그녀는 소셜 미디어를 사용하는 것을 좋아한다.", difficulty: 'beginner', category: 'technology' },
  { id: 93, sentence: "We watch videos on YouTube.", meaning: "우리는 YouTube에서 영상을 본다.", difficulty: 'beginner', category: 'technology' },
  { id: 94, sentence: "He always checks his phone first.", meaning: "그는 항상 먼저 휴대폰을 확인한다.", difficulty: 'beginner', category: 'technology' },
  { id: 95, sentence: "I need to charge my laptop.", meaning: "나는 노트북을 충전해야 한다.", difficulty: 'beginner', category: 'technology' },
  { id: 96, sentence: "She likes playing mobile games.", meaning: "그녀는 모바일 게임을 하는 것을 좋아한다.", difficulty: 'beginner', category: 'technology' },
  { id: 97, sentence: "We communicate through email.", meaning: "우리는 이메일을 통해 소통한다.", difficulty: 'beginner', category: 'technology' },
  { id: 98, sentence: "He works as a software developer.", meaning: "그는 소프트웨어 개발자로 일한다.", difficulty: 'beginner', category: 'technology' },
  { id: 99, sentence: "I learn programming online.", meaning: "나는 온라인에서 프로그래밍을 배운다.", difficulty: 'beginner', category: 'technology' },
  { id: 100, sentence: "She helps me with computer problems.", meaning: "그녀는 컴퓨터 문제를 도와준다.", difficulty: 'beginner', category: 'technology' }
];

// 랜덤하게 문장을 선택하는 함수
export const getRandomSentences = (count: number): Sentence[] => {
  const shuffled = [...sentences].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, sentences.length));
};
