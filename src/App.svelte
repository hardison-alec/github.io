<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let globeRoot;

  const feedItems = [
    { region: 'NORTH ATLANTIC', event: 'Suspicious AIS silence window exceeds 11 hours', confidence: '92%' },
    { region: 'EASTERN EUROPE', event: 'Cross-platform influence campaign tied to 17 mirrored domains', confidence: '89%' },
    { region: 'HORN OF AFRICA', event: 'Maritime route deviation near protected corridor', confidence: '84%' },
    { region: 'SOUTH AMERICA', event: 'Port logistics chatter spike around strategic mineral hubs', confidence: '78%' }
  ];

  const priorityTasks = [
    'Validate provenance and temporal consistency for cluster A-194',
    'Correlate maritime anomalies with SAR revisit opportunities',
    'Escalate executive intelligence digest with confidence grading'
  ];

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, globeRoot.clientWidth / globeRoot.clientHeight, 0.1, 1000);
    camera.position.set(0, 0.15, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeRoot.clientWidth, globeRoot.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    globeRoot.appendChild(renderer.domElement);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 72, 72),
      new THREE.MeshStandardMaterial({
        color: 0xb8172d,
        emissive: 0x280106,
        emissiveIntensity: 0.8,
        metalness: 0.35,
        roughness: 0.45
      })
    );
    scene.add(globe);

    const wireframe = new THREE.Mesh(
      new THREE.SphereGeometry(1.01, 36, 36),
      new THREE.MeshBasicMaterial({ color: 0xff7a8d, wireframe: true, transparent: true, opacity: 0.18 })
    );
    scene.add(wireframe);

    const stars = new THREE.Points(
      new THREE.BufferGeometry().setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
          Array.from({ length: 450 }, () => (Math.random() - 0.5) * 18),
          3
        )
      ),
      new THREE.PointsMaterial({ color: 0xa33c4d, size: 0.02 })
    );
    scene.add(stars);

    scene.add(new THREE.AmbientLight(0x401015, 0.95));
    const key = new THREE.PointLight(0xff5f77, 2.0);
    key.position.set(2.8, 2, 3.2);
    scene.add(key);

    const rim = new THREE.PointLight(0x6b0f1f, 1.3);
    rim.position.set(-3, -1.5, -3);
    scene.add(rim);

    let frame;
    const animate = () => {
      globe.rotation.y += 0.0038;
      wireframe.rotation.y -= 0.0022;
      stars.rotation.y += 0.00045;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      const width = globeRoot.clientWidth;
      const height = globeRoot.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      globe.geometry.dispose();
      globe.material.dispose();
      wireframe.geometry.dispose();
      wireframe.material.dispose();
      stars.geometry.dispose();
      stars.material.dispose();
      renderer.dispose();
      if (globeRoot?.contains(renderer.domElement)) globeRoot.removeChild(renderer.domElement);
    };
  });
</script>

<div class="app-shell">
  <header class="topbar">
    <div>
      <p class="eyebrow">OpenIntel / Mission Control</p>
      <h1>OSINT Operations Platform</h1>
      <p class="subtitle">Deep-red intelligence workspace for source triage, geospatial context, and analyst tasking.</p>
    </div>
    <div class="status-pill">Threat Posture: Elevated</div>
  </header>

  <main class="workspace-grid">
    <section class="panel">
      <h2>Collection Stream</h2>
      <ul class="feed-list">
        {#each feedItems as item}
          <li>
            <strong>{item.region}</strong>
            <span>{item.event}</span>
            <em>Confidence {item.confidence}</em>
          </li>
        {/each}
      </ul>
    </section>

    <section class="panel globe-panel">
      <h2>Geospatial Threat Globe</h2>
      <div class="globe" bind:this={globeRoot} aria-label="Three.js rotating geospatial globe" />
      <p class="panel-footnote">Three.js rendering active · tactical overlays ready for integration</p>
    </section>

    <section class="panel">
      <h2>Analyst Queue</h2>
      <ol class="task-list">
        {#each priorityTasks as task}
          <li>{task}</li>
        {/each}
      </ol>
    </section>
  </main>
</div>
