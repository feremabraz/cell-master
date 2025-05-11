'use client';

import { cn } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

// Type for colored ASCII characters
type ColoredChar = {
  char: string;
  color: string;
};

interface AsciiImageProps {
  imageUrl?: string;
  width?: number;
  height?: number;
  resolution?: number;
  inverted?: boolean;
  grayscale?: boolean;
  charSet?: 'standard' | 'blocks' | 'minimal';
  className?: string;
}

export default function AsciiImage({
  imageUrl = 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=1000',
  width = 800,
  height = 400,
  resolution = 0.1,
  inverted = false,
  grayscale = true,
  charSet = 'blocks',
  className,
}: AsciiImageProps) {
  // At the beginning of the component, right after the imports
  useEffect(() => {
    // Set document background to black
    if (typeof document !== 'undefined') {
      document.documentElement.style.backgroundColor = 'black';
      document.body.style.backgroundColor = 'black';
    }

    return () => {
      // Clean up when component unmounts
      if (typeof document !== 'undefined') {
        document.documentElement.style.backgroundColor = '';
        document.body.style.backgroundColor = '';
      }
    };
  }, []);

  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [asciiArt, setAsciiArt] = useState<string>('');
  const [coloredAsciiArt, setColoredAsciiArt] = useState<ColoredChar[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [, setIsDesktop] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load image when component mounts
  useEffect(() => {
    if (!isHydrated) return;

    // Check if we're on the client side
    setIsDesktop(window.innerWidth >= 768);

    // Add resize listener
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);

    // Load image
    loadDefaultImage();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isHydrated]); // Only depend on isHydrated since loadDefaultImage uses the current value of imageUrl

  useEffect(() => {
    if (imageLoaded && imageRef.current) {
      convertToAscii();
    }
  }, [imageLoaded]);

  const loadDefaultImage = () => {
    setLoading(true);
    setError(null);
    setImageLoaded(false);

    // Create a new image element
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (img.width === 0 || img.height === 0) {
        setError('Invalid image dimensions');
        setLoading(false);
        return;
      }

      imageRef.current = img;
      setImageLoaded(true);
      setLoading(false);
    };

    img.onerror = () => {
      setError('Failed to load image');
      setLoading(false);
    };

    // Set the source after setting up event handlers
    img.src = imageUrl;
  };

  // Helper function to adjust color brightness
  const adjustColorBrightness = (r: number, g: number, b: number, factor: number): string => {
    // Ensure the colors are visible against black background
    const minBrightness = 40; // Minimum brightness to ensure visibility
    const adjustedR = Math.max(Math.min(Math.round(r * factor), 255), minBrightness);
    const adjustedG = Math.max(Math.min(Math.round(g * factor), 255), minBrightness);
    const adjustedB = Math.max(Math.min(Math.round(b * factor), 255), minBrightness);
    return `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
  };

  // Add this function after the adjustColorBrightness function
  // Use useCallback to memoize the renderToCanvas function
  const renderToCanvas = useCallback(() => {
    if (!outputCanvasRef.current) return;

    const canvas = outputCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set font properties to match the DOM rendering
    const fontSize = 8; // Base font size in pixels
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';

    // Calculate dimensions
    const lineHeight = fontSize;
    const charWidth = fontSize * 0.6; // Approximate width of monospace character

    // Resize canvas to fit the ASCII art
    if (grayscale) {
      const lines = asciiArt.split('\n');
      const maxLineLength = Math.max(...lines.map((line) => line.length));
      canvas.width = maxLineLength * charWidth;
      canvas.height = lines.length * lineHeight;
    } else {
      canvas.width = coloredAsciiArt[0].length * charWidth;
      canvas.height = coloredAsciiArt.length * lineHeight;
    }

    // Re-apply font after canvas resize
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';

    // Render the ASCII art
    if (grayscale) {
      ctx.fillStyle = 'white';
      asciiArt.split('\n').forEach((line, lineIndex) => {
        ctx.fillText(line, 0, lineIndex * lineHeight);
      });
    } else {
      coloredAsciiArt.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          ctx.fillStyle = col.color;
          ctx.fillText(col.char, colIndex * charWidth, rowIndex * lineHeight);
        });
      });
    }
  }, [asciiArt, coloredAsciiArt, grayscale]);

  // Add this effect to trigger canvas rendering when ASCII art changes
  useEffect(() => {
    if (imageLoaded && !loading && !error) {
      renderToCanvas();
    }
  }, [loading, error, imageLoaded, renderToCanvas]);

  const convertToAscii = () => {
    try {
      if (!canvasRef.current || !imageRef.current) {
        throw new Error('Canvas or image not available');
      }

      const img = imageRef.current;

      // Validate image dimensions
      if (img.width === 0 || img.height === 0) {
        throw new Error('Invalid image dimensions');
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Calculate dimensions based on provided props
      const scaledWidth = Math.floor(img.width * resolution);
      const scaledHeight = Math.floor(img.height * resolution);

      // Set canvas dimensions based on the props
      canvas.width = width || scaledWidth;
      canvas.height = height || scaledHeight;

      // Clear the canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw image to canvas, respecting the provided dimensions
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Get image data - this is where the error was occurring
      let imageData: ImageData;
      try {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch (e: unknown) {
        const error = e instanceof Error ? e.message : 'Unknown error';
        throw new Error(`Failed to get image data: ${error}. This might be a CORS issue.`);
      }

      const data = imageData.data;

      // Choose character set based on the prop
      const charSets = {
        standard: '@%#*+=-:. ',
        blocks: '█▓▒░ ',
        minimal: '█░',
      };
      const chars = charSets[charSet as keyof typeof charSets];

      // Calculate aspect ratio correction for monospace font
      const fontAspect = 0.5; // Width/height ratio of monospace font characters
      // Use the provided width and height props or calculate from resolution
      const targetWidth = width || scaledWidth;
      const targetHeight = height || scaledHeight;
      const widthStep = Math.ceil(canvas.width / targetWidth);
      const heightStep = Math.ceil(canvas.height / targetHeight / fontAspect);

      let result = '';
      const coloredResult: ColoredChar[][] = [];

      // Process the image using the dimensions from props
      for (let y = 0; y < canvas.height; y += heightStep) {
        const coloredRow: ColoredChar[] = [];

        for (let x = 0; x < canvas.width; x += widthStep) {
          // Calculate position in the image data array
          const pos = (y * canvas.width + x) * 4;

          const r = data[pos];
          const g = data[pos + 1];
          const b = data[pos + 2];

          // Calculate brightness based on grayscale setting
          let brightness: number;
          if (grayscale) {
            // Standard grayscale calculation
            brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          } else {
            // Color-aware brightness (perceived luminance)
            brightness = Math.sqrt(
              0.299 * (r / 255) * (r / 255) +
                0.587 * (g / 255) * (g / 255) +
                0.114 * (b / 255) * (b / 255)
            );
          }

          // Invert if needed
          if (inverted) brightness = 1 - brightness;

          // Map brightness to character
          const charIndex = Math.floor(brightness * (chars.length - 1));
          const char = chars[charIndex];

          result += char;

          // For colored mode, store the character and its color
          if (!grayscale) {
            // Adjust color brightness based on the character density
            // Characters with more "ink" (later in the charset) should be brighter
            const brightnessFactor = (charIndex / (chars.length - 1)) * 1.5 + 0.5;
            const color = adjustColorBrightness(r, g, b, brightnessFactor);
            coloredRow.push({ char, color });
          } else {
            // For grayscale mode, we still need to populate the array
            coloredRow.push({ char, color: 'white' });
          }
        }

        result += '\n';
        coloredResult.push(coloredRow);
      }

      setAsciiArt(result);
      setColoredAsciiArt(coloredResult);
      setError(null);
    } catch (err) {
      console.error('Error converting to ASCII:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setAsciiArt('');
      setColoredAsciiArt([]);
    }
  };

  return (
    <div className={cn('w-full overflow-hidden', className)}>
      {/* Hidden elements for processing */}
      <div className="hidden">
        <canvas ref={canvasRef} />
        <canvas ref={outputCanvasRef} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-green-500 font-mono">
          Loading ASCII art...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40 text-red-500 font-mono">{error}</div>
      ) : (
        <div className="relative">
          {/* ASCII Art Display */}
          <div
            ref={previewRef}
            className="ascii-art font-mono text-xs leading-[0.6] whitespace-pre overflow-x-auto bg-black p-2 border border-green-500"
          >
            {coloredAsciiArt.map((row, rowIndex) => (
              <div key={`row-${rowIndex}-${row.length}`} className="flex">
                {row.map((col, colIndex) => (
                  <span
                    key={`cell-${rowIndex}-${colIndex}-${col.char}`}
                    style={{ color: grayscale ? '#22c55e' : col.color }}
                  >
                    {col.char}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
