const habits = [
  "မလိုလားအပ်သော လျှပ်စစ်မီးနှင့် ပလပ်များကို ပိတ်ခြင်း",
  "ရေကို စနစ်တကျ ခြွေတာသုံးစွဲခြင်း",
  "တစ်နေ့တာအတွက် Green Plan ချမှတ်ခြင်း",
  "အမှိုက်ကို စနစ်တကျ ခွဲခြားစွန့်ပစ်ခြင်း",
  "တစ်ခါသုံး ပလတ်စတစ်များကို ငြင်းပယ်ခြင်း",
  "အစားအစာ လေလွင့်မှုမရှိအောင် ဂရုစိုက်ခြင်း",
  "စက်ဘီးစီးခြင်း သို့မဟုတ် လမ်းလျှောက်ခြင်း",
  "စာရွက်သုံးစွဲမှုလျှော့ချပြီး Digital စနစ်သုံးခြင်း",
  "အပင်များကို ပြုစုပျိုးထောင်ခြင်း",
  "ပတ်ဝန်းကျင်ထိန်းသိမ်းရေးအသိပညာ မျှဝေခြင်း",
];

//Local Storage data Load

let completedIndicate =
  JSON.parse(localStorage.getItem("greenHabitsProgress")) || [];
let totalXp = parseInt(localStorage.getItem("greenHabitsXp")) || 0;
let activeDate = localStorage.getItem("greenHabitsDate") || "";

//Element references
const habitsContainer = document.getElementById("habit-container");
const xpDisplay = document.getElementById("xp-display");
const countDisplay = document.getElementById("count-display");
const timerDisplay = document.getElementById("timer-display");

function checkDailyReset() {
  const today = new Date().toLocaleDateString("sv");

  if (activeDate !== today) {
    completedIndicate = [];
    activeDate = today;

    localStorage.setItem(
      "greenHabitsProgress",
      JSON.stringify(completedIndicate),
    );
    localStorage.setItem("greenHabitsDate", activeDate);
  }
}

function updateResetTime() {
  const now = new Date();

  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );
  const diff = tomorrow - now;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formatTime = (num) => String(num).padStart(2, "0");

  timerDisplay.innerText = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;

  // Automatically trigger visual refresh when countdown hits midnight
  if (diff <= 0) {
    checkDailyReset();
    renderHabits();
  }
}

function renderHabits() {
  habitsContainer.innerHTML = "";

  habits.forEach((habit, index) => {
    const isDone = completedIndicate.includes(index);
    const itemBox = document.createElement("div");

    itemBox.className = `habit-item ${isDone ? "completed" : ""}`;
    itemBox.onclick = () => toggleHabit(index);

    itemBox.innerHTML = `
    <div class ='checkbox'></div>
    <div class ='habit-text'>${habit}</div>
    <div class = 'xp-tag'> +10 Xp</div>`;
    habitsContainer.appendChild(itemBox);
  });

  xpDisplay.innerText = totalXp;
  countDisplay.innerText = `${completedIndicate.length}/${habits.length}`;

  localStorage.setItem(
    "greenHabitsProgress",
    JSON.stringify(completedIndicate),
  );
  localStorage.setItem("greenHabitsXp", totalXp);
}

function toggleHabit(index) {
  checkDailyReset();

  const position = completedIndicate.indexOf(index);

  if (position === -1) {
    completedIndicate.push(index);
    totalXp += 10;
  } else {
    completedIndicate.splice(position, 1);
    totalXp = Math.max(0, totalXp - 10);
  }
  renderHabits();
}
checkDailyReset();
renderHabits();
updateResetTime();
setInterval(updateResetTime, 1000);
