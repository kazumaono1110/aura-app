import { NextRequest, NextResponse } from "next/server";
import type { GenerateRequest, AuraHistoryItem } from "@/lib/types";

function buildContextBlock(
  history?: AuraHistoryItem[],
  weather?: { temp: number; condition: string } | null,
  datetime?: { dayOfWeek: string; timeOfDay: string; season: string }
): string {
  const lines: string[] = [];

  if (datetime) {
    lines.push(`【日時】${datetime.dayOfWeek} ${datetime.timeOfDay}（${datetime.season}）`);
  }
  if (weather) {
    lines.push(`【天気】気温${weather.temp}度、${weather.condition}`);
  }
  if (history && history.length > 0) {
    lines.push("【最近のオーラ履歴】");
    for (const h of history) {
      lines.push(`- ${h.date}: 「${h.input}」→ ${h.emotion_label}（${h.primary_color}）`);
    }
  }

  if (lines.length === 0) return "";

  return `

--- コンテキスト情報 ---
${lines.join("\n")}

このユーザーの情報を踏まえて、以下を意識してください：
- 履歴がある場合は、前回や数日前の状態との変化・つながりに言及する
- 天気や季節が気分に与える影響を自然に織り込む
- trendフィールドでは実際の履歴データに基づいた具体的な傾向分析をする（履歴がない場合は推測で）
- 時間帯に合ったアドバイスをする（朝なら一日の過ごし方、夜なら振り返りや明日への備え）
- まるで毎日会っている親しいアドバイザーのように、自然に語りかける`;
}

export async function POST(request: NextRequest) {
  const body: GenerateRequest = await request.json();
  const { mood, history, weather, datetime } = body;

  if (!mood || typeof mood !== "string" || mood.trim().length === 0) {
    return NextResponse.json({ error: "気分を入力してください" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // Demo mode: APIキーがない場合はダミーデータを返す
  if (!apiKey) {
    const demoPatterns: Record<string, {
      primary: string; secondary: string; tertiary: string;
      emotion_label: string; comment: string;
      lucky_action: string; compatible_color: string; compatible_hex: string; compatible_message: string;
      personality_mode: string; personality_detail: string; advice: string; trend: string;
    }> = {
      default: {
        primary: "#6B5CE7", secondary: "#E056A0", tertiary: "#F5A623",
        emotion_label: "静かな情熱",
        comment: "内側に小さな炎が灯っています。",
        lucky_action: "帰り道にいつもと違う道を1本だけ曲がってみて。小さな発見が今日の収穫になる",
        compatible_color: "ミントグリーン",
        compatible_hex: "#3EB489",
        compatible_message: "あなたの紫がかった情熱を、ミントグリーンの冷静さが中和してくれます。この2色が混ざると、判断力が研ぎ澄まされる組み合わせです。",
        personality_mode: "探求者モード",
        personality_detail: "好奇心が内側からじわじわ湧いている状態。未知のものに惹かれやすく、直感が冴えています。ただし手を広げすぎると散漫になるので、1つに絞る勇気が鍵。",
        advice: "今日のあなたは「考えるより動く」が正解。14時〜16時に直感が冴えやすい波が来ています。",
        trend: "ここ数日、内に向かうエネルギーと外に向かうエネルギーが交互に来ています。今日は外向きの日。この波に乗ると、思いがけない出会いが生まれやすくなります。",
      },
      tired: {
        primary: "#2D3561", secondary: "#6B5CE7", tertiary: "#8B9DC3",
        emotion_label: "静かな疲労",
        comment: "深い藍色が、今日の頑張りを包んでいます。",
        lucky_action: "21時までにスマホを置いて、温かい飲み物だけの時間を15分だけ作ってみて",
        compatible_color: "コーラルピンク",
        compatible_hex: "#FF7F7F",
        compatible_message: "あなたの深い藍色は「頑張りすぎのサイン」。コーラルピンクの持ち主は、言葉より存在で癒してくれるタイプ。近くにいるだけで呼吸が楽になります。",
        personality_mode: "回復モード",
        personality_detail: "心と体が「少し休ませて」と言っている状態。無理に元気を出す必要はありません。今は回復に集中することで、明日以降のパフォーマンスが格段に上がります。",
        advice: "今日の疲れは2日前の頑張りが今ごろ届いたもの。体は遅れて反応する。責めなくていい。",
        trend: "エネルギーの貯金を使い切りかけています。ここで1日だけ完全に力を抜くと、3日後に急に体が軽くなる周期に入れます。",
      },
      happy: {
        primary: "#FF6B6B", secondary: "#FFE66D", tertiary: "#F5A623",
        emotion_label: "陽だまり",
        comment: "暖かなオレンジが、心を照らしています。",
        lucky_action: "この気分のまま、最近ご無沙汰な人に「元気？」とだけ送ってみて。相手にとって今日のベストメッセージになる",
        compatible_color: "スカイブルー",
        compatible_hex: "#87CEEB",
        compatible_message: "あなたのオレンジの温かさと、スカイブルーの爽やかさが重なると「安心して挑戦できる空気」が生まれます。一緒にいるだけでお互いの行動力が上がる最高の組み合わせ。",
        personality_mode: "太陽モード",
        personality_detail: "周囲を自然と明るくする放射型のエネルギー状態。あなたがいるだけで場の空気が柔らかくなっています。この波動は伝染するので、大切な人と過ごすと効果倍増。",
        advice: "今日の気分をスクショしておいて。落ち込んだ未来の自分が見返したとき、一番効く薬になる。",
        trend: "ポジティブの波がここ数日で一番高い位置にいます。この波は周りにも伝染しているので、今日会った人はあなたのおかげで少し機嫌が良くなっているはず。",
      },
      anxious: {
        primary: "#4A6FA5", secondary: "#6B5CE7", tertiary: "#2D3561",
        emotion_label: "揺らぎ",
        comment: "波のように揺れる青が、あなたを映しています。",
        lucky_action: "不安なことを3つだけ紙に書き出して、1つだけ線で消してみて。「全部じゃない」と気づくだけで楽になる",
        compatible_color: "アンバーゴールド",
        compatible_hex: "#FFBF00",
        compatible_message: "揺れる青を、アンバーゴールドの安定感が支えてくれます。この色の持ち主は「大丈夫」を押し付けず、ただ隣にいてくれるタイプ。今のあなたに一番必要な存在です。",
        personality_mode: "内省モード",
        personality_detail: "感受性のアンテナが高く、普段は見逃すような微細な変化にも気づける状態。繊細さは弱さではなく、深い洞察の源。自分の声に耳を傾けることで答えが見つかります。",
        advice: "不安を感じているということは、それだけ真剣に向き合っている証拠。鈍感な人は不安にすらならない。",
        trend: "感受性のアンテナが普段より2段階高くなっています。些細なことが気になるのはそのせい。敏感な日は、良いものもよく拾えるので、好きな音楽や景色を意識的に取り入れて。",
      },
      excited: {
        primary: "#E056A0", secondary: "#FF6B6B", tertiary: "#FFE66D",
        emotion_label: "高揚",
        comment: "ピンクの光が弾けるように広がっています。",
        lucky_action: "このテンションのうちに「ずっとやりたかったけど先送りしてたこと」を1つだけ着手して。完了しなくていい、始めるだけでいい",
        compatible_color: "ディープネイビー",
        compatible_hex: "#1B2A4A",
        compatible_message: "あなたのピンクの爆発力を、ディープネイビーの冷静さが「方向」に変えてくれます。ブレーキ役ではなくナビゲーター。この組み合わせは最も成果が出やすいペアです。",
        personality_mode: "点火モード",
        personality_detail: "行動力と決断力が最大値に近い爆発的なエネルギー状態。周りを巻き込む力が強いですが、暴走注意。10秒だけ立ち止まって方向を確認すると、エネルギーが正しく着火します。",
        advice: "この熱量は72時間で半減する。今日と明日が勝負。逆に言えば、今動けば3日後には「あの時やってよかった」と思える。",
        trend: "エネルギーが外に向かって放射されています。周りの人はあなたの勢いに少し圧倒されているかも。意識的に相手の話を聞く時間を入れると、巻き込み力がさらに上がります。",
      },
    };

    const moodLower = mood.toLowerCase();
    let pattern = demoPatterns.default;
    if (moodLower.includes("疲") || moodLower.includes("だるい") || moodLower.includes("眠")) pattern = demoPatterns.tired;
    else if (moodLower.includes("嬉") || moodLower.includes("楽し") || moodLower.includes("ハッピー") || moodLower.includes("幸")) pattern = demoPatterns.happy;
    else if (moodLower.includes("不安") || moodLower.includes("心配") || moodLower.includes("怖")) pattern = demoPatterns.anxious;
    else if (moodLower.includes("ワクワク") || moodLower.includes("興奮") || moodLower.includes("テンション") || moodLower.includes("やる気")) pattern = demoPatterns.excited;

    const hueShift = Math.floor(Math.random() * 30) - 15;
    const shiftColor = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `#${Math.min(255, Math.max(0, r + hueShift)).toString(16).padStart(2, "0")}${Math.min(255, Math.max(0, g + hueShift)).toString(16).padStart(2, "0")}${Math.min(255, Math.max(0, b + hueShift)).toString(16).padStart(2, "0")}`;
    };

    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({
      ...pattern,
      primary: shiftColor(pattern.primary),
      secondary: shiftColor(pattern.secondary),
      tertiary: shiftColor(pattern.tertiary),
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `あなたは感情を色とオーラに変換するアーティストです。
ユーザーの気分テキストを受け取り、その感情を表現する美しいカラーパレットと詳細な読み解きを生成してください。

必ず以下のJSON形式のみで返答してください。他のテキストは一切含めないでください。
{
  "primary": "#xxxxxx",
  "secondary": "#xxxxxx",
  "tertiary": "#xxxxxx",
  "emotion_label": "感情を2〜4文字の日本語で",
  "comment": "40〜60文字の詩的なコメント。情景が浮かぶような表現で",
  "lucky_action": "今日おすすめの具体的な行動を50〜80文字で。時間帯や場所など具体的に。なぜその行動が良いのかの理由も添えて",
  "compatible_color": "相性の良いオーラの色名（カタカナ）",
  "compatible_hex": "#xxxxxx（compatible_colorの実際のカラーコード）",
  "compatible_message": "その色のオーラを持つ人との相性を80〜120文字で。なぜこの2色が合うのか、一緒にいるとどんな変化が起きるのかを具体的に。出会いたくなるような表現で",
  "personality_mode": "今の性格モードを○○モードの形式で（8文字以内）",
  "personality_detail": "そのモードの詳しい説明を60〜100文字で。今の自分がどういう状態で、どんな強みがあり、何に気をつけるべきかを具体的に",
  "advice": "今日の一言アドバイスを60〜100文字で。具体的な時間帯や行動を含め、なぜそうすべきかの理由も。占いっぽく断定的に",
  "trend": "最近の感情の傾向を80〜120文字で。過去数日の流れを推測し、今日がその中でどんな位置にいるかを解説。明日以降の予測も一言添えて"
}

カラーは美しいグラデーションになるよう、互いに調和する色を選んでください。
暗い感情でも美しい色を使ってください。
compatible_colorは実際のオーラと補色関係や調和する色を選び、その色のオーラを持つ人に出会いたくなるような表現にしてください。${buildContextBlock(history, weather, datetime)}`,
          },
          {
            role: "user",
            content: mood,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: errData?.error?.message || `OpenAI API error: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
    }

    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Generation error:", error);
    const message = error instanceof Error ? error.message : "生成に失敗しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
