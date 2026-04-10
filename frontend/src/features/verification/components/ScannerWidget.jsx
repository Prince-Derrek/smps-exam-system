import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff } from 'lucide-react';

const BRAND = '#1A5276';

export default function ScannerWidget({ onScan, disabled }) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);
  const containerId = 'qr-scanner-container';

  const startScanner = async () => {
    setError('');
    try {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
        },
        () => {}
      );
      setActive(true);
    } catch {
      setError('Camera access denied or not available. Please allow camera permissions.');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
      scannerRef.current = null;
    }
    setActive(false);
  };

  useEffect(() => () => { stopScanner(); }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Camera viewfinder */}
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden mb-4"
        style={{ border: `2px solid ${active ? BRAND : 'var(--border)'}`, background: '#0a0a0a', aspectRatio: '1' }}>
        <div id={containerId} className="w-full h-full" />
        {!active && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <CameraOff size={40} style={{ color: 'rgba(255,255,255,0.3)' }} strokeWidth={1.25} />
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Camera inactive</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs mb-3 text-center px-4" style={{ color: 'var(--danger)' }}>{error}</p>
      )}

      <button onClick={active ? stopScanner : startScanner} disabled={disabled}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
        style={{ background: active ? 'var(--danger)' : BRAND, color: 'white', opacity: disabled ? 0.6 : 1 }}>
        <Camera size={17} />
        {active ? 'Stop Scanner' : 'Start Scanner'}
      </button>
    </div>
  );
}
