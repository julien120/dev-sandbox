// Minimal stub worker to override @ffmpeg/ffmpeg default multi-thread worker URL.
// Single-threaded builds of @ffmpeg/core do not require any worker handling.
self.onmessage = () => {
  // Ignore unexpected messages from ffmpeg wasm runtime.
};
