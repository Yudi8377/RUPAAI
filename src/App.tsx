import { useEffect, useRef, useState } from 'react';
import { clearHairOverlay, createHairSegmenter, renderHairColor } from './hairVision';
import { Aperture, ArrowUpRight, Check, ChevronDown, CircleHelp, Crown, Download, Heart, Menu, Palette, RefreshCw, Scissors, ShieldCheck, Sparkles, Video, VideoOff, WandSparkles } from 'lucide-react';

type Look = { id: string; name: string; note: string; shape: string; tone: string; tint: string };
const looks: Look[] = [
  { id: 'bob', name: 'French Bob', note: 'Chic · Struktur', shape: 'French bob', tone: 'bob', tint: '#3a2924' },
  { id: 'layers', name: 'Soft Layers', note: 'Natural · Flowing', shape: 'soft layers', tone: 'layers', tint: '#5c3a29' },
  { id: 'pixie', name: 'Modern Pixie', note: 'Bold · Effortless', shape: 'modern pixie', tone: 'pixie', tint: '#302521' },
  { id: 'waves', name: 'Hollywood Waves', note: 'Glamour · Volume', shape: 'hollywood waves', tone: 'waves', tint: '#71452d' },
  { id: 'curly', name: 'Defined Curls', note: 'Defined · Textured', shape: 'defined curls', tone: 'curly', tint: '#3c2a23' },
  { id: 'long', name: 'Long & Sleek', note: 'Polished · Timeless', shape: 'long sleek', tone: 'long', tint: '#29201e' },
];
const colors = [
  { name: 'Espresso', value: '#30221e' }, { name: 'Chocolate', value: '#5a3829' },
  { name: 'Chestnut', value: '#8b5133' }, { name: 'Copper', value: '#bd6841' },
  { name: 'Honey Blonde', value: '#d5ae6b' }, { name: 'Ash Blonde', value: '#b4a48c' },
  { name: 'Rose', value: '#b87983' }, { name: 'Midnight Blue', value: '#343b57' },
];
export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const activeColorRef = useRef(colors[1].value);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [visionStatus, setVisionStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [activeLook, setActiveLook] = useState('layers');
  const [activeColor, setActiveColor] = useState(colors[1].value);
  const [tab, setTab] = useState<'haircuts' | 'colors'>('haircuts');
  const [saved, setSaved] = useState(false);
  const [studio, setStudio] = useState(false);

  useEffect(() => () => streamRef.current?.getTracks().forEach(track => track.stop()), []);
  useEffect(() => {
    activeColorRef.current = activeColor;
    if (visionStatus === 'ready' && videoRef.current && overlayRef.current) {
      // The animation loop reads this ref, so color changes do not reload the model.
    }
  }, [activeColor, visionStatus]);

  useEffect(() => {
    if (!cameraOn) {
      setVisionStatus('idle');
      clearHairOverlay(overlayRef.current);
      return;
    }
    let cancelled = false;
    let frame = 0;
    let lastInference = 0;
    let segmenter: Awaited<ReturnType<typeof createHairSegmenter>> | null = null;
    setVisionStatus('loading');
    createHairSegmenter().then(instance => {
      if (cancelled) { instance.close(); return; }
      segmenter = instance;
      setVisionStatus('ready');
      const tick = (now: number) => {
        if (cancelled) return;
        if (now - lastInference >= 140 && videoRef.current && overlayRef.current && segmenter) {
          lastInference = now;
          try {
            renderHairColor(segmenter, videoRef.current, overlayRef.current, activeColorRef.current, now);
          } catch {
            setVisionStatus('error');
            clearHairOverlay(overlayRef.current);
            return;
          }
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }).catch(() => {
      if (!cancelled) setVisionStatus('error');
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      segmenter?.close();
      clearHairOverlay(overlayRef.current);
    };
  }, [cameraOn]);

  useEffect(() => {
    if (videoRef.current && streamRef.current) videoRef.current.srcObject = streamRef.current;
  }, [cameraOn]);

  async function startCamera() {
    if (cameraStarting || cameraOn) return;
    setCameraError('');
    setCameraStarting(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Browser ini belum mendukung akses kamera. Coba Chrome atau Edge terbaru melalui HTTPS atau localhost.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      // A permission prompt can outlive the page or component that initiated it.
      // Do not leave the newly granted camera running if its video target is gone.
      if (!videoRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = stream;
      const handleTrackEnded = () => {
        // Ignore stale streams if a newer camera session has already started.
        if (streamRef.current !== stream) return;
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
        setCameraOn(false);
        setCameraError('Koneksi kamera terputus. Periksa perangkat kamera lalu hubungkan kembali.');
      };
      stream.getVideoTracks().forEach(track => {
        track.addEventListener('ended', handleTrackEnded, { once: true });
      });
      videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch {
      setCameraError('Kamera belum dapat diakses. Periksa izin kamera browser atau pastikan kamera tidak sedang digunakan aplikasi lain.');
    } finally {
      setCameraStarting(false);
    }
  }
  function stopCamera() {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }
  function capturePreview() {
    const video = videoRef.current;
    if (!video || !cameraOn || video.videoWidth === 0) {
      setCameraError('Aktifkan kamera terlebih dahulu untuk mengambil pratinjau.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.translate(canvas.width, 0); ctx.scale(-1, 1); ctx.drawImage(video, 0, 0);
    if (overlayRef.current && visionStatus === 'ready') {
      // Match the live preview's color blend so exported images retain hair shading.
      ctx.globalCompositeOperation = 'color';
      ctx.drawImage(overlayRef.current, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }
    const link = document.createElement('a');
    link.download = 'rupaai-camera-preview.png'; link.href = canvas.toDataURL('image/png'); link.click();
  }
  const selected = looks.find(item => item.id === activeLook) ?? looks[1];

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" aria-label="RUPAAI beranda"><span className="brand-mark"><Aperture size={20}/></span><span>RUPA<span className="brand-ai">AI</span></span></a>
      <nav className="desktop-nav" aria-label="Navigasi utama"><a className="nav-active" href="#simulator">Hair Simulator</a><a href="#studio">Luxury Studio</a><a href="#how-it-works">Cara Kerja</a></nav>
      <div className="top-actions"><span className="live-pill"><span/> WEBCAM FIRST</span><button className="icon-button mobile-menu" aria-label="Menu"><Menu size={19}/></button><a className="top-cta" href="#simulator">Coba sekarang <ArrowUpRight size={15}/></a></div>
    </header>

    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> THE FUTURE OF HAIR DISCOVERY</div>
        <h1>Rambut baru.<br/><em>Versi terbaikmu.</em></h1>
        <p className="hero-description">Coba potongan dan warna rambut sebelum berkomitmen. Temukan gaya yang terasa paling kamu — langsung dari kamera yang sudah kamu miliki.</p>
        <div className="hero-actions"><a className="button button-light" href="#simulator"><Sparkles size={16}/> Mulai hair simulator <ArrowUpRight size={16}/></a><span className="no-install"><ShieldCheck size={15}/> Tanpa instalasi</span></div>
        <div className="hero-proof"><div className="proof-avatars"><span>R</span><span>A</span><span>M</span></div><p><strong>Dibuat untuk semua orang.</strong><br/>Laptop, webcam USB, atau kamera ponsel.</p></div>
      </div>
      <div className="hero-art" aria-label="Ilustrasi editorial gaya rambut">
        <div className="art-backdrop"></div><div className="art-ring"></div><div className="art-label label-top">LOOK 02 <span>·</span> SOFT LAYERS</div>
        <div className="portrait"><div className="portrait-hair"></div><div className="portrait-neck"></div><div className="portrait-face"><span className="brow brow-left"></span><span className="brow brow-right"></span><span className="eye eye-left"></span><span className="eye eye-right"></span><span className="nose"></span><span className="lips"></span></div><div className="portrait-ear"></div><div className="portrait-body"></div><div className="portrait-shirt"></div></div>
        <div className="art-label label-bottom"><span className="sparkle-dot"><Sparkles size={12}/></span> YOUR STYLE, REIMAGINED</div>
        <div className="floating-chip"><span className="chip-swatch"></span><span><small>COLOR STORY</small><strong>Warm Chestnut</strong></span><Check size={15}/></div>
      </div>
    </section>

    <section className="simulator-section" id="simulator">
      <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR PERSONAL HAIR STUDIO</div><h2>Temukan <em>signature look</em>-mu.</h2><p>Mulai dari webcam. Eksplorasi gaya tanpa batas.</p></div><div className="privacy-note"><ShieldCheck size={17}/><span><strong>Privasi diutamakan</strong><small>Pratinjau kamera tetap di perangkat ini.</small></span></div></div>
      <div className="studio-grid">
        <div className="camera-panel">
          <div className="camera-panel-head"><span><span className="status-dot"/> LIVE PREVIEW</span><span className="panel-tag">01 / CAMERA</span></div>
          <div className="camera-stage">
            <video ref={videoRef} autoPlay muted playsInline className={cameraOn ? 'camera-video is-on' : 'camera-video'} aria-label="Pratinjau kamera Anda"/>
            <canvas ref={overlayRef} className={cameraOn && visionStatus === 'ready' ? 'hair-overlay is-on' : 'hair-overlay'} aria-hidden="true"/>
            {!cameraOn && <div className="camera-placeholder"><div className="camera-orbit"><Video size={29}/></div><strong>Tempatkan dirimu di tengah frame</strong><p>Gunakan pencahayaan lembut dan arahkan kamera ke wajah.</p><button className="button button-light" onClick={startCamera} disabled={cameraStarting}><Video size={16}/> {cameraStarting ? 'Menghubungkan kamera…' : 'Aktifkan kamera'}</button></div>}
            {cameraOn && <div className="camera-overlay"><span className="corner corner-tl"/><span className="corner corner-tr"/><span className="corner corner-bl"/><span className="corner corner-br"/><span className="tracking-label"><span/> CAMERA CONNECTED</span></div>}
            <div className="stage-bottom"><span><span className="stage-dot"/> {cameraOn ? 'Kamera aktif' : 'Menunggu kamera'}</span><span>HD · MIRROR VIEW</span></div>
          </div>
          {cameraError && <p className="error-message" role="alert">{cameraError}</p>}
          {cameraOn && visionStatus === 'loading' && <p className="vision-status" role="status">Memuat model segmentasi rambut di perangkat ini…</p>}
          {cameraOn && visionStatus === 'ready' && <p className="vision-status" role="status">AI segmentasi rambut aktif · pemrosesan lokal</p>}
          {cameraOn && visionStatus === 'error' && <p className="vision-status vision-warning" role="status">Model AI belum tersedia. Pratinjau kamera tetap berfungsi; periksa koneksi internet lalu mulai ulang kamera.</p>}
          <div className="camera-controls"><button className="button button-outline" onClick={cameraOn ? stopCamera : startCamera} disabled={cameraStarting}>{cameraOn ? <VideoOff size={16}/> : <Video size={16}/>} {cameraOn ? 'Matikan kamera' : cameraStarting ? 'Menghubungkan…' : 'Hubungkan webcam'}</button><button className="button button-dark" onClick={capturePreview}><Download size={16}/> Simpan frame</button></div>
          <p className="camera-disclaimer"><CircleHelp size={14}/> Warna rambut menggunakan segmentasi AI MediaPipe di browser. Efek warna bersifat pratinjau; bentuk potongan rambut fotorealistis belum diterapkan. Frame kamera tidak dikirim ke server.</p>
        </div>

        <div className="look-panel">
          <div className="look-panel-head"><div><span className="panel-tag">02 / PERSONALIZE</span><h3>Kurasi tampilanmu.</h3></div><button className="reset-button" onClick={() => {setActiveLook('layers');setActiveColor(colors[1].value);setSaved(false);}}><RefreshCw size={14}/> Reset</button></div>
          <div className="tab-switch" role="tablist" aria-label="Pilihan gaya"><button role="tab" aria-selected={tab === 'haircuts'} className={tab === 'haircuts' ? 'tab-active' : ''} onClick={() => setTab('haircuts')}><Scissors size={15}/> Haircuts</button><button role="tab" aria-selected={tab === 'colors'} className={tab === 'colors' ? 'tab-active' : ''} onClick={() => setTab('colors')}><Palette size={15}/> Hair colors</button></div>
          {tab === 'haircuts' ? <div className="look-list">{looks.map((look, i) => <button key={look.id} className={'look-option ' + (activeLook === look.id ? 'look-selected' : '')} onClick={() => {setActiveLook(look.id);setSaved(false);}}><span className={'hair-thumb hair-' + look.tone} style={{'--hair-color': activeColor} as React.CSSProperties}><span/></span><span className="look-info"><strong>{look.name}</strong><small>{look.note}</small></span>{activeLook === look.id ? <span className="selected-check"><Check size={14}/></span> : <ArrowUpRight size={15} className="look-arrow"/>}</button>)}</div> : <div className="color-grid">{colors.map(color => <button key={color.value} className={'color-option ' + (activeColor === color.value ? 'color-selected' : '')} onClick={() => {setActiveColor(color.value);setSaved(false);}} aria-label={'Pilih warna ' + color.name} aria-pressed={activeColor === color.value}><span className="color-dot" style={{background:color.value}}/><span>{color.name}</span>{activeColor === color.value && <Check size={14}/>}</button>)}</div>}
          <div className="selection-summary"><div className="summary-swatch" style={{background:activeColor}}/><div><small>YOUR CURRENT SELECTION</small><strong>{selected.name} <span>·</span> {colors.find(c => c.value === activeColor)?.name}</strong></div><button aria-label="Simpan pilihan" className={'favorite-button ' + (saved ? 'is-saved' : '')} onClick={() => setSaved(!saved)}><Heart size={17} fill={saved ? 'currentColor' : 'none'}/></button></div>
          {saved && <p className="saved-message" role="status">Pilihan tersimpan untuk sesi ini di perangkat Anda.</p>}
          <button className="button button-gold full-button" onClick={() => setStudio(true)}><WandSparkles size={16}/> Konsultasi Luxury Hair Studio <ArrowUpRight size={16}/></button>
          <p className="panel-footnote">Warna rambut dapat dipratinjau dengan segmentasi AI setelah kamera aktif. Pilihan potongan rambut masih berupa referensi katalog dan belum mengubah bentuk rambut secara fotorealistis.</p>
        </div>
      </div>
    </section>

    <section className="luxury-section" id="studio"><div className="luxury-copy"><div className="eyebrow"><Crown size={14}/> THE LUXURY EXPERIENCE</div><h2>Luxury Hair Studio</h2><p className="luxury-lead">High-end hair visualization for top-tier salons.</p><p>Pengalaman konsultasi rambut premium untuk salon profesional: kurasi look, konsultasi warna, dan fondasi visualisasi personal yang siap dikembangkan menjadi layanan berlangganan.</p><button className="button button-gold" onClick={() => setStudio(true)}>Jelajahi layanan studio <ArrowUpRight size={16}/></button></div><div className="luxury-features"><div className="lux-feature"><span>01</span><div><strong>Signature consultation</strong><p>Bangun referensi gaya berdasarkan preferensi pelanggan.</p></div></div><div className="lux-feature"><span>02</span><div><strong>Color story</strong><p>Eksplorasi palet warna untuk konsultasi sebelum pewarnaan.</p></div></div><div className="lux-feature"><span>03</span><div><strong>Salon-ready workflow</strong><p>Fondasi layanan profesional dengan alur pelanggan dan stylist.</p></div></div></div></section>

    <section className="steps-section" id="how-it-works"><div className="eyebrow"><span className="eyebrow-line"/> SIMPLE BY DESIGN</div><h2>Gaya baru, <em>tanpa risiko.</em></h2><div className="steps-grid"><article><span>01</span><Video size={20}/><h3>Hubungkan kamera</h3><p>Gunakan webcam laptop atau USB yang sudah kamu punya.</p></article><article><span>02</span><Sparkles size={20}/><h3>Eksplorasi look</h3><p>Pilih potongan dan warna untuk merancang gaya favoritmu.</p></article><article><span>03</span><Scissors size={20}/><h3>Bawa ke stylist</h3><p>Simpan frame dan gunakan pilihanmu sebagai referensi konsultasi.</p></article></div></section>

    <footer className="footer"><a className="brand" href="#"><span className="brand-mark"><Aperture size={18}/></span><span>RUPA<span className="brand-ai">AI</span></span></a><span>Your Look. Your Style. Your AI.</span><span>© 2026 RUPAAI · Built for everyone.</span></footer>

    {studio && <div className="modal-backdrop" role="presentation" onClick={() => setStudio(false)}><section className="studio-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setStudio(false)} aria-label="Tutup">×</button><div className="modal-icon"><Crown size={22}/></div><div className="eyebrow">LUXURY HAIR STUDIO</div><h2 id="modal-title">Elevasi pengalaman salonmu.</h2><p>Modul profesional sedang disiapkan. Fondasi berikutnya mencakup profil salon, konsultasi stylist, katalog gaya premium, serta visualisasi rambut berbasis AI.</p><div className="modal-current"><span className="summary-swatch" style={{background:activeColor}}/><span><small>PILIHAN SAAT INI</small><strong>{selected.name} · {colors.find(c => c.value === activeColor)?.name}</strong></span></div><button className="button button-dark full-button" onClick={() => setStudio(false)}>Kembali ke simulator <ChevronDown size={16}/></button></section></div>}
  </main>;
}
