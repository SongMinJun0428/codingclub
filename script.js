// script.js (Supabase 관련 로직 - 수정됨)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://jzkqqqofveivqaerqwcl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6a3FxcW9mdmVpdnFhZXJxd2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NjEwMzQsImV4cCI6MjA2MjUzNzAzNH0.PYB6fyfyAxaZBK76kUnPe5d7EQKWXfCBBIlvdNPwyq0'
);

async function initXp(userId) {
    const { data } = await supabase
        .from('club_xp')
        .select('*')
        .eq('user_id', userId)
        .eq('club_name', '코딩동아리');

    if (data.length === 0) {
        await supabase.from('club_xp').insert([
            { user_id: userId, club_name: '코딩동아리', xp: 0 }
        ]);
    }
}

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
        let level = "🌱 새싹";
        let levelNumber = 1;
        let grade = "Beginner";

        if (xp >= 500) {
            level = "🧙 마스터";
            levelNumber = 6;
            grade = "Master";
        } else if (xp >= 300) {
            level = "🔥 고수";
            levelNumber = 5;
            grade = "Expert";
        } else if (xp >= 200) {
            level = "💡 중수";
            levelNumber = 4;
            grade = "Intermediate";
        } else if (xp >= 100) {
            level = "✨ 초보";
            levelNumber = 3;
            grade = "Novice";
        } else if (xp >= 50) {
            level = "🐣 병아리"; // 등급명 변경
            levelNumber = 2;
            grade = "Apprentice";
        } else {
            level = "🌱 새싹";
            levelNumber = 1;
            grade = "Beginner";
        }

        document.getElementById("xp-status").innerHTML = `
            🎖️ <strong>${level}</strong> (등급: ${grade})<br>
            📈 레벨: <strong>LV.${levelNumber}</strong><br>
            ⚡ 경험치: <strong>${xp} XP</strong>
        `;
    }
}

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

window.logoutSupabase = async function () {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        localStorage.clear();
        location.reload();
    } else {
        console.error("로그아웃 실패:", error);
        alert("로그아웃에 실패했습니다.");
    }
}

window.onload = async () => {
    if (localStorage.getItem("loggedIn") === "true") {
        const username = localStorage.getItem("username") || localStorage.getItem("localUsername");
        showMainContent(username); // showMainContent 함수에서 updateXp 호출
    }
}

window.initXp = initXp;
window.updateXp = updateXp;
window.addXP = addXP;