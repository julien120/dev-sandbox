import './style.css';

type PlaceSummary = {
  name: string;
  address: string;
  rating?: number;
  userRatingCount?: number;
  reviews: Review[];
};

type Review = {
  author: string;
  rating: number;
  relativeTime: string;
  text: string;
  url?: string;
};

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('#app not found');
}

app.innerHTML = `
  <div class="card">
    <h1>Review Fetcher</h1>
    <p class="lead">Google Places API を使って合法的に口コミを取得し、ダウンロードできます。APIキーはご自身のものを入力してください。</p>
    <div class="grid">
      <div>
        <label for="apiKey">APIキー（Places API 有効）</label>
        <input id="apiKey" type="password" placeholder="AIza... / 環境変数など" autocomplete="off" />
      </div>
      <div>
        <label for="inputText">店舗URL または 店名・住所キーワード</label>
        <input id="inputText" type="text" placeholder="店名やGoogleマップのURLを貼り付け" />
      </div>
      <div>
        <label for="delayMs">人間ぽい待機ミリ秒（リクエスト間）</label>
        <input id="delayMs" type="number" min="400" max="5000" step="100" value="1200" />
      </div>
    </div>
    <div class="actions">
      <button id="fetchBtn">レビュー取得</button>
      <button id="downloadBtn" class="secondary" disabled>JSONダウンロード</button>
      <span class="pill" id="status">準備完了</span>
    </div>
    <div id="result" class="reviews"></div>
  </div>
`;

const apiKeyInput = document.querySelector<HTMLInputElement>('#apiKey')!;
const inputText = document.querySelector<HTMLInputElement>('#inputText')!;
const delayInput = document.querySelector<HTMLInputElement>('#delayMs')!;
const fetchBtn = document.querySelector<HTMLButtonElement>('#fetchBtn')!;
const downloadBtn = document.querySelector<HTMLButtonElement>('#downloadBtn')!;
const statusEl = document.querySelector<HTMLSpanElement>('#status')!;
const resultEl = document.querySelector<HTMLDivElement>('#result')!;

let lastResult: PlaceSummary | null = null;

const setStatus = (text: string) => {
  statusEl.textContent = text;
};

fetchBtn.addEventListener('click', async () => {
  const apiKey = apiKeyInput.value.trim();
  const query = inputText.value.trim();
  const delay = Number(delayInput.value) || 1200;
  if (!apiKey || !query) {
    setStatus('APIキーとURL/店名を入力してください');
    return;
  }
  fetchBtn.disabled = true;
  downloadBtn.disabled = true;
  resultEl.innerHTML = '';
  setStatus('検索中...');
  try {
    const placeId = await findPlaceId(apiKey, query, delay);
    if (!placeId) {
      setStatus('一致する場所が見つかりませんでした');
      return;
    }
    setStatus('詳細を取得中...');
    await sleep(delay);
    const summary = await fetchPlaceReviews(apiKey, placeId, delay);
    lastResult = summary;
    renderReviews(summary);
    downloadBtn.disabled = false;
    setStatus(`取得完了: ${summary.reviews.length} 件`);
  } catch (error) {
    console.error(error);
    setStatus('取得に失敗しました');
  } finally {
    fetchBtn.disabled = false;
  }
});

downloadBtn.addEventListener('click', () => {
  if (!lastResult) return;
  const blob = new Blob([JSON.stringify(lastResult, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFileName(lastResult.name || 'reviews')}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

const sanitizeFileName = (name: string) => name.replace(/[\\/:*?"<>|]+/g, '_');

const renderReviews = (summary: PlaceSummary) => {
  const { name, address, rating, userRatingCount, reviews } = summary;
  resultEl.innerHTML = `
    <div class="review">
      <header>
        <div>
          <div class="author">${name}</div>
          <div class="status">${address}</div>
        </div>
        <div class="rating">${rating ?? '-'} ★ (${userRatingCount ?? 0})</div>
      </header>
      <div class="status">以下は Google Places API から取得した最新レビューです</div>
    </div>
  `;
  reviews.forEach((review) => {
    const card = document.createElement('div');
    card.className = 'review';
    card.innerHTML = `
      <header>
        <span class="author">${review.author}</span>
        <span class="rating">${review.rating.toFixed(1)} ★</span>
      </header>
      <div class="status">${review.relativeTime}</div>
      <p>${escapeHtml(review.text)}</p>
    `;
    resultEl.appendChild(card);
  });
};

const escapeHtml = (raw: string) =>
  raw.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] ?? ch));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const findPlaceId = async (apiKey: string, query: string, delay: number): Promise<string | null> => {
  const endpoint = 'https://places.googleapis.com/v1/places:searchText';
  const body = {
    textQuery: query,
    maxResultCount: 1,
    languageCode: 'ja',
  };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`search failed: ${res.status} ${res.statusText}`);
  }
  await sleep(delay); // human-like pause
  const data = (await res.json()) as { places?: { id: string }[] };
  return data.places?.[0]?.id ?? null;
};

const fetchPlaceReviews = async (apiKey: string, placeId: string, delay: number): Promise<PlaceSummary> => {
  const endpoint = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  const res = await fetch(endpoint, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'id,displayName,formattedAddress,rating,userRatingCount,reviews.authorAttribution.displayName,reviews.rating,reviews.relativePublishTimeDescription,reviews.text.text',
    },
  });
  if (!res.ok) {
    throw new Error(`details failed: ${res.status} ${res.statusText}`);
  }
  await sleep(delay);
  const json = (await res.json()) as any;
  const reviews: Review[] =
    json.reviews?.map((r: any) => ({
      author: r.authorAttribution?.displayName ?? '匿名',
      rating: r.rating ?? 0,
      relativeTime: r.relativePublishTimeDescription ?? '',
      text: r.text?.text ?? '',
    })) ?? [];
  return {
    name: json.displayName?.text ?? '',
    address: json.formattedAddress ?? '',
    rating: json.rating,
    userRatingCount: json.userRatingCount,
    reviews,
  };
};
