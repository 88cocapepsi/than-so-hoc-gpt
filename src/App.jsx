import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "than_so_hoc_gpt_messages_v5";
const SETTINGS_KEY = "than_so_hoc_gpt_settings_v5";
const MASTER_NUMBERS = [11, 22, 33];

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Xin chào, tôi là Thần Số Học GPT. Bạn hãy nhập họ tên và ngày sinh theo dạng dd/mm/yyyy, hoặc viết tự nhiên như: 'Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989'. Tôi sẽ phân tích số chủ đạo, thái độ, linh hồn, nhân cách, sứ mệnh, năm cá nhân, biểu đồ ngày sinh, mũi tên, kim tự tháp và 4 đỉnh cao cuộc đời, kèm hình minh hoạ cá nhân hoá.",
  time: new Date().toISOString(),
};

const meanings = {
  lifePath: {
    1: {
      title: "Người tiên phong",
      short: "Độc lập, quyết đoán, thích dẫn đường.",
      detail:
        "Số chủ đạo 1 thường gắn với tinh thần tự lập, ý chí mạnh và nhu cầu khẳng định bản thân. Bạn hợp với vai trò mở đường, khởi xướng, làm người cầm lái hơn là đi theo số đông.",
      strengths: ["Bản lĩnh", "Chủ động", "Tư duy dẫn dắt"],
      challenges: ["Dễ nóng vội", "Cứng ý", "Khó nhờ người khác giúp"],
      advice:
        "Học cách lắng nghe và phối hợp sẽ giúp năng lượng số 1 đi xa hơn thay vì chỉ đi nhanh.",
    },
    2: {
      title: "Người kết nối",
      short: "Nhạy cảm, tinh tế, giỏi hòa hợp.",
      detail:
        "Số 2 thiên về cảm xúc, trực giác và khả năng kết nối. Bạn thường cảm được tâm trạng người khác rất nhanh, hợp với môi trường cần sự khéo léo, hỗ trợ và ngoại giao.",
      strengths: ["Tinh tế", "Biết lắng nghe", "Hòa giải tốt"],
      challenges: ["Dễ bị ảnh hưởng cảm xúc", "Ngại va chạm", "Thiếu quyết đoán"],
      advice:
        "Khi biết đặt ranh giới cảm xúc rõ ràng, số 2 sẽ vừa dịu dàng vừa rất mạnh.",
    },
    3: {
      title: "Người biểu đạt",
      short: "Sáng tạo, vui vẻ, truyền cảm hứng.",
      detail:
        "Số 3 liên quan đến biểu đạt, giao tiếp, sáng tạo và niềm vui sống. Bạn dễ có năng lực nói, viết, trình bày, nghệ thuật hoặc truyền năng lượng tích cực cho người khác.",
      strengths: ["Sáng tạo", "Giao tiếp tốt", "Truyền động lực"],
      challenges: ["Dễ phân tán", "Cảm hứng thất thường", "Thiếu kỷ luật"],
      advice:
        "Nếu giữ được tính kỷ luật, năng lượng số 3 rất dễ tỏa sáng và tạo ảnh hưởng lớn.",
    },
    4: {
      title: "Người xây nền",
      short: "Thực tế, bền bỉ, thích ổn định.",
      detail:
        "Số 4 tượng trưng cho nền tảng, tổ chức, sự đều đặn và tính thực tế. Bạn thường làm tốt khi có kế hoạch rõ ràng, thích sự chắc chắn, có xu hướng xây thứ gì đó lâu bền.",
      strengths: ["Kỷ luật", "Chắc chắn", "Đáng tin"],
      challenges: ["Khô cứng", "Ngại thay đổi", "Dễ tự ép mình quá mức"],
      advice:
        "Đôi khi mở lòng với cái mới sẽ giúp số 4 không chỉ vững mà còn linh hoạt hơn.",
    },
    5: {
      title: "Người tự do",
      short: "Linh hoạt, thích trải nghiệm, ưa đổi mới.",
      detail:
        "Số 5 có năng lượng của dịch chuyển, trải nghiệm, thay đổi và học qua thực tế. Bạn thường không hợp cuộc sống quá gò bó, cần không gian để khám phá.",
      strengths: ["Thích nghi nhanh", "Dũng cảm trải nghiệm", "Năng động"],
      challenges: ["Dễ chán", "Thiếu ổn định", "Khó duy trì lâu dài"],
      advice:
        "Khi số 5 học được cách giữ nhịp ổn định, bạn sẽ rất mạnh vì vừa linh hoạt vừa có chiều sâu.",
    },
    6: {
      title: "Người chăm sóc",
      short: "Yêu thương, trách nhiệm, giàu tính chữa lành.",
      detail:
        "Số 6 gắn với tình yêu thương, gia đình, trách nhiệm và sự chăm sóc. Bạn thường muốn mọi người được ổn, muốn làm điểm tựa và có gu thẩm mỹ hoặc cảm quan hài hòa khá tốt.",
      strengths: ["Tận tâm", "Biết chăm lo", "Trách nhiệm"],
      challenges: ["Hay lo thay người khác", "Dễ ôm việc", "Khó buông kiểm soát"],
      advice:
        "Hãy nhớ chăm sóc chính mình trước, khi đó năng lượng số 6 mới thật sự cân bằng.",
    },
    7: {
      title: "Người chiêm nghiệm",
      short: "Nội tâm, học sâu, trưởng thành qua trải nghiệm.",
      detail:
        "Số 7 là con số của chiều sâu, chiêm nghiệm, học hỏi và trưởng thành nội tâm. Bạn thường không thích cái gì quá hời hợt, có xu hướng đi tìm ý nghĩa thật sự phía sau vấn đề.",
      strengths: ["Tư duy sâu", "Quan sát tốt", "Khả năng tự học cao"],
      challenges: ["Dễ cô lập", "Hay suy nghĩ nhiều", "Khó mở lòng"],
      advice:
        "Khi số 7 kết nối được chiều sâu nội tâm với đời sống thực tế, bạn sẽ rất vững và sáng.",
    },
    8: {
      title: "Người quản trị",
      short: "Mạnh mẽ, thực tế, thiên về thành tựu.",
      detail:
        "Số 8 gắn với năng lực quản lý, kết quả, tài chính, hiệu suất và sức ảnh hưởng. Bạn thường có nội lực mạnh, thích đo bằng kết quả thực tế và có khả năng tạo ra thành tựu lớn.",
      strengths: ["Bản lĩnh", "Tư duy kết quả", "Khả năng điều hành"],
      challenges: ["Dễ áp lực", "Khó mềm lại", "Đôi lúc quá nặng thành tích"],
      advice:
        "Giữ cân bằng giữa thành công bên ngoài và sự đủ đầy bên trong sẽ giúp số 8 bền hơn.",
    },
    9: {
      title: "Người nhân văn",
      short: "Bao dung, lý tưởng, có tâm phụng sự.",
      detail:
        "Số 9 là con số của lòng trắc ẩn, tầm nhìn rộng, lý tưởng và khuynh hướng cống hiến cho điều gì đó lớn hơn bản thân. Bạn thường có chiều sâu cảm xúc và quan tâm nhiều tới giá trị sống.",
      strengths: ["Bao dung", "Nhân văn", "Truyền cảm hứng vì cộng đồng"],
      challenges: ["Dễ lý tưởng hóa", "Khó buông quá khứ", "Nhạy cảm với nỗi đau"],
      advice:
        "Khi số 9 biết cân bằng giữa lòng tốt và ranh giới cá nhân, bạn sẽ rất đẹp và rất mạnh.",
    },
    11: {
      title: "Người truyền cảm hứng",
      short: "Trực giác mạnh, cảm nhận tinh tế, năng lượng cao.",
      detail:
        "Số 11 là một số master, thường gắn với trực giác, cảm hứng, độ nhạy cao và khả năng đánh thức điều tốt đẹp ở người khác. Bạn dễ cảm nhận năng lượng xung quanh và hợp với vai trò truyền cảm hứng.",
      strengths: ["Trực giác", "Nhạy cảm tinh tế", "Tạo cảm hứng"],
      challenges: ["Dễ quá tải", "Tâm trạng dao động", "Khó ổn định nhịp sống"],
      advice:
        "Số 11 cần nền tảng sống ổn định để giữ được độ sáng mà không bị kiệt năng lượng.",
    },
    22: {
      title: "Người kiến tạo lớn",
      short: "Tầm nhìn xa, khả năng biến ý tưởng thành thực tế.",
      detail:
        "Số 22 là master number của xây dựng quy mô lớn. Bạn có thể vừa mơ lớn vừa làm thật, miễn là biết đi từng bước chắc chắn. Đây là năng lượng rất mạnh nếu sống đúng hướng.",
      strengths: ["Tầm nhìn lớn", "Khả năng kiến tạo", "Thực thi mạnh"],
      challenges: ["Áp lực nặng", "Tự đòi hỏi cao", "Dễ mệt nếu ôm quá nhiều"],
      advice:
        "Số 22 rất cần kỷ luật, đội ngũ tốt và sự bền bỉ để chuyển tiềm năng thành thành tựu thật.",
    },
    33: {
      title: "Người chữa lành",
      short: "Tình thương lớn, phụng sự sâu, nâng đỡ người khác.",
      detail:
        "Số 33 là master number của yêu thương và chữa lành ở mức rất sâu. Bạn có thể có thiên hướng dẫn dắt bằng trái tim, hỗ trợ, chữa lành, giáo dục hoặc truyền giá trị sống tích cực.",
      strengths: ["Tình thương lớn", "Khả năng nâng đỡ", "Phụng sự"],
      challenges: ["Dễ hy sinh quá mức", "Tự ép mình", "Mang cảm xúc của người khác"],
      advice:
        "Số 33 chỉ thật sự đẹp khi biết vừa cho đi vừa giữ được cân bằng cho chính mình.",
    },
  },
  attitude: {
    1: "Số thái độ 1 cho thấy bạn bước vào cuộc sống với phong thái chủ động, thẳng và khá rõ ràng.",
    2: "Số thái độ 2 cho thấy bạn tạo cảm giác mềm, tinh tế, biết quan sát và hợp tác.",
    3: "Số thái độ 3 giúp bạn dễ tạo ấn tượng vui vẻ, có màu sắc riêng, biết biểu đạt.",
    4: "Số thái độ 4 cho thấy người khác cảm nhận bạn nghiêm túc, chắc chắn và đáng tin.",
    5: "Số thái độ 5 tạo hình ảnh linh hoạt, cởi mở, thích trải nghiệm mới.",
    6: "Số thái độ 6 thường khiến bạn toát ra năng lượng ấm áp, trách nhiệm và chăm sóc.",
    7: "Số thái độ 7 tạo cảm giác trầm, sâu, quan sát nhiều hơn nói.",
    8: "Số thái độ 8 giúp bạn tạo hình ảnh mạnh, quyết đoán, có lực.",
    9: "Số thái độ 9 khiến bạn dễ được cảm nhận là nhân văn, rộng lượng, có chiều sâu cảm xúc.",
    11: "Số thái độ 11 cho cảm giác đặc biệt, có trực giác và độ nhạy cao.",
    22: "Số thái độ 22 gợi năng lượng lớn, có tầm và có sức nặng trong cách hiện diện.",
    33: "Số thái độ 33 gợi ra sự yêu thương, chữa lành và nâng đỡ người khác.",
  },
  personalYear: {
    1: "Năm cá nhân 1 là lúc bắt đầu chu kỳ mới. Hợp để khởi sự, quyết định mới, đổi hướng và gieo hạt.",
    2: "Năm cá nhân 2 thiên về kiên nhẫn, hợp tác, nuôi dưỡng quan hệ và chờ thời điểm chín.",
    3: "Năm cá nhân 3 hợp cho sáng tạo, mở rộng giao tiếp, học cách thể hiện bản thân rõ hơn.",
    4: "Năm cá nhân 4 cần kỷ luật, nền tảng, xử lý việc thực tế và xây cấu trúc bền.",
    5: "Năm cá nhân 5 nhiều biến động, cơ hội đổi mới, dịch chuyển và trải nghiệm.",
    6: "Năm cá nhân 6 liên quan mạnh tới gia đình, trách nhiệm, chữa lành và cam kết.",
    7: "Năm cá nhân 7 là năm của chiêm nghiệm, học sâu, nhìn lại và nâng cấp nội tâm.",
    8: "Năm cá nhân 8 hợp cho thành tựu, tài chính, đàm phán, kết quả và sức ảnh hưởng.",
    9: "Năm cá nhân 9 là lúc kết thúc chu kỳ cũ, buông bỏ, hoàn tất và dọn đường cho cái mới.",
  },
  arrows: {
    "1-2-3": "Mũi tên 1-2-3 thường gợi khả năng tư duy thực tế và sắp xếp ý tưởng khá ổn.",
    "4-5-6": "Mũi tên 4-5-6 cho thấy nhịp hành động khá đều và có xu hướng làm tới nơi tới chốn.",
    "7-8-9": "Mũi tên 7-8-9 thiên về hoạt động trí óc, tư duy lớn và học qua trải nghiệm.",
    "1-4-7": "Mũi tên 1-4-7 gợi sự thực tế, biết làm, biết triển khai từng bước.",
    "2-5-8": "Mũi tên 2-5-8 cho thấy cảm xúc có điểm cân bằng và biết cảm nhận môi trường.",
    "3-6-9": "Mũi tên 3-6-9 thiên về sáng tạo, tưởng tượng, lý tưởng và tầm nhìn.",
    "1-5-9": "Mũi tên 1-5-9 thường được xem là mũi tên quyết tâm mạnh.",
    "3-5-7": "Mũi tên 3-5-7 gợi trực giác, độ nhạy và khả năng học qua chiều sâu trải nghiệm.",
  },
  emptyArrows: {
    "1-2-3": "Mũi tên trống 1-2-3 cho thấy cần rèn thêm cách sắp xếp suy nghĩ và lập kế hoạch rõ ràng.",
    "4-5-6": "Mũi tên trống 4-5-6 gợi bài học về nhịp hành động đều đặn và tính ổn định trong thực thi.",
    "7-8-9": "Mũi tên trống 7-8-9 cho thấy nên mở rộng tầm nhìn và học nhiều hơn qua trải nghiệm thực tế.",
    "1-4-7": "Mũi tên trống 1-4-7 là bài học về tính thực tế, kỷ luật và bền bỉ.",
    "2-5-8": "Mũi tên trống 2-5-8 gợi việc cần rèn cân bằng cảm xúc và ổn định nội tâm.",
    "3-6-9": "Mũi tên trống 3-6-9 cho thấy nên nuôi dưỡng trí tưởng tượng, niềm tin và tầm nhìn dài hơn.",
    "1-5-9": "Mũi tên trống 1-5-9 gợi bài học về quyết tâm và khả năng theo mục tiêu tới cùng.",
    "3-5-7": "Mũi tên trống 3-5-7 cho thấy cần nghe mình sâu hơn và tin vào trực giác lành mạnh.",
  },
  pinnacle: {
    1: "Đỉnh này mang năng lượng khởi đầu, tự lập, tự khẳng định và mở đường mới.",
    2: "Đỉnh này thiên về kiên nhẫn, quan hệ, hợp tác và học bài học mềm mại.",
    3: "Đỉnh này thiên về sáng tạo, biểu đạt, truyền thông và mở rộng giao tiếp.",
    4: "Đỉnh này tập trung vào xây nền tảng, lao động bền bỉ và cấu trúc rõ ràng.",
    5: "Đỉnh này nhiều thay đổi, dịch chuyển, bước ngoặt và trải nghiệm mới.",
    6: "Đỉnh này thiên về gia đình, trách nhiệm, chữa lành và cam kết.",
    7: "Đỉnh này nhấn mạnh học sâu, chiêm nghiệm, phát triển nội tâm và tri thức.",
    8: "Đỉnh này thiên về thành tựu, quản trị, tài chính và kết quả lớn.",
    9: "Đỉnh này thiên về hoàn thiện, buông bỏ, phụng sự và khép chu kỳ cũ.",
    11: "Đỉnh này mang màu sắc trực giác mạnh, cảm hứng và thức tỉnh tinh thần.",
    22: "Đỉnh này nhấn mạnh khả năng xây dựng điều lớn và hiện thực hóa tầm nhìn.",
    33: "Đỉnh này thiên về chữa lành, phụng sự và ảnh hưởng bằng tình thương sâu sắc.",
  },
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
  return reduceNumber(digits.reduce((a, b) => a + b, 0), true);
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

    if (hasAll) strong.push({ key, text: meanings.arrows[key] || `Mũi tên ${key}` });
    if (hasNone) missing.push({ key, text: meanings.emptyArrows[key] || `Mũi tên trống ${key}` });
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

  const firstEndAge = 36 - lifePath;

  return [
    { label: "Đỉnh cao 1", number: p1, ageStart: 0, ageEnd: firstEndAge },
    { label: "Đỉnh cao 2", number: p2, ageStart: firstEndAge + 1, ageEnd: firstEndAge + 9 },
    { label: "Đỉnh cao 3", number: p3, ageStart: firstEndAge + 10, ageEnd: firstEndAge + 18 },
    { label: "Đỉnh cao 4", number: p4, ageStart: firstEndAge + 19, ageEnd: null },
  ];
}

function buildPyramidText(date) {
  const pinnacles = calcPinnacles(date);

  return pinnacles
    .map((item) => {
      const yearStart = date.year + item.ageStart;
      const yearEnd = item.ageEnd == null ? null : date.year + item.ageEnd;
      const meaning = meanings.pinnacle[item.number] || `Đỉnh này mang năng lượng số ${item.number}.`;

      return `${item.label}: số ${item.number}
- Giai đoạn tuổi: ${item.ageStart}${item.ageEnd == null ? "+" : ` - ${item.ageEnd}`}
- Mốc năm: ${yearStart}${yearEnd == null ? "+" : ` - ${yearEnd}`}
- Ý nghĩa: ${meaning}`;
    })
    .join("\n\n");
}

function buildLifePathSection(lifePath) {
  const data = meanings.lifePath[lifePath];
  if (!data) {
    return `Số chủ đạo: ${lifePath}\nHiện tôi chưa có mô tả chi tiết cho con số này.`;
  }

  return `1) Số chủ đạo: ${lifePath} — ${data.title}
Từ khóa: ${data.short}

Phân tích:
${data.detail}

Điểm mạnh nổi bật:
- ${data.strengths.join("\n- ")}

Bài học / thách thức:
- ${data.challenges.join("\n- ")}

Gợi ý:
${data.advice}`;
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
    yearView,
  };
}

function buildChatReply(input, yearView) {
  const lower = normalizeVietnamese(input.toLowerCase());

  if (
    lower.includes("khac nhau giua so chu dao 6 va 7") ||
    lower.includes("giai thich su khac nhau giua so chu dao 6 va 7")
  ) {
    return {
      text: `So sánh số chủ đạo 6 và 7

Số 6:
- Thiên về yêu thương, chăm sóc, trách nhiệm.
- Quan tâm tới gia đình, sự hài hòa, cảm giác mọi người được ổn.
- Thường mạnh ở vai trò nâng đỡ, chữa lành, kết nối bằng tình cảm.

Số 7:
- Thiên về chiều sâu, chiêm nghiệm, học hỏi qua trải nghiệm.
- Quan tâm tới sự thật, ý nghĩa sống, tri thức và phát triển nội tâm.
- Thường mạnh ở khả năng quan sát, tự học và trưởng thành qua bài học cuộc đời.

Nói ngắn gọn:
- Số 6 nghiêng về trái tim và trách nhiệm với con người.
- Số 7 nghiêng về chiều sâu nhận thức và trải nghiệm linh hồn.

Không có số nào tốt hơn số nào, chỉ là khác chất. Số 6 đẹp ở sự ấm áp, số 7 đẹp ở chiều sâu.`,
      visualData: null,
    };
  }

  const { name, date } = extractNameAndDate(input);

  if (!date) {
    return {
      text: `Tôi chưa thấy ngày sinh hợp lệ trong tin nhắn của bạn.

Bạn hãy nhập theo một trong các cách sau:
- Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989
- Phân tích thần số học cho Trần Minh Anh 10/11/1965
- Cho tôi biết năm cá nhân ${yearView} của tôi, tôi sinh 24/08/1992
- Lập biểu đồ ngày sinh, mũi tên và kim tự tháp cho tôi: Võ Văn Hải 10/11/1965

Định dạng ngày sinh chuẩn là: dd/mm/yyyy`,
      visualData: null,
    };
  }

  const visualData = buildVisualData(name, date, yearView);
  const { lifePath, attitude, soulUrge, personality, expression, personalYear, birthdayNumber, counts, arrows } =
    visualData;

  return {
    text: `HỒ SƠ THẦN SỐ HỌC

Họ tên: ${name}
Ngày sinh: ${date.raw}
Năm đang xem: ${yearView}

${buildLifePathSection(lifePath)}

2) Số thái độ: ${attitude}
${meanings.attitude[attitude] || "Số thái độ này cho thấy phong thái bạn bước vào cuộc sống và ấn tượng đầu tiên bạn tạo ra cho người khác."}

3) Số linh hồn: ${soulUrge}
Số linh hồn phản ánh động lực sâu bên trong, điều trái tim bạn thật sự muốn hướng tới. Con số này cho thấy điều gì khiến bạn thấy có ý nghĩa, thấy được nuôi dưỡng từ bên trong.

4) Số nhân cách: ${personality}
Số nhân cách phản ánh hình ảnh bên ngoài và năng lượng mà người khác dễ cảm nhận từ bạn lúc mới tiếp xúc. Nó giống như “lớp sóng đầu tiên” người khác thấy ở bạn.

5) Số sứ mệnh / biểu đạt: ${expression}
Số biểu đạt cho thấy cách bạn phát triển năng lực tổng thể trong đời, cách bạn thể hiện bản thân và đóng góp cho thế giới.

6) Số ngày sinh: ${birthdayNumber}
Đây là một sắc thái phụ nhưng khá thú vị, cho thấy một món quà tự nhiên hoặc xu hướng nổi bật đi kèm hành trình của bạn.

7) Biểu đồ ngày sinh
${buildBirthChart(counts)}
Bố cục biểu đồ theo trục:
3 - 6 - 9
2 - 5 - 8
1 - 4 - 7

8) Mũi tên cá tính
${arrows.strong.length ? `- ${arrows.strong.map((x) => x.text).join("\n- ")}` : "- Hiện không có mũi tên cá tính nổi bật theo 8 trục cơ bản."}

9) Mũi tên trống / bài học
${arrows.missing.length ? `- ${arrows.missing.map((x) => x.text).join("\n- ")}` : "- Không có mũi tên trống nổi bật theo 8 trục cơ bản."}

10) Kim tự tháp / 4 đỉnh cao cuộc đời
${buildPyramidText(date)}

11) Năm cá nhân ${yearView}: ${personalYear}
${meanings.personalYear[personalYear] || "Đây là chu kỳ năm hiện tại của bạn."}

TỔNG KẾT NHANH
- Trục chính của bạn là số chủ đạo ${lifePath}
- Bên trong bạn được thúc đẩy bởi số linh hồn ${soulUrge}
- Bên ngoài bạn thể hiện khá rõ qua số nhân cách ${personality}
- Trong năm ${yearView}, bạn đang đi qua chu kỳ ${personalYear}

GỢI Ý ỨNG DỤNG
- Nếu bạn đang cần định hướng: hãy ưu tiên sống đúng với phẩm chất tốt đẹp của số chủ đạo ${lifePath}
- Nếu đang thấy mâu thuẫn nội tâm: xem lại khoảng cách giữa điều tim muốn (số linh hồn ${soulUrge}) và cách bạn đang sống bên ngoài (số nhân cách ${personality})
- Nếu muốn đọc sâu hơn về biểu đồ ngày sinh, hãy đặc biệt nhìn các số lặp nhiều và các mũi tên trống
- Kim tự tháp và 4 đỉnh cao giúp bạn nhìn từng chặng đường đời theo giai đoạn, thay vì đánh giá toàn bộ cuộc đời chỉ bằng một thời điểm

Nếu muốn, tôi có thể phân tích tiếp cho bạn theo một trong 4 hướng:
1. Giải thích kỹ hơn từng chỉ số
2. Phân tích điểm mạnh - điểm yếu trong công việc và tình cảm
3. Xem riêng năm cá nhân ${yearView} chi tiết hơn
4. Diễn giải sâu hơn biểu đồ ngày sinh, mũi tên và 4 đỉnh cao cuộc đời`,
      visualData,
    };
  };
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

function BirthChartGraphic({ counts }) {
  const layout = [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7],
  ];

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>Biểu đồ ngày sinh</div>
      <div style={styles.chartGrid}>
        {layout.flat().map((n) => (
          <div key={n} style={styles.chartCell}>
            <div style={styles.chartCellNumber}>{n}</div>
            <div style={styles.chartCellValue}>
              {counts[n] ? String(n).repeat(counts[n]) : "—"}
            </div>
          </div>
        ))}
      </div>
      <div style={styles.cardHint}>Bố cục: 3-6-9 / 2-5-8 / 1-4-7</div>
    </div>
  );
}

function ArrowGraphic({ arrows }) {
  const patternMeta = [
    { key: "1-2-3", name: "1-2-3" },
    { key: "4-5-6", name: "4-5-6" },
    { key: "7-8-9", name: "7-8-9" },
    { key: "1-4-7", name: "1-4-7" },
    { key: "2-5-8", name: "2-5-8" },
    { key: "3-6-9", name: "3-6-9" },
    { key: "1-5-9", name: "1-5-9" },
    { key: "3-5-7", name: "3-5-7" },
  ];

  const strongKeys = new Set(arrows.strong.map((x) => x.key));
  const missingKeys = new Set(arrows.missing.map((x) => x.key));

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>Mũi tên cá tính & mũi tên trống</div>
      <div style={styles.arrowList}>
        {patternMeta.map((item) => {
          const isStrong = strongKeys.has(item.key);
          const isMissing = missingKeys.has(item.key);

          return (
            <div
              key={item.key}
              style={{
                ...styles.arrowItem,
                background: isStrong ? "#0f3f32" : isMissing ? "#3a1f1f" : "#1f2937",
                borderColor: isStrong ? "#10a37f" : isMissing ? "#ef4444" : "#334155",
              }}
            >
              <div style={styles.arrowName}>{item.name}</div>
              <div style={styles.arrowStatus}>
                {isStrong ? "Mạnh" : isMissing ? "Trống" : "Trung tính"}
              </div>
            </div>
          );
        })}
      </div>
      <div style={styles.cardHint}>
        Xanh = mũi tên hiện diện · Đỏ = mũi tên trống · Xám = không nổi bật
      </div>
    </div>
  );
}

function PyramidGraphic({ pinnacles, birthYear }) {
  const mapped = pinnacles.map((p) => ({
    ...p,
    yearStart: birthYear + p.ageStart,
    yearEnd: p.ageEnd == null ? null : birthYear + p.ageEnd,
  }));

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>Kim tự tháp cuộc đời</div>
      <div style={styles.pyramidWrap}>
        <div style={styles.pyramidRowTop}>
          <div style={styles.pyramidNode}>{mapped[2].number}</div>
        </div>
        <div style={styles.pyramidRowMid}>
          <div style={styles.pyramidNode}>{mapped[0].number}</div>
          <div style={styles.pyramidNode}>{mapped[1].number}</div>
        </div>
        <div style={styles.pyramidRowBottom}>
          <div style={styles.pyramidNodeLarge}>{mapped[3].number}</div>
        </div>
      </div>
      <div style={styles.cardHint}>Các số trên đỉnh thể hiện bài học và năng lượng nổi bật theo từng chặng.</div>
    </div>
  );
}

function PinnaclesTimelineGraphic({ pinnacles, birthYear }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>4 đỉnh cao cuộc đời</div>
      <div style={styles.timeline}>
        {pinnacles.map((item, idx) => {
          const yearStart = birthYear + item.ageStart;
          const yearEnd = item.ageEnd == null ? null : birthYear + item.ageEnd;

          return (
            <div key={item.label} style={styles.timelineItem}>
              <div style={styles.timelineDot}>{idx + 1}</div>
              <div style={styles.timelineContent}>
                <div style={styles.timelineTitle}>
                  {item.label} · Số {item.number}
                </div>
                <div style={styles.timelineMeta}>
                  Tuổi {item.ageStart}
                  {item.ageEnd == null ? "+" : ` - ${item.ageEnd}`} · Năm {yearStart}
                  {yearEnd == null ? "+" : ` - ${yearEnd}`}
                </div>
                <div style={styles.timelineText}>
                  {meanings.pinnacle[item.number] || `Đỉnh này mang năng lượng số ${item.number}.`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VisualPanel({ visualData }) {
  if (!visualData) return null;

  return (
    <div style={styles.visualPanel}>
      <BirthChartGraphic counts={visualData.counts} />
      <ArrowGraphic arrows={visualData.arrows} />
      <PyramidGraphic pinnacles={visualData.pinnacles} birthYear={visualData.date.year} />
      <PinnaclesTimelineGraphic pinnacles={visualData.pinnacles} birthYear={visualData.date.year} />
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

          {!isUser && message.visualData && <VisualPanel visualData={message.visualData} />}

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

const styles = {
  visualPanel: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
    marginTop: 18,
  },
  card: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 16,
    padding: 14,
  },
  cardTitle: {
    fontWeight: 700,
    marginBottom: 12,
    fontSize: 15,
  },
  cardHint: {
    marginTop: 10,
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 1.4,
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
  },
  chartCell: {
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 10,
    minHeight: 68,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "#111827",
  },
  chartCellNumber: {
    fontSize: 12,
    color: "#94a3b8",
  },
  chartCellValue: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 1,
  },
  arrowList: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8,
  },
  arrowItem: {
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 10,
  },
  arrowName: {
    fontWeight: 700,
    fontSize: 13,
    marginBottom: 4,
  },
  arrowStatus: {
    fontSize: 12,
    color: "#cbd5e1",
  },
  pyramidWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  pyramidRowTop: {
    display: "flex",
    justifyContent: "center",
  },
  pyramidRowMid: {
    display: "flex",
    gap: 18,
    justifyContent: "center",
  },
  pyramidRowBottom: {
    display: "flex",
    justifyContent: "center",
  },
  pyramidNode: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "#1e293b",
    border: "1px solid #475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 22,
  },
  pyramidNodeLarge: {
    width: 76,
    height: 76,
    borderRadius: 18,
    background: "#0f3f32",
    border: "1px solid #10a37f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 28,
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  timelineItem: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 999,
    background: "#10a37f",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    background: "#111827",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 10,
  },
  timelineTitle: {
    fontWeight: 700,
    fontSize: 13,
    marginBottom: 4,
  },
  timelineMeta: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 6,
  },
  timelineText: {
    fontSize: 13,
    lineHeight: 1.5,
  },
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
      return saved ? JSON.parse(saved) : { yearView: 2026 };
    } catch {
      return { yearView: 2026 };
    }
  });

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const textareaRef = useRef(null);
  const endRef = useRef(null);

  const suggestions = useMemo(
    () => [
      "Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989",
      "Phân tích thần số học cho Trần Minh Anh 10/11/1965",
      "Cho tôi biết năm cá nhân 2026 của tôi, tôi sinh 24/08/1992",
      "Lập biểu đồ ngày sinh, mũi tên và kim tự tháp cho tôi: Võ Văn Hải 10/11/1965",
    ],
    []
  );

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

  function resetChat() {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setTyping(false);
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
      const delay = 700 + Math.floor(Math.random() * 700);
      setTimeout(() => {
        resolve(buildChatReply(text, settings.yearView));
      }, delay);
    });
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
      const result = await simulateReply(text);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.text,
          visualData: result.visualData,
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
          <p className="brand-subtitle">Bản local thông minh · không cần backend</p>
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
          <p>Giao diện kiểu ChatGPT · lưu lịch sử chat · không tốn phí API</p>
        </header>

        <div className="chat-scroll">
          {messages.length <= 1 && (
            <section className="hero">
              <h2>Thần Số Học GPT</h2>
              <p>
                Nhập họ tên và ngày sinh để nhận phân tích thần số học theo phong cách chat tự nhiên, rõ ràng và dễ đọc.
              </p>

              <div className="hero-actions">
                <div
                  className="hero-card"
                  onClick={() => handleSend("Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989")}
                >
                  <h4>Phân tích cơ bản</h4>
                  <p>Số chủ đạo, linh hồn, nhân cách, sứ mệnh và năm cá nhân.</p>
                </div>

                <div
                  className="hero-card"
                  onClick={() =>
                    handleSend("Cho tôi biết năm cá nhân 2026 của tôi, tôi sinh 24/08/1992")
                  }
                >
                  <h4>Xem năm cá nhân</h4>
                  <p>Tập trung vào chu kỳ năm hiện tại và định hướng hành động.</p>
                </div>

                <div
                  className="hero-card"
                  onClick={() =>
                    handleSend("Lập biểu đồ ngày sinh, mũi tên và kim tự tháp cho tôi: Võ Văn Hải 10/11/1965")
                  }
                >
                  <h4>Biểu đồ & kim tự tháp</h4>
                  <p>Thêm biểu đồ ngày sinh, mũi tên, 4 đỉnh cao và kim tự tháp.</p>
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
