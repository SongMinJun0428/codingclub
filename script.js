import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ✅ Supabase 초기화
window.supabase = createClient(
  'https://jzkqqqofveivqaerqwcl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6a3FxcW9mdmVpdnFhZXJxd2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NjEwMzQsImV4cCI6MjA2MjUzNzAzNH0.PYB6fyfyAxaZBK76kUnPe5d7EQKWXfCBBIlvdNPwyq0'
);

// ✅ 전역 상태
window.currentXP = 0;
window.currentLevel = 1;
window.purchasedItems = new Set();

// ✅ 레벨/등급표
const LEVELS = [
  { xp: 0, icon: "🌱", name: "씨앗", grade: "Beginner", level: 1 },
  { xp: 10, icon: "🪴", name: "준비중", grade: "Growing", level: 2 },
  { xp: 20, icon: "🌼", name: "발아자", grade: "Seedling", level: 3 },
  { xp: 40, icon: "🌿", name: "새싹", grade: "Sprout", level: 4 },
  { xp: 70, icon: "🍀", name: "잎사귀", grade: "Leaf", level: 5 },
  { xp: 100, icon: "☘️", name: "쌍잎", grade: "Apprentice", level: 6 },
  { xp: 130, icon: "✨", name: "초보", grade: "Beginner+", level: 7 },
  { xp: 160, icon: "🧩", name: "입문자", grade: "Novice", level: 8 },
  { xp: 190, icon: "🔧", name: "연습생", grade: "Trainee", level: 9 },
  { xp: 220, icon: "💡", name: "실습자", grade: "Practitioner", level: 10 },
  { xp: 250, icon: "💬", name: "발표자", grade: "Presenter", level: 11 },
  { xp: 300, icon: "🧠", name: "이해자", grade: "Thinker", level: 12 },
  { xp: 350, icon: "📊", name: "분석가", grade: "Analyst", level: 13 },
  { xp: 400, icon: "🔥", name: "숙련자", grade: "Advanced", level: 14 },
  { xp: 450, icon: "⚙️", name: "자동화 초급", grade: "Automation Novice", level: 15 },
  { xp: 500, icon: "🧬", name: "설계자", grade: "Architect", level: 16 },
  { xp: 550, icon: "🧪", name: "실험자", grade: "Experimenter", level: 17 },
  { xp: 600, icon: "🧙", name: "마스터", grade: "Master", level: 18 },
  { xp: 650, icon: "💼", name: "팀 리더", grade: "Team Leader", level: 19 },
  { xp: 700, icon: "🚀", name: "혁신가", grade: "Innovator", level: 20 },
  { xp: 750, icon: "🧩", name: "해결사", grade: "Solver", level: 21 },
  { xp: 800, icon: "🎯", name: "문제 스나이퍼", grade: "Problem Sniper", level: 22 },
  { xp: 850, icon: "🦾", name: "미래 설계자", grade: "Visionary", level: 23 },
  { xp: 900, icon: "🏆", name: "전설의 코더", grade: "Legend", level: 24 },
  { xp: 950, icon: "🧠", name: "인공지능 교관", grade: "AI Instructor", level: 25 },
  { xp: 1000, icon: "👑", name: "전설의 개발자", grade: "Grandmaster", level: 26 }
];

// ✅ 현재 XP로 등급 계산
function getLevelInfo(xp) {
  let current = LEVELS[0];
  let next = null;

  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
    }
  }

  const toNext = next ? next.xp - xp : 0;

  return {
    ...current,
    toNext,
    nextLevel: next?.level ?? null,
    nextName: next?.name ?? null
  };
}

// ✅ XP 초기화
async function initXp(userId) {
  const { data } = await supabase
    .from('club_xp')
    .select('*')
    .eq('user_id', userId)
    .eq('club_name', '코딩동아리');

  if (!data || data.length === 0) {
    await supabase.from('club_xp').insert([
      { user_id: userId, club_name: '코딩동아리', xp: 0 }
    ]);
  }
}

// ✅ XP 업데이트 및 화면 표시
async function updateXp(userId) {
  const { data, error } = await supabase
    .from('club_xp')
    .select('xp')
    .eq('user_id', userId)
    .eq('club_name', '코딩동아리');

  if (error) {
    console.error("XP 조회 실패:", error.message);
    return;
  }

  if (data.length > 0) {
    const xp = data[0].xp;
    const info = getLevelInfo(xp);

    document.getElementById("xp-status").innerHTML = `
      🎖️ <strong>${info.icon} ${info.name}</strong> (등급: ${info.grade})<br>
      📈 레벨: <strong>LV.${info.level}</strong><br>
      ⚡ 경험치: <strong>${xp} XP</strong><br>
      ${info.toNext > 0 ? `⏳ 다음 등급(${info.nextName})까지 <strong>${info.toNext} XP</strong> 남음` : "🎉 최고 등급입니다!"}
    `;

    window.currentXP = xp;
    window.currentLevel = info.level;
  }
}

// ✅ XP 증가
async function addXP(amount = 10) {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const { data } = await supabase
    .from('club_xp')
    .select('*')
    .eq('user_id', userId)
    .eq('club_name', '코딩동아리');

  if (data.length > 0) {
    const current = data[0].xp;
    await supabase
      .from('club_xp')
      .update({ xp: current + amount })
      .eq('id', data[0].id);

    updateXp(userId);
  }
}

// ✅ 전체 등급표 표시
function renderLevelTable() {
  const container = document.getElementById("level-table");
  container.innerHTML = `
    <h3 class="text-lg font-bold mb-2">📊 전체 등급표</h3>
    ${LEVELS.map(lvl => `
      <div class="border-b py-1">
        ${lvl.icon} <strong>LV.${lvl.level}</strong> - ${lvl.name} 
        (<span class="text-gray-600">${lvl.grade}</span>) 
        <span class="text-xs text-gray-500 ml-2">XP ${lvl.xp} 이상</span>
      </div>
    `).join("")}
  `;
}

// ✅ 로그아웃
window.logoutSupabase = async function () {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    localStorage.clear();
    location.reload();
  } else {
    console.error("로그아웃 실패:", error);
    alert("로그아웃에 실패했습니다.");
  }
};

// ✅ onload 시 실행
window.onload = async () => {
  if (localStorage.getItem("loggedIn") === "true") {
    const username = localStorage.getItem("username") || localStorage.getItem("localUsername");
    showMainContent(username);
    await updateXp(localStorage.getItem("userId"));
    if (typeof loadPurchasedItems === 'function') await loadPurchasedItems();
    renderLevelTable(); // ✅ 등급표 출력
  }
};



// ✅ 전역 함수 등록
window.initXp = initXp;
window.updateXp = updateXp;
window.addXP = addXP;

