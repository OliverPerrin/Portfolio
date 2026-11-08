# Portfolio assets

- `ml-atmosphere.js` and `ml-atmosphere.css`: the home page's mono frame. One WebGL
  canvas shows the particle scenes (a gridworld with an animated agent, a supervised
  fine-tuning loop, rotary coordinate pairs, a quadratic loss surface, and a shared
  encoder with three task heads) inside a hairline rectangle. Each full-screen
  section sets the rectangle's position and size through `data-frame`
  (centre x, centre y, width, height, particle presence, as viewport fractions), and
  the frame springs between them on scroll. Once per cycle the particles collapse
  onto the frame itself. Post-processing adds bloom, grain, a vignette and a slight
  chromatic split while the frame moves. The RL route and training cycle are
  authored illustrations, not a running learning agent, training job, or measured
  activations. References: [RL concepts](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html),
  [SFT](https://huggingface.co/docs/trl/sft_trainer),
  [RoPE](https://arxiv.org/abs/2104.09864), and
  [multi-task learning](https://arxiv.org/abs/1706.05098).
  A Pause control stops the scene cycle. Reduced motion snaps the frame and stops
  cycling and wipes; hidden tabs stop rendering; without WebGL a CSS rectangle
  stands in for the frame. The study it came from is `explorations/frame-and-light.html`
  (kept local, not deployed).

- `oliver-hiking.jpg`: user-supplied photograph, copied without pixel edits.
- `studio-runtime.js` and `studio-presets.json`: LiminalML's actual self-contained Studio spatial runtime and public LoRA, RoPE, and KV-cache presets, exported from local commit `af6f64a4dd2c286af76633f43a86e6453c85d1ad`. Source repository was read-only. Keep the runtime's bundled notices and visible LiminalML attribution. Portfolio overrides affect presentation only; the scene computations and explanatory limits are preserved. Autoplay is disabled.

- `/favicon.svg`: original OP monogram in the site's charcoal and cream colors.
  `/favicon.ico`, `/favicon-192.png`, and `/apple-touch-icon.png` are raster exports
  of the same mark for browser tabs, search results, and home-screen bookmarks.
