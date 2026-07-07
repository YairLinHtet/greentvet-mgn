//Drop Down for Campaign
document.querySelectorAll(".lang-option").forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const dropdown = toggle.nextElementSibling;
    dropdown.classList.toggle("show");
  });
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    document
      .querySelectorAll(".lang-dropdown")
      .forEach((dd) => dd.classList.remove("show"));
  }
});

document.querySelectorAll(".cam-choose").forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const dropdown = toggle.nextElementSibling;
    dropdown.classList.toggle("show");
  });
});

window.addEventListener("click", (e) => {
  if (!e.target.closest(".campaign")) {
    document
      .querySelectorAll(".cam-dropdown")
      .forEach((dd) => dd.classList.remove("show"));
  }
});

function showMenu() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}
function hideMenu() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  // ဝက်ဘ်ဆိုက်တစ်ခုလုံးရှိ ImageKit ပုံအားလုံးကို ရှာဖွေခြင်း
  const images = document.querySelectorAll('img[src*="imagekit.io"]');

  images.forEach((img) => {
    let originalSrc = img.src;

    // URL ထဲတွင် parameter မပါဝင်သေးပါက အလိုအလျောက် ပေါင်းထည့်ပေးမည်
    if (!originalSrc.includes("tr:")) {
      const baseUrl = originalSrc.split("imagekit.io/")[0] + "imagekit.io/";
      const pathUrl = originalSrc.split("imagekit.io/")[1];

      // ImageKit ID/Endpoint အား ခွဲထုတ်ခြင်း
      const endpoint = pathUrl.split("/")[0];
      const remainingPath = pathUrl.substring(endpoint.length);

      // Auto-Format (WebP ပြောင်းလဲခြင်း) နှင့် Quality 80% သို့ ချုံ့၍ URL အသစ်သတ်မှတ်ခြင်း
      img.src = `${baseUrl}${endpoint}/tr:f-auto,q-80${remainingPath}`;
    }

    // စာမျက်နှာကို ပိုမိုမြန်ဆန်စေရန် Lazy Loading စနစ်ပါ တစ်ပါတည်းထည့်သွင်းခြင်း
    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
  });
});
