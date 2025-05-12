import { atom } from 'jotai';

type MixBlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

// Scene image atom
export const sceneImageUrlAtom = atom<string>('');

// CRT effect settings atoms
export const scanlineOpacityAtom = atom(0.18);
export const scanlineSpacingAtom = atom(2); // in pixels
export const scanlineAngleAtom = atom(0); // in degrees
export const scanlineColorAtom = atom('0, 0, 0'); // RGB values
export const scanlineBlendModeAtom = atom<MixBlendMode>('multiply');
export const scanlineAnimationSpeedAtom = atom(50); // in ms
export const flickerIntensityAtom = atom(0.19);
export const flickerSpeedAtom = atom(100); // in ms
export const glowIntensityAtom = atom(0.31);
export const glowSizeAtom = atom(90); // in pixels
export const curvatureIntensityAtom = atom(1); // percentage
export const vignetteIntensityAtom = atom(0.9);
export const noiseOpacityAtom = atom(0.81);
export const noiseSpeedAtom = atom(1); // frames to skip
export const showControlsAtom = atom(true);
