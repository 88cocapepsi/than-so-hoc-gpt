import React, { useEffect, useMemo, useRef, useState } from "react";
import { Send, Sparkles, User, Moon, SunMedium, Trash2, Copy, CalendarDays, Signature, Wand2 } from "lucide-react";

const SYSTEM_WELCOME = {
  role: "assistant",
  content:
    "Xin chào, tôi là Thần Số Học GPT. Bạn hãy nhập họ tên và ngày sinh theo dạng dd/mm/yyyy, hoặc viết tự nhiên như: 'Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989'. Tôi sẽ phân tích số chủ đạo, thái độ, linh hồn, nhân cách, sứ mệnh và năm cá nhân.",
  time: new Date().toISOString(),
};

const vowels = ["A", "E", "I", "O", "U", "Y", "Á", "À", "Ả", "Ã", "Ạ", "Ă", "Ắ", "Ằ", "Ẳ", "Ẵ", "Ặ", "Â", "Ấ", "Ầ", "Ẩ", "Ẫ", "Ậ", "É", "È", "Ẻ", "Ẽ", "Ẹ", "Ê", "Ế", "Ề", "Ể", "Ễ", "Ệ", "Í", "Ì", "Ỉ", "Ĩ", "Ị", "Ó", "Ò", "Ỏ", "Õ", "Ọ", "Ô", "Ố", "Ồ", "Ổ", "Ỗ", "Ộ", "Ơ", "Ớ", "Ờ", "Ở", "Ỡ", "Ợ", "Ú", "Ù", "Ủ", "Ũ", "Ụ", "Ư", "Ứ", "Ừ", "Ử", "Ữ", "Ự", "Ý", "Ỳ", "Ỷ", "Ỹ", "Ỵ"];

const meanings = {
  lifePath: {
    1: {
      title: "Số chủ đạo 1",
      short: "Độc lập, tiên phong, có tố chất dẫn dắt.",
      detail:
        "Bạn có xu hướng tự chủ rất mạnh, thích tự quyết và muốn tạo dấu ấn riêng. Khi phát triển tốt, bạn là người dám làm, dám chịu trách nhiệm và truyền động lực cho người khác. Bài học lớn của số 1 là cân bằng giữa sự quyết đoán và khả năng lắng nghe.",
    },
    2: {
      title: "Số chủ đạo 2",
      short: "Tinh tế, giàu cảm xúc, giỏi kết nối.",
      detail:
        "Bạn thường cảm nhận không khí, cảm xúc và nhu cầu của người khác rất nhanh. Thế mạnh là ngoại giao, hợp tác và xây dựng sự hài hòa. Bài học của số 2 là không để sự nhạy cảm khiến mình mất cân bằng hoặc phụ thuộc vào sự công nhận từ bên ngoài.",
    },
    3: {
      title: "Số chủ đạo 3",
      short: "Sáng tạo, biểu đạt tốt, nhiều năng lượng.",
      detail:
        "Bạn có thiên hướng truyền cảm hứng qua lời nói, hình ảnh hoặc ý tưởng. Số 3 thường hợp với môi trường cần sáng tạo, giao tiếp và kết nối cộng đồng. Bài học là tránh phân tán năng lượng, cần theo đuổi điều gì đó đủ lâu để tạo thành giá trị lớn.",
    },
    4: {
      title: "Số chủ đạo 4",
      short: "Thực tế, kỷ luật, xây nền tảng chắc chắn.",
      detail:
        "Bạn có xu hướng suy nghĩ rõ ràng, yêu cấu trúc và thích xây dựng điều bền vững. Điểm mạnh là sự kiên trì, đều đặn và đáng tin cậy. Bài học là bớt cứng nhắc và cho phép bản thân linh hoạt hơn khi cuộc sống thay đổi.",
    },
    5: {
      title: "Số chủ đạo 5",
      short: "Tự do, trải nghiệm, thích đổi mới.",
      detail:
        "Bạn thường phát triển mạnh khi được khám phá, di chuyển, học qua trải nghiệm thực tế và tiếp xúc với điều mới. Số 5 mang năng lượng sống động và dễ truyền cảm hứng về sự tự do. Bài học là quản trị cảm xúc, nhịp sống và sự bốc đồng để không đánh mất hướng đi dài hạn.",
    },
    6: {
      title: "Số chủ đạo 6",
      short: "Trách nhiệm, yêu thương, thiên về gia đình và chữa lành.",
      detail:
        "Bạn có xu hướng quan tâm đến người khác, muốn chăm lo, tạo cảm giác an toàn và sống có trách nhiệm. Năng lượng số 6 thường gắn với gia đình, cộng đồng, giáo dục, chữa lành và cái đẹp. Bài học là đừng ôm hết mọi thứ vào mình hoặc hy sinh quá mức đến mức kiệt sức.",
    },
    7: {
      title: "Số chủ đạo 7",
      short: "Chiêm nghiệm, học sâu, thiên về nội tâm.",
      detail:
        "Bạn có xu hướng tìm sự thật bên dưới bề mặt vấn đề, thích quan sát, suy ngẫm và học qua trải nghiệm sâu. Số 7 thường trưởng thành mạnh sau những bài học lớn của cuộc đời. Bài học là mở lòng hơn với cuộc sống và với người khác thay vì thu mình quá nhiều.",
    },
    8: {
      title: "Số chủ đạo 8",
      short: "Bản lĩnh, quản trị, năng lượng thành tựu và vật chất.",
      detail:
        "Bạn có xu hướng mạnh về tổ chức, điều hành, hiệu quả và tạo kết quả cụ thể. Số 8 thường hợp với kinh doanh, lãnh đạo và các vai trò cần chịu trách nhiệm lớn. Bài học là giữ cân bằng giữa thành công bên ngoài và đời sống cảm xúc bên trong.",
    },
    9: {
      title: "Số chủ đạo 9",
      short: "Nhân văn, bao dung, hướng đến giá trị lớn hơn bản thân.",
      detail:
        "Bạn thường có trái tim rộng, dễ cảm thông và muốn làm điều có ý nghĩa cho cộng đồng hoặc một lý tưởng nào đó. Số 9 mang màu sắc cho đi, chữa lành, nghệ thuật hoặc phụng sự. Bài học là học cách buông bỏ đúng lúc và không mang nỗi buồn của cả thế giới lên vai mình.",
    },
    11: {
      title: "Số chủ đạo 11",
      short: "Trực giác mạnh, truyền cảm hứng, nhạy với năng lượng.",
      detail:
        "11 là con số master, thường mang khả năng cảm nhận tinh tế, truyền cảm hứng và khai mở cho người khác. Bạn có thể vừa sâu sắc vừa dễ căng thẳng nếu không giữ được nền tảng cân bằng. Bài học là biến trực giác thành hành động thực tế, không chỉ dừng ở cảm nhận.",
    },
    22: {
      title: "Số chủ đạo 22",
      short: "Tầm nhìn lớn, khả năng hiện thực hóa điều lớn lao.",
      detail:
        "22 là master number của người có thể biến ý tưởng lớn thành hệ thống, công trình hoặc giá trị có ảnh hưởng rộng. Bạn vừa cần tầm nhìn vừa cần kỷ luật cực cao để đi đường dài. Bài học là không tự gây áp lực quá mức và học cách đi từng bước thật vững.",
    },
    33: {
      title: "Số chủ đạo 33",
      short: "Yêu thương vô điều kiện, chữa lành, phụng sự ở mức cao.",
      detail:
        "33 là master number thiên về lòng trắc ẩn, trách nhiệm tinh thần và khả năng nâng đỡ người khác. Bạn có thể là nguồn an ủi, truyền cảm hứng và chữa lành rất mạnh. Bài học là biết giữ ranh giới lành mạnh để không hao hụt năng lượng vì gánh quá nhiều cho người khác.",
    },
  },
  attitude: {
    1: "Thái độ 1: thẳng, nhanh, thích chủ động và muốn tự quyết.",
    2: "Thái độ 2: mềm, tinh tế, quan sát tốt và đề cao sự hài hòa.",
    3: "Thái độ 3: cởi mở, vui vẻ, dễ tạo kết nối bằng lời nói.",
    4: "Thái độ 4: chỉn chu, nghiêm túc, thực tế và có nguyên tắc.",
    5: "Thái độ 5: linh hoạt, phóng khoáng, thích trải nghiệm mới.",
    6: "Thái độ 6: trách nhiệm, ấm áp, quan tâm đến người khác.",
    7: "Thái độ 7: sâu sắc, dè dặt, quan sát nhiều hơn nói.",
    8: "Thái độ 8: mạnh mẽ, rõ mục tiêu, thiên về hiệu quả.",
    9: "Thái độ 9: bao dung, rộng lòng, dễ nhìn vấn đề theo bức tranh lớn.",
    11: "Thái độ 11: trực giác cao, truyền cảm hứng, tinh tế về năng lượng.",
    22: "Thái độ 22: điềm tĩnh, tầm nhìn lớn, thích xây điều bền vững.",
    33: "Thái độ 33: dịu, nâng đỡ, dễ tạo cảm giác an toàn cho người khác.",
  },
  personalYear: {
    1: "Năm cá nhân 1: khởi đầu mới, gieo hạt, chủ động mở chu kỳ mới.",
    2: "Năm cá nhân 2: chậm lại, hợp tác, nuôi dưỡng quan hệ và sự kiên nhẫn.",
    3: "Năm cá nhân 3: biểu đạt, sáng tạo, mở rộng kết nối xã hội.",
    4: "Năm cá nhân 4: xây nền tảng, kỷ luật, lo việc thực tế và hệ thống.",
    5: "Năm cá nhân 5: thay đổi, dịch chuyển, nhiều cơ hội mới bất ngờ.",
    6: "Năm cá nhân 6: gia đình, trách nhiệm, chữa lành và cam kết.",
    7: "Năm cá nhân 7: nội tâm, học hỏi, nhìn lại và phát triển chiều sâu.",
    8: "Năm cá nhân 8: thành tựu, tài chính, quyền lực và kết quả cụ thể.",
    9: "Năm cá nhân 9: hoàn tất, buông bỏ, kết thúc chu kỳ cũ để dọn đường cho mới.",
  },
};

function normalizeVietnamese(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

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

function parseDate(dateStr) {
  const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (!day || !month || !year) return null;
  if (day < 1 || day > 31 || month < 1 || month > 12) return null;
  return { day, month, year, raw: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}` };
}

function extractNameAndDate(input) {
  const dateMatch = input.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
  const dateText = dateMatch?.[1] || "";
  const parsedDate = dateText ? parseDate(dateText) : null;

  let name = input
    .replace(dateText, "")
    .replace(/tôi tên là|tôi tên|ten toi la|ten toi|my name is|name is|sinh ngày|sinh ngay|ngày sinh|ngay sinh/gi, " ")
    .replace(/[,:-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!name) name = "Bạn";
  return { name, date: parsedDate };
}

function calcLifePath({ day, month, year }) {
  const digits = `${day}${month}${year}`.split("").map(Number);
  return reduceNumerology(digits.reduce((a, b) => a + b, 0), true);
}

function calcAttitude({ day, month }) {
  return reduceNumerology(day + month, true);
}

function splitNameNumbers(name) {
  const cleaned = normalizeVietnamese(name).toUpperCase().replace(/[^A-Z\s]/g, " ");
  const chars = cleaned.replace(/\s+/g, "").split("");

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

function calcSoulUrge(name) {
  const { vowelNums } = splitNameNumbers(name);
  const sum = vowelNums.reduce((a, b) => a + b, 0);
  return reduceNumerology(sum, true);
}

function calcPersonality(name) {
  const { consonantNums } = splitNameNumbers(name);
  const sum = consonantNums.reduce((a, b) => a + b, 0);
  return reduceNumerology(sum, true);
}

function calcExpression(name) {
  const { allNums } = splitNameNumbers(name);
  const sum = allNums.reduce((a, b) => a + b, 0);
  return reduceNumerology(sum, true);
}

function calcPersonalYear({ day, month }, targetYear) {
  const universalYear = String(targetYear)
    .split("")
    .reduce((a, b) => a + Number(b), 0);
  return reduceNumerology(day + month + universalYear, false);
}

function buildReport(name, dob, targetYear = new Date().getFullYear()) {
  const lifePath = calcLifePath(dob);
  const attitude = calcAttitude(dob);
  const soulUrge = calcSoulUrge(name);
  const personality = calcPersonality(name);
  const expression = calcExpression(name);
  const personalYear = calcPersonalYear(dob, targetYear);

  const lp = meanings.lifePath[lifePath];
  const py = meanings.personalYear[personalYear];
  const at = meanings.attitude[attitude] || `Thái độ ${attitude}.`;

  return {
    name,
    dob: dob.raw,
    lifePath,
    attitude,
    soulUrge,
    personality,
    expression,
    personalYear,
    markdown: `## Hồ sơ thần số học\n\n**Họ tên:** ${name}  \n**Ngày sinh:** ${dob.raw}  \n**Năm đang xem:** ${targetYear}\n\n### 1) Số chủ đạo: ${lifePath}\n**Từ khóa:** ${lp?.short || "Đang cập nhật"}\n\n${lp?.detail || "Chưa có mô tả chi tiết."}\n\n### 2) Số thái độ: ${attitude}\n${at}\n\n### 3) Số linh hồn: ${soulUrge}\nSố linh hồn phản ánh động lực bên trong, điều trái tim bạn thật sự muốn hướng tới.\n\n### 4) Số nhân cách: ${personality}\nSố nhân cách phản ánh cách người khác dễ cảm nhận về bạn trong những tiếp xúc đầu tiên.\n\n### 5) Số sứ mệnh / biểu đạt: ${expression}\nCon số này nói về cách bạn phát triển năng lực tổng thể và đóng góp cho cuộc đời.\n\n### 6) Năm cá nhân ${targetYear}: ${personalYear}\n${py || "Chu kỳ đang được cập nhật."}\n\n### Gợi ý\n- Phát huy điểm mạnh cốt lõi của số chủ đạo.\n- Trong năm cá nhân hiện tại, ưu tiên hành động đúng nhịp thay vì cố đốt giai đoạn.\n- Kết hợp trực giác với kỷ luật để kết quả rõ hơn.`,
  };
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function TypingDots() {
  return (
    <div className="inline-flex items-center gap-1 px-1 py-2">
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
    </div>
  );
}

function MessageBubble({ message, onCopy }) {
  const isUser = message.role === "user";

  return (
    <div className={`group mx-auto flex w-full max-w-4xl gap-4 px-4 py-6 ${isUser ? "bg-transparent" : "bg-zinc-50/70 dark:bg-zinc-900/40"}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${isUser ? "border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"}`}>
        {isUser ? <User size={18} /> : <Sparkles size={18} />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {isUser ? "Bạn" : "Thần Số Học GPT"}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{formatTime(message.time)}</div>
        </div>

        <div className="whitespace-pre-wrap break-words text-[15px] leading-7 text-zinc-800 dark:text-zinc-200">
          {message.content}
        </div>

        {!message.loading && (
          <div className="mt-3 opacity-0 transition group-hover:opacity-100">
            <button
              onClick={() => onCopy(message.content)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Copy size={14} /> Sao chép
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("numerology_gpt_messages_v1");
    return saved ? JSON.parse(saved) : [SYSTEM_WELCOME];
  });
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("numerology_gpt_darkmode_v1");
    return saved ? JSON.parse(saved) : true;
  });
  const [typing, setTyping] = useState(false);
  const [yearView, setYearView] = useState(new Date().getFullYear());
  const endRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("numerology_gpt_messages_v1", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("numerology_gpt_darkmode_v1", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

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
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  }

  function answerGeneralQuestion(content) {
    const lower = content.toLowerCase();

    if (lower.includes("khác nhau giữa số chủ đạo 6 và 7")) {
      return "Số chủ đạo 6 thiên về yêu thương, trách nhiệm, gia đình và xu hướng chăm sóc người khác. Số chủ đạo 7 thiên về chiêm nghiệm, học sâu, trải nghiệm nội tâm và những bài học trưởng thành. Nói ngắn gọn: 6 nghiêng về trái tim và trách nhiệm với con người, còn 7 nghiêng về chiều sâu nhận thức và bài học linh hồn.";
    }

    if (lower.includes("số chủ đạo") && !content.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
      return "Để tính đúng số chủ đạo cho bạn, tôi cần ngày sinh dạng dd/mm/yyyy. Bạn có thể nhập ví dụ: Tôi tên Minh, sinh ngày 17/01/1989.";
    }

    return "Tôi có thể phân tích thần số học cho bạn nếu bạn gửi họ tên và ngày sinh dạng dd/mm/yyyy. Ví dụ: Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989.";
  }

  function generateReply(content) {
    const { name, date } = extractNameAndDate(content);
    if (!date) return answerGeneralQuestion(content);

    const report = buildReport(name, date, yearView);

    return `Mình đã giải mã cho bạn như sau:\n\n${report.markdown.replace(/## /g, "").replace(/### /g, "")}\n\nTổng kết ngắn: Bạn mang năng lượng trung tâm của số ${report.lifePath}, thể hiện ra ngoài theo số ${report.personality}, bên trong được thúc đẩy bởi số ${report.soulUrge}. Trong năm ${yearView}, bạn đang ở chu kỳ ${report.personalYear}, vì vậy nên ưu tiên sống đúng nhịp của chu kỳ này để mọi việc thuận hơn.`;
  }

  function handleSend(customText) {
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

    setTimeout(() => {
      const reply = generateReply(text);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          time: new Date().toISOString(),
        },
      ]);
      setTyping(false);
    }, 900);
  }

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#0d0d0d] dark:text-zinc-100">
        <div className="flex min-h-screen">
          <aside className="hidden w-[280px] border-r border-zinc-200 bg-zinc-50/80 lg:flex lg:flex-col dark:border-zinc-800 dark:bg-[#111111]">
            <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#171717]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="font-semibold">Thần Số Học GPT</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Bản PRO giao diện chat</div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <button
                onClick={resetChat}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-zinc-900"
              >
                <Wand2 size={16} /> Cuộc trò chuyện mới
              </button>
            </div>

            <div className="px-4 pb-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#171717]">
                <div className="mb-3 text-sm font-semibold">Tùy chọn phân tích</div>
                <label className="mb-2 block text-xs text-zinc-500 dark:text-zinc-400">Năm cần xem</label>
                <input
                  type="number"
                  value={yearView}
                  onChange={(e) => setYearView(Number(e.target.value) || new Date().getFullYear())}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                />
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setDarkMode((v) => !v)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    {darkMode ? <SunMedium size={16} /> : <Moon size={16} />}
                    {darkMode ? "Light" : "Dark"}
                  </button>
                  <button
                    onClick={resetChat}
                    className="flex items-center justify-center rounded-xl border border-zinc-200 px-3 py-2.5 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    title="Xóa chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 pb-6">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#171717]">
                <div className="mb-3 text-sm font-semibold">Gợi ý nhập nhanh</div>
                <div className="space-y-2">
                  {suggestions.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSend(item)}
                      className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-left text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/85 backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-[#0d0d0d]/85">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="font-semibold">Thần Số Học GPT</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Bản PRO</div>
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode((v) => !v)}
                  className="rounded-xl border border-zinc-200 p-2 dark:border-zinc-700"
                >
                  {darkMode ? <SunMedium size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto">
              {messages.map((message, idx) => (
                <MessageBubble key={`${message.time}-${idx}`} message={message} onCopy={copyText} />
              ))}

              {typing && (
                <div className="mx-auto flex w-full max-w-4xl gap-4 px-4 py-6">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-semibold">Thần Số Học GPT</div>
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {messages.length <= 1 && (
              <div className="mx-auto w-full max-w-3xl px-4 pb-6 pt-4 sm:pt-10">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900">
                    <Sparkles size={28} />
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Thần Số Học GPT</h1>
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400 sm:text-base">
                    Nhập họ tên và ngày sinh để nhận phân tích thần số học theo phong cách chat tự nhiên, rõ ràng và dễ đọc.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <button onClick={() => handleSend("Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989")} className="rounded-2xl border border-zinc-200 bg-white p-4 text-left hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#171717] dark:hover:bg-zinc-900">
                    <Signature className="mb-3" size={18} />
                    <div className="text-sm font-medium">Phân tích cơ bản</div>
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Số chủ đạo, linh hồn, nhân cách, sứ mệnh</div>
                  </button>
                  <button onClick={() => handleSend("Cho tôi biết năm cá nhân 2026, tôi sinh ngày 10/11/1965, tên Võ Văn Hải")} className="rounded-2xl border border-zinc-200 bg-white p-4 text-left hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#171717] dark:hover:bg-zinc-900">
                    <CalendarDays className="mb-3" size={18} />
                    <div className="text-sm font-medium">Xem năm cá nhân</div>
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Tập trung vào chu kỳ năm hiện tại</div>
                  </button>
                  <button onClick={() => handleSend("Khác nhau giữa số chủ đạo 6 và 7 là gì?")} className="rounded-2xl border border-zinc-200 bg-white p-4 text-left hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#171717] dark:hover:bg-zinc-900">
                    <Wand2 className="mb-3" size={18} />
                    <div className="text-sm font-medium">Giải thích chuyên sâu</div>
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Giải thích đơn giản, dễ hiểu</div>
                  </button>
                </div>
              </div>
            )}

            <div className="sticky bottom-0 border-t border-zinc-200 bg-white/95 px-3 py-3 backdrop-blur dark:border-zinc-800 dark:bg-[#0d0d0d]/95 sm:px-4 sm:py-4">
              <div className="mx-auto max-w-4xl">
                <div className="rounded-[28px] border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-[#171717]">
                  <div className="flex items-end gap-3 p-3">
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Nhập họ tên và ngày sinh của bạn..."
                      className="max-h-[220px] min-h-[28px] flex-1 resize-none bg-transparent px-2 py-3 text-[15px] outline-none placeholder:text-zinc-400 dark:text-zinc-100"
                    />
                    <button
                      onClick={() => handleSend()}
                      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900"
                      disabled={!input.trim()}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  Ví dụ: Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
