// Let the browser own scrolling, focus, and history.
const indexMenu = document.querySelector('.site-index');
if (indexMenu) {
    indexMenu.addEventListener('click', event => {
        if (event.target.closest('a')) indexMenu.open = false;
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && indexMenu.open) {
            indexMenu.open = false;
            indexMenu.querySelector('summary').focus();
        }
    });
    document.addEventListener('click', event => {
        if (!indexMenu.contains(event.target)) indexMenu.open = false;
    });
}

// The same offline 3D runtime and public presets used by LiminalML Studio.
// Load it only as the showcase approaches the viewport. No autoplay.
const sceneHost = document.getElementById('studio-scene');
if (sceneHost) {
    const descriptions = {
        lora: ['LoRA update space', 'Change the adapter rank to see its outputs expand from a line to a plane to a volume.', 'A three-output toy model with fixed synthetic inputs. It shows the adapter correction, not trained model activations.'],
        rope: ['Rotary position encoding', 'Move through token positions and see three coordinate pairs rotate at different frequencies.', 'The rings separate three pairs in a six-dimensional vector. This illustrates position encoding; it does not compute attention.'],
        'kv-cache': ['KV-cache memory', 'Step through decoding to see keys and values accumulate for each layer.', 'Three illustrative layers, with head and feature dimensions collapsed. This is a conceptual cache, not a memory or latency benchmark.']
    };
    let selected = 'lora';
    let cleanup;
    let assets;
    let request = 0;
    function loadAssets() {
        if (!assets) {
            assets = Promise.all([
                fetch('assets/studio-presets.json').then(response => {
                    if (!response.ok) throw new Error('Studio presets unavailable');
                    return response.json();
                }),
                new Promise((resolve, reject) => {
                    if (window.LiminalSpatial) return resolve();
                    const script = document.createElement('script');
                    script.src = 'assets/studio-runtime.js';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.append(script);
                })
            ]);
        }
        return assets;
    }
    async function showScene(kind) {
        selected = kind;
        const version = ++request;
        document.querySelectorAll('[data-scene]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scene === kind)));
        const [title, description, limits] = descriptions[kind];
        document.getElementById('visual-title').textContent = title;
        document.getElementById('visual-description').textContent = description;
        document.getElementById('visual-limits').textContent = limits;
        document.getElementById('visual-source').href = 'https://liminalml.com/explore/spatial-' + kind;
        sceneHost.setAttribute('aria-busy', 'true');
        try {
            const [documents] = await loadAssets();
            if (version !== request) return;
            if (cleanup) cleanup();
            cleanup = window.LiminalSpatial.mountSpatialVisual(sceneHost, documents.find(doc => doc.template === kind), { compact: true, branded: true });
        } catch {
            if (version !== request) return;
            sceneHost.replaceChildren();
            const message = document.createElement('p');
            message.className = 'scene-loading';
            message.textContent = 'The interactive preview could not load. You can open this visual directly in Studio using the link alongside it.';
            sceneHost.append(message);
        } finally {
            if (version === request) sceneHost.setAttribute('aria-busy', 'false');
        }
    }
    document.querySelectorAll('[data-scene]').forEach(button => button.addEventListener('click', () => showScene(button.dataset.scene)));
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                observer.disconnect();
                showScene(selected);
            }
        }, { rootMargin: '500px' });
        observer.observe(sceneHost);
    } else {
        showScene(selected);
    }
    window.addEventListener('pagehide', () => { if (cleanup) cleanup(); });
    window.addEventListener('pageshow', event => { if (event.persisted) showScene(selected); });
}
