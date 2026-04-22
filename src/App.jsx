import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "than_so_hoc_gpt_messages_v2";
const SETTINGS_KEY = "than_so_hoc_gpt_settings_v2";

/**
 * Nếu sau này anh có backend thật để gọi AI:
 * ví dụ: https://ten-backend-cua-anh.onrender.com/api/chat
 * thì thay API_URL thành đường dẫn đó.
 *
 * Nếu để rỗng "", app sẽ dùng AI local ở dưới.
 */
const API_URL = "";

const SYSTEM_WELCOME = {
  role: "assistant",
  content:
    "Xin chào, tôi là Thần Số Học GPT. Bạn hãy nhập họ tên và ngày sinh theo dạng dd/mm/yyyy, hoặc viết tự nhiên như: 'Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989'. Tôi sẽ phân tích số chủ đạo, thái độ, linh hồn, nhân cách, sứ mệnh và năm cá nhân.",
  time: new Date().toISOString(),
};

const meanings = {
  lifePath: {
    1: "Số 1: độc lập, tiên phong, thích tự quyết và có tố chất dẫn dắt.",
    2: "Số 2: tinh tế, giàu cảm xúc, giỏi kết nối và hợp tác.",
    3: "Số 3: sáng tạo, biểu đạt tốt, nhiều năng lượng nghệ thuật.",
    4: "Số 4: thực tế, kỷ luật, bền bỉ, thích xây nền tảng chắc chắn.",
    5: "Số 5: yêu tự do, thích trải nghiệm, linh hoạt và thích thay đổi.",
    6: "Số 6: trách nhiệm, yêu thương, thiên về gia đình và chữa lành.",
    7: "Số 7: chiêm nghiệm, học sâu, nội tâm, trưởng thành qua trải nghiệm.",
    8: "Số 8: bản lĩnh, quản trị, thiên về thành tựu và tài chính.",
    9: "Số 9: nhân văn, bao dung, giàu lòng trắc ẩn và lý tưởng.",
    11: "Số 11: trực giác mạnh, truyền cảm hứng, nhạy với năng lượng.",
    22: "Số 22: tầm nhìn lớn, khả năng biến ý tưởng lớn thành hiện thực.",
    33: "Số 33: yêu thương vô điều kiện, chữa lành, phụng sự sâu sắc.",
  },
  personalYear: {
    1: "Năm cá nhân 1: khởi đầu mới, gieo hạt, mở chu kỳ mới.",
    2: "Năm cá nhân 2: chậm lại, hợp tác, kiên nhẫn và nuôi dưỡng quan hệ.",
    3: "Năm cá nhân 3: sáng tạo, giao tiếp, mở rộng kết nối xã hội.",
    4: "Năm cá nhân 4: xây nền tảng, kỷ luật, lo việc thực tế.",
    5: "Năm cá nhân 5: thay đổi, dịch chuyển, nhiều cơ hội mới.",
    6: "Năm cá nhân 6: gia đình, trách nhiệm, chữa lành và cam kết.",
    7: "Năm cá nhân 7: nội tâm, học hỏi, nhìn lại và phát triển chiều sâu.",
    8: "Năm cá nhân 8: thành tựu, tài chính, hiệu quả và kết quả cụ thể.",
    9: "Năm cá nhân 9: hoàn tất, buông bỏ, kết thúc chu kỳ cũ.",
  },
};

function reduceNumerology(num, keepMasters = true) {
  let n = Number(num) || 0;
  while (n > 9) {
    if (keepMasters && (n === 11 || n === 22 || n === 33)) return n;
    n = String(n)
      .split("")
      .reduce((a, b) => a + Number(b), 0);
  }
  return n;
}

function normalizeVietnamese(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function parseDate(dateStr) {
  const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (!day || !month || !year) return null;
  if (day < 1 || day > 31 || month < 1 || month > 12) return null;

  return {
    day,
    month,
    year,
    raw: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`,
  };
}

function extractNameAndDate(input) {
  const dateMatch = input.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
  const dateText = dateMatch?.[1] || "";
  const date = dateText ? parseDate(dateText) : null;

  let name = input
    .replace(dateText, "")
    .replace(
      /tôi tên là|tôi tên|ten toi la|ten toi|my name is|name is|sinh ngày|sinh ngay|ngày sinh|ngay sinh|toi la/gi,
      " "
    )
    .replace(/[,:-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!name) name = "Bạn";
  return { name, date };
}

function charToNumber(char) {
  const map = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9,
  };
  return map[char] || 0;
}

function splitNameNumbers(name) {
  const cleaned = normalizeVietnamese(name).toUpperCase().replace(/[^A-Z\s]/g, " ");
  const chars = cleaned.replace(/\s+/g, "").split("");

  const vowels = ["A", "E", "I", "O", "U", "Y"];
  const vowelNums = [];
  const consonantNums = [];

  chars.forEach((char) => {
    const value = charToNumber(char);
    if (!value) return;
    if (vowels.includes(char)) vowelNums.push(value);
    else consonantNums.push(value);
  });

  return { vowelNums, consonantNums, allNums: [...vowelNums, ...consonantNums] };
}

function calcLifePath({ day, month, year }) {
  const digits = `${day}${month}${year}`.split("").map(Number);
  return reduceNumerology(digits.reduce((a, b) => a + b, 0), true);
}

function calcAttitude({ day, month }) {
  return reduceNumerology(day + month, true);
}

function calcSoulUrge(name) {
  const { vowelNums } = splitNameNumbers(name);
  return reduceNumerology(vowelNums.reduce((a, b) => a + b, 0), true);
}

function calcPersonality(name) {
  const { consonantNums } = splitNameNumbers(name);
  return reduceNumerology(consonantNums.reduce((a, b) => a + b, 0), true);
}

function calcExpression(name) {
  const { allNums } = splitNameNumbers(name);
  return reduceNumerology(allNums.reduce((a, b) => a + b, 0), true);
}

function calcPersonalYear({ day, month }, targetYear) {
  const universalYear = String(targetYear)
    .split("")
    .reduce((a, b) => a + Number(b), 0);
  return reduceNumerology(day + month + universalYear, false);
}

function buildNumerologyReport(name, date, yearView) {
  const lifePath = calcLifePath(date);
  const attitude = calcAttitude(date);
  const soulUrge = calcSoulUrge(name);
  const personality = calcPersonality(name);
  const expression = calcExpression(name);
  const personalYear = calcPersonalYear(date, yearView);

  return `HỒ SƠ THẦN SỐ HỌC

Họ tên: ${name}
Ngày sinh: ${date.raw}
Năm đang xem: ${yearView}

1) Số chủ đạo: ${lifePath}
${meanings.lifePath[lifePath] || "Đang cập nhật ý nghĩa."}

2) Số thái độ: ${attitude}
Phản ánh cách bạn bước vào cuộc sống, cách bạn phản ứng và tạo ấn tượng ban đầu.

3) Số linh hồn: ${soulUrge}
Phản ánh động lực sâu bên trong và điều trái tim bạn thật sự muốn hướng tới.

4) Số nhân cách: ${personality}
Phản ánh hình ảnh và năng lượng mà người khác dễ cảm nhận từ bạn.

5) Số sứ mệnh / biểu đạt: ${expression}
Cho thấy cách bạn phát triển năng lực tổng thể và đóng góp cho cuộc đời.

6) Năm cá nhân ${yearView}: ${personalYear}
${meanings.personalYear[personalYear] || "Đang cập nhật ý nghĩa."}

Tổng kết:
Bạn mang năng lượng trung tâm của số ${lifePath}, thể hiện ra ngoài theo số ${personality}, bên trong được thúc đẩy bởi số ${soulUrge}. Trong năm ${yearView}, bạn đang ở chu kỳ ${personalYear}.`;
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TypingDots() {
  return (
    <div className="typing" aria-label="Đang trả lời">
      <span />
      <span />
      <span />
    </div>
  );
}

function Message({ message, onCopy }) {
  const isUser = message.role === "user";
  return (
    <div className="message-wrap">
      <div className={`message-row ${isUser ? "user" : "assistant"}`}>
        <div className={`avatar ${isUser ? "user" : "assistant"}`}>
          {isUser ? "👤" : "🔮"}
        </div>

        <div className="message-content">
          <div className="message-meta">
            <div className="message-author">{isUser ? "Bạn" : "Thần Số Học GPT"}</div>
            <div className="message-time">{formatTime(message.time)}</div>
          </div>

          <div className="message-text">{message.content}</div>

          {!message.loading && (
            <div className="message-tools">
              <button className="small-btn" onClick={() => onCopy(message.content)}>
                Sao chép
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [SYSTEM_WELCOME];
    } catch {
      return [SYSTEM_WELCOME];
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved) : { yearView: 2026 };
    } catch {
      return { yearView: 2026 };
    }
  });

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const textareaRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
  }, [input]);

  const suggestions = useMemo(
    () => [
      "Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989",
      "Phân tích thần số học cho tên Trần Minh Anh 10/11/1965",
      "Cho tôi biết năm cá nhân 2026 của tôi, tôi sinh 24/08/1992",
      "Giải thích sự khác nhau giữa số chủ đạo 6 và 7",
    ],
    []
  );

  function resetChat() {
    setMessages([SYSTEM_WELCOME]);
    setTyping(false);
    setInput("");
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Đã sao chép");
    } catch {
      alert("Không sao chép được");
    }
  }

  function localAIReply(content) {
    const lower = content.toLowerCase();

    if (lower.includes("khác nhau giữa số chủ đạo 6 và 7")) {
      return "Số chủ đạo 6 thiên về yêu thương, trách nhiệm, gia đình và xu hướng chăm sóc người khác. Số chủ đạo 7 thiên về chiêm nghiệm, học sâu, nội tâm và những bài học trưởng thành. Nói ngắn gọn: 6 nghiêng về trái tim và trách nhiệm với con người, còn 7 nghiêng về chiều sâu nhận thức và trải nghiệm linh hồn.";
    }

    const { name, date } = extractNameAndDate(content);
    if (!date) {
      return "Tôi có thể phân tích thần số học cho bạn nếu bạn gửi họ tên và ngày sinh dạng dd/mm/yyyy. Ví dụ: Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989.";
    }

    return buildNumerologyReport(name, date, settings.yearView);
  }

  async function callRealAI(content) {
    if (!API_URL) {
      return localAIReply(content);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: content,
        yearView: settings.yearView,
        history: messages,
      }),
    });

    if (!response.ok) {
      throw new Error("Không gọi được AI thật");
    }

    const data = await response.json();
    return data.reply || "AI không trả về nội dung.";
  }

  async function handleSend(customText) {
    const text = (customText ?? input).trim();
    if (!text) return;

    const userMessage = {
      role: "user",
      content: text,
      time: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    try {
      const reply = await callRealAI(text);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          time: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Đã có lỗi khi gọi AI. Hiện tôi đang chuyển sang chế độ phân tích nội bộ. Hãy thử lại hoặc dùng câu hỏi có họ tên và ngày sinh.",
          time: new Date().toISOString(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <h1 className="brand-title">Thần Số Học GPT</h1>
          <p className="brand-subtitle">Bản PRO giao diện chat</p>
        </div>

        <button className="primary-btn" onClick={resetChat}>
          ✨ Cuộc trò chuyện mới
        </button>

        <div className="sidebar-card">
          <h3>Tùy chọn phân tích</h3>
          <label className="sidebar-label">Năm cần xem</label>
          <input
            className="sidebar-input"
            type="number"
            value={settings.yearView}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                yearView: Number(e.target.value) || new Date().getFullYear(),
              }))
            }
          />
          <div className="sidebar-actions">
            <button className="secondary-btn" onClick={resetChat}>
              Xóa chat
            </button>
            <button
              className="ghost-btn"
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(SETTINGS_KEY);
                window.location.reload();
              }}
            >
              Reset app
            </button>
          </div>
        </div>

        <div className="sidebar-card">
          <h3>Gợi ý nhập nhanh</h3>
          <div className="suggestion-list">
            {suggestions.map((item) => (
              <button
                key={item}
                className="suggestion-btn"
                onClick={() => handleSend(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="main-header">
          <h1>Thần Số Học GPT</h1>
          <p>Giao diện đẹp kiểu ChatGPT · lưu lịch sử chat · sẵn sàng nối AI thật</p>
        </header>

        <div className="chat-scroll">
          {messages.length <= 1 && (
            <section className="hero">
              <h2>Thần Số Học GPT</h2>
              <p>
                Nhập họ tên và ngày sinh để nhận phân tích thần số học theo phong cách chat tự nhiên, rõ ràng và dễ đọc.
              </p>

              <div className="hero-actions">
                <div className="hero-card" onClick={() => handleSend("Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989")}>
                  <h4>Phân tích cơ bản</h4>
                  <p>Số chủ đạo, linh hồn, nhân cách, sứ mệnh và năm cá nhân.</p>
                </div>

                <div className="hero-card" onClick={() => handleSend("Cho tôi biết năm cá nhân 2026 của tôi, tôi sinh 24/08/1992")}>
                  <h4>Xem năm cá nhân</h4>
                  <p>Tập trung vào chu kỳ năm hiện tại và định hướng hành động.</p>
                </div>

                <div className="hero-card" onClick={() => handleSend("Giải thích sự khác nhau giữa số chủ đạo 6 và 7")}>
                  <h4>Giải thích chuyên sâu</h4>
                  <p>Giải thích ngắn gọn, dễ hiểu, đúng kiểu chat trợ lý.</p>
                </div>
              </div>
            </section>
          )}

          {messages.map((message, idx) => (
            <Message key={`${message.time}-${idx}`} message={message} onCopy={copyText} />
          ))}

          {typing && (
            <div className="message-wrap">
              <div className="message-row assistant">
                <div className="avatar assistant">🔮</div>
                <div className="message-content">
                  <div className="message-meta">
                    <div className="message-author">Thần Số Học GPT</div>
                  </div>
                  <TypingDots />
                </div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        <div className="chat-input-bar">
          <div className="chat-input-inner">
            <div className="chat-box">
              <textarea
                ref={textareaRef}
                className="chat-textarea"
                rows={1}
                value={input}
                placeholder="Nhập họ tên và ngày sinh của bạn..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button className="send-btn" onClick={() => handleSend()} disabled={!input.trim()}>
                ➤
              </button>
            </div>
            <div className="chat-hint">
              Ví dụ: Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
