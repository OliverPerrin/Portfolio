# Portfolio assets

- `ml-atmosphere.js` and `ml-atmosphere.css`: the portfolio's continuous particle
  background. A gridworld with an animated agent, a supervised fine-tuning loop,
  rotary coordinate pairs, a quadratic loss surface, and a shared encoder with
  three task heads morph through one field. Each scene contains moving elements;
  there are no click-through controls. The RL route and training cycle are authored
  illustrations, not a running learning agent, training job, or measured activations.
  References: [RL concepts](https://spinningup.openai.com/en/latest/spinningup/rl_intro.html),
  [SFT](https://huggingface.co/docs/trl/sft_trainer),
  [RoPE](https://arxiv.org/abs/2104.09864), and
  [multi-task learning](https://arxiv.org/abs/1706.05098).
  Motion respects the reduced-motion setting, suspends in hidden tabs, and falls
  back to a lower-density Canvas 2D renderer without WebGL. All scenes are large
  and centered in the viewport, with a horizontal multi-task structure. Their
  placement, scale, and brightness stay independent of scrolling and the portrait.

- `oliver-hiking.jpg`: user-supplied photograph, copied without pixel edits.
- `studio-runtime.js` and `studio-presets.json`: LiminalML's actual self-contained Studio spatial runtime and public LoRA, RoPE, and KV-cache presets, exported from local commit `af6f64a4dd2c286af76633f43a86e6453c85d1ad`. Source repository was read-only. Keep the runtime's bundled notices and visible LiminalML attribution. Portfolio overrides affect presentation only; the scene computations and explanatory limits are preserved. Autoplay is disabled.
