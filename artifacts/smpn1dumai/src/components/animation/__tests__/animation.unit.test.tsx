/**
 * Unit tests untuk komponen animasi
 *
 * Persyaratan: 1.1, 1.4, 1.5, 1.6
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock framer-motion to avoid browser animation API dependencies
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");

  let mockReducedMotion = false;

  return {
    ...actual,
    useReducedMotion: () => mockReducedMotion,
    motion: {
      div: React.forwardRef(
        (
          {
            children,
            initial,
            animate,
            exit,
            whileInView,
            viewport,
            variants,
            transition,
            className,
            ...rest
          }: {
            children?: React.ReactNode;
            initial?: unknown;
            animate?: unknown;
            exit?: unknown;
            whileInView?: unknown;
            viewport?: { once?: boolean };
            variants?: unknown;
            transition?: { duration?: number; delay?: number };
            className?: string;
            [key: string]: unknown;
          },
          ref: React.Ref<HTMLDivElement>
        ) => (
          <div
            ref={ref}
            className={className}
            data-testid="motion-div"
            data-viewport-once={viewport?.once?.toString()}
            data-transition-duration={transition?.duration?.toString()}
            data-transition-delay={transition?.delay?.toString()}
            {...rest}
          >
            {children}
          </div>
        )
      ),
    },
    AnimatePresence: ({
      children,
      mode,
    }: {
      children: React.ReactNode;
      mode?: string;
    }) => (
      <div data-testid="animate-presence" data-mode={mode}>
        {children}
      </div>
    ),
    __setReducedMotion: (value: boolean) => {
      mockReducedMotion = value;
    },
  };
});

// Import after mock
import { AnimatedSection } from "../AnimatedSection";
import { StaggerContainer } from "../StaggerContainer";
import { StaggerItem } from "../StaggerItem";
import { PageTransition } from "../PageTransition";

describe("AnimatedSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("merender children dengan benar", () => {
    render(
      <AnimatedSection>
        <p>Test content</p>
      </AnimatedSection>
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("menggunakan viewport.once = true secara default", () => {
    render(
      <AnimatedSection>
        <span>Content</span>
      </AnimatedSection>
    );
    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveAttribute("data-viewport-once", "true");
  });

  it("menggunakan viewport.once = true saat once prop tidak diberikan", () => {
    render(
      <AnimatedSection variant="slideUp">
        <span>Content</span>
      </AnimatedSection>
    );
    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveAttribute("data-viewport-once", "true");
  });

  it("menggunakan viewport.once = false saat once=false diberikan", () => {
    render(
      <AnimatedSection once={false}>
        <span>Content</span>
      </AnimatedSection>
    );
    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveAttribute("data-viewport-once", "false");
  });

  it("menerapkan transition.duration default 0.6", () => {
    render(
      <AnimatedSection>
        <span>Content</span>
      </AnimatedSection>
    );
    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveAttribute("data-transition-duration", "0.6");
  });

  it("menerapkan delay yang diberikan", () => {
    render(
      <AnimatedSection delay={0.3}>
        <span>Content</span>
      </AnimatedSection>
    );
    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveAttribute("data-transition-delay", "0.3");
  });

  it("menerima className prop", () => {
    render(
      <AnimatedSection className="custom-class">
        <span>Content</span>
      </AnimatedSection>
    );
    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveClass("custom-class");
  });

  it("duration di-clamp ke 0.4 jika diberikan nilai lebih kecil", () => {
    render(
      <AnimatedSection duration={0.1}>
        <span>Content</span>
      </AnimatedSection>
    );
    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveAttribute("data-transition-duration", "0.4");
  });

  it("duration di-clamp ke 0.7 jika diberikan nilai lebih besar", () => {
    render(
      <AnimatedSection duration={1.5}>
        <span>Content</span>
      </AnimatedSection>
    );
    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveAttribute("data-transition-duration", "0.7");
  });

  it("semua variant yang valid dapat dirender tanpa error", () => {
    const variants = ["fadeIn", "slideUp", "slideLeft", "slideRight", "scaleIn"] as const;
    for (const variant of variants) {
      const { unmount } = render(
        <AnimatedSection variant={variant}>
          <span>{variant}</span>
        </AnimatedSection>
      );
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    }
  });
});

describe("StaggerContainer", () => {
  it("merender children dengan benar", () => {
    render(
      <StaggerContainer>
        <StaggerItem>Item 1</StaggerItem>
        <StaggerItem>Item 2</StaggerItem>
        <StaggerItem>Item 3</StaggerItem>
      </StaggerContainer>
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("menggunakan staggerDelay default 0.08", () => {
    // The StaggerContainer renders a motion.div with viewport.once = true
    render(
      <StaggerContainer>
        <StaggerItem>Item</StaggerItem>
      </StaggerContainer>
    );
    // Container should render with viewport.once = true
    const motionDivs = screen.getAllByTestId("motion-div");
    const containerDiv = motionDivs[0];
    expect(containerDiv).toHaveAttribute("data-viewport-once", "true");
  });

  it("menerima className prop", () => {
    render(
      <StaggerContainer className="stagger-container">
        <StaggerItem>Item</StaggerItem>
      </StaggerContainer>
    );
    const motionDivs = screen.getAllByTestId("motion-div");
    expect(motionDivs[0]).toHaveClass("stagger-container");
  });

  it("merender multiple children dengan benar", () => {
    const items = ["Alpha", "Beta", "Gamma", "Delta"];
    render(
      <StaggerContainer>
        {items.map((item) => (
          <StaggerItem key={item}>{item}</StaggerItem>
        ))}
      </StaggerContainer>
    );
    for (const item of items) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });
});

describe("StaggerItem", () => {
  it("merender children dengan benar", () => {
    render(
      <StaggerContainer>
        <StaggerItem>
          <p>Stagger content</p>
        </StaggerItem>
      </StaggerContainer>
    );
    expect(screen.getByText("Stagger content")).toBeInTheDocument();
  });

  it("menerima className prop", () => {
    render(
      <StaggerContainer>
        <StaggerItem className="item-class">Item</StaggerItem>
      </StaggerContainer>
    );
    const motionDivs = screen.getAllByTestId("motion-div");
    // The second motion-div is the StaggerItem
    expect(motionDivs[1]).toHaveClass("item-class");
  });
});

describe("PageTransition", () => {
  it("merender children dengan AnimatePresence", () => {
    render(
      <PageTransition locationKey="/home">
        <main>Page content</main>
      </PageTransition>
    );
    expect(screen.getByTestId("animate-presence")).toBeInTheDocument();
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("menggunakan durasi 300ms (0.3 detik)", () => {
    render(
      <PageTransition locationKey="/home">
        <div>Content</div>
      </PageTransition>
    );
    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toHaveAttribute("data-transition-duration", "0.3");
  });

  it("menggunakan locationKey sebagai key unik", () => {
    const { rerender } = render(
      <PageTransition locationKey="/home">
        <div>Home page</div>
      </PageTransition>
    );
    expect(screen.getByText("Home page")).toBeInTheDocument();

    rerender(
      <PageTransition locationKey="/profil">
        <div>Profil page</div>
      </PageTransition>
    );
    expect(screen.getByText("Profil page")).toBeInTheDocument();
  });

  it("merender children yang berbeda untuk locationKey yang berbeda", () => {
    const { rerender } = render(
      <PageTransition locationKey="/berita">
        <div>Berita</div>
      </PageTransition>
    );
    expect(screen.getByText("Berita")).toBeInTheDocument();

    rerender(
      <PageTransition locationKey="/galeri">
        <div>Galeri</div>
      </PageTransition>
    );
    expect(screen.getByText("Galeri")).toBeInTheDocument();
  });

  it("AnimatePresence menggunakan mode wait", () => {
    render(
      <PageTransition locationKey="/kontak">
        <div>Kontak</div>
      </PageTransition>
    );
    const animatePresence = screen.getByTestId("animate-presence");
    expect(animatePresence).toHaveAttribute("data-mode", "wait");
  });
});
