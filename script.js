// script.js (Supabase 관련 로직 - 수정됨)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


window.supabase = createClient(
  'https://jzkqqqofveivqaerqwcl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6a3FxcW9mdmVpdnFhZXJxd2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NjEwMzQsImV4cCI6MjA2MjUzNzAzNH0.PYB6fyfyAxaZBK76kUnPe5d7EQKWXfCBBIlvdNPwyq0'
);

window.currentXP = 0;
window.currentLevel = 1;


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
        let level = "🌱 씨앗";
        let levelNumber = 1;
        let grade = "Beginner";

        if (xp >= 950) {
        level = "🧠 인공지능 교관"; levelNumber = 25; grade = "AI Instructor";
        } else if (xp >= 900) {
        level = "🏆 전설의 코더"; levelNumber = 24; grade = "Legend";
        } else if (xp >= 850) {
        level = "🦾 미래 설계자"; levelNumber = 23; grade = "Visionary";
        } else if (xp >= 800) {
        level = "🎯 문제 스나이퍼"; levelNumber = 22; grade = "Problem Sniper";
        } else if (xp >= 750) {
        level = "🧩 해결사"; levelNumber = 21; grade = "Solver";
        } else if (xp >= 700) {
        level = "🚀 혁신가"; levelNumber = 20; grade = "Innovator";
        } else if (xp >= 650) {
        level = "💼 팀 리더"; levelNumber = 19; grade = "Team Leader";
        } else if (xp >= 600) {
        level = "🧙 마스터"; levelNumber = 18; grade = "Master";
        } else if (xp >= 550) {
        level = "🧪 실험자"; levelNumber = 17; grade = "Experimenter";
        } else if (xp >= 500) {
        level = "🧬 설계자"; levelNumber = 16; grade = "Architect";
        } else if (xp >= 450) {
        level = "⚙️ 자동화 초급"; levelNumber = 15; grade = "Automation Novice";
        } else if (xp >= 400) {
        level = "🔥 숙련자"; levelNumber = 14; grade = "Advanced";
        } else if (xp >= 350) {
        level = "📊 분석가"; levelNumber = 13; grade = "Analyst";
        } else if (xp >= 300) {
        level = "🧠 이해자"; levelNumber = 12; grade = "Thinker";
        } else if (xp >= 250) {
        level = "💬 발표자"; levelNumber = 11; grade = "Presenter";
        } else if (xp >= 220) {
        level = "💡 실습자"; levelNumber = 10; grade = "Practitioner";
        } else if (xp >= 190) {
        level = "🔧 연습생"; levelNumber = 9; grade = "Trainee";
        } else if (xp >= 160) {
        level = "🧩 입문자"; levelNumber = 8; grade = "Novice";
        } else if (xp >= 130) {
        level = "✨ 초보"; levelNumber = 7; grade = "Beginner+";
        } else if (xp >= 100) {
        level = "☘️ 쌍잎"; levelNumber = 6; grade = "Apprentice";
        } else if (xp >= 70) {
        level = "🍀 잎사귀"; levelNumber = 5; grade = "Leaf";
        } else if (xp >= 40) {
        level = "🌿 새싹"; levelNumber = 4; grade = "Sprout";
        } else if (xp >= 20) {
        level = "🌼 발아자"; levelNumber = 3; grade = "Seedling";
        } else if (xp >= 10) {
        level = "🪴 준비중"; levelNumber = 2; grade = "Growing";
        } else {
        level = "🌱 씨앗"; levelNumber = 1; grade = "Beginner";
        }


        document.getElementById("xp-status").innerHTML = `
            🎖️ <strong>${level}</strong> (등급: ${grade})<br>
            📈 레벨: <strong>LV.${levelNumber}</strong><br>
            ⚡ 경험치: <strong>${xp} XP</strong>
        `;
        window.currentXP = xp;
        window.currentLevel = levelNumber;


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