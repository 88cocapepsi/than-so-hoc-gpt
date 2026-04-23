
import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "than_so_hoc_gpt_messages_v7";
const SETTINGS_KEY = "than_so_hoc_gpt_settings_v7";
const USER_HISTORY_KEY = "than_so_hoc_gpt_user_history_v7";
const MASTER_NUMBERS = [11, 22, 33];

const WELCOME_MESSAGE = {
  id: crypto.randomUUID(),
  role: "assistant",
  kind: "main",
  content:
    "Xin chào, tôi là Thần Số Học GPT. Bạn hãy nhập họ tên và ngày sinh theo dạng dd/mm/yyyy, hoặc viết tự nhiên như: 'Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989'. Tôi sẽ phân tích số chủ đạo, thái độ, linh hồn, nhân cách, sứ mệnh, năm cá nhân, biểu đồ ngày sinh, mũi tên, kim tự tháp, 4 đỉnh cao cuộc đời và cho phép bạn bấm xem các mục chuyên sâu cá nhân hoá.",
  time: new Date().toISOString(),
  visualData: null,
};

const LIFE_PATH_DATA = {
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
      "Người số 2 thường nhạy cảm, trực giác tốt, đáng tin cậy, tận tụy và giàu tình cảm. Bạn hợp với vai trò hỗ trợ, hòa giải, hợp tác cùng một tập thể hoặc người dẫn dắt năng động.",
    strengths: ["Trực giác", "Tinh tế", "Tận tụy", "Hòa giải tốt"],
    challenges: ["Dễ bị ảnh hưởng cảm xúc", "Ngại va chạm", "Dễ dựa dẫm quá mức"],
    advice:
      "Hãy tin hơn vào trực giác của mình, chọn đúng người đồng hành và phát triển thêm trí nhớ, suy luận để tự tin hơn.",
  },
  3: {
    title: "Người biểu đạt",
    short: "Tư duy nhanh, hài hước, truyền cảm hứng.",
    detail:
      "Người số 3 thiên mạnh về trí não, phân tích, ghi nhớ, lên kế hoạch. Bạn có duyên biểu đạt, đầu óc nhanh, sáng, hài hước nhưng cần học thêm sự tinh tế cảm xúc để sống hài hòa hơn.",
    strengths: ["Nhanh trí", "Biểu đạt tốt", "Hài hước", "Có sức bật tư duy"],
    challenges: ["Thiếu kiên nhẫn", "Hay soi lỗi", "Dễ gia trưởng hoặc chỉ đạo quá mức"],
    advice:
      "Đừng chỉ giỏi nói hay nghĩ; hãy luyện lòng bao dung, thấu cảm và dùng trí tuệ để kết nối chứ không chỉ để đánh giá.",
  },
  4: {
    title: "Người xây nền",
    short: "Thực tế, bền bỉ, khéo tay, đáng tin.",
    detail:
      "Người số 4 rất thực tế, thích làm hơn thích bàn, có thể mạnh về kỹ năng, thể chất, tính tổ chức và khả năng xây dựng nền tảng bền vững.",
    strengths: ["Kỷ luật", "Chắc chắn", "Khéo tay", "Đáng tin"],
    challenges: ["Khô cứng", "Dễ nghiêng vật chất", "Thiếu kiên nhẫn với tinh thần/tâm linh"],
    advice:
      "Hãy giữ sự thực tế của bạn, nhưng nhớ phát triển thêm trực giác, thư giãn và cân bằng giữa vật chất – tinh thần – trí tuệ.",
  },
  5: {
    title: "Người tự do",
    short: "Yêu tự do, giàu cảm xúc, có óc nghệ thuật.",
    detail:
      "Người số 5 yêu tự do, nhiều cảm xúc, giàu biểu đạt và thường cần không gian để sống thật với bản thân. Bạn hợp môi trường linh hoạt, năng động, sáng tạo.",
    strengths: ["Linh hoạt", "Giàu cảm xúc", "Yêu tự do", "Có duyên nghệ thuật"],
    challenges: ["Dễ chán", "Hay moody", "Khó chịu khi bị gò bó", "Dễ mắc lỗi do thiếu chú ý chi tiết"],
    advice:
      "Tự do thật không đến từ trốn tránh khuôn khổ, mà từ việc trưởng thành đủ để dùng trải nghiệm làm trí tuệ.",
  },
  6: {
    title: "Người chăm sóc",
    short: "Sáng tạo, giàu tình thương, yêu gia đình.",
    detail:
      "Người số 6 có năng lực sáng tạo mạnh, yêu thương con người, giàu trách nhiệm và rất để tâm đến gia đình, công bằng và sự chăm sóc.",
    strengths: ["Sáng tạo", "Tình thương", "Bao dung", "Trách nhiệm"],
    challenges: ["Hay lo lắng", "Dễ ôm việc", "Tính sở hữu", "Dễ thành khó tính khi stress"],
    advice:
      "Bạn sẽ nở rộ khi học cách buông bớt lo âu, yêu thương mà không kiểm soát và dùng sáng tạo để chữa lành thay vì căng thẳng.",
  },
  7: {
    title: "Người chiêm nghiệm",
    short: "Học qua trải nghiệm, sâu sắc, quyết đoán.",
    detail:
      "Người số 7 thường học qua va chạm thực tế, mất mát, trải nghiệm cá nhân. Bạn sâu sắc, nhân văn, quyết đoán và thường tích lũy trí tuệ lớn qua bài học đời.",
    strengths: ["Sâu sắc", "Quyết đoán", "Có vốn sống", "Nhân văn"],
    challenges: ["Ít nghe lời khuyên", "Nổi loạn", "Dễ trải bài học nặng ở sức khỏe, tình cảm hoặc tiền bạc"],
    advice:
      "Khi bạn chịu học từ trải nghiệm của mình và của người khác, con đường số 7 sẽ chuyển từ tổn thất thành trí tuệ.",
  },
  8: {
    title: "Người quản trị",
    short: "Độc lập, đáng tin, mạnh về thành tựu.",
    detail:
      "Người số 8 coi trọng tự chủ, có sức mạnh nội tại, năng lực quản trị và khả năng tạo thành tựu thực tế. Bạn thường khó bày tỏ cảm xúc nhưng rất có lực.",
    strengths: ["Độc lập", "Tự tin", "Có tố chất quản lý", "Đáng tin"],
    challenges: ["Khó bộc lộ tình cảm", "Dễ lạnh", "Bực khi bị can thiệp", "Dễ gặp bài học trong quan hệ"],
    advice:
      "Học cách bày tỏ lòng biết ơn, tình cảm và giữ cân bằng giữa sức mạnh – mềm mại sẽ mở lớn cả thành công lẫn hạnh phúc.",
  },
  9: {
    title: "Người nhân văn",
    short: "Lý tưởng, trách nhiệm, giàu nhân văn.",
    detail:
      "Người số 9 mang hoài bão, trách nhiệm và lý tưởng lớn. Bạn thường hướng về yếu tố con người, nghệ thuật, phụng sự và các giá trị lớn hơn lợi ích cá nhân.",
    strengths: ["Lý tưởng", "Thật thà", "Nhân văn", "Có trách nhiệm"],
    challenges: ["Khó quản lý tiền", "Dễ nghiêm túc quá mức", "Dễ lý tưởng hóa con người"],
    advice:
      "Muốn số 9 nở đẹp, bạn cần thêm kiên nhẫn, kiên định, óc nhìn người và đừng quên cho mình quyền được vui, nhẹ và thở.",
  },
  10: {
    title: "Người thích nghi",
    short: "Linh hoạt, hòa nhã, dễ thích nghi.",
    detail:
      "Người số 10 có khả năng dao động rất rộng: khi tích cực bạn rất quảng giao, tự tin và thích nghi tốt; khi lệch nhịp bạn dễ chao đảo. Đây là con số của linh hoạt và thay đổi.",
    strengths: ["Thích nghi nhanh", "Tự tin", "Hòa nhã", "Có tiềm năng thành công lớn"],
    challenges: ["Dễ sống hời hợt", "Dễ nóng nảy khi bị cản", "Có thể thiếu chiều sâu nội tâm"],
    advice:
      "Thiền, tập trung nội tâm và phân biệt điều quan trọng với điều chỉ gây xao động sẽ giúp số 10 đi từ tiềm năng sang thành tựu thực.",
  },
  11: {
    title: "Người truyền cảm hứng",
    short: "Trực giác mạnh, độ nhạy tinh thần cao.",
    detail:
      "Số 11 mang tiềm năng tinh thần và trực giác rất mạnh. Đây là dạng người có thể truyền cảm hứng, khai mở nhận thức hoặc đi theo con đường giá trị sâu.",
    strengths: ["Trực giác", "Nhạy tinh thần", "Truyền cảm hứng", "Chiều sâu"],
    challenges: ["Dễ quá tải", "Dễ bị kéo vào cảm xúc đời thường", "Khó ổn định nhịp sống"],
    advice:
      "Giữ nền sống ổn định và học cách quản trị năng lượng sẽ giúp số 11 không chỉ sáng mà còn bền.",
  },
  22: {
    title: "Người kiến tạo lớn",
    short: "Master number của xây dựng quy mô lớn.",
    detail:
      "Số 22/4 là con số đặc biệt hiếm, được xem là có tiềm năng gần như vô giới hạn nếu người mang nó nhận thức được sức mạnh của mình và sống có hướng.",
    strengths: ["Tầm nhìn lớn", "Khả năng kiến tạo", "Thực thi mạnh", "Có thể đạt mục tiêu rất lớn"],
    challenges: ["Dễ lười nếu không nhận ra giá trị bản thân", "Dễ cực đoan: được ăn cả, ngã về không"],
    advice:
      "Số 22/4 nở đẹp nhất khi biết biến năng lượng lớn thành kỷ luật, trách nhiệm và cống hiến thay vì chỉ mơ hoặc bỏ mặc tiềm năng.",
  },
};

const ATTITUDE_DATA = {
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
};

const PERSONAL_YEAR_DATA = {
  1: "Năm cá nhân 1 là lúc bắt đầu chu kỳ mới. Hợp để khởi sự, quyết định mới, đổi hướng và gieo hạt.",
  2: "Năm cá nhân 2 thiên về kiên nhẫn, hợp tác, nuôi dưỡng quan hệ và chờ thời điểm chín.",
  3: "Năm cá nhân 3 hợp cho sáng tạo, mở rộng giao tiếp, học cách thể hiện bản thân rõ hơn.",
  4: "Năm cá nhân 4 cần kỷ luật, nền tảng, xử lý việc thực tế và xây cấu trúc bền.",
  5: "Năm cá nhân 5 nhiều biến động, cơ hội đổi mới, dịch chuyển và trải nghiệm.",
  6: "Năm cá nhân 6 liên quan mạnh tới gia đình, trách nhiệm, chữa lành và cam kết.",
  7: "Năm cá nhân 7 là năm của chiêm nghiệm, học sâu, nhìn lại và nâng cấp nội tâm.",
  8: "Năm cá nhân 8 hợp cho thành tựu, tài chính, đàm phán, kết quả và sức ảnh hưởng.",
  9: "Năm cá nhân 9 là lúc kết thúc chu kỳ cũ, buông bỏ, hoàn tất và dọn đường cho cái mới.",
};

const ARROW_TEXT = {
  "1-2-3": {
    strong:
      "Bạn có Mũi tên Kế hoạch 1-2-3. Điều này cho thấy bạn có thiên hướng yêu sự gọn gàng, ngăn nắp, thích tổ chức và làm việc theo kế hoạch. Nếu đi kèm thêm tính thực tế, bạn rất dễ trở thành người hoạch định tốt.",
    weak:
      "Bạn thiếu trục 1-2-3 nên dễ gặp bài học về sắp xếp suy nghĩ, kế hoạch và khả năng tổ chức. Cuộc sống sẽ tốt hơn khi bạn luyện cách đi từng bước rõ ràng.",
    titleStrong: "Mũi tên kế hoạch",
    titleWeak: "Mũi tên trống kế hoạch",
  },
  "1-5-9": {
    strong:
      "Bạn có Mũi tên Quyết tâm 1-5-9. Đây là dấu hiệu của sự kiên trì, nhẫn nại và khả năng theo đuổi mục tiêu đến cùng. Điểm cần để ý là đừng để quyết tâm biến thành cố chấp.",
    weak:
      "Bạn đang có Mũi tên trống Trì hoãn 1-5-9. Điều này cho thấy bài học lớn của bạn là quyết tâm, tính kiên định và khả năng hành động dứt khoát, thay vì chần chừ hoặc đợi đúng cảm hứng mới làm.",
    titleStrong: "Mũi tên quyết tâm",
    titleWeak: "Mũi tên trống trì hoãn",
  },
  "3-5-7": {
    strong:
      "Bạn có Mũi tên Nhạy bén 3-5-7. Đây là dấu hiệu của độ nhạy cảm đặc biệt, trực giác tốt và xu hướng thích tự trải nghiệm để rút ra bài học riêng cho mình.",
    weak:
      "Bạn đang có Mũi tên trống Hoài nghi 3-5-7. Điều này cho thấy bạn có thể hay phân tích quá sâu, nghi ngờ nhiều, lạnh với những điều chưa chứng minh được và khó thả lỏng niềm tin.",
    titleStrong: "Mũi tên nhạy bén",
    titleWeak: "Mũi tên trống hoài nghi",
  },
  "3-6-9": {
    strong:
      "Bạn có Mũi tên Trí tuệ 3-6-9. Đây là lợi thế rất mạnh về tư duy, khả năng ghi nhớ và xử lý tri thức. Bạn dễ nổi bật ở học thuật, toán, phân tích và các lĩnh vực cần đầu óc sắc.",
    weak:
      "Bạn đang có Mũi tên trống Trí nhớ ngắn hạn 3-6-9. Bài học của bạn liên quan đến khả năng ghi nhớ, duy trì ý tưởng và làm sâu các năng lực trí tuệ thay vì chỉ nắm bề mặt.",
    titleStrong: "Mũi tên trí tuệ",
    titleWeak: "Mũi tên trống trí nhớ ngắn hạn",
  },
  "2-5-8": {
    strong:
      "Bạn có Mũi tên Cân bằng cảm xúc 2-5-8. Điều này cho thấy bạn có khả năng điều hòa cảm xúc, cảm nhận tốt các giá trị tinh thần và giữ nhịp tương đối ổn trong nhiều tình huống.",
    weak:
      "Bạn đang có Mũi tên trống Nhạy cảm 2-5-8. Đây là dấu hiệu của một vùng rất mong manh bên trong: dễ bất an, dễ tổn thương và đôi khi che giấu sự nhạy cảm bằng vẻ bướng bỉnh hoặc bất cần.",
    titleStrong: "Mũi tên cân bằng cảm xúc",
    titleWeak: "Mũi tên trống nhạy cảm",
  },
  "1-4-7": {
    strong:
      "Bạn có Mũi tên Thực tế 1-4-7. Đây là chỉ dấu của sự tháo vát, giỏi làm, khéo tay và sẵn sàng dấn thân vào công việc thực tế, hữu hình.",
    weak:
      "Bạn đang có Mũi tên trống Hỗn độn 1-4-7. Điều này cho thấy bài học của bạn nằm ở tổ chức, chăm sóc đời sống, kiên nhẫn và tạo trật tự thay vì để mọi thứ rơi vào trạng thái rối.",
    titleStrong: "Mũi tên thực tế",
    titleWeak: "Mũi tên trống hỗn độn",
  },
  "4-5-6": {
    strong:
      "Bạn có Mũi tên Ý chí 4-5-6. Đây là dấu hiệu của một lực nội tâm đáng kể, kết hợp giữa trí não, tự do và sáng tạo. Khi nhận ra điểm mạnh này, bạn có thể vượt trở ngại rất tốt.",
    weak:
      "Bạn đang có Mũi tên trống Uất hận / thiếu ý chí 4-5-6. Bài học ở đây là xây sức bền nội tâm, bớt ỷ lại và chủ động hơn với ước mơ của chính mình.",
    titleStrong: "Mũi tên ý chí",
    titleWeak: "Mũi tên trống ý chí",
  },
  "7-8-9": {
    strong:
      "Bạn có Mũi tên Hoạt động 7-8-9. Đây là chỉ dấu của nguồn năng lượng mạnh, tinh thần hành động rõ và xu hướng không muốn đứng ngoài cuộc sống.",
    weak:
      "Bạn đang có Mũi tên trống Thụ động 7-8-9. Điều này cho thấy bạn cần thêm trải nghiệm sống, vận động và va chạm thực tế để trưởng thành, thay vì đứng yên hoặc trì hoãn trải nghiệm.",
    titleStrong: "Mũi tên hoạt động",
    titleWeak: "Mũi tên trống thụ động",
  },
};

const SUCCESS_BRIDGE_DATA = {
  0: {
    title: "Không có khoảng cách, thuận dòng tự nhiên",
    text:
      "Bạn mang Cầu nối Thành công 0. Điều này cho thấy nội tâm và cách bạn thể hiện ra bên ngoài khá hòa hợp. Bạn ít bị tự mâu thuẫn trên đường thành công. Bài học của bạn không nằm ở chỉnh hướng quá nhiều, mà nằm ở việc đừng chủ quan, đừng ngủ quên trong vùng dễ chịu và tiếp tục mài giũa chuyên môn, kỷ luật, tầm nhìn.",
  },
  1: {
    title: "Trở ngại nằm ở bản lĩnh cá nhân",
    text:
      "Bạn mang Cầu nối Thành công 1. Thành công của bạn thường bị cản bởi sự chần chừ, nỗi sợ nổi bật hoặc việc chưa thật sự tin vào giá trị riêng của mình. Khi bạn học được quyền được là chính mình và dám chủ động bước lên trước khi mọi thứ hoàn hảo, cây cầu thành công sẽ mở rất nhanh.",
  },
  2: {
    title: "Trở ngại nằm ở cảm xúc và quan hệ",
    text:
      "Bạn mang Cầu nối Thành công 2. Bạn không thiếu năng lực, nhưng rất dễ chùn bước vì cảm xúc, quan hệ hoặc nỗi sợ mất lòng. Thành công của bạn đến mạnh khi biết giữ ranh giới, bớt lệ thuộc vào phản ứng của người khác và dùng sự tinh tế như sức mạnh thay vì như điểm yếu.",
  },
  3: {
    title: "Trở ngại nằm ở biểu đạt và tập trung",
    text:
      "Bạn mang Cầu nối Thành công 3. Bạn có tài, có ý tưởng, có duyên thể hiện, nhưng dễ bị phân tán, thiếu nhất quán hoặc đẹp phần mở đầu hơn phần kết thúc. Cầu nối này đòi hỏi bạn biến cảm hứng thành quy trình và truyền cảm hứng thành thành quả thật.",
  },
  4: {
    title: "Trở ngại nằm ở cấu trúc và kỷ luật",
    text:
      "Bạn mang Cầu nối Thành công 4. Cuộc đời đang dạy bạn bài học xây nền, ổn định, tổ chức và sức bền. Thành công của bạn không đến từ bùng nổ nhất thời, mà đến khi bạn chấp nhận đi từng bước, tạo hệ thống, bền với việc nhỏ nhưng quan trọng.",
  },
  5: {
    title: "Trở ngại nằm ở tự do và biến động",
    text:
      "Bạn mang Cầu nối Thành công 5. Bạn thông minh, thích trải nghiệm và linh hoạt, nhưng dễ bị cái mới kéo đi hoặc chán nhanh trước khi thành quả kịp chín. Bài học của bạn là tự do có trách nhiệm: biết chọn, biết giữ nhịp và biết neo mình đủ lâu vào hướng đúng.",
  },
  6: {
    title: "Trở ngại nằm ở trách nhiệm và gánh vác",
    text:
      "Bạn mang Cầu nối Thành công 6. Đường thành công của bạn dễ bị chậm vì ưu tiên người khác quá nhiều, gánh việc tình cảm, gia đình hoặc nghĩa vụ. Khi bạn học cách yêu thương mà không ôm hết, giúp mà không kiệt quệ, thành công cá nhân sẽ nở như một phần của trách nhiệm với cuộc đời mình.",
  },
  7: {
    title: "Trở ngại nằm ở niềm tin và sự cô lập",
    text:
      "Bạn mang Cầu nối Thành công 7. Bạn có chiều sâu, có tư duy và quan sát tốt, nhưng dễ chậm hành động vì phân tích quá nhiều, hoài nghi hoặc khó hợp tác. Cầu nối này mở ra khi bạn chấp nhận hành động trước khi hiểu hết, tin hơn vào tiến trình và đem trí tuệ ra sống cùng đời thực.",
  },
  8: {
    title: "Trở ngại nằm ở quyền lực và vật chất",
    text:
      "Bạn mang Cầu nối Thành công 8. Đây là bài học lớn về tiền, vị thế, quyền lực và năng lực chứa thành tựu lớn. Bạn có thể rất khát vọng, nhưng cũng có thể sợ chính sức mạnh của mình. Khi học được cách cầm sức mạnh một cách chính trực, bạn rất dễ bật lên mạnh mẽ.",
  },
};

const MATURITY_DATA = {
  1: {
    title: "Hậu vận của bản lĩnh, tự chủ và vị thế cá nhân",
    text:
      "Con số Trưởng thành 1 cho thấy càng về sau bạn càng được mời gọi bước vào bản lĩnh, tự chủ và quyền làm chủ đời mình. Nếu thời trẻ bạn còn ngại va chạm, thì hậu vận đẹp của bạn là khí chất của người biết mình là ai, dám chọn và dám chịu trách nhiệm cho lựa chọn đó.",
  },
  2: {
    title: "Hậu vận của tinh tế, hòa hợp và trí tuệ cảm xúc",
    text:
      "Con số Trưởng thành 2 cho thấy bạn càng lớn tuổi càng đẹp ở sự mềm mại, thấu hiểu, tinh tế và khả năng giữ hòa khí. Hậu vận của bạn không cần quá ồn ào; vẻ đẹp của bạn nằm ở việc biết yêu thương mà không đánh mất mình.",
  },
  3: {
    title: "Hậu vận của biểu đạt, niềm vui sống và lan tỏa",
    text:
      "Con số Trưởng thành 3 cho thấy càng về sau bạn càng nở mạnh ở giao tiếp, sáng tạo, kể chuyện, truyền cảm hứng. Hậu vận đẹp của bạn là niềm vui chín, không phải vui bề mặt mà là ánh sáng đã đi qua nhiều trải nghiệm.",
  },
  4: {
    title: "Hậu vận của nền tảng, kỷ luật và thành quả bền",
    text:
      "Con số Trưởng thành 4 cho thấy nửa sau cuộc đời của bạn càng rõ về trách nhiệm, cấu trúc, ổn định và giá trị bền vững. Hậu vận đẹp khi bạn có nền vững về tài chính, tinh thần hoặc sự nghiệp và trở thành chỗ dựa đáng tin cho người khác.",
  },
  5: {
    title: "Hậu vận của tự do, trải nghiệm và mở rộng",
    text:
      "Con số Trưởng thành 5 cho thấy bạn càng lớn tuổi càng cần sống linh hoạt, mở, thích nghi và trẻ về tinh thần. Bài học đẹp của bạn là học tự do một cách khôn ngoan: đủ mở để sống mới, đủ sâu để không tán loạn.",
  },
  6: {
    title: "Hậu vận của tình thương, trách nhiệm và giá trị gia đình",
    text:
      "Con số Trưởng thành 6 cho thấy hậu vận của bạn gắn mạnh với yêu thương, gia đình, sự chăm sóc và trách nhiệm. Càng chín, bạn càng đẹp ở sự ấm áp, đôn hậu, biết vun vén và tạo cảm giác được nâng đỡ cho người khác.",
  },
  7: {
    title: "Hậu vận của chiều sâu trí tuệ và nội tâm",
    text:
      "Con số Trưởng thành 7 cho thấy nửa sau cuộc đời bạn càng thiên về suy ngẫm, chiêm nghiệm, nghiên cứu và đời sống tinh thần. Hậu vận đẹp của bạn không phải ồn ào thành tích, mà là bình an, chiều sâu và lời nói ít nhưng nặng giá trị.",
  },
  8: {
    title: "Hậu vận của thành tựu, quyền lực và năng lực làm chủ",
    text:
      "Con số Trưởng thành 8 cho thấy bạn càng về sau càng bị đời hỏi sâu về thành tựu, tiền bạc, quyền lực và trách nhiệm lớn. Khi trưởng thành đúng, bạn không chỉ có khả năng làm việc lớn, mà còn có sức chứa để giữ thành quả một cách chính trực.",
  },
  9: {
    title: "Hậu vận của bao dung, cống hiến và chiều cao tâm hồn",
    text:
      "Con số Trưởng thành 9 cho thấy càng sống bạn càng được mời gọi bước vào lòng bao dung, nhân văn và tình thương rộng. Hậu vận đẹp của bạn là đi từ đau riêng đến hiểu chung, từ kỳ vọng cá nhân đến tầm nhìn lớn hơn cho con người và cuộc đời.",
  },
};

const HAPPINESS_BRIDGE_DATA = {
  0: "Bạn mang Cầu nối Hạnh phúc 0. Điều này cho thấy khoảng cách giữa điều lòng bạn cần và cách bạn đang sống bên ngoài không quá xa. Bài học của bạn là đừng chủ quan với hạnh phúc; bình an cũng cần được nuôi dưỡng có ý thức.",
  1: "Bạn mang Cầu nối Hạnh phúc 1. Trở ngại tới hạnh phúc nằm ở việc chưa sống đủ thật với bản thân, còn sợ khác người hoặc sợ bày tỏ nhu cầu thật. Hạnh phúc của bạn bắt đầu khi bạn cho mình quyền được là mình.",
  2: "Bạn mang Cầu nối Hạnh phúc 2. Bạn dễ gắn hạnh phúc với thái độ của người khác, nên khi quan hệ bất ổn bạn rất dễ mất cân bằng. Bài học của bạn là yêu mà không lệ thuộc, mềm mà không yếu.",
  3: "Bạn mang Cầu nối Hạnh phúc 3. Niềm vui của bạn dễ đến nhưng cũng dễ đi. Hạnh phúc bền của bạn không nằm ở vui nhiều hơn, mà ở sống thật hơn, biểu đạt thật hơn và cho phép mình chạm cả phần sâu lẫn phần sáng.",
  4: "Bạn mang Cầu nối Hạnh phúc 4. Bạn muốn bình an qua sự ổn định, nhưng đôi khi lại tự làm mình nặng nề vì quá nguyên tắc hoặc luôn phải 'đúng' mới dám thở. Bài học của bạn là kỷ luật nhưng vẫn mềm mại.",
  5: "Bạn mang Cầu nối Hạnh phúc 5. Bạn rất cần tự do và trải nghiệm, nhưng cũng dễ thấy thiếu dù đang có. Hạnh phúc của bạn đến khi học được ở yên với chính mình, không đổi liên tục chỉ vì bất an.",
  6: "Bạn mang Cầu nối Hạnh phúc 6. Bạn dễ đánh đổi hạnh phúc cá nhân để lo cho người khác. Hạnh phúc thật của bạn đến khi biết chăm người nhưng không bỏ mình, cho đi nhưng không kiệt quệ.",
  7: "Bạn mang Cầu nối Hạnh phúc 7. Trở ngại của bạn là cô lập, hoài nghi và khó mở lòng. Bạn sẽ hạnh phúc hơn nhiều khi hiểu rằng mở lòng không làm mình yếu đi và kết nối không làm mất chiều sâu.",
  8: "Bạn mang Cầu nối Hạnh phúc 8. Bạn dễ gắn hạnh phúc với thành tựu, vị thế hoặc cảm giác kiểm soát. Hạnh phúc sâu của bạn đến khi hiểu mình có thể mạnh mà vẫn mềm, thành công mà vẫn bình an.",
};

const KARMIC_LESSON_DATA = {
  1: "Bạn thiếu bài học nghiệp số 1. Điều này cho thấy bài học của bạn là bản lĩnh cá nhân, tính chủ động, sự tự tin và khả năng tự đứng ra chịu trách nhiệm cho đời mình.",
  2: "Bạn thiếu bài học nghiệp số 2. Bài học của bạn nằm ở sự tinh tế, khả năng hợp tác, lắng nghe, điều tiết cảm xúc và sống mềm mại hơn trong quan hệ.",
  3: "Bạn thiếu bài học nghiệp số 3. Bạn cần học biểu đạt cảm xúc, sống sinh động, cởi mở, cho phép mình giao tiếp và sáng tạo thay vì nén quá nhiều bên trong.",
  4: "Bạn thiếu bài học nghiệp số 4. Bài học của bạn nằm ở kỷ luật, cấu trúc, nề nếp, tính thực tế và sức bền với những việc nhỏ nhưng quan trọng.",
  5: "Bạn thiếu bài học nghiệp số 5. Bạn cần học mở lòng với thay đổi, trải nghiệm, sự linh hoạt và bước ra khỏi vùng an toàn một cách có ý thức.",
  6: "Bạn thiếu bài học nghiệp số 6. Bài học của bạn liên quan đến tình thương trưởng thành, trách nhiệm trong yêu thương, sự vun vén và chiều sâu của chăm sóc.",
  7: "Bạn thiếu bài học nghiệp số 7. Bạn cần đào sâu hơn vào nội tâm, sự chiêm nghiệm, niềm tin, trực giác và chiều sâu tri thức – tinh thần.",
  8: "Bạn thiếu bài học nghiệp số 8. Bạn cần rèn bản lĩnh với vật chất, khả năng quản trị, làm chủ nguồn lực, tiền bạc và áp lực thành tựu.",
  9: "Bạn thiếu bài học nghiệp số 9. Bài học của bạn là lòng bao dung, tầm nhìn rộng, sự tha thứ, bớt chấp nhặt và sống vì ý nghĩa lớn hơn cái tôi cá nhân.",
};

const KARMIC_DEBT_DATA = {
  13: "Bạn có Nợ nghiệp 13/4. Đây là bài học về lao động, kỷ luật, xây nền và thái độ nghiêm túc với quá trình. Đường tắt không phải chìa khóa của bạn; điều bền mới là câu trả lời.",
  14: "Bạn có Nợ nghiệp 14/5. Đây là bài học về tự do, tiết chế và làm chủ ham muốn. Bạn cần học tự do có trách nhiệm, thay vì đổi thay liên tục hoặc chạy theo cảm giác trước mắt.",
  16: "Bạn có Nợ nghiệp 16/7. Đây là bài học về cái tôi, đổ vỡ nhận thức và thức tỉnh nội tâm. Có những mất mát hoặc cú va đập sâu đến để dạy bạn khiêm nhường, thật và sâu hơn.",
  19: "Bạn có Nợ nghiệp 19/1. Đây là bài học về độc lập, trách nhiệm cá nhân và dùng cái tôi đúng cách. Bạn cần học tự đứng được, nhưng không cô lập; mạnh, nhưng không kiêu.",
};

const BALANCE_DATA = {
  1: "Con số Cân bằng của bạn là 1. Khi khó khăn tới, bạn cần giữ mình bằng bản lĩnh, chủ động và sự dứt khoát. Mạnh, nhưng không cứng. Chủ động, nhưng không độc đoán.",
  2: "Con số Cân bằng của bạn là 2. Khi khủng hoảng tới, bạn nên chậm lại, lắng nghe, điều hòa cảm xúc và dùng sự tinh tế để làm dịu tình huống. Mềm, nhưng không yếu.",
  3: "Con số Cân bằng của bạn là 3. Khi áp lực tới, hãy biểu đạt, viết ra, nói ra, sáng tạo lối ra cho cảm xúc. Tươi sáng, nhưng vẫn thật với nỗi đau.",
  4: "Con số Cân bằng của bạn là 4. Khi gặp sóng gió, bạn giữ mình tốt nhất bằng trật tự, kỷ luật, làm từng bước và bám vào điều thực tế có thể kiểm soát.",
  5: "Con số Cân bằng của bạn là 5. Khi khó khăn, bạn nên giữ mình bằng linh hoạt, thích nghi và đổi góc nhìn đúng lúc. Linh hoạt, nhưng không tán loạn.",
  6: "Con số Cân bằng của bạn là 6. Khi biến cố tới, bạn giữ mình bằng trách nhiệm, tình thương, sự đôn hậu và quay về những giá trị nền tảng. Yêu thương, nhưng không ôm hết.",
  7: "Con số Cân bằng của bạn là 7. Khi khủng hoảng tới, bạn nên lùi một bước để quan sát, suy ngẫm, tìm sự thật bên dưới lớp phản ứng. Tĩnh, nhưng không tách khỏi đời.",
  8: "Con số Cân bằng của bạn là 8. Khi khó khăn, bạn giữ mình bằng bản lĩnh, khả năng xử lý thực tế, quản trị nguồn lực và đứng vững trước áp lực. Mạnh, nhưng vẫn chính trực.",
  9: "Con số Cân bằng của bạn là 9. Khi gặp tổn thương, bạn nên giữ mình bằng lòng bao dung, cái nhìn rộng và khả năng buông điều không còn phù hợp. Rộng lòng, nhưng không xóa mình.",
};

const ADVANCED_OPTIONS = [
  { id: "arrow-strong", label: "1. Mũi tên trong thần số học cá tính" },
  { id: "arrow-weak", label: "2. Mũi tên trong thần số học trống" },
  { id: "pinnacles-deep", label: "3. Diễn giải sâu hơn về 4 đỉnh cao cuộc đời" },
  { id: "secondary", label: "4. Các số phụ" },
];

const SECONDARY_OPTIONS = [
  { id: "maturity", label: "1. Con số trưởng thành (tương lai hậu vận)" },
  { id: "success-bridge", label: "2. Con số cầu nối thành công (trở ngại tới thành công)" },
  { id: "happiness-bridge", label: "3. Con số cầu nối hạnh phúc (trở ngại tới hạnh phúc)" },
  { id: "karmic-lessons", label: "4. Con số bài học nghiệp (thiếu sót cần bổ sung)" },
  { id: "karmic-debts", label: "5. Con số nợ nghiệp (bài học chưa hoàn thành)" },
  { id: "balance", label: "6. Con số cân bằng (cách ứng xử trong khó khăn)" },
];

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
    if (hasAll) strong.push({ key, ...ARROW_TEXT[key] });
    if (hasNone) missing.push({ key, ...ARROW_TEXT[key] });
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

function buildLifePathSection(lifePath) {
  const data = LIFE_PATH_DATA[lifePath];
  if (!data) {
    return `1) Số chủ đạo: ${lifePath}\nHiện tôi chưa có mô tả chi tiết cho con số này.`;
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

function buildPyramidText(date) {
  const pinnacles = calcPinnacles(date);

  return pinnacles
    .map((item) => {
      const yearStart = date.year + item.ageStart;
      const yearEnd = item.ageEnd == null ? null : date.year + item.ageEnd;

      return `${item.label}: số ${item.number}
- Giai đoạn tuổi: ${item.ageStart}${item.ageEnd == null ? "+" : ` - ${item.ageEnd}`}
- Mốc năm: ${yearStart}${yearEnd == null ? "+" : ` - ${yearEnd}`}`;
    })
    .join("\n\n");
}

function buildChatReply(input, yearView) {
  const lower = normalizeVietnamese(input.toLowerCase());

  if (lower.includes("khac nhau giua so chu dao 6 va 7")) {
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
- Số 7 nghiêng về chiều sâu nhận thức và trải nghiệm linh hồn.`,
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
  const {
    lifePath,
    attitude,
    soulUrge,
    personality,
    expression,
    personalYear,
    birthdayNumber,
    counts,
    arrows,
    maturity,
    successBridge,
    happinessBridge,
    balance,
  } = visualData;

  return {
    text: `HỒ SƠ THẦN SỐ HỌC

Họ tên: ${name}
Ngày sinh: ${date.raw}
Năm đang xem: ${yearView}

${buildLifePathSection(lifePath)}

2) Số thái độ: ${attitude}
${ATTITUDE_DATA[attitude] || "Số thái độ này cho thấy phong thái bạn bước vào cuộc sống và ấn tượng đầu tiên bạn tạo ra cho người khác."}

3) Số linh hồn: ${soulUrge}
Số linh hồn phản ánh động lực sâu bên trong, điều trái tim bạn thật sự muốn hướng tới.

4) Số nhân cách: ${personality}
Số nhân cách phản ánh hình ảnh bên ngoài và năng lượng mà người khác dễ cảm nhận từ bạn.

5) Số sứ mệnh / biểu đạt: ${expression}
Số biểu đạt cho thấy cách bạn phát triển năng lực tổng thể trong đời và cách bạn tạo giá trị.

6) Số ngày sinh: ${birthdayNumber}
Đây là một sắc thái phụ nhưng khá thú vị, cho thấy món quà tự nhiên đi kèm hành trình sống của bạn.

7) Biểu đồ ngày sinh
${buildBirthChart(counts)}
Bố cục biểu đồ theo trục:
3 - 6 - 9
2 - 5 - 8
1 - 4 - 7

8) Mũi tên cá tính nổi bật
${arrows.strong.length ? `- ${arrows.strong.map((x) => x.titleStrong).join("\n- ")}` : "- Hiện không có mũi tên cá tính nổi bật theo 8 trục cơ bản."}

9) Mũi tên trống / bài học
${arrows.missing.length ? `- ${arrows.missing.map((x) => x.titleWeak).join("\n- ")}` : "- Không có mũi tên trống nổi bật theo 8 trục cơ bản."}

10) Kim tự tháp / 4 đỉnh cao cuộc đời
${buildPyramidText(date)}

11) Năm cá nhân ${yearView}: ${personalYear}
${PERSONAL_YEAR_DATA[personalYear] || "Đây là chu kỳ năm hiện tại của bạn."}

12) Các chỉ số phụ quan trọng
- Con số trưởng thành: ${maturity}
- Cầu nối thành công: ${successBridge}
- Cầu nối hạnh phúc: ${happinessBridge}
- Con số cân bằng: ${balance}

TỔNG KẾT NHANH
- Trục chính của bạn là số chủ đạo ${lifePath}
- Bên trong bạn được thúc đẩy bởi số linh hồn ${soulUrge}
- Bên ngoài bạn thể hiện khá rõ qua số nhân cách ${personality}
- Trong năm ${yearView}, bạn đang đi qua chu kỳ ${personalYear}

Ngay bên dưới khung này, bạn có thể bấm vào các mục chuyên sâu cá nhân hoá để xem sâu hơn theo đúng hồ sơ của mình.`,
    visualData,
  };
}

function buildAdvancedText(optionId, data) {
  if (!data) return "Tôi chưa có đủ dữ liệu để mở phần chuyên sâu này.";

  switch (optionId) {
    case "arrow-strong": {
      if (!data.arrows.strong.length) {
        return "Bạn hiện không có mũi tên cá tính nổi bật theo 8 trục cơ bản. Điều này không có nghĩa là bạn yếu hơn người khác, mà cho thấy năng lượng của bạn phân tán hơn và phát triển theo nhiều chiều nhỏ thay vì một trục quá rõ.";
      }
      return `MŨI TÊN CÁ TÍNH CỦA BẠN

${data.arrows.strong
  .map((item, idx) => `${idx + 1}. ${item.titleStrong}\n${item.strong}`)
  .join("\n\n")}

Điều quan trọng là: mũi tên mạnh là món quà, nhưng nếu đi quá đà nó cũng dễ thành cực đoan. Bạn sẽ nở đẹp nhất khi dùng điểm mạnh này có ý thức, có kỷ luật và có cân bằng.`;
    }
    case "arrow-weak": {
      if (!data.arrows.missing.length) {
        return "Bạn hiện không có mũi tên trống nổi bật theo 8 trục cơ bản. Đây là một dấu hiệu khá tốt: biểu đồ của bạn ít vùng khuyết trầm trọng, nên bài học của bạn thường nằm ở cân bằng, tinh chỉnh và trưởng thành chiều sâu hơn là thiếu một trục quá rõ.";
      }
      return `MŨI TÊN TRỐNG / BÀI HỌC CỦA BẠN

${data.arrows.missing
  .map((item, idx) => `${idx + 1}. ${item.titleWeak}\n${item.weak}`)
  .join("\n\n")}

Mũi tên trống không phải là điều xấu. Nó cho thấy đúng nơi cuộc đời đang dạy bạn trưởng thành. Khi bạn rèn đúng vùng này, đó thường lại là nơi bạn bật lên rất đẹp.`;
    }
    case "pinnacles-deep": {
      return `DIỄN GIẢI SÂU HƠN VỀ 4 ĐỈNH CAO CUỘC ĐỜI

${data.pinnacles
  .map((p, idx) => {
    const yearStart = data.date.year + p.ageStart;
    const yearEnd = p.ageEnd == null ? null : data.date.year + p.ageEnd;
    return `${idx + 1}. ${p.label} — Số ${p.number}
- Giai đoạn tuổi: ${p.ageStart}${p.ageEnd == null ? "+" : ` - ${p.ageEnd}`}
- Mốc năm: ${yearStart}${yearEnd == null ? "+" : ` - ${yearEnd}`}
- Luận giải: ${
      MATURITY_DATA[p.number]?.text ||
      `Giai đoạn này nhấn mạnh năng lượng số ${p.number}, mời gọi bạn trưởng thành đúng chất của con số này.`
    }`;
  })
  .join("\n\n")}

4 đỉnh cao không nói bạn “sướng hay khổ”, mà cho thấy từng chặng đời bạn cần lớn lên bằng phẩm chất nào. Càng đi đúng nhịp từng giai đoạn, bạn càng thấy đường đời bớt chống đối và bớt hao năng lượng.`;
    }
    case "maturity": {
      const item = MATURITY_DATA[data.maturity];
      return `CON SỐ TRƯỞNG THÀNH CỦA BẠN: ${data.maturity}

${item?.title || "Năng lượng trưởng thành của bạn"}

${item?.text || "Con số này cho thấy phẩm chất sẽ nở mạnh hơn ở giai đoạn trưởng thành muộn và hậu vận."}

Nói cách khác: đây là hình ảnh của phiên bản chín muồi hơn của bạn. Nó không phủ nhận con người hiện tại, mà chỉ ra bạn sẽ bước vào năng lượng nào rõ hơn khi sống đủ sâu, đủ thật và đủ trải nghiệm.`;
    }
    case "success-bridge": {
      const item = SUCCESS_BRIDGE_DATA[data.successBridge];
      return `CẦU NỐI THÀNH CÔNG CỦA BẠN: ${data.successBridge}

${item?.title || "Khoảng cách nội tại trên đường thành công"}

${item?.text || "Con số này cho biết kiểu trở ngại nội tâm có thể khiến bạn đi chậm hơn tới thành công."}

Tóm lại, con số này không nói bạn thành công hay thất bại. Nó nói bạn đang bị chặn ở đâu, và muốn bật lên thì cần sửa phần nào trước.`;
    }
    case "happiness-bridge": {
      const item = HAPPINESS_BRIDGE_DATA[data.happinessBridge];
      return `CẦU NỐI HẠNH PHÚC CỦA BẠN: ${data.happinessBridge}

${item}

Cây cầu này phản ánh khoảng cách giữa điều trái tim bạn thật sự cần và cách bạn đang sống. Khi khoảng cách đó được nối lại, cảm giác đủ đầy và an yên sẽ đến rõ hơn.`;
    }
    case "karmic-lessons": {
      if (!data.karmicLessons.length) {
        return "Biểu đồ ngày sinh của bạn không có bài học nghiệp nổi bật theo cách tính thiếu số 1–9. Điều này cho thấy bạn không bị thiếu trầm trọng một trục nào trong 9 phẩm chất cơ bản, nhưng vẫn cần phát triển đều và có ý thức các vùng mình còn yếu.";
      }
      return `CÁC CON SỐ BÀI HỌC NGHIỆP CỦA BẠN

${data.karmicLessons
  .map((n, idx) => `${idx + 1}. Số ${n}\n${KARMIC_LESSON_DATA[n]}`)
  .join("\n\n")}

Bài học nghiệp không phải là hình phạt. Nó là phần linh hồn đến để học. Càng nhận đúng chỗ thiếu, bạn càng trưởng thành nhanh và bền.`;
    }
    case "karmic-debts": {
      if (!data.karmicDebts.length) {
        return "Bạn hiện không có Nợ nghiệp nổi bật theo các dạng phổ biến 13/4, 14/5, 16/7, 19/1 trong cách tính đang dùng. Điều này không có nghĩa là bạn không có bài học sâu, mà là các bài học của bạn nghiêng nhiều hơn về trưởng thành tự nhiên, bài học nghiệp thiếu số, hoặc các cầu nối nội tâm.";
      }
      return `CÁC CON SỐ NỢ NGHIỆP CỦA BẠN

${data.karmicDebts
  .map((n, idx) => `${idx + 1}. ${n}\n${KARMIC_DEBT_DATA[n]}`)
  .join("\n\n")}

Nợ nghiệp không phải án phạt. Nó là bài học sâu hơn, đòi hỏi ý thức và sự trưởng thành cao hơn để đi qua một cách đẹp.`;
    }
    case "balance": {
      return `CON SỐ CÂN BẰNG CỦA BẠN: ${data.balance}

${BALANCE_DATA[data.balance]}

Con số này không phản ánh con người bạn lúc mọi thứ bình thường. Nó cho biết “thuốc tinh thần” phù hợp nhất để bạn giữ mình vững khi áp lực, biến cố hoặc tổn thương kéo tới.`;
    }
    default:
      return "Tôi chưa nhận diện được mục chuyên sâu này.";
  }
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
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
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: theme.accent,
            opacity: 0.85,
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

function BirthChartGraphic({ counts, theme }) {
  const layout = [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7],
  ];
  return (
    <div style={{ ...styles.card, background: theme.card, borderColor: theme.border }}>
      <div style={{ ...styles.cardTitle, color: theme.text }}>Biểu đồ ngày sinh</div>
      <div style={styles.chartGrid}>
        {layout.flat().map((n) => (
          <div key={n} style={{ ...styles.chartCell, background: theme.panel, borderColor: theme.border }}>
            <div style={{ ...styles.chartCellNumber, color: theme.muted }}>{n}</div>
            <div style={{ ...styles.chartCellValue, color: theme.text }}>
              {counts[n] ? String(n).repeat(counts[n]) : "—"}
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...styles.cardHint, color: theme.muted }}>Bố cục: 3-6-9 / 2-5-8 / 1-4-7</div>
    </div>
  );
}

function ArrowGraphic({ arrows, theme }) {
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
    <div style={{ ...styles.card, background: theme.card, borderColor: theme.border }}>
      <div style={{ ...styles.cardTitle, color: theme.text }}>Mũi tên cá tính & mũi tên trống</div>
      <div style={styles.arrowList}>
        {patternMeta.map((item) => {
          const isStrong = strongKeys.has(item.key);
          const isMissing = missingKeys.has(item.key);
          return (
            <div
              key={item.key}
              style={{
                ...styles.arrowItem,
                background: isStrong ? theme.strongBg : isMissing ? theme.missingBg : theme.panel,
                borderColor: isStrong ? theme.accent : isMissing ? theme.danger : theme.border,
              }}
            >
              <div style={{ ...styles.arrowName, color: theme.text }}>{item.name}</div>
              <div style={{ ...styles.arrowStatus, color: theme.muted }}>
                {isStrong ? "Mạnh" : isMissing ? "Trống" : "Trung tính"}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ ...styles.cardHint, color: theme.muted }}>
        Xanh = mũi tên hiện diện · Đỏ = mũi tên trống · Xám = không nổi bật
      </div>
    </div>
  );
}

function PyramidGraphic({ pinnacles, birthYear, theme }) {
  const mapped = pinnacles.map((p) => ({
    ...p,
    yearStart: birthYear + p.ageStart,
    yearEnd: p.ageEnd == null ? null : birthYear + p.ageEnd,
  }));

  return (
    <div style={{ ...styles.card, background: theme.card, borderColor: theme.border }}>
      <div style={{ ...styles.cardTitle, color: theme.text }}>Kim tự tháp cuộc đời</div>
      <div style={styles.pyramidWrap}>
        <div style={styles.pyramidRowTop}>
          <div style={{ ...styles.pyramidNode, background: theme.panel, borderColor: theme.border, color: theme.text }}>
            {mapped[2].number}
          </div>
        </div>
        <div style={styles.pyramidRowMid}>
          <div style={{ ...styles.pyramidNode, background: theme.panel, borderColor: theme.border, color: theme.text }}>
            {mapped[0].number}
          </div>
          <div style={{ ...styles.pyramidNode, background: theme.panel, borderColor: theme.border, color: theme.text }}>
            {mapped[1].number}
          </div>
        </div>
        <div style={styles.pyramidRowBottom}>
          <div style={{ ...styles.pyramidNodeLarge, background: theme.strongBg, borderColor: theme.accent, color: theme.text }}>
            {mapped[3].number}
          </div>
        </div>
      </div>
      <div style={{ ...styles.cardHint, color: theme.muted }}>
        Các số trên đỉnh thể hiện bài học và năng lượng nổi bật theo từng chặng.
      </div>
    </div>
  );
}

function PinnaclesTimelineGraphic({ pinnacles, birthYear, theme }) {
  return (
    <div style={{ ...styles.card, background: theme.card, borderColor: theme.border }}>
      <div style={{ ...styles.cardTitle, color: theme.text }}>4 đỉnh cao cuộc đời</div>
      <div style={styles.timeline}>
        {pinnacles.map((item, idx) => {
          const yearStart = birthYear + item.ageStart;
          const yearEnd = item.ageEnd == null ? null : birthYear + item.ageEnd;

          return (
            <div key={item.label} style={styles.timelineItem}>
              <div style={{ ...styles.timelineDot, background: theme.accent }}>{idx + 1}</div>
              <div style={{ ...styles.timelineContent, background: theme.panel, borderColor: theme.border }}>
                <div style={{ ...styles.timelineTitle, color: theme.text }}>
                  {item.label} · Số {item.number}
                </div>
                <div style={{ ...styles.timelineMeta, color: theme.muted }}>
                  Tuổi {item.ageStart}
                  {item.ageEnd == null ? "+" : ` - ${item.ageEnd}`} · Năm {yearStart}
                  {yearEnd == null ? "+" : ` - ${yearEnd}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SecondaryMetricsGraphic({ visualData, theme }) {
  return (
    <div style={{ ...styles.card, background: theme.card, borderColor: theme.border }}>
      <div style={{ ...styles.cardTitle, color: theme.text }}>Các số phụ cá nhân</div>
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
  );
}

function VisualPanel({ visualData, theme }) {
  if (!visualData) return null;
  return (
    <div style={styles.visualPanel}>
      <BirthChartGraphic counts={visualData.counts} theme={theme} />
      <ArrowGraphic arrows={visualData.arrows} theme={theme} />
      <PyramidGraphic pinnacles={visualData.pinnacles} birthYear={visualData.date.year} theme={theme} />
      <PinnaclesTimelineGraphic pinnacles={visualData.pinnacles} birthYear={visualData.date.year} theme={theme} />
      <SecondaryMetricsGraphic visualData={visualData} theme={theme} />
    </div>
  );
}

function AdvancedActions({ visualData, onSelect, theme }) {
  if (!visualData) return null;
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ color: theme.text, fontWeight: 700, marginBottom: 10 }}>
        🔍 Phân tích chuyên sâu cá nhân hoá
      </div>
      <div style={styles.actionList}>
        {ADVANCED_OPTIONS.map((item) => (
          <button
            key={item.id}
            style={{
              ...styles.actionButton,
              background: theme.panel,
              borderColor: theme.border,
              color: theme.text,
            }}
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
      <div style={{ color: theme.text, fontWeight: 700, marginBottom: 10 }}>
        Các số phụ chuyên sâu
      </div>
      <div style={styles.actionList}>
        {SECONDARY_OPTIONS.map((item) => (
          <button
            key={item.id}
            style={{
              ...styles.actionButton,
              background: theme.panel,
              borderColor: theme.border,
              color: theme.text,
            }}
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
        {!isUser && (
          <div style={{ ...styles.avatar, background: theme.strongBg, borderColor: theme.border }}>
            🔮
          </div>
        )}

        <div
          style={{
            ...styles.messageContent,
            background: isUser ? theme.userBubble : theme.assistantBubble,
            borderColor: theme.border,
          }}
        >
          <div style={styles.messageMeta}>
            <div style={{ ...styles.messageAuthor, color: theme.text }}>
              {isUser ? "Bạn" : "Thần Số Học GPT"}
            </div>
            <div style={{ ...styles.messageTime, color: theme.muted }}>{formatTime(message.time)}</div>
          </div>

          <div style={{ ...styles.messageText, color: theme.text, whiteSpace: "pre-wrap" }}>
            {message.content}
          </div>

          {!isUser && message.visualData && <VisualPanel visualData={message.visualData} theme={theme} />}

          {!isUser && message.kind === "main" && (
            <AdvancedActions visualData={message.visualData} onSelect={onAdvancedSelect} theme={theme} />
          )}

          {!isUser && isSecondaryMenu && (
            <SecondaryActions visualData={message.visualData} onSelect={onAdvancedSelect} theme={theme} />
          )}

          {!message.loading && (
            <div style={styles.messageTools}>
              <button
                style={{ ...styles.smallBtn, background: theme.panel, borderColor: theme.border, color: theme.text }}
                onClick={() => onCopy(message.content)}
              >
                Sao chép
              </button>
            </div>
          )}
        </div>

        {isUser && (
          <div style={{ ...styles.avatar, background: theme.panel, borderColor: theme.border }}>
            👤
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  appShell: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    minHeight: "100vh",
  },
  sidebar: {
    padding: 20,
    borderRight: "1px solid",
  },
  brandBox: {
    paddingBottom: 8,
    borderBottom: "1px solid rgba(148,163,184,0.14)",
    marginBottom: 18,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  brandSubtitle: {
    fontSize: 13,
    marginTop: 8,
    lineHeight: 1.5,
    maxWidth: 250,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  mainHeader: {
    padding: "24px 28px 8px",
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.03em",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 8,
  },
  primaryBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "none",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 16,
  },
  sidebarCard: {
    padding: 14,
    borderRadius: 16,
    border: "1px solid",
    marginBottom: 14,
  },
  sidebarLabel: {
    display: "block",
    fontSize: 12,
    marginBottom: 8,
  },
  sidebarInput: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid",
    outline: "none",
    fontSize: 14,
    marginBottom: 10,
    boxSizing: "border-box",
  },
  sidebarActions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  secondaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid",
    background: "transparent",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  },
  ghostBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid",
    background: "transparent",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  },
  suggestionList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  suggestionBtn: {
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid",
    background: "transparent",
    cursor: "pointer",
    fontSize: 13,
    lineHeight: 1.4,
  },
  userHistoryItem: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid",
    cursor: "pointer",
    marginBottom: 8,
  },
  userHistoryName: {
    fontWeight: 700,
    fontSize: 13,
    marginBottom: 4,
  },
  userHistoryMeta: {
    fontSize: 12,
    lineHeight: 1.4,
  },
  chatScroll: {
    flex: 1,
    overflowY: "auto",
    padding: "22px 28px 160px",
  },
  hero: {
    marginBottom: 24,
    borderRadius: 24,
    padding: 24,
    border: "1px solid",
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 800,
    margin: 0,
    textAlign: "center",
    letterSpacing: "-0.04em",
  },
  heroText: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 1.6,
    maxWidth: 780,
    margin: "14px auto 0",
  },
  heroActions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 22,
  },
  heroCard: {
    borderRadius: 18,
    border: "1px solid",
    padding: 16,
    cursor: "pointer",
  },
  messageWrap: {
    marginBottom: 18,
  },
  messageRow: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: 18,
  },
  messageContent: {
    maxWidth: "980px",
    width: "100%",
    borderRadius: 20,
    border: "1px solid",
    padding: 16,
    boxSizing: "border-box",
  },
  messageMeta: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
    fontSize: 12,
  },
  messageAuthor: {
    fontWeight: 700,
  },
  messageTime: {},
  messageText: {
    lineHeight: 1.75,
    fontSize: 15,
    wordBreak: "break-word",
  },
  messageTools: {
    marginTop: 12,
  },
  smallBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
  },
  chatInputBar: {
    position: "sticky",
    bottom: 0,
    padding: "18px 22px 22px",
    backdropFilter: "blur(12px)",
    zIndex: 10,
  },
  chatInputInner: {
    maxWidth: 980,
    margin: "0 auto",
  },
  chatBox: {
    display: "flex",
    alignItems: "flex-end",
    gap: 12,
    border: "1px solid",
    borderRadius: 22,
    padding: 12,
  },
  chatTextarea: {
    width: "100%",
    border: "none",
    outline: "none",
    resize: "none",
    background: "transparent",
    fontSize: 15,
    lineHeight: 1.55,
    fontFamily: "inherit",
    maxHeight: 220,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 700,
    flexShrink: 0,
  },
  chatHint: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 8,
  },
  visualPanel: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
    marginTop: 18,
  },
  card: {
    border: "1px solid",
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
    fontSize: 12,
    lineHeight: 1.4,
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
  },
  chartCell: {
    border: "1px solid",
    borderRadius: 12,
    padding: 10,
    minHeight: 68,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  chartCellNumber: {
    fontSize: 12,
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
    border: "1px solid",
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
    border: "1px solid",
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
    border: "1px solid",
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
    border: "1px solid",
    borderRadius: 12,
    padding: 10,
  },
  timelineTitle: {
    fontWeight: 700,
    fontSize: 13,
    marginBottom: 4,
  },
  timelineMeta: {
    fontSize: 12,
    marginBottom: 6,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },
  metricItem: {
    border: "1px solid",
    borderRadius: 12,
    padding: 10,
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 800,
  },
  actionList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 8,
  },
  actionButton: {
    padding: "11px 12px",
    borderRadius: 12,
    border: "1px solid",
    textAlign: "left",
    cursor: "pointer",
    fontSize: 13,
    lineHeight: 1.45,
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
    localStorage.setItem(USER_HISTORY_KEY, JSON.stringify(userHistory));
  }, [userHistory]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
  }, [input]);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = theme.appBg;
    document.body.style.color = theme.text;
    document.body.style.fontFamily =
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(settings.themeMode === "light" ? "theme-light" : "theme-dark");
  }, [theme, settings.themeMode]);

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

      if (result.visualData) {
        addUserToHistory(result.visualData);
      }

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
            "Bạn đã mở mục Các số phụ. Hãy chọn một nhánh bên dưới để xem phần luận giải cá nhân hoá sâu hơn đúng theo hồ sơ của mình.",
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
          <p style={{ ...styles.brandSubtitle, color: theme.muted }}>Bản local PRO · không cần backend</p>
        </div>

        <button
          style={{ ...styles.primaryBtn, background: theme.accent, color: "#fff" }}
          onClick={resetChat}
        >
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
              setSettings((prev) => ({
                ...prev,
                yearView: Number(e.target.value) || new Date().getFullYear(),
              }))
            }
          />

          <label style={{ ...styles.sidebarLabel, color: theme.muted }}>Giao diện</label>
          <div style={{ ...styles.sidebarActions, marginBottom: 10 }}>
            <button
              style={{
                ...styles.secondaryBtn,
                background: settings.themeMode === "dark" ? theme.accentSoft : "transparent",
                borderColor: theme.border,
                color: theme.text,
              }}
              onClick={() => setSettings((prev) => ({ ...prev, themeMode: "dark" }))}
            >
              🌙 Dark
            </button>
            <button
              style={{
                ...styles.secondaryBtn,
                background: settings.themeMode === "light" ? theme.accentSoft : "transparent",
                borderColor: theme.border,
                color: theme.text,
              }}
              onClick={() => setSettings((prev) => ({ ...prev, themeMode: "light" }))}
            >
              ☀️ Light
            </button>
          </div>

          <div style={styles.sidebarActions}>
            <button
              style={{ ...styles.secondaryBtn, borderColor: theme.border, color: theme.text }}
              onClick={resetChat}
            >
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
              <button
                key={item}
                style={{ ...styles.suggestionBtn, borderColor: theme.border, color: theme.text, background: theme.panel }}
                onClick={() => handleSend(item)}
              >
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
                <div
                  key={item.id}
                  style={{ ...styles.userHistoryItem, background: theme.panel, borderColor: theme.border }}
                  onClick={() => handleSend(item.prompt)}
                >
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
            Giao diện kiểu ChatGPT · lịch sử người dùng · dark / light mode · menu chuyên sâu cá nhân hoá
          </p>
        </header>

        <div style={styles.chatScroll}>
          {messages.length <= 1 && (
            <section style={{ ...styles.hero, background: theme.card, borderColor: theme.border }}>
              <h2 style={{ ...styles.heroTitle, color: theme.text }}>Thần Số Học GPT</h2>
              <p style={{ ...styles.heroText, color: theme.muted }}>
                Nhập họ tên và ngày sinh để nhận phân tích thần số học theo phong cách chat tự nhiên, có biểu đồ, có số phụ và có nút bấm xem chuyên sâu cá nhân hoá.
              </p>

              <div style={styles.heroActions}>
                <div
                  style={{ ...styles.heroCard, background: theme.heroCard, borderColor: theme.border }}
                  onClick={() => handleSend("Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989")}
                >
                  <h4 style={{ color: theme.text, marginTop: 0 }}>Phân tích cơ bản</h4>
                  <p style={{ color: theme.muted, marginBottom: 0 }}>
                    Số chủ đạo, linh hồn, nhân cách, sứ mệnh và năm cá nhân.
                  </p>
                </div>

                <div
                  style={{ ...styles.heroCard, background: theme.heroCard, borderColor: theme.border }}
                  onClick={() => handleSend("Cho tôi biết năm cá nhân 2026 của tôi, tôi sinh 24/08/1992")}
                >
                  <h4 style={{ color: theme.text, marginTop: 0 }}>Xem năm cá nhân</h4>
                  <p style={{ color: theme.muted, marginBottom: 0 }}>
                    Tập trung vào chu kỳ năm hiện tại và định hướng hành động.
                  </p>
                </div>

                <div
                  style={{ ...styles.heroCard, background: theme.heroCard, borderColor: theme.border }}
                  onClick={() =>
                    handleSend("Lập biểu đồ ngày sinh, mũi tên và kim tự tháp cho tôi: Võ Văn Hải 10/11/1965")
                  }
                >
                  <h4 style={{ color: theme.text, marginTop: 0 }}>Biểu đồ & kim tự tháp</h4>
                  <p style={{ color: theme.muted, marginBottom: 0 }}>
                    Thêm biểu đồ ngày sinh, mũi tên, 4 đỉnh cao và các số phụ cá nhân.
                  </p>
                </div>
              </div>
            </section>
          )}

          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onCopy={copyText}
              onAdvancedSelect={handleAdvancedSelect}
              theme={theme}
            />
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
              <button
                style={{ ...styles.sendBtn, background: input.trim() ? theme.accent : theme.border, color: "#fff" }}
                onClick={() => handleSend()}
                disabled={!input.trim()}
              >
                ➤
              </button>
            </div>
            <div style={{ ...styles.chatHint, color: theme.muted }}>
              Ví dụ: Tôi tên Nguyễn Hoàng Long, sinh ngày 17/01/1989
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
