'use client';

import { useEffect, useRef, useState } from 'react';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      const status = existing.getAttribute('data-load-status');
      if (status === 'loaded') {
        resolve();
        return;
      }
      if (status === 'failed') {
        existing.remove();
      } else {
        const onLoad = () => {
          existing.setAttribute('data-load-status', 'loaded');
          existing.removeEventListener('load', onLoad);
          existing.removeEventListener('error', onError);
          resolve();
        };
        const onError = () => {
          existing.setAttribute('data-load-status', 'failed');
          existing.removeEventListener('load', onLoad);
          existing.removeEventListener('error', onError);
          reject(new Error(`Failed to load script: ${src}`));
        };

        existing.addEventListener('load', onLoad);
        existing.addEventListener('error', onError);
        return;
      }
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.setAttribute('data-load-status', 'loading');
    script.onload = () => {
      script.setAttribute('data-load-status', 'loaded');
      resolve();
    };
    script.onerror = () => {
      script.setAttribute('data-load-status', 'failed');
      script.remove();
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.body.appendChild(script);
  });
}

async function loadScriptWithFallback(sources) {
  let lastError;
  for (const src of sources) {
    try {
      await loadScript(src);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Failed to load required runtime scripts.');
}

export default function MindarViewer({ targetUrl, mediaUrl, mediaType }) {
  const containerRef = useRef(null);
  const [runtimeError, setRuntimeError] = useState('');

  useEffect(() => {
    let mindarThree;
    let renderer;
    let video;
    let mounted = true;

    async function startMindar() {
      try {
        const bundledThree = await import('three');
        if (!window.THREE) {
          window.THREE = bundledThree;
        }

        await loadScriptWithFallback([
          '/vendor/mindar-image-three.prod.js',
          'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js',
          'https://unpkg.com/mind-ar@1.2.5/dist/mindar-image-three.prod.js'
        ]);

        const THREE = window.THREE;
        const MindARThree = window.MINDAR?.IMAGE?.MindARThree;

        if (!MindARThree || !containerRef.current) {
          throw new Error('MindAR runtime is not available in this build.');
        }

        mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: targetUrl,
        });

        const { scene, camera } = mindarThree;
        renderer = mindarThree.renderer;

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const anchor = mindarThree.addAnchor(0);

        if (mediaType === 'audio') {
          const audioElement = document.createElement('audio');
          audioElement.src = mediaUrl;
          audioElement.controls = true;
          audioElement.autoplay = true;
          audioElement.style.width = '100%';
          containerRef.current.appendChild(audioElement);
        } else {
          video = document.createElement('video');
          video.src = mediaUrl;
          video.crossOrigin = 'anonymous';
          video.playsInline = true;
          video.muted = true;
          video.loop = true;
          video.autoplay = true;

          const texture = new THREE.VideoTexture(video);
          const plane = new THREE.PlaneGeometry(1, 0.56);
          const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
          const mesh = new THREE.Mesh(plane, material);
          mesh.position.set(0, 0, 0);
          anchor.group.add(mesh);

          await video.play();
        }

        await mindarThree.start();
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });
      } catch (error) {
        if (mounted) {
          setRuntimeError(
            error instanceof Error
              ? `${error.message}. Check ad-block/privacy shields or corporate network rules for CDN script access.`
              : 'Failed to start MindAR runtime. Check ad-block/privacy shields or corporate network rules for CDN script access.'
          );
        }
      }
    }

    startMindar();

    return () => {
      mounted = false;
      if (renderer) {
        renderer.setAnimationLoop(null);
      }
      if (mindarThree) {
        mindarThree.stop();
      }
      if (video) {
        video.pause();
      }
    };
  }, [mediaType, mediaUrl, targetUrl]);

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="relative h-[380px] w-full overflow-hidden rounded-xl border border-[#6d4f3b] bg-black" />
      {runtimeError && <p className="text-sm text-[#E84A4A]">{runtimeError}</p>}
    </div>
  );
}
