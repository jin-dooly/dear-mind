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
      message:
        "동생이 보낸 사진 한 장에 지하철에서 혼자 웃음이 터진 장면이 참 다정하게 그려져요. 그런 작은 순간을 알아보는 마음이 요즘의 하루를 든든하게 받쳐 주고 있나 봐요",
    },
  },
  {
    daysAgo: 2,
    hour: 23,
    level: 3,
    question: "최근에 누군가에게 하지 못한 말이 있나요?",
    content: `오늘 회의 때 일. 일정 얘기하다가 내가 "이거 이번 주 안에는 무리일 것 같다"고 했는데 아무도 대답을 안 하고 그냥 다음 안건으로 넘어갔다. 진짜 아무도. 팀장님은 노트북만 보고 있었고.

근데 웃긴 게 30분 뒤에 옆 팀 과장님이 거의 똑같은 말을 하니까 다들 "아 그렇네요, 일정 다시 봐야겠네요" 이러는 거다. 그 순간 얼굴이 좀 뜨거워졌다. 화가 났다기보다는... 뭐랄까 내가 투명인간이 된 느낌?

그 자리에선 그냥 웃었다. 괜찮은 척하는 건 이제 너무 자연스러워서 나도 내가 괜찮은 줄 알았는데, 집 와서 씻는데 그 장면이 계속 떠오르는 거 보면 안 괜찮았나 보다.

생각해 보면 내가 말을 너무 조심스럽게 해서 그런 것도 있다. "~것 같아요", "혹시 괜찮으시면" 이런 말을 앞뒤로 너무 붙이니까 의견이 아니라 혼잣말처럼 들렸을 수도. 그렇다고 내 탓만 하고 싶진 않은데 ㅋㅋ 그것도 좀 억울하고.

하고 싶었던 말은 "아까 제가 말한 거랑 같은 얘기예요" 이 한 마디였다. 그게 왜 그렇게 어려웠을까. 다음엔 한 번은 말해 보고 싶다. 크게 말고 그냥 담담하게.`,
    analysis: {
      summary:
        "무시당한 것 같은 서운함 아래에, 내 목소리를 조금 더 믿어 보고 싶은 마음이 보여요. 괜찮은 척이 익숙해진 만큼 이번 일이 오래 남은 것 같아요",
      tone_keywords: ["서운함", "속상함", "다짐"],
      message:
        "투명인간이 된 것 같던 그 순간에도 웃으며 자리를 지킨 건, 그만큼 상황을 먼저 배려하는 사람이라서일 거예요. 내 탓만 하기엔 억울하다는 그 마음도, 담담하게 한 번 말해 보고 싶다는 마음도 모두 소중한 목소리예요",
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
      message:
        "처음 가 본 가게가 기대보다 맛있던 날은 하루가 조금 특별해지죠. 선선한 날씨에 일부러 돌아서 걸어온 그 길이 오늘의 작은 선물이었나 봐요",
    },
  },
  {
    daysAgo: 6,
    hour: 23,
    level: 2,
    question: "요즘 나를 가장 지치게 하는 건 무엇인가요?",
    content: `솔직히 일 자체보다 일 생각이 더 지친다. 할 일 목록이 줄어들지를 않음. 하나 지우면 두 개가 새로 생기고, 금요일에 다 끝냈다 싶으면 월요일 아침에 또 메일이 와 있고.

지난 주말에 친구들이랑 카페 갔는데 대화하다가도 자꾸 "아 그거 월요일에 확인해야 되는데" 이런 생각이 끼어들었다. 몸은 쉬고 있는데 머리는 계속 출근해 있는 느낌. 그래서 일요일 저녁쯤 되면 쉰 것 같지가 않고 오히려 더 피곤하다.

예전엔 안 이랬던 것 같은데 언제부터 이렇게 됐지? 작년 이맘때는 퇴근하면 진짜 퇴근이었는데. 일이 늘어난 것도 있지만 내가 "다 잘 해내야 한다"는 걸 너무 꽉 쥐고 있어서 그런 것 같기도 하다. 하나라도 빠뜨리면 큰일 날 것 같은 기분.

근데 쓰다 보니까 진짜 큰일 난 적은 거의 없었다 ㅋㅋ 빠뜨린 것도 대부분 다음 날 하면 됐던 것들이고.

이번 주말엔 업무 알림 꺼 보려고 한다. 슬랙 앱 지우는 건 무섭고... 알림만이라도. 일단 거기서부터.`,
    analysis: {
      summary:
        "쉬는 시간에도 마음이 일에서 내려오지 못해 지친 것 같아요. 다 잘 해내야 한다는 생각을 조금 느슨하게 쥐어 보려는 마음도 함께 보여요",
      tone_keywords: ["지침", "조급함", "부담감"],
      message:
        "주말에도 머릿속이 출근해 있었다는 건, 그만큼 하나도 놓치지 않으려고 애써 왔다는 뜻이에요. 쓰다가 \"진짜 큰일 난 적은 거의 없었다\"고 알아차린 순간이, 알림 하나를 끄는 작은 시작을 조금 더 가볍게 해 줄 거예요",
    },
  },
  {
    daysAgo: 9,
    hour: 22,
    level: 3,
    question: "지금의 나에게 가장 필요한 위로는 무엇인가요?",
    content: `질문 보고 한참 생각했다. 위로... 처음 떠오른 건 "잘하고 있어"였는데 그건 아닌 것 같다. 그 말은 이미 많이 들었고 들을 때마다 고맙긴 한데 이상하게 더 잘해야 할 것 같은 기분이 든다. 잘하고 있으니까 계속 잘해, 이렇게 들리는 느낌.

내가 듣고 싶은 건 "지금 이대로도 괜찮아" 쪽인 것 같다. 뭘 더 하지 않아도, 지금 멈춰 있어도 괜찮다는 말.

돌아보면 나는 늘 다음 걸 보고 있었다. 시험 붙으면 취업, 취업하면 이직 준비, 운동 시작하면 몸무게 목표. 하나 이루면 기뻐할 틈도 없이 다음 칸으로 넘어갔다. 그래서 지금의 나한테는 한 번도 "수고했다"고 말해 준 적이 없는 것 같다. 항상 아직 덜 된 나였으니까.

그게 좀 미안하다. 나한테. 이상한 말이지만.

엄마가 예전에 "너는 왜 맨날 바빠?" 하신 적 있는데 그땐 그냥 웃고 넘겼다. 근데 그게 일정이 바쁘다는 얘기가 아니라 마음이 바쁘다는 얘기였을 수도 있겠다는 생각이 지금 든다.

오늘은 그냥 지금의 나한테 괜찮다고 해 주고 자야지. 어색하지만.`,
    analysis: {
      summary:
        "앞만 보며 달리느라 지금의 나를 한 번도 안아 주지 못했다는 걸 깨닫고 있어요. 더 잘하라는 응원보다 멈춰도 괜찮다는 허락이 필요했던 것 같아요",
      tone_keywords: ["깨달음", "애틋함", "지침"],
      message:
        "늘 다음 칸을 향해 달려온 시간 덕분에 지금의 내가 여기 있는 거예요. 한 번도 듣지 못했던 \"수고했어\"를 오늘 처음 스스로에게 건넨다면, 어색한 그 한마디가 생각보다 오래 마음을 데워 줄 거예요",
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
      message:
        "핸드폰 없이 책만 읽는 한두 시간, 떠올리기만 해도 마음이 조금 조용해지는 것 같아요. 이번 주말에는 그 설렘을 따라 도서관에 들러 봐도 좋겠어요",
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
      message:
        "말없이 놓인 커피 한 잔에는 \"수고하고 있어\"라는 말이 담겨 있었을 거예요. 그 마음을 받아 끝까지 해낸 오늘의 나도 충분히 뿌듯해해도 괜찮아요",
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
      message:
        "잘 살고 있는지 묻는 질문에 거창한 답이 없어도 괜찮아요. 주말 아침의 음악과 커피, 친구들과 나누는 웃음처럼 작은 시간들을 알아보는 눈이 앞으로도 길을 밝혀 줄 거예요",
    },
  },
  {
    daysAgo: 20,
    hour: 21,
    level: 2,
    question: "요즘 자주 떠오르는 사람이 있나요?",
    content: `대학 때 맨날 붙어 다니던 친구 J. 수업 끝나면 학교 앞 떡볶이집 가서 두 시간씩 떠들고, 시험 기간엔 도서관에서 공부는 안 하고 둘이 과자만 먹었다 ㅋㅋ

졸업하고 J는 지방으로 내려가고 나는 서울에 남았다. 처음엔 자주 연락했는데 서로 바빠지니까 답장이 하루 늦고, 일주일 늦고, 어느 순간 생일 때만 연락하는 사이가 됐다. 올해는 그것도 못 했다. 생일 지나고 나서야 알았음.

요즘 자꾸 생각나는 건 출근길에 J가 좋아하던 노래가 셔플로 나와서다. 그 노래 나오면 J가 버스에서 이어폰 한쪽 빼서 나한테 주던 장면이 그대로 떠오른다. 별것도 아닌 장면인데.

연락해 볼까 몇 번이나 카톡 창을 열었다. 근데 "잘 지내?" 치고 지우고, "갑자기 생각나서" 치고 또 지우고. 너무 오랜만이라 뭐라고 해야 할지 모르겠다. 혹시 J는 나를 별로 안 궁금해하면 어떡하지 싶기도 하고.

근데 반대로 J가 나한테 먼저 연락 오면 나는 엄청 반가울 것 같다. 그럼 J도 그렇지 않을까?

이번 주 안에는 보내 보자. 그 노래 링크랑 같이 보내면 덜 어색할 것 같다.`,
    analysis: {
      summary:
        "멀어진 시간만큼 망설여지지만, 다시 닿고 싶은 그리움이 더 커지고 있는 것 같아요. 내가 반가울 것처럼 상대도 반가울 거라고 마음을 고쳐 보고 있어요",
      tone_keywords: ["그리움", "애틋함", "용기"],
      message:
        "이어폰 한쪽을 나눠 듣던 장면이 아직 이렇게 선명한 걸 보면, J와 보낸 시간이 그만큼 따뜻했나 봐요. 그 노래 링크에 담긴 마음이라면 몇 년의 공백보다 \"갑자기 생각났어\"라는 반가움이 먼저 닿을 것 같아요",
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
      message:
        "몇 달을 미뤄 온 일을 2주째 이어 가고 있다는 건 결코 작은 일이 아니에요. 스스로 정한 약속을 지켜 온 그 마음이면 앞으로도 충분히 이어 갈 수 있어요",
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
