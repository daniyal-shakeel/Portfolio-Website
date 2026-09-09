import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileQuestion,
  Hand,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Skeleton } from "@/components/ui/skeleton";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type PageRenderTask = ReturnType<pdfjsLib.PDFPageProxy["render"]>;

interface SettingsData {
  selectedPalette?: string;
}

interface CvStatus {
  exists: boolean;
  filename?: string;
  uploadedAt?: string;
}

const CvViewer = () => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "unavailable" | "error">("loading");
  const [cvInfo, setCvInfo] = useState<CvStatus | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [baseFitScale, setBaseFitScale] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [isPanning, setIsPanning] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerWrapperRef = useRef<HTMLDivElement | null>(null);
  const renderTaskRef = useRef<PageRenderTask | null>(null);
  const panStartRef = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number }>({
    x: 0,
    y: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  useEffect(() => {
    document.title = "Curriculum Vitae | Muhammad Daniyal Shakeel";
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/settings`);
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Unable to load theme settings", error);
      }
    };
    fetchSettings();
  }, []);

  const loadCv = useCallback(async () => {
    setStatus("loading");
    try {
      const statusRes = await fetch(`${API_BASE_URL}/api/cv/status`);
      if (!statusRes.ok) {
        setStatus("error");
        return;
      }
      const statusData: CvStatus = await statusRes.json();
      setCvInfo(statusData);

      if (!statusData.exists) {
        setStatus("unavailable");
        return;
      }

      const downloadRes = await fetch(`${API_BASE_URL}/api/cv/download`);
      if (!downloadRes.ok) {
        setStatus("error");
        return;
      }

      const buffer = await downloadRes.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
      });

      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setCurrentPage(1);
      setStatus("loaded");
    } catch (error) {
      console.error("Unable to load curriculum vitae", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadCv();
  }, [loadCv]);

  const calculateFitScale = useCallback(async (doc: pdfjsLib.PDFDocumentProxy) => {
    try {
      const page = await doc.getPage(1);
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
      const targetWidth = Math.max(containerWidth - 48, 280);
      const computedScale = Math.min(Math.max(targetWidth / unscaledViewport.width, 0.5), 1.5);
      const rounded = Math.round(computedScale * 100) / 100;
      setBaseFitScale(rounded);
      setScale(rounded);
    } catch {
      setScale(1.0);
    }
  }, []);

  useEffect(() => {
    if (pdfDoc) {
      calculateFitScale(pdfDoc);
    }
  }, [pdfDoc, calculateFitScale]);

  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      setIsRendering(true);
      const page = await pdfDoc.getPage(currentPage);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      const viewport = page.getViewport({ scale });
      const pixelRatio = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const transform = pixelRatio !== 1 ? [pixelRatio, 0, 0, pixelRatio, 0, 0] : undefined;

      const renderContext = {
        canvasContext: context,
        transform,
        viewport,
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;
      await task.promise;
    } catch (err: unknown) {
      const errorObj = err as { name?: string };
      if (errorObj?.name !== "RenderingCancelledException") {
        console.error("Canvas render error", err);
        setStatus("error");
      }
    } finally {
      setIsRendering(false);
    }
  }, [pdfDoc, currentPage, scale]);

  useEffect(() => {
    if (status === "loaded" && pdfDoc) {
      renderPage();
    }
  }, [status, pdfDoc, currentPage, scale, renderPage]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(Math.round((prev + 0.2) * 100) / 100, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(Math.round((prev - 0.2) * 100) / 100, 0.4));
  };

  const handleResetZoom = () => {
    setScale(baseFitScale);
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (viewerWrapperRef.current) {
          await viewerWrapperRef.current.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen toggle failed", error);
    }
  };

  const isZoomed = scale > baseFitScale;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !containerRef.current || e.button !== 0) return;
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !containerRef.current) return;
    e.preventDefault();
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    containerRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
    containerRef.current.scrollTop = panStartRef.current.scrollTop - dy;
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isZoomed || !containerRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsPanning(true);
    panStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isPanning || !containerRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - panStartRef.current.x;
    const dy = touch.clientY - panStartRef.current.y;
    containerRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
    containerRef.current.scrollTop = panStartRef.current.scrollTop - dy;
  };

  const handleTouchEnd = () => {
    if (isPanning) {
      setIsPanning(false);
    }
  };

  const themeClass = settings?.selectedPalette ? `theme-${settings.selectedPalette}` : "theme-matrix";
  const filename = cvInfo?.filename || "Muhammad_Daniyal_Shakeel_CV.pdf";

  const cursorClass = !isZoomed
    ? "cursor-default"
    : isPanning
    ? "cursor-grabbing select-none"
    : "cursor-grab select-none";

  return (
    <div className={`min-h-screen bg-background text-foreground ${themeClass}`}>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </Link>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="text-neon-green">$</span>
              <span>cat</span>
              <span className="text-foreground truncate max-w-[200px] md:max-w-[300px]">{filename}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status === "loaded" && (
              <a
                href={`${API_BASE_URL}/api/cv/download`}
                download={filename}
                className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Download</span>
              </a>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 w-full max-w-3xl mx-auto">
            <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-neon-green" />
              <span>Loading curriculum vitae...</span>
            </div>
            <div className="w-full bg-card border border-border rounded-lg p-6 sm:p-10 shadow-xl space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="space-y-3 pt-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="space-y-3 pt-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        )}

        {status === "unavailable" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto p-6 bg-card border border-border rounded-lg card-glow">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
              <FileQuestion className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold mb-2">CV Currently Unavailable</h2>
            <p className="text-sm text-muted-foreground mb-6">
              No curriculum vitae document has been published yet. Please check back soon or explore my projects.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Return to Home
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto p-6 bg-card border border-destructive/40 rounded-lg card-glow">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Failed to Load CV</h2>
            <p className="text-sm text-muted-foreground mb-6">
              An error occurred while loading the CV document. You can retry or download it directly.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadCv}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Retry
              </button>
              <a
                href={`${API_BASE_URL}/api/cv/download`}
                download={filename}
                className="border border-border text-foreground px-4 py-2 rounded-md text-sm font-medium hover:border-primary/50 transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Direct Download
              </a>
            </div>
          </div>
        )}

        {status === "loaded" && (
          <div
            ref={viewerWrapperRef}
            className={`flex flex-col bg-card border border-border rounded-lg shadow-xl overflow-hidden ${
              isFullscreen ? "p-4 bg-background fixed inset-0 z-50 rounded-none border-0" : ""
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 border-b border-border bg-muted/40 font-mono text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1 || isRendering}
                  aria-label="Previous Page"
                  className="p-1.5 rounded-md border border-border text-foreground hover:border-neon-green/40 disabled:opacity-40 disabled:hover:border-border transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2.5 py-1 rounded bg-background border border-border text-foreground select-none">
                  {currentPage} / {numPages || 1}
                </span>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage >= numPages || isRendering}
                  aria-label="Next Page"
                  className="p-1.5 rounded-md border border-border text-foreground hover:border-neon-green/40 disabled:opacity-40 disabled:hover:border-border transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={scale <= 0.4 || isRendering}
                  aria-label="Zoom Out"
                  className="p-1.5 rounded-md border border-border text-foreground hover:border-neon-green/40 disabled:opacity-40 disabled:hover:border-border transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2.5 py-1 rounded bg-background border border-border text-foreground min-w-[56px] text-center select-none">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={scale >= 3.0 || isRendering}
                  aria-label="Zoom In"
                  className="p-1.5 rounded-md border border-border text-foreground hover:border-neon-green/40 disabled:opacity-40 disabled:hover:border-border transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  disabled={isRendering}
                  aria-label="Reset Zoom"
                  title="Fit to screen"
                  className="p-1.5 rounded-md border border-border text-foreground hover:border-neon-green/40 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                {isZoomed && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-background border border-border text-muted-foreground select-none"
                    title="Drag or swipe to pan"
                  >
                    <Hand className="w-3.5 h-3.5 text-neon-green" />
                    <span className="hidden sm:inline text-[11px]">Pan</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  className="p-1.5 rounded-md border border-border text-foreground hover:border-neon-green/40 transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <a
                  href={`${API_BASE_URL}/api/cv/download`}
                  download={filename}
                  aria-label="Download CV"
                  title="Download CV"
                  className="p-1.5 rounded-md border border-border text-foreground hover:border-neon-green/40 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start min-h-[65vh] max-h-[82vh] bg-muted/20 ${cursorClass}`}
            >
              <div className="relative inline-block shadow-2xl rounded-sm overflow-hidden border border-border/80 bg-white">
                <canvas ref={canvasRef} className="block max-w-none pointer-events-none" />
                {isRendering && (
                  <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-neon-green" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CvViewer;
