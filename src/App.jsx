
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  RAW_LIFE_PATHS,
  RAW_ARROWS,
  RAW_SUCCESS_BRIDGES,
  RAW_MATURITY,
  RAW_HAPPINESS_BRIDGES,
  RAW_KARMIC_LESSONS,
  RAW_KARMIC_DEBTS,
  RAW_BALANCE,
  ADVANCED_OPTIONS,
  SECONDARY_OPTIONS,
} from "./data.js";

const STORAGE_KEY = "than_so_hoc_gpt_messages_v8";
const SETTINGS_KEY = "than_so_hoc_gpt_settings_v8";
const USER_HISTORY_KEY = "than_so_hoc_gpt_user_history_v8";
const MASTER_NUMBERS = [11, 22, 33];

const WELCOME_MESSAGE = {
  id: crypto.randomUUID(),
  role: "assistant",
  kind: "main",
  content:
    "Xin chào, tôi là Thần Số Học GPT. Bản này đã đổi sang cách hiển thị nguyên văn nội dung từ file anh tải lên. Bạn hãy nhập họ tên và ngày sinh theo dạng dd/mm/yyyy để xem hồ sơ chính và bấm các mục chuyên sâu cá nhân hoá.",
  time: new Date().toISOString(),
  visualData: null,
};

function reduceNumber(num, keepMasters = true) {
  let n = Number(num) || 0;
  while (n > 9) {
    if (keepMasters && MASTER_NUMBERS.includes(n)) return n;
    n = String(n)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
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

function parseDate(dateStr = "") {
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

function extractNameAndDate(input = "") {
  const dateMatch = input.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  const dateText = dateMatch?.[0] || "";
  const date = dateText ? parseDate(dateText) : null;

  let name = input
    .replace(dateText, "")
    .replace(
      /tôi tên là|tôi tên|ten toi la|ten toi|my name is|name is|sinh ngày|sinh ngay|ngày sinh|ngay sinh|toi la|hãy xem cho tôi|xem cho tôi|phân tích cho tôi|lap cho toi|lập cho tôi/gi,
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
  const letters = cleaned.replace(/\s+/g, "").split("");
  const vowels = ["A", "E", "I", "O", "U", "Y"];

  const vowelNums = [];
  const consonantNums = [];

  letters.forEach((char) => {
    const value = charToNumber(char);
    if (!value) return;
    if (vowels.includes(char)) vowelNums.push(value);
    else consonantNums.push(value);
  });

  return {
    vowelNums,
    consonantNums,
    allNums: [...vowelNums, ...consonantNums],
  };
}

function calcLifePath(date) {
  const digits = `${date.day}${date.month}${date.year}`.split("").map(Number);
  const total = digits.reduce((a, b) => a + b, 0);
  if (total === 22) return 22;
  return reduceNumber(total, true);
}

function calcAttitude(date) {
  return reduceNumber(date.day + date.month, true);
}

function calcSoulUrge(name) {
  const { vowelNums } = splitNameNumbers(name);
  return reduceNumber(vowelNums.reduce((a, b) => a + b, 0), true);
}

function calcPersonality(name) {
  const { consonantNums } = splitNameNumbers(name);
  return reduceNumber(consonantNums.reduce((a, b) => a + b, 0), true);
}

function calcExpression(name) {
  const { allNums } = splitNameNumbers(name);
  return reduceNumber(allNums.reduce((a, b) => a + b, 0), true);
}

function calcPersonalYear(date, targetYear) {
  const universalYear = String(targetYear)
    .split("")
    .reduce((a, b) => a + Number(b), 0);
  return reduceNumber(date.day + date.month + universalYear, false);
}

function calcBirthdayNumber(date) {
  return reduceNumber(date.day, true);
}

function getBirthDigits(date) {
  return `${String(date.day).padStart(2, "0")}${String(date.month).padStart(2, "0")}${date.year}`
    .replace(/0/g, "")
    .split("")
    .map(Number);
}

function getBirthDigitCounts(date) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  getBirthDigits(date).forEach((n) => {
    if (counts[n] !== undefined) counts[n] += 1;
  });
  return counts;
}

function buildBirthChart(counts) {
  const grid = [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7],
  ];
  return grid
    .map((row) => row.map((n) => `[${counts[n] ? String(n).repeat(counts[n]) : "-"}]`).join(" "))
    .join("\n");
}

function analyzeArrows(counts) {
  const patterns = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  const strong = [];
  const missing = [];

  patterns.forEach((pattern) => {
    const key = pattern.join("-");
    const hasAll = pattern.every((n) => counts[n] > 0);
    const hasNone = pattern.every((n) => counts[n] === 0);
    if (hasAll) strong.push(key);
    if (hasNone) missing.push(key);
  });

  return { strong, missing };
}

function calcPinnacles(date) {
  const month = reduceNumber(date.month, false);
  const day = reduceNumber(date.day, false);
  const year = reduceNumber(String(date.year).split("").reduce((a, b) => a + Number(b), 0), false);
  const lifePath = calcLifePath(date);
  const p1 = reduceNumber(month + day, false);
  const p2 = reduceNumber(day + year, false);
  const p3 = reduceNumber(p1 + p2, false);
  const p4 = reduceNumber(month + year, false);
  const firstEndAge = 36 - reduceNumber(lifePath, false);

  return [
    { label: "Đỉnh cao 1", number: p1, ageStart: 0, ageEnd: firstEndAge },
    { label: "Đỉnh cao 2", number: p2, ageStart: firstEndAge + 1, ageEnd: firstEndAge + 9 },
    { label: "Đỉnh cao 3", number: p3, ageStart: firstEndAge + 10, ageEnd: firstEndAge + 18 },
    { label: "Đỉnh cao 4", number: p4, ageStart: firstEndAge + 19, ageEnd: null },
  ];
}

function calcMaturityNumber(lifePath, expression) {
  return reduceNumber(reduceNumber(lifePath, false) + reduceNumber(expression, false), false);
}

function calcBridge(a, b) {
  return Math.abs(reduceNumber(a, false) - reduceNumber(b, false));
}

function calcKarmicLessons(counts) {
  return Object.keys(counts)
    .map(Number)
    .filter((n) => counts[n] === 0);
}

function calcKarmicDebts(date) {
  const rawSum = `${date.day}${date.month}${date.year}`
    .split("")
    .map(Number)
    .reduce((a, b) => a + b, 0);

  const debts = [];
  if ([13, 14, 16, 19].includes(rawSum)) debts.push(rawSum);
  if ([13, 14, 16, 19].includes(date.day)) debts.push(date.day);
  return [...new Set(debts)];
}

function calcBalanceNumber(name) {
  const cleaned = normalizeVietnamese(name).toUpperCase().replace(/[^A-Z\s]/g, "");
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const initials = parts.map((p) => p[0]).filter(Boolean);
  const total = initials.reduce((sum, ch) => sum + charToNumber(ch), 0);
  return reduceNumber(total, false) || 1;
}

function buildVisualData(name, date, yearView) {
  const lifePath = calcLifePath(date);
  const attitude = calcAttitude(date);
  const soulUrge = calcSoulUrge(name);
  const personality = calcPersonality(name);
  const expression = calcExpression(name);
  const personalYear = calcPersonalYear(date, yearView);
  const birthdayNumber = calcBirthdayNumber(date);
  const counts = getBirthDigitCounts(date);
  const arrows = analyzeArrows(counts);
  const pinnacles = calcPinnacles(date);
  const maturity = calcMaturityNumber(lifePath, expression);
  const successBridge = calcBridge(lifePath, expression);
  const happinessBridge = calcBridge(soulUrge, personality);
  const karmicLessons = calcKarmicLessons(counts);
  const karmicDebts = calcKarmicDebts(date);
  const balance = calcBalanceNumber(name);

  return {
    name,
    date,
    lifePath,
    attitude,
    soulUrge,
    personality,
    expression,
    personalYear,
    birthdayNumber,
    counts,
    arrows,
    pinnacles,
    maturity,
    successBridge,
    happinessBridge,
    karmicLessons,
    karmicDebts,
    balance,
    yearView,
  };
}

function getLifePathRawText(lifePath) {
  const key = String(lifePath);
  if (RAW_LIFE_PATHS[key]) return RAW_LIFE_PATHS[key];
  if (lifePath === 22 && RAW_LIFE_PATHS["22/4"]) return RAW_LIFE_PATHS["22/4"];
  return `Hiện chưa có nguyên văn cho Con Số Chủ Đạo ${lifePath} trong file đã tải lên.`;
}

function getArrowText(key) {
  return RAW_ARROWS[key] || `Hiện chưa có nguyên văn cho mũi tên ${key} trong file đã tải lên.`;
}

function buildPinnacleSummary(data) {
  return data.pinnacles
    .map((p) => {
      const yearStart = data.date.year + p.ageStart;
      const yearEnd = p.ageEnd == null ? null : data.date.year + p.ageEnd;
      return `${p.label}: số ${p.number}
- Giai đoạn tuổi: ${p.ageStart}${p.ageEnd == null ? "+" : ` - ${p.ageEnd}`}
- Mốc năm: ${yearStart}${yearEnd == null ? "+" : ` - ${yearEnd}`}`;
    })
    .join("\n\n");
}

function buildChatReply(input, yearView) {
  const { name, date } = extractNameAndDate(input);
  if (!date) {
    return {
      text: `Tôi chưa thấy ngày sinh hợp lệ trong tin nhắn của bạn.

Bạn hãy nhập theo một trong các cách sau:
- Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989
- Phân tích thần số học cho Trần Minh Anh 10/11/1965
- Cho tôi biết năm cá nhân ${yearView} của tôi, tôi sinh 24/08/1992

Định dạng ngày sinh chuẩn là: dd/mm/yyyy`,
      visualData: null,
    };
  }

  const data = buildVisualData(name, date, yearView);
  const lifePathRaw = getLifePathRawText(data.lifePath);

  return {
    text: `HỒ SƠ THẦN SỐ HỌC

Họ tên: ${name}
Ngày sinh: ${date.raw}
Năm đang xem: ${yearView}

Số chủ đạo: ${data.lifePath}
Số thái độ: ${data.attitude}
Số linh hồn: ${data.soulUrge}
Số nhân cách: ${data.personality}
Số sứ mệnh / biểu đạt: ${data.expression}
Số ngày sinh: ${data.birthdayNumber}
Năm cá nhân ${yearView}: ${data.personalYear}

Biểu đồ ngày sinh:
${buildBirthChart(data.counts)}

Kim tự tháp / 4 đỉnh cao cuộc đời:
${buildPinnacleSummary(data)}

NGUYÊN VĂN PHẦN CON SỐ CHỦ ĐẠO TỪ FILE:
${lifePathRaw}

Ngay dưới khung này, bạn có thể bấm vào các mục chuyên sâu để mở nguyên văn đúng đoạn tương ứng trong file anh đã tải lên.`,
    visualData: data,
  };
}

function buildAdvancedText(optionId, data) {
  if (!data) return "Tôi chưa có đủ dữ liệu để mở phần chuyên sâu này.";

  switch (optionId) {
    case "arrow-strong": {
      if (!data.arrows.strong.length) {
        return "Biểu đồ của bạn hiện không có mũi tên cá tính nổi bật theo 8 trục cơ bản.";
      }
      return `NGUYÊN VĂN CÁC MŨI TÊN CÁ TÍNH CỦA BẠN

${data.arrows.strong.map((key, i) => `${i + 1}. ${getArrowText(key)}`).join("\n\n")}`;
    }
    case "arrow-weak": {
      if (!data.arrows.missing.length) {
        return "Biểu đồ của bạn hiện không có mũi tên trống nổi bật theo 8 trục cơ bản.";
      }
      return `NGUYÊN VĂN CÁC MŨI TÊN TRỐNG / BÀI HỌC CỦA BẠN

${data.arrows.missing.map((key, i) => `${i + 1}. ${getArrowText(key)}`).join("\n\n")}`;
    }
    case "pinnacles-deep": {
      return `DIỄN GIẢI SÂU HƠN VỀ 4 ĐỈNH CAO CUỘC ĐỜI

${buildPinnacleSummary(data)}

Lưu ý: hiện trong các file anh tải lên chưa có một file riêng chứa nguyên văn luận giải 4 đỉnh cao cho từng số như các nhóm số phụ khác. Vì vậy phần này đang hiển thị theo logic tính toán của app, chưa có nguyên văn nguồn ngoài để map như các nhóm còn lại.`;
    }
    case "maturity":
      return RAW_MATURITY[String(data.maturity)] || `Hiện chưa có nguyên văn cho Con số Trưởng thành ${data.maturity}.`;
    case "success-bridge":
      return RAW_SUCCESS_BRIDGES[String(data.successBridge)] || `Hiện chưa có nguyên văn cho Cầu nối Thành công ${data.successBridge}.`;
    case "happiness-bridge":
      return RAW_HAPPINESS_BRIDGES[String(data.happinessBridge)] || `Hiện chưa có nguyên văn cho Cầu nối Hạnh phúc ${data.happinessBridge}.`;
    case "karmic-lessons":
      if (!data.karmicLessons.length) return "Biểu đồ của bạn hiện không có bài học nghiệp nổi bật theo cách tính thiếu số 1–9.";
      return data.karmicLessons
        .map((n, i) => `${i + 1}. ${RAW_KARMIC_LESSONS[String(n)] || `Hiện chưa có nguyên văn cho Bài học nghiệp số ${n}.`}`)
        .join("\n\n");
    case "karmic-debts":
      if (!data.karmicDebts.length) return "Bạn hiện không có nợ nghiệp nổi bật theo các dạng 13/4, 14/5, 16/7, 19/1 trong cách tính này.";
      return data.karmicDebts
        .map((n, i) => `${i + 1}. ${RAW_KARMIC_DEBTS[`${n}/${String(n)[0]}`] || RAW_KARMIC_DEBTS[String(n)] || `Hiện chưa có nguyên văn cho Nợ nghiệp ${n}.`}`)
        .join("\n\n");
    case "balance":
      return RAW_BALANCE[String(data.balance)] || `Hiện chưa có nguyên văn cho Con số Cân bằng ${data.balance}.`;
    default:
      return "Tôi chưa nhận diện được mục chuyên sâu này.";
  }
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

const darkTheme = {
  appBg: "#0b1020",
  sidebarBg: "#0f172a",
  mainBg: "#111827",
  card: "#0f172a",
  panel: "#111827",
  border: "#334155",
  text: "#e5e7eb",
  muted: "#94a3b8",
  accent: "#10a37f",
  accentSoft: "#0f3f32",
  danger: "#ef4444",
  strongBg: "#0f3f32",
  missingBg: "#3a1f1f",
  userBubble: "#0f3f32",
  assistantBubble: "#0f172a",
  heroCard: "#111827",
  inputBg: "#0f172a",
};

const lightTheme = {
  appBg: "#f8fafc",
  sidebarBg: "#ffffff",
  mainBg: "#f8fafc",
  card: "#ffffff",
  panel: "#f8fafc",
  border: "#dbe4ee",
  text: "#0f172a",
  muted: "#64748b",
  accent: "#10a37f",
  accentSoft: "#dcfce7",
  danger: "#dc2626",
  strongBg: "#dcfce7",
  missingBg: "#fee2e2",
  userBubble: "#dcfce7",
  assistantBubble: "#ffffff",
  heroCard: "#ffffff",
  inputBg: "#ffffff",
};

function TypingDots({ theme }) {
  return (
    <div style={{ display: "flex", gap: 8, padding: "8px 0" }}>
      {[1, 2, 3].map((i) => (
        <span key={i} style={{ width: 8, height: 8, borderRadius: 999, background: theme.accent, opacity: 0.85 }} />
      ))}
    </div>
  );
}

function VisualPanel({ visualData, theme }) {
  if (!visualData) return null;
  const layout = [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7],
  ];
  const strongKeys = new Set(visualData.arrows.strong);
  const missingKeys = new Set(visualData.arrows.missing);
  const patternMeta = ["1-2-3","4-5-6","7-8-9","1-4-7","2-5-8","3-6-9","1-5-9","3-5-7"];
  return (
    <div style={styles.visualPanel}>
      <div style={{ ...styles.card, background: theme.card, borderColor: theme.border }}>
        <div style={{ ...styles.cardTitle, color: theme.text }}>Biểu đồ ngày sinh</div>
        <div style={styles.chartGrid}>
          {layout.flat().map((n) => (
            <div key={n} style={{ ...styles.chartCell, background: theme.panel, borderColor: theme.border }}>
              <div style={{ ...styles.chartCellNumber, color: theme.muted }}>{n}</div>
              <div style={{ ...styles.chartCellValue, color: theme.text }}>
                {visualData.counts[n] ? String(n).repeat(visualData.counts[n]) : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...styles.card, background: theme.card, borderColor: theme.border }}>
        <div style={{ ...styles.cardTitle, color: theme.text }}>Mũi tên</div>
        <div style={styles.arrowList}>
          {patternMeta.map((key) => {
            const isStrong = strongKeys.has(key);
            const isMissing = missingKeys.has(key);
            return (
              <div
                key={key}
                style={{
                  ...styles.arrowItem,
                  background: isStrong ? theme.strongBg : isMissing ? theme.missingBg : theme.panel,
                  borderColor: isStrong ? theme.accent : isMissing ? theme.danger : theme.border,
                }}
              >
                <div style={{ ...styles.arrowName, color: theme.text }}>{key}</div>
                <div style={{ ...styles.arrowStatus, color: theme.muted }}>
                  {isStrong ? "Mạnh" : isMissing ? "Trống" : "Trung tính"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ ...styles.card, background: theme.card, borderColor: theme.border }}>
        <div style={{ ...styles.cardTitle, color: theme.text }}>Các số phụ</div>
        <div style={styles.metricsGrid}>
          {[
            ["Trưởng thành", visualData.maturity],
            ["Cầu nối thành công", visualData.successBridge],
            ["Cầu nối hạnh phúc", visualData.happinessBridge],
            ["Cân bằng", visualData.balance],
          ].map(([label, value]) => (
            <div key={label} style={{ ...styles.metricItem, background: theme.panel, borderColor: theme.border }}>
              <div style={{ ...styles.metricLabel, color: theme.muted }}>{label}</div>
              <div style={{ ...styles.metricValue, color: theme.text }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdvancedActions({ visualData, onSelect, theme }) {
  if (!visualData) return null;
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ color: theme.text, fontWeight: 700, marginBottom: 10 }}>🔍 Phân tích chuyên sâu cá nhân hoá</div>
      <div style={styles.actionList}>
        {ADVANCED_OPTIONS.map((item) => (
          <button
            key={item.id}
            style={{ ...styles.actionButton, background: theme.panel, borderColor: theme.border, color: theme.text }}
            onClick={() => onSelect(item.id, visualData)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SecondaryActions({ visualData, onSelect, theme }) {
  if (!visualData) return null;
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ color: theme.text, fontWeight: 700, marginBottom: 10 }}>Các số phụ chuyên sâu</div>
      <div style={styles.actionList}>
        {SECONDARY_OPTIONS.map((item) => (
          <button
            key={item.id}
            style={{ ...styles.actionButton, background: theme.panel, borderColor: theme.border, color: theme.text }}
            onClick={() => onSelect(item.id, visualData)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Message({ message, onCopy, onAdvancedSelect, theme }) {
  const isUser = message.role === "user";
  const isSecondaryMenu = message.kind === "secondary-menu";
  return (
    <div style={styles.messageWrap}>
      <div style={{ ...styles.messageRow, justifyContent: isUser ? "flex-end" : "flex-start" }}>
        {!isUser && <div style={{ ...styles.avatar, background: theme.strongBg, borderColor: theme.border }}>🔮</div>}
        <div style={{ ...styles.messageContent, background: isUser ? theme.userBubble : theme.assistantBubble, borderColor: theme.border }}>
          <div style={styles.messageMeta}>
            <div style={{ ...styles.messageAuthor, color: theme.text }}>{isUser ? "Bạn" : "Thần Số Học GPT"}</div>
            <div style={{ ...styles.messageTime, color: theme.muted }}>{formatTime(message.time)}</div>
          </div>
          <div style={{ ...styles.messageText, color: theme.text, whiteSpace: "pre-wrap" }}>{message.content}</div>
          {!isUser && message.visualData && <VisualPanel visualData={message.visualData} theme={theme} />}
          {!isUser && message.kind === "main" && <AdvancedActions visualData={message.visualData} onSelect={onAdvancedSelect} theme={theme} />}
          {!isUser && isSecondaryMenu && <SecondaryActions visualData={message.visualData} onSelect={onAdvancedSelect} theme={theme} />}
          <div style={styles.messageTools}>
            <button style={{ ...styles.smallBtn, background: theme.panel, borderColor: theme.border, color: theme.text }} onClick={() => onCopy(message.content)}>
              Sao chép
            </button>
          </div>
        </div>
        {isUser && <div style={{ ...styles.avatar, background: theme.panel, borderColor: theme.border }}>👤</div>}
      </div>
    </div>
  );
}

const styles = {
  appShell: { display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "100vh" },
  sidebar: { padding: 20, borderRight: "1px solid" },
  brandBox: { paddingBottom: 8, borderBottom: "1px solid rgba(148,163,184,0.14)", marginBottom: 18 },
  brandTitle: { fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" },
  brandSubtitle: { fontSize: 13, marginTop: 8, lineHeight: 1.5, maxWidth: 250 },
  main: { display: "flex", flexDirection: "column", minWidth: 0 },
  mainHeader: { padding: "24px 28px 8px" },
  headerTitle: { fontSize: 38, fontWeight: 800, margin: 0, letterSpacing: "-0.03em" },
  headerSubtitle: { fontSize: 14, marginTop: 8 },
  primaryBtn: { width: "100%", padding: "12px 14px", borderRadius: 14, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 16 },
  sidebarCard: { padding: 14, borderRadius: 16, border: "1px solid", marginBottom: 14 },
  sidebarLabel: { display: "block", fontSize: 12, marginBottom: 8 },
  sidebarInput: { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid", outline: "none", fontSize: 14, marginBottom: 10, boxSizing: "border-box" },
  sidebarActions: { display: "flex", gap: 8, flexWrap: "wrap" },
  secondaryBtn: { padding: "10px 12px", borderRadius: 12, border: "1px solid", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600 },
  ghostBtn: { padding: "10px 12px", borderRadius: 12, border: "1px solid", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600 },
  suggestionList: { display: "flex", flexDirection: "column", gap: 8 },
  suggestionBtn: { textAlign: "left", padding: "10px 12px", borderRadius: 12, border: "1px solid", background: "transparent", cursor: "pointer", fontSize: 13, lineHeight: 1.4 },
  userHistoryItem: { padding: "10px 12px", borderRadius: 12, border: "1px solid", cursor: "pointer", marginBottom: 8 },
  userHistoryName: { fontWeight: 700, fontSize: 13, marginBottom: 4 },
  userHistoryMeta: { fontSize: 12, lineHeight: 1.4 },
  chatScroll: { flex: 1, overflowY: "auto", padding: "22px 28px 160px" },
  hero: { marginBottom: 24, borderRadius: 24, padding: 24, border: "1px solid" },
  heroTitle: { fontSize: 48, fontWeight: 800, margin: 0, textAlign: "center", letterSpacing: "-0.04em" },
  heroText: { textAlign: "center", fontSize: 16, lineHeight: 1.6, maxWidth: 780, margin: "14px auto 0" },
  heroActions: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 22 },
  heroCard: { borderRadius: 18, border: "1px solid", padding: 16, cursor: "pointer" },
  messageWrap: { marginBottom: 18 },
  messageRow: { display: "flex", gap: 12, alignItems: "flex-start" },
  avatar: { width: 40, height: 40, borderRadius: 999, border: "1px solid", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 },
  messageContent: { maxWidth: "980px", width: "100%", borderRadius: 20, border: "1px solid", padding: 16, boxSizing: "border-box" },
  messageMeta: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 10, fontSize: 12 },
  messageAuthor: { fontWeight: 700 },
  messageTime: {},
  messageText: { lineHeight: 1.75, fontSize: 15, wordBreak: "break-word" },
  messageTools: { marginTop: 12 },
  smallBtn: { padding: "8px 10px", borderRadius: 10, border: "1px solid", cursor: "pointer", fontSize: 12, fontWeight: 600 },
  chatInputBar: { position: "sticky", bottom: 0, padding: "18px 22px 22px", backdropFilter: "blur(12px)", zIndex: 10 },
  chatInputInner: { maxWidth: 980, margin: "0 auto" },
  chatBox: { display: "flex", alignItems: "flex-end", gap: 12, border: "1px solid", borderRadius: 22, padding: 12 },
  chatTextarea: { width: "100%", border: "none", outline: "none", resize: "none", background: "transparent", fontSize: 15, lineHeight: 1.55, fontFamily: "inherit", maxHeight: 220 },
  sendBtn: { width: 44, height: 44, borderRadius: 14, border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, flexShrink: 0 },
  chatHint: { textAlign: "center", fontSize: 12, marginTop: 8 },
  visualPanel: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginTop: 18 },
  card: { border: "1px solid", borderRadius: 16, padding: 14 },
  cardTitle: { fontWeight: 700, marginBottom: 12, fontSize: 15 },
  chartGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 },
  chartCell: { border: "1px solid", borderRadius: 12, padding: 10, minHeight: 68, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  chartCellNumber: { fontSize: 12 },
  chartCellValue: { fontSize: 18, fontWeight: 700, letterSpacing: 1 },
  arrowList: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 },
  arrowItem: { border: "1px solid", borderRadius: 12, padding: 10 },
  arrowName: { fontWeight: 700, fontSize: 13, marginBottom: 4 },
  arrowStatus: { fontSize: 12 },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 },
  metricItem: { border: "1px solid", borderRadius: 12, padding: 10 },
  metricLabel: { fontSize: 12, marginBottom: 6 },
  metricValue: { fontSize: 24, fontWeight: 800 },
  actionList: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 },
  actionButton: { padding: "11px 12px", borderRadius: 12, border: "1px solid", textAlign: "left", cursor: "pointer", fontSize: 13, lineHeight: 1.45 },
};

export default function App() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [WELCOME_MESSAGE];
    } catch {
      return [WELCOME_MESSAGE];
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved) : { yearView: 2026, themeMode: "dark" };
    } catch {
      return { yearView: 2026, themeMode: "dark" };
    }
  });

  const [userHistory, setUserHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const textareaRef = useRef(null);
  const endRef = useRef(null);
  const theme = settings.themeMode === "light" ? lightTheme : darkTheme;

  const suggestions = useMemo(
    () => [
      "Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989",
      "Phân tích thần số học cho Trần Minh Anh 10/11/1965",
      "Cho tôi biết năm cá nhân 2026 của tôi, tôi sinh 24/08/1992",
    ],
    []
  );

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(USER_HISTORY_KEY, JSON.stringify(userHistory)); }, [userHistory]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
  }, [input]);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = theme.appBg;
    document.body.style.color = theme.text;
    document.body.style.fontFamily = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  }, [theme]);

  function resetChat() {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setTyping(false);
  }

  function addUserToHistory(visualData) {
    if (!visualData) return;
    const item = {
      id: `${visualData.name}-${visualData.date.raw}`,
      name: visualData.name,
      dob: visualData.date.raw,
      lifePath: visualData.lifePath,
      personalYear: visualData.personalYear,
      viewedAt: new Date().toISOString(),
      prompt: `Tôi tên ${visualData.name}, sinh ngày ${visualData.date.raw}`,
    };
    setUserHistory((prev) => {
      const filtered = prev.filter((x) => x.id !== item.id);
      return [item, ...filtered].slice(0, 12);
    });
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Đã sao chép");
    } catch {
      alert("Không sao chép được");
    }
  }

  function simulateReply(text) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(buildChatReply(text, settings.yearView)), 600 + Math.floor(Math.random() * 600));
    });
  }

  async function handleSend(customText) {
    const text = (customText ?? input).trim();
    if (!text) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      kind: "user",
      content: text,
      time: new Date().toISOString(),
      visualData: null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    try {
      const result = await simulateReply(text);
      if (result.visualData) addUserToHistory(result.visualData);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          kind: "main",
          content: result.text,
          visualData: result.visualData,
          time: new Date().toISOString(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function handleAdvancedSelect(optionId, visualData) {
    if (optionId === "secondary") {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          kind: "secondary-menu",
          content:
            "Bạn đã mở mục Các số phụ. Hãy chọn một nhánh bên dưới để xem nguyên văn đúng đoạn tương ứng trong file anh đã tải lên.",
          visualData,
          time: new Date().toISOString(),
        },
      ]);
      return;
    }

    const content = buildAdvancedText(optionId, visualData);
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        kind: "deep",
        content,
        visualData: null,
        time: new Date().toISOString(),
      },
    ]);
  }

  return (
    <div style={{ ...styles.appShell, background: theme.appBg }}>
      <aside style={{ ...styles.sidebar, background: theme.sidebarBg, borderColor: theme.border }}>
        <div style={styles.brandBox}>
          <h1 style={{ ...styles.brandTitle, color: theme.text }}>Thần Số Học GPT</h1>
          <p style={{ ...styles.brandSubtitle, color: theme.muted }}>Bản PRO · dữ liệu nguyên văn tách riêng trong data.js</p>
        </div>

        <button style={{ ...styles.primaryBtn, background: theme.accent, color: "#fff" }} onClick={resetChat}>
          ✨ Cuộc trò chuyện mới
        </button>

        <div style={{ ...styles.sidebarCard, background: theme.card, borderColor: theme.border }}>
          <h3 style={{ color: theme.text, marginTop: 0 }}>Tùy chọn phân tích</h3>

          <label style={{ ...styles.sidebarLabel, color: theme.muted }}>Năm cần xem</label>
          <input
            style={{ ...styles.sidebarInput, background: theme.panel, borderColor: theme.border, color: theme.text }}
            type="number"
            value={settings.yearView}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, yearView: Number(e.target.value) || new Date().getFullYear() }))
            }
          />

          <label style={{ ...styles.sidebarLabel, color: theme.muted }}>Giao diện</label>
          <div style={{ ...styles.sidebarActions, marginBottom: 10 }}>
            <button
              style={{ ...styles.secondaryBtn, background: settings.themeMode === "dark" ? theme.accentSoft : "transparent", borderColor: theme.border, color: theme.text }}
              onClick={() => setSettings((prev) => ({ ...prev, themeMode: "dark" }))}
            >
              🌙 Dark
            </button>
            <button
              style={{ ...styles.secondaryBtn, background: settings.themeMode === "light" ? theme.accentSoft : "transparent", borderColor: theme.border, color: theme.text }}
              onClick={() => setSettings((prev) => ({ ...prev, themeMode: "light" }))}
            >
              ☀️ Light
            </button>
          </div>

          <div style={styles.sidebarActions}>
            <button style={{ ...styles.secondaryBtn, borderColor: theme.border, color: theme.text }} onClick={resetChat}>
              Xóa chat
            </button>
            <button
              style={{ ...styles.ghostBtn, borderColor: theme.border, color: theme.text }}
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(SETTINGS_KEY);
                localStorage.removeItem(USER_HISTORY_KEY);
                window.location.reload();
              }}
            >
              Reset app
            </button>
          </div>
        </div>

        <div style={{ ...styles.sidebarCard, background: theme.card, borderColor: theme.border }}>
          <h3 style={{ color: theme.text, marginTop: 0 }}>Gợi ý nhập nhanh</h3>
          <div style={styles.suggestionList}>
            {suggestions.map((item) => (
              <button key={item} style={{ ...styles.suggestionBtn, borderColor: theme.border, color: theme.text, background: theme.panel }} onClick={() => handleSend(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...styles.sidebarCard, background: theme.card, borderColor: theme.border }}>
          <h3 style={{ color: theme.text, marginTop: 0 }}>Lịch sử người dùng</h3>
          {userHistory.length === 0 ? (
            <div style={{ color: theme.muted, fontSize: 13 }}>Chưa có hồ sơ nào được lưu.</div>
          ) : (
            <div>
              {userHistory.map((item) => (
                <div key={item.id} style={{ ...styles.userHistoryItem, background: theme.panel, borderColor: theme.border }} onClick={() => handleSend(item.prompt)}>
                  <div style={{ ...styles.userHistoryName, color: theme.text }}>{item.name}</div>
                  <div style={{ ...styles.userHistoryMeta, color: theme.muted }}>
                    {item.dob} · Số chủ đạo {item.lifePath} · Năm cá nhân {item.personalYear}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <main style={{ ...styles.main, background: theme.mainBg }}>
        <header style={styles.mainHeader}>
          <h1 style={{ ...styles.headerTitle, color: theme.text }}>Thần Số Học GPT</h1>
          <p style={{ ...styles.headerSubtitle, color: theme.muted }}>
            Hiển thị nguyên văn theo file anh tải lên · App.jsx logic · data.js dữ liệu
          </p>
        </header>

        <div style={styles.chatScroll}>
          {messages.length <= 1 && (
            <section style={{ ...styles.hero, background: theme.card, borderColor: theme.border }}>
              <h2 style={{ ...styles.heroTitle, color: theme.text }}>Thần Số Học GPT</h2>
              <p style={{ ...styles.heroText, color: theme.muted }}>
                Bản này ưu tiên giữ nguyên văn nội dung từ file anh tải lên. App sẽ tính số, sau đó map đúng đoạn tương ứng trong data.js.
              </p>

              <div style={styles.heroActions}>
                <div style={{ ...styles.heroCard, background: theme.heroCard, borderColor: theme.border }} onClick={() => handleSend("Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989")}>
                  <h4 style={{ color: theme.text, marginTop: 0 }}>Phân tích hồ sơ</h4>
                  <p style={{ color: theme.muted, marginBottom: 0 }}>Hiện hồ sơ chính + mở chuyên sâu nguyên văn.</p>
                </div>
                <div style={{ ...styles.heroCard, background: theme.heroCard, borderColor: theme.border }} onClick={() => handleSend("Phân tích thần số học cho Trần Minh Anh 10/11/1965")}>
                  <h4 style={{ color: theme.text, marginTop: 0 }}>Xem thử người khác</h4>
                  <p style={{ color: theme.muted, marginBottom: 0 }}>Map dữ liệu theo ngày sinh khác.</p>
                </div>
              </div>
            </section>
          )}

          {messages.map((message) => (
            <Message key={message.id} message={message} onCopy={copyText} onAdvancedSelect={handleAdvancedSelect} theme={theme} />
          ))}

          {typing && (
            <div style={styles.messageWrap}>
              <div style={{ ...styles.messageRow, justifyContent: "flex-start" }}>
                <div style={{ ...styles.avatar, background: theme.strongBg, borderColor: theme.border }}>🔮</div>
                <div style={{ ...styles.messageContent, background: theme.assistantBubble, borderColor: theme.border }}>
                  <div style={styles.messageMeta}>
                    <div style={{ ...styles.messageAuthor, color: theme.text }}>Thần Số Học GPT</div>
                  </div>
                  <TypingDots theme={theme} />
                </div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        <div style={{ ...styles.chatInputBar, background: `${theme.mainBg}cc` }}>
          <div style={styles.chatInputInner}>
            <div style={{ ...styles.chatBox, background: theme.inputBg, borderColor: theme.border }}>
              <textarea
                ref={textareaRef}
                style={{ ...styles.chatTextarea, color: theme.text }}
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
              <button style={{ ...styles.sendBtn, background: input.trim() ? theme.accent : theme.border, color: "#fff" }} onClick={() => handleSend()} disabled={!input.trim()}>
                ➤
              </button>
            </div>
            <div style={{ ...styles.chatHint, color: theme.muted }}>Ví dụ: Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989</div>
          </div>
        </div>
      </main>
    </div>
  );
}
