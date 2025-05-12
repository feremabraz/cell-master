import { atom } from 'jotai';

// Scene image atom
export const sceneImageUrlAtom = atom<string>('');

// CRT effect settings atoms
export const scanlineOpacityAtom = atom(0.18);
export const scanlineSpacingAtom = atom(2); // in pixels
export const flickerIntensityAtom = atom(0.19);
export const flickerSpeedAtom = atom(100); // in ms
export const glowIntensityAtom = atom(0.31);
export const glowSizeAtom = atom(90); // in pixels
export const curvatureIntensityAtom = atom(1); // percentage
export const vignetteIntensityAtom = atom(0.9);
export const noiseOpacityAtom = atom(0.81);
export const noiseSpeedAtom = atom(1); // frames to skip
export const showControlsAtom = atom(false);
