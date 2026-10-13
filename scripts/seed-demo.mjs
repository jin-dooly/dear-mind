// 체험 계정을 만들거나 처음 상태로 되돌림. 여러 번 실행해도 됨
//   npm run seed:demo
// - 계정이 없으면 만들고, 있으면 비밀번호·프로필을 되돌림
// - 체험 계정의 질문·기록을 모두 지우고 샘플 기록을 다시 넣음 (날짜는 실행한 날 기준 최근 한 달)
// 필요한 환경 변수: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY (또는 SUPABASE_SERVICE_ROLE_KEY)

import { createClient } from "@supabase/supabase-js";

// app/lib/demoAccount.ts와 같은 값
const DEMO_EMAIL = "demo@dear-mind.example.com";
const DEMO_PASSWORD = "dearmind1234";

const PROFILE = { age_group: "20대", base_level: 2, nickname: "여행자" };

/** daysAgo일 전 저녁(한국 시간)에 쓴 글. 분석 키워드는 app/lib/emotions.ts 안의 단어만 씀 */
const SAMPLES = [
  {
    daysAgo: 1,
    hour: 22,
    level: 2,
    question: "요즘 나를 가장 많이 웃게 하는 건 무엇인가요?",
    content:
      "퇴근길에 동생이 보내 준 고양이 사진. 별것 아닌데 그 사진 하나로 지하철에서 혼자 웃었다. 요즘은 큰 일보다 이런 작은 순간들이 하루를 버티게 해 주는 것 같다.",
    analysis: {
      summary: "작은 순간이 하루를 지탱해 준다는 걸 알아차리고 있는 것 같아요",
      tone_keywords: ["즐거움", "감사", "편안함"],
      message: "그런 순간을 알아보는 마음이 있다는 게 참 다정해요",
    },
  },
  {
    daysAgo: 2,
    hour: 23,
    level: 3,
    question: "최근에 누군가에게 하지 못한 말이 있나요?",
    content:
      "회의에서 내 의견이 그냥 지나갔을 때 사실 좀 서운했다. 그 자리에서는 괜찮은 척했는데, 집에 와서도 계속 생각났다. 다음엔 한 번 더 말해 볼 수 있을까.",
    analysis: {
      summary: "괜찮은 척 넘긴 마음이 아직 대답을 기다리고 있는 것 같아요",
      tone_keywords: ["서운함", "아쉬움", "다짐"],
      message: "한 번 더 말해 보고 싶다는 마음, 그것만으로도 충분히 용기예요",
    },
  },
  {
    daysAgo: 4,
    hour: 21,
    level: 1,
    question: "오늘 하루 중 가장 마음에 들었던 순간은?",
    content: "점심에 처음 가 본 국숫집이 생각보다 훨씬 맛있었다. 날씨도 선선해서 조금 돌아서 걸어왔다.",
    analysis: {
      summary: "새로운 곳에서 만난 작은 기쁨을 천천히 누린 하루였네요",
      tone_keywords: ["기쁨", "여유", "만족"],
      message: "돌아서 걸어온 그 길이 오늘의 작은 선물이었나 봐요",
    },
  },
  {
    daysAgo: 6,
    hour: 23,
    level: 2,
    question: "요즘 나를 가장 지치게 하는 건 무엇인가요?",
    content:
      "할 일 목록이 줄어들지 않는다. 하나 끝내면 두 개가 생긴다. 쉬는 날에도 머릿속에서 일이 떠나지 않아서 제대로 쉰 느낌이 없다.",
    analysis: {
      summary: "쉬는 시간에도 마음이 일에서 내려오지 못해 지친 것 같아요",
      tone_keywords: ["지침", "조급함", "부담감"],
      message: "그만큼 애쓰고 있었다는 뜻이에요. 오늘은 조금 내려놓아도 괜찮아요",
    },
  },
  {
    daysAgo: 9,
    hour: 22,
    level: 3,
    question: "지금의 나에게 가장 필요한 위로는 무엇인가요?",
    content:
      "잘하고 있다는 말보다, 지금 이대로도 괜찮다는 말이 듣고 싶다. 늘 다음 목표를 세우느라 지금의 나를 한 번도 인정해 준 적이 없는 것 같다.",
    analysis: {
      summary: "앞만 보느라 지금의 나를 안아 주지 못했다는 걸 깨닫고 있어요",
      tone_keywords: ["깨달음", "애틋함", "외로움"],
      message: "그 말을 스스로에게 먼저 건네 보는 것도 좋을 것 같아요",
    },
  },
  {
    daysAgo: 12,
    hour: 20,
    level: 2,
    question: "최근에 새롭게 시작해 보고 싶은 일이 있나요?",
    content:
      "주말마다 동네 도서관에 가 보고 싶다. 핸드폰 없이 한두 시간 책만 읽는 시간. 생각만 해도 조금 설렌다.",
    analysis: {
      summary: "조용히 나에게만 집중하는 시간을 바라고 있는 것 같아요",
      tone_keywords: ["설렘", "기대", "호기심"],
      message: "이번 주말, 그 설렘을 한번 따라가 보면 어떨까요",
    },
  },
  {
    daysAgo: 12,
    hour: 23,
    level: 1,
    question: "오늘 나에게 고마웠던 사람은 누구인가요?",
    content: "야근하는데 옆자리 선배가 말없이 커피를 두고 갔다. 덕분에 끝까지 할 수 있었다.",
    analysis: {
      summary: "말없이 건네받은 마음 덕분에 힘을 낼 수 있었네요",
      tone_keywords: ["감사", "안도", "뿌듯함"],
      message: "그 커피 한 잔이 오래 따뜻하게 남을 것 같아요",
    },
  },
  {
    daysAgo: 16,
    hour: 22,
    level: 4,
    question: "지금의 삶을 계속 살아도 된다고 느끼게 만드는 것은 무엇인가요?",
    content:
      "가끔 내가 잘 살고 있는 건지 모르겠다. 그래도 주말 아침에 좋아하는 음악을 틀고 커피를 내리는 시간, 친구들과 별것 아닌 얘기로 웃는 시간이 있으면 괜찮다고 느낀다. 거창한 이유보다 이런 시간들이 나를 붙잡아 주는 것 같다.",
    analysis: {
      summary: "거창한 답 대신 일상의 작은 시간들에서 살아갈 이유를 찾고 있어요",
      tone_keywords: ["담담함", "평온함", "희망"],
      message: "그 작은 시간들을 알아보는 눈이 앞으로도 길을 밝혀 줄 거예요",
    },
  },
  {
    daysAgo: 20,
    hour: 21,
    level: 2,
    question: "요즘 자주 떠오르는 사람이 있나요?",
    content:
      "대학 때 자주 같이 다니던 친구. 연락이 끊긴 지 꽤 됐는데, 요즘 그 친구가 좋아하던 노래를 들으면 생각난다. 먼저 연락해 볼까 고민 중이다.",
    analysis: {
      summary: "멀어진 인연을 다시 이어 보고 싶은 마음이 조금씩 자라고 있네요",
      tone_keywords: ["그리움", "애틋함", "용기"],
      message: "먼저 건네는 안부 한마디가 생각보다 반갑게 닿을지도 몰라요",
    },
  },
  {
    daysAgo: 25,
    hour: 22,
    level: 3,
    question: "최근에 스스로가 자랑스러웠던 순간이 있나요?",
    content:
      "몇 달 동안 미뤄 왔던 운동을 드디어 2주째 이어 가고 있다. 대단한 건 아니지만, 내가 정한 약속을 지키고 있다는 게 뿌듯하다.",
    analysis: {
      summary: "스스로와의 약속을 지켜 가는 나를 조금씩 믿게 되는 것 같아요",
      tone_keywords: ["뿌듯함", "자신감", "의욕"],
      message: "2주를 이어 온 그 마음이면 앞으로도 충분히 이어 갈 수 있어요",
    },
  },
];

/** 오늘(한국 날짜)에서 daysAgo일 전 hour시(한국 시간)의 ISO 문자열 */
function kstDate(daysAgo, hour) {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
  const nowKst = new Date(Date.now() + KST_OFFSET_MS);
  const utc = Date.UTC(
    nowKst.getUTCFullYear(),
    nowKst.getUTCMonth(),
    nowKst.getUTCDate() - daysAgo,
    hour,
  );
  return new Date(utc - KST_OFFSET_MS).toISOString();
}

async function findUserByEmail(supabase, email) {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const user = data.users.find((u) => u.email === email);
    if (user) return user;
    if (data.users.length < 200) return null;
  }
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secretKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY 환경 변수가 필요해요");
  }
  const supabase = createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. 계정 (이메일 인증 없이 바로 로그인할 수 있게 확인 처리)
  let user = await findUserByEmail(supabase, DEMO_EMAIL);
  if (user) {
    const { error } = await supabase.auth.admin.updateUserById(user.id, { password: DEMO_PASSWORD });
    if (error) throw error;
    console.log("체험 계정 비밀번호를 되돌렸어요");
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { name: PROFILE.nickname },
    });
    if (error) throw error;
    user = data.user;
    console.log("체험 계정을 만들었어요");
  }

  // 2. 프로필 (온보딩을 마친 상태로). 레벨 제안 집계는 샘플 기록 이후부터
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ ...PROFILE, level_counted_since: new Date().toISOString() })
    .eq("id", user.id);
  if (profileError) throw profileError;

  // 3. 기존 기록·질문 삭제 (ai_analyses는 journals와 함께 지워짐)
  for (const table of ["journals", "questions"]) {
    const { error } = await supabase.from(table).delete().eq("user_id", user.id);
    if (error) throw error;
  }

  // 4. 샘플 기록과 분석
  for (const sample of SAMPLES) {
    const createdAt = kstDate(sample.daysAgo, sample.hour);
    const { data: journal, error } = await supabase
      .from("journals")
      .insert({
        user_id: user.id,
        question_content: sample.question,
        level: sample.level,
        content: sample.content,
        created_at: createdAt,
      })
      .select("id")
      .single();
    if (error) throw error;

    const { error: analysisError } = await supabase
      .from("ai_analyses")
      .insert({ journal_id: journal.id, ...sample.analysis, created_at: createdAt });
    if (analysisError) throw analysisError;
  }
  console.log(`샘플 기록 ${SAMPLES.length}개를 넣었어요`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
