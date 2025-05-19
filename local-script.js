// local-script.js (로컬 스토리지 및 UI 관련 로직 - 수정됨)

function openTab(event, tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelectorAll('.tab-button').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
}

const users = {
    "admin": "1234",
    "박우승": "p4783907",
    "육성현": "09020821!!",
    "이채환": "nano8778",
    "김하람": "akaski2006",
    "이도현": "",
    "박시우": "icanho75",
    "박용현": "younghyeon",
    "guest1" : "",
    "guest2" : ""
};

// ✅ 로그인 처리 (로컬 스토리지 기반)
function loginLocal() {
    const id = document.getElementById("login-id").value.trim();
    const pw = document.getElementById("login-pw").value.trim();

    if (users[id] === pw) {
        // ✅ 로그인 상태 저장
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("localUsername", id);
        localStorage.setItem("username", id);
        localStorage.setItem("userId", id); // ✅ Supabase에서 사용할 ID
        localStorage.setItem("isAdmin", id === "admin" ? "true" : "false");

        // ✅ 화면 전환 및 초기화
        showMainContent(id);
        markAttendance();
        initXp(id);
        addXP(10);
        // updateXp(id); // showMainContent에서 호출
        restoreMemo();
    } else {
        document.getElementById("login-error").classList.remove("hidden");
    }
}

function showMainContent(username) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
    document.getElementById("welcome-text").textContent = `👋 ${username}님 환영합니다!`;
    if (localStorage.getItem("isAdmin") === "true") {
        const adminButton = document.getElementById("gotoButton");
        if (adminButton) adminButton.classList.remove("hidden");
        const adminShortcut = document.getElementById("admin-shortcut");
        if (adminShortcut) adminShortcut.classList.remove("hidden");
    }
    updateXp(username); // 여기서 updateXp 호출
}

// ✅ 페이지 로드 시 로그인 상태 확인
window.onload = () => {
    if (localStorage.getItem("loggedIn") === "true") {
        const username = localStorage.getItem("username") || localStorage.getItem("localUsername");
        showMainContent(username);
        markAttendance();
        initXp(username);
        // updateXp(username); // showMainContent에서 호출
        restoreMemo();
    }
};

// ✅ 로그아웃 (로컬 스토리지 기반)
function logoutLocal() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("localUsername");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    location.reload();
}

// ✅ 출석 체크 (로컬 스토리지 기반)
// 📝 메모 자동 저장 (로컬 스토리지 기반)

// 💻 파이썬 실행 (Skulpt 사용 안 함)
function runPython() {
    alert("파이썬 실행 기능은 현재 지원하지 않습니다.");
}

// ✅ 관리자 인증 및 ID/PW 확인 (로컬 스토리지 기반)
function checkUser() {
    const value = document.getElementById("userInput").value.trim();
    const result = document.getElementById("result");
    const button = document.getElementById("gotoButton");

    const userInfo = {
        "박우승": "박우승13570 / 621843",
        "육성현": "육성현77373 / 214898",
        "이채환": "이채환31948 / bd1234",
        "김하람": "김하람28476 / 706587",
        "이도현": "이도현39857 / bd1234",
        "박시우": "박시우15328 / bd1234",
        "박용현": "박용현49224 / bd1234"
    };

    if (userInfo[value]) {
        const [id, pw] = userInfo[value].split(" / ");
        result.textContent = `✅ ID: ${id} | Password: ${pw}`;
        button.classList.add('hidden');
    } else if (value === "1234" && localStorage.getItem("isAdmin") === "true") {
        result.textContent = "✅ 관리자 인증 성공";
        button.classList.remove('hidden'); // 관리자 버튼 보이기
    } else {
        result.textContent = "해당 이름 또는 비밀번호를 찾을 수 없습니다.";
        button.classList.add('hidden');
    }
}


function toggleCalendar() {
    const container = document.getElementById("calendar-container");
    container.classList.toggle("hidden");
    if (!container.classList.contains("hidden")) {
        const userId = localStorage.getItem("userId");
        renderCalendar(userId);  // ✅ 수정
    }
}


function scrollToCalendar() {
    document.getElementById("calendar-container").scrollIntoView({ behavior: 'smooth' });
    const container = document.getElementById("calendar-container");
    if (container.classList.contains("hidden")) {
        container.classList.remove("hidden");
        const userId = localStorage.getItem("userId");
        renderCalendar(userId); // ✅ 수정
    }
}

