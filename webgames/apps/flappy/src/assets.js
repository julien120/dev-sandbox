export const ASSET_PATHS = {
    background: new URL('./assets/background.svg', import.meta.url).href,
    bird: new URL('./assets/bird.svg', import.meta.url).href,
    pipeTop: new URL('./assets/pipe-top.svg', import.meta.url).href,
    pipeBottom: new URL('./assets/pipe-bottom.svg', import.meta.url).href,
};
const loadImage = (source) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = source;
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`画像の読み込みに失敗しました: ${source}`));
    });
};
export const loadAssets = async () => {
    const entries = await Promise.all(Object.entries(ASSET_PATHS).map(async ([key, url]) => {
        // 画像ファイルを差し替えるだけでビジュアルを一新できるよう、ロードロジックを1か所に集約。
        const image = await loadImage(url);
        return [key, image];
    }));
    return Object.fromEntries(entries);
};
