document.addEventListener("DOMContentLoaded", () => {
  const landing = document.getElementById("landing");
  const main = document.getElementById("mainContent");
  const viewBtn = document.getElementById("viewMoreBtn");

  // Hiệu ứng chuyển từ trang bìa sang trang chính
  if (viewBtn && landing && main) {
    viewBtn.addEventListener("click", () => {
      landing.classList.add("fade-out");
      setTimeout(() => {
        landing.style.display = "none";
        landing.classList.remove("fade-out");
        main.classList.remove("hidden");
        main.setAttribute("aria-hidden", "false");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 600);
    });
  }

  //  TỶ GIÁ 
  const rateEl = document.getElementById("rate");
  const usdInput = document.getElementById("usdInput");
  const vndOutput = document.getElementById("vndOutput");
  const refreshBtn = document.getElementById("refreshBtn");
  let currentRate = 0;

  async function fetchExchangeRate() {
    try {
      rateEl.textContent = "Đang tải...";
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      
      if (data?.rates?.VND) {
        currentRate = data.rates.VND;
        const formattedRate = Math.trunc(currentRate).toLocaleString('de-DE');
        rateEl.textContent = `1 USD = ${formattedRate} VND`;

        if (usdInput.value) {
          const usd = parseFloat(usdInput.value);
          if (!isNaN(usd)) {
            const vndValue = usd * currentRate;
            vndOutput.value = Math.trunc(vndValue).toLocaleString('de-DE');
          }
        }
      } else {
        rateEl.textContent = "Không có dữ liệu tỷ giá";
      }
    } catch {
      rateEl.textContent = "Lỗi khi tải tỷ giá";
    }
  }

  usdInput.addEventListener("input", () => {
    const usd = parseFloat(usdInput.value);
    if (!isNaN(usd) && currentRate) {
        const vndValue = usd * currentRate;
        vndOutput.value = Math.trunc(vndValue).toLocaleString('de-DE');
    } else {
        vndOutput.value = "";
    }
  });

  refreshBtn?.addEventListener("click", fetchExchangeRate);
  fetchExchangeRate();

  // THỜI TIẾT 
  const weatherContainer = document.getElementById("weatherContainer");
  
  // Ánh xạ mã thời tiết WMO sang tên icon
  const weatherIcons = {
    0: "wi-day-sunny",
    1: "wi-day-cloudy",
    2: "wi-cloudy",
    3: "wi-cloudy-gusts",
    45: "wi-fog",
    48: "wi-fog",
    51: "wi-sprinkle",
    53: "wi-sprinkle",
    55: "wi-sprinkle",
    61: "wi-rain",
    63: "wi-rain",
    65: "wi-rain-wind",
    66: "wi-sleet",
    67: "wi-sleet",
    71: "wi-snow",
    73: "wi-snow",
    75: "wi-snow",
    77: "wi-snow",
    80: "wi-showers",
    81: "wi-showers",
    82: "wi-showers",
    85: "wi-snow",
    86: "wi-snow",
    95: "wi-thunderstorm",
    96: "wi-thunderstorm",
    99: "wi-thunderstorm"
  };

  async function fetchWeather() {
    try {
      weatherContainer.innerHTML = "<p>Đang tải...</p>";
      const url = "https://api.open-meteo.com/v1/forecast?latitude=10.762622&longitude=106.660172&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto";
      const res = await fetch(url);
      const data = await res.json();

      if (!data?.daily) {
        weatherContainer.innerHTML = "<p>Không có dữ liệu thời tiết</p>";
        return;
      }

      const { time, temperature_2m_max, temperature_2m_min, weathercode } = data.daily;
      weatherContainer.innerHTML = "";
      const days = Math.min(7, time.length);

      for (let i = 0; i < days; i++) {
        const code = weathercode[i];
        // Lấy tên icon từ mã, nếu không có thì dùng icon mặc định
        const iconName = weatherIcons[code] || "wi-na"; 
        const iconUrl = `https://cdn.jsdelivr.net/gh/erikflowers/weather-icons/svg/${iconName}.svg`;

        const [year, month, day] = time[i].split("-");
        const formattedDate = `${day}/${month}/${year}`;

        const card = document.createElement("div");
        card.className = "weather-card";
        card.innerHTML = `
          <img src="${iconUrl}" alt="Thời tiết ${code}" style="filter: invert(15%) sepia(20%) saturate(2500%) hue-rotate(180deg) brightness(90%) contrast(90%);" />
          <h3>${formattedDate}</h3>
          <p>Thấp: ${Number(temperature_2m_min[i]).toFixed(1)}°C</p>
          <p>Cao: ${Number(temperature_2m_max[i]).toFixed(1)}°C</p>
        `;
        weatherContainer.appendChild(card);
      }
    } catch {
      weatherContainer.innerHTML = "<p>Lỗi khi tải dữ liệu thời tiết</p>";
    }
  }

  fetchWeather();

  // HIỆU ỨNG BONG BÓNG NỀN 
  const bubblesContainer = document.querySelector(".bubbles-background");
  const numBubbles = 20;

  function createBubble() {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    const size = Math.random() * 60 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    bubble.style.left = `${Math.random() * 100}%`;
    
    const animationDuration = Math.random() * 10 + 10;
    bubble.style.animationDuration = `${animationDuration}s`;
    bubble.style.animationDelay = `${Math.random() * 10}s`;

    bubblesContainer.appendChild(bubble);

    bubble.addEventListener('animationend', () => {
      bubble.remove();
      createBubble();
    });
  }

  for (let i = 0; i < numBubbles; i++) {
    createBubble();
  }


  const contactBtn = document.getElementById("contactBtn");
  const contactPopup = document.getElementById("contactPopup");
  const emailText = document.getElementById("emailText");
  const copyEmailBtn = document.getElementById("copyEmailBtn");

  if (contactBtn && contactPopup && emailText && copyEmailBtn) {
    // 1. Bấm nút LIÊN HỆ để bật/tắt pop-up
    contactBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Ngăn sự kiện click lan ra window
      contactPopup.classList.toggle("show");
    });

    // 2. Bấm nút COPY
    copyEmailBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const email = emailText.textContent;
      
      navigator.clipboard.writeText(email).then(() => {
        // Thông báo đã copy thành công
        copyEmailBtn.classList.add("copied");
        
        // Trở lại trạng thái cũ sau 2 giây
        setTimeout(() => {
          copyEmailBtn.classList.remove("copied");
        }, 2000);
      }).catch(err => {
        console.error("Không thể copy email: ", err);
      });
    });

    // 3. Bấm ra ngoài để tắt pop-up
    window.addEventListener("click", (e) => {
      if (contactPopup.classList.contains("show")) {
        // Chỉ tắt nếu click ra bên ngoài cả nút FAB và pop-up
        if (!contactBtn.contains(e.target) && !contactPopup.contains(e.target)) {
          contactPopup.classList.remove("show");
        }
      }
    });
  }
  
});