import type { EraGraph } from '../types';

export const PRECURE_ERAS: EraGraph[] = [
  {
    "era": "2025",
    "label": "キミとアイドルプリキュ2025",
    "nodes": [
      {
        "id": "Hope",
        "label": "希望",
        "value": 100,
        "color": "#ff7fbf",
        "phrase": "もっと照らすよ決意リボン結んで"
      },
      {
        "id": "Joy",
        "label": "喜び",
        "value": 50,
        "color": "#ffd966",
        "phrase": "笑顔 light up (イェーイ)"
      },
      {
        "id": "Friendship",
        "label": "友情",
        "value": 100,
        "color": "#7ed1ff",
        "phrase": "キミとアイドルプリキュア (プリキュア)"
      },
      {
        "id": "Wonder",
        "label": "驚き",
        "value": 25,
        "color": "#c492ff",
        "phrase": "きらめき満開"
      },
      {
        "id": "Protection",
        "label": "守り",
        "value": 25,
        "color": "#f59f7d",
        "phrase": "大丈夫　ゼッタイ (プリキュア)"
      },
      {
        "id": "Future",
        "label": "未来",
        "value": 75,
        "color": "#8febc6",
        "phrase": "笑顔 light up (Light up)"
      }
    ],
    "links": [
      {
        "source": "Future",
        "target": "Hope",
        "weight": 1
      },
      {
        "source": "Future",
        "target": "Joy",
        "weight": 0.5
      }
    ]
  },
  {
    "era": "2024",
    "label": "わんだふるぷりきゅあ 2024",
    "nodes": [
      {
        "id": "Joy",
        "label": "喜び",
        "value": 61.5,
        "color": "#ffd966",
        "phrase": "キラキラ笑顔で"
      },
      {
        "id": "Friendship",
        "label": "友情",
        "value": 69.2,
        "color": "#7ed1ff",
        "phrase": "わいわいあつまって　みんな友達になる♪"
      },
      {
        "id": "Wonder",
        "label": "驚き",
        "value": 100,
        "color": "#c492ff",
        "phrase": "きらめく世界で　ココロ元気わんだふる！"
      },
      {
        "id": "Empathy",
        "label": "共感",
        "value": 46.2,
        "color": "#9be0d4",
        "phrase": "ぎゅっと抱きしめてくれるから"
      },
      {
        "id": "Protection",
        "label": "守り",
        "value": 15.4,
        "color": "#f59f7d",
        "phrase": "ぎゅっと抱きしめてくれるから"
      },
      {
        "id": "Fear",
        "label": "不安",
        "value": 7.7,
        "color": "#8f9bb3",
        "phrase": "涙はかくれんぼ　公園探検隊"
      },
      {
        "id": "Future",
        "label": "未来",
        "value": 23.1,
        "color": "#8febc6",
        "phrase": "仲良しキズナが　進化中"
      },
      {
        "id": "Solidarity",
        "label": "連帯",
        "value": 7.7,
        "color": "#6ed3ff",
        "phrase": "つながる世界で　ココロはしゃぐわんだふる！"
      },
      {
        "id": "Memory",
        "label": "記憶",
        "value": 15.4,
        "color": "#c7b8ff",
        "phrase": "キミと覚えてこれた気持ち　胸でふくらんでく"
      },
      {
        "id": "Adventure",
        "label": "冒険",
        "value": 7.7,
        "color": "#ffa45b",
        "phrase": "思いきり駆け出す笑顔と並んで GO！！"
      }
    ],
    "links": [
      {
        "source": "Friendship",
        "target": "Memory",
        "weight": 0.4
      },
      {
        "source": "Empathy",
        "target": "Protection",
        "weight": 0.4
      },
      {
        "source": "Friendship",
        "target": "Joy",
        "weight": 0.6
      },
      {
        "source": "Joy",
        "target": "Wonder",
        "weight": 0.6
      },
      {
        "source": "Friendship",
        "target": "Wonder",
        "weight": 1
      },
      {
        "source": "Adventure",
        "target": "Joy",
        "weight": 0.2
      },
      {
        "source": "Friendship",
        "target": "Solidarity",
        "weight": 0.2
      },
      {
        "source": "Solidarity",
        "target": "Wonder",
        "weight": 0.2
      }
    ]
  },
  {
    "era": "2023",
    "label": "ひろがるスカイ！プリキュア 2023",
    "nodes": [
      {
        "id": "Hope",
        "label": "希望",
        "value": 100,
        "color": "#ff7fbf",
        "phrase": "希望という光　つかんでた"
      },
      {
        "id": "Joy",
        "label": "喜び",
        "value": 30,
        "color": "#ffd966",
        "phrase": "イライラも　キラキラに　チェンジして"
      },
      {
        "id": "Friendship",
        "label": "友情",
        "value": 40,
        "color": "#7ed1ff",
        "phrase": "同じ空つながる仲間　明日へ続け！キセキ"
      },
      {
        "id": "Wonder",
        "label": "驚き",
        "value": 10,
        "color": "#c492ff",
        "phrase": "（トキメキgirl　ウキウキgirl　Hero Girls）"
      },
      {
        "id": "Empathy",
        "label": "共感",
        "value": 10,
        "color": "#9be0d4",
        "phrase": "「ありがとう」と笑う　やさしさをつなぐバトン"
      },
      {
        "id": "Protection",
        "label": "守り",
        "value": 10,
        "color": "#f59f7d",
        "phrase": "何が起きたって見捨てない（タッテ ミステナイ）"
      },
      {
        "id": "Fear",
        "label": "不安",
        "value": 20,
        "color": "#8f9bb3",
        "phrase": "果てしなく止めどなく　押し寄せるノイズたち"
      },
      {
        "id": "Future",
        "label": "未来",
        "value": 90,
        "color": "#8febc6",
        "phrase": "何かが始まる空の気配（ソラノケハイ）"
      },
      {
        "id": "Solidarity",
        "label": "連帯",
        "value": 50,
        "color": "#6ed3ff",
        "phrase": "同じ空つながる仲間　明日へ続け！キセキ"
      },
      {
        "id": "Adventure",
        "label": "冒険",
        "value": 100,
        "color": "#ffa45b",
        "phrase": "天高く羽ばたいて　最高のココロ持ち"
      }
    ],
    "links": [
      {
        "source": "Future",
        "target": "Hope",
        "weight": 1
      },
      {
        "source": "Friendship",
        "target": "Hope",
        "weight": 0.33
      },
      {
        "source": "Hope",
        "target": "Solidarity",
        "weight": 0.33
      },
      {
        "source": "Friendship",
        "target": "Future",
        "weight": 0.33
      },
      {
        "source": "Friendship",
        "target": "Solidarity",
        "weight": 0.33
      },
      {
        "source": "Future",
        "target": "Solidarity",
        "weight": 0.33
      }
    ]
  }
];
