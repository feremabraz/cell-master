'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ChevronUp, ChevronDown, Settings } from 'lucide-react';
import {
  scanlineOpacityAtom,
  scanlineSpacingAtom,
  flickerIntensityAtom,
  flickerSpeedAtom,
  glowIntensityAtom,
  glowSizeAtom,
  curvatureIntensityAtom,
  vignetteIntensityAtom,
  noiseOpacityAtom,
  noiseSpeedAtom,
  showControlsAtom,
} from '@/store/crt-effect-store';

export function CRTControls() {
  const [isOpen, setIsOpen] = useState(true);
  const [showControls, setShowControls] = useAtom(showControlsAtom);

  // CRT effect settings
  const [scanlineOpacity, setScanlineOpacity] = useAtom(scanlineOpacityAtom);
  const [scanlineSpacing, setScanlineSpacing] = useAtom(scanlineSpacingAtom);
  const [flickerIntensity, setFlickerIntensity] = useAtom(flickerIntensityAtom);
  const [flickerSpeed, setFlickerSpeed] = useAtom(flickerSpeedAtom);
  const [glowIntensity, setGlowIntensity] = useAtom(glowIntensityAtom);
  const [glowSize, setGlowSize] = useAtom(glowSizeAtom);
  const [curvatureIntensity, setCurvatureIntensity] = useAtom(curvatureIntensityAtom);
  const [vignetteIntensity, setVignetteIntensity] = useAtom(vignetteIntensityAtom);
  const [noiseOpacity, setNoiseOpacity] = useAtom(noiseOpacityAtom);
  const [noiseSpeed, setNoiseSpeed] = useAtom(noiseSpeedAtom);

  if (!showControls) {
    return (
      <Button
        className="fixed bottom-4 right-4 z-50 bg-black border border-green-500 text-green-500 hover:bg-green-900"
        onClick={() => setShowControls(true)}
      >
        <Settings className="w-4 h-4 mr-2" />
        CRT Controls
      </Button>
    );
  }

  return (
    <Card className="fixed right-4 bottom-4 z-50 w-80 bg-black border-2 border-green-500 text-green-500 shadow-lg shadow-green-900/20">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold ">CRT Effect Controls</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-green-500 text-green-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 p-2 border-green-500 text-green-500"
              onClick={() => setShowControls(false)}
            >
              Hide
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-sm">Scanline Opacity: {scanlineOpacity.toFixed(2)}</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs border-green-500 text-green-500 rounded-none hover:bg-green-900 hover:text-black"
                  onClick={() => setScanlineOpacity(0.18)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[scanlineOpacity]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(value) => setScanlineOpacity(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-sm">Scanline Spacing: {scanlineSpacing}px</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs border-green-500 text-green-500 rounded-none hover:bg-green-900 hover:text-black"
                  onClick={() => setScanlineSpacing(2)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[scanlineSpacing]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setScanlineSpacing(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-sm">Flicker Intensity: {flickerIntensity.toFixed(2)}</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs border-green-500 text-green-500 rounded-none hover:bg-green-900 hover:text-black"
                  onClick={() => setFlickerIntensity(0.19)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[flickerIntensity]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(value) => setFlickerIntensity(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-sm">Flicker Speed: {flickerSpeed}ms</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs border-green-500 text-green-500 rounded-none hover:bg-green-900 hover:text-black"
                  onClick={() => setFlickerSpeed(100)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[flickerSpeed]}
                min={10}
                max={500}
                step={10}
                onValueChange={(value) => setFlickerSpeed(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-sm">Glow Intensity: {glowIntensity.toFixed(2)}</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs border-green-500 text-green-500 rounded-none hover:bg-green-900 hover:text-black"
                  onClick={() => setGlowIntensity(0.31)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[glowIntensity]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(value) => setGlowIntensity(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-sm">Glow Size: {glowSize}px</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs border-green-500 text-green-500 rounded-none hover:bg-green-900 hover:text-black"
                  onClick={() => setGlowSize(90)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[glowSize]}
                min={0}
                max={200}
                step={5}
                onValueChange={(value) => setGlowSize(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-sm">Curvature: {curvatureIntensity}%</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs border-green-500 text-green-500 rounded-none hover:bg-green-900 hover:text-black"
                  onClick={() => setCurvatureIntensity(1)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[curvatureIntensity]}
                min={0}
                max={20}
                step={1}
                onValueChange={(value) => setCurvatureIntensity(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-sm">Vignette: {vignetteIntensity.toFixed(2)}</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs border-green-500 text-green-500 rounded-none hover:bg-green-900 hover:text-black"
                  onClick={() => setVignetteIntensity(0.9)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[vignetteIntensity]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(value) => setVignetteIntensity(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-sm">Noise Opacity: {noiseOpacity.toFixed(2)}</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs border-green-500 text-green-500 rounded-none hover:bg-green-900 hover:text-black"
                  onClick={() => setNoiseOpacity(0.81)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[noiseOpacity]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(value) => setNoiseOpacity(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-sm">Noise Speed: {noiseSpeed}</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs border-green-500 text-green-500 rounded-none hover:bg-green-900 hover:text-black"
                  onClick={() => setNoiseSpeed(1)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[noiseSpeed]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setNoiseSpeed(value[0])}
              />
            </div>

            <div className="pt-2 flex justify-between">
              <Button
                variant="outline"
                className="border-green-500 text-green-500"
                onClick={() => {
                  // Reset all settings to default
                  setScanlineOpacity(0.3);
                  setScanlineSpacing(2);
                  setFlickerIntensity(0.2);
                  setFlickerSpeed(100);
                  setGlowIntensity(0.3);
                  setGlowSize(100);
                  setCurvatureIntensity(10);
                  setVignetteIntensity(0.9);
                  setNoiseOpacity(0.3);
                  setNoiseSpeed(1);
                }}
              >
                Reset All
              </Button>
              <Button
                variant="default"
                className="bg-green-700 hover:bg-green-600 text-white"
                onClick={() => {
                  // Log current settings to console for easy copying
                  console.log('CRT Effect Settings:', {
                    scanlineOpacity,
                    scanlineSpacing,
                    flickerIntensity,
                    flickerSpeed,
                    glowIntensity,
                    glowSize,
                    curvatureIntensity,
                    vignetteIntensity,
                    noiseOpacity,
                    noiseSpeed,
                  });
                  alert('Settings logged to console (F12)');
                }}
              >
                Log Settings
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
