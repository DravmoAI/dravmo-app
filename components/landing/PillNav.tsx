"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  target?: string;
};

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  initialLoadAnimation?: boolean;
}

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  ease = "power3.out",
  initialLoadAnimation = true,
}) => {
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const pillRefs = useRef<Array<HTMLAnchorElement | HTMLLinkElement | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const componentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // === INITIAL LOAD ANIMATION ===
    if (initialLoadAnimation) {
      const tl = gsap.timeline({
        defaults: { duration: 0.6, ease },
        delay: 0.2,
      });
      tl.to(logoRef.current, { scale: 1, autoAlpha: 1 }).to(
        navItemsRef.current,
        { width: "auto", autoAlpha: 1, ease: "power2.inOut" },
        "-=0.4"
      );
    }

    // === HOVER ANIMATIONS SETUP ===
    const setupHoverAnimations = () => {
      circleRefs.current.forEach((circle, i) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const { width: w, height: h } = pill.getBoundingClientRect();

        // Calculate the circle diameter needed to cover the pill
        const radius = (w * w + 4 * h * h) / (8 * h);
        const diameter = Math.ceil(2 * radius);
        const delta = Math.ceil(radius - Math.sqrt(Math.max(0, radius * radius - (w * w) / 4)));

        gsap.set(circle, {
          width: diameter,
          height: diameter,
          bottom: -delta,
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${diameter - delta}px`,
        });

        const label = pill.querySelector<HTMLElement>(".pill-label");
        const labelHover = pill.querySelector<HTMLElement>(".pill-label-hover");

        gsap.set(label, { y: 0 });
        gsap.set(labelHover, { y: h, opacity: 0 });

        // Create a paused timeline for each pill
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1, duration: 0.4, ease })
          .to(label, { y: -(h + 8), duration: 0.4, ease }, 0)
          .to(labelHover, { y: 0, opacity: 1, duration: 0.4, ease }, 0);

        tlRefs.current[i] = tl;
      });
    };

    // Run setup on mount and on resize
    setupHoverAnimations();
    window.addEventListener("resize", setupHoverAnimations);

    return () => {
      window.removeEventListener("resize", setupHoverAnimations);
      tlRefs.current.forEach((tl) => tl?.kill());
    };
  }, [ease, initialLoadAnimation]);

  const handleEnter = (i: number, isActive: boolean) => {
    tlRefs.current[i]?.timeScale(1).play();
  };

const handleLeave = (i: number, isActive: boolean) => {
  tlRefs.current[i]?.timeScale(1.5).reverse();
};


  const handleLogoEnter = () => {
    gsap.fromTo(
      logoImgRef.current,
      { rotate: 0 },
      {
        rotate: 360,
        duration: 0.4,
        ease: "power1.inOut",
      }
    );
  };

  const isExternalLink = (href: string) =>
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#");

  const isRouterLink = (href?: string) => href && !isExternalLink(href);

  const cssVars = {
    ["--nav-h"]: "56px",
    ["--logo"]: "36px",
    ["--pill-pad-x"]: "24px",
    ["--pill-gap"]: "5px",
  } as React.CSSProperties;

  const initialStyle: React.CSSProperties = {
    visibility: initialLoadAnimation ? "hidden" : "visible",
  };

  return (
    <div
      ref={componentRef}
      className="fixed top-[40px] z-[1000] w-full left-1/2 -translate-x-1/2 md:w-auto"
    >
      <nav
        className={`w-full md:w-max flex items-center justify-between md:justify-start box-border px-4 md:px-0 ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        <a
          href={"/"}
          aria-label="Home"
          onMouseEnter={handleLogoEnter}
          ref={logoRef}
          className="rounded-full p-3 inline-flex items-center justify-center overflow-hidden"
          style={{
            ...initialStyle,
            scale: initialLoadAnimation ? 0 : 1,
            width: "var(--nav-h)",
            height: "var(--nav-h)",
            background:
              "linear-gradient(to bottom, rgba(145, 187, 242, 0.1), rgba(13, 27, 42, 0.1))",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(151, 255, 239, 0.25)",
            boxShadow:
              "inset 0 1px 1px 0 rgba(247, 237, 226, 0.05), 0 0 20px 0 rgba(151, 255, 239, 0.1)",
          }}
        >
          <img
            src={logo}
            alt={logoAlt}
            ref={logoImgRef}
            className="w-full h-full object-cover block"
          />
        </a>

        <div
          ref={navItemsRef}
          className="relative items-center rounded-full hidden md:flex ml-2"
          style={{
            ...initialStyle,
            width: initialLoadAnimation ? 0 : "auto",
            height: "var(--nav-h)",
            background:
              "linear-gradient(to bottom, rgba(145, 187, 242, 0.1), rgba(13, 27, 42, 0.1))",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(151, 255, 239, 0.25)",
            boxShadow:
              "inset 0 1px 1px 0 rgba(247, 237, 226, 0.05), 0 0 20px 0 rgba(151, 255, 239, 0.1)",
          }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-[5px] h-full"
            style={{ gap: "var(--pill-gap)" }}
          >
            {items.map((item, i) => {
              const isActive = activeHref === item.href;

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{
                      background: "rgba(151, 255, 239, 0.15)",
                      backdropFilter: "blur(12px)",
                      willChange: "transform",
                    }}
                    aria-hidden="true"
                    ref={(el) => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span
                      className="pill-label font-quantico relative z-[2] inline-block"
                      style={{ willChange: "transform" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover font-quantico absolute left-0 top-0 z-[3] inline-block"
                      style={{
                        willChange: "transform, opacity",
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4] bg-white"
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses =
                "relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border text-white font-semibold text-[16px] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer";
              const homeItemClasses = item.href === "/" ? "text-white/90" : "text-white";

              return (
                <li key={item.href} role="none" className="flex h-full"
                  style={{ border: '1px solid transparent' }}>
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      href={item.href}
                      className={`${basePillClasses} ${homeItemClasses}`}
                      style={{
                        paddingLeft: "var(--pill-pad-x)",
                        paddingRight: "var(--pill-pad-x)",
                        background: isActive ? "linear-gradient(to bottom, rgba(145, 187, 242, 0.05), rgba(13, 27, 42, 0.05))" : "transparent",
                        border: isActive ? '1px solid rgba(151, 255, 239, 0.25)' : '1px solid transparent',
                      }}
                      aria-label={item.ariaLabel || item.label}
                      ref={(el) => { pillRefs.current[i] = el; }}
                      onMouseEnter={() => handleEnter(i, isActive)}
                      onMouseLeave={() => handleLeave(i, isActive)}
                      onClick={(e) => {
                        if (item.href === "/") {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                    >
                      {PillContent}
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={`${basePillClasses} ${homeItemClasses}`}
                      style={{
                        paddingLeft: "var(--pill-pad-x)",
                        paddingRight: "var(--pill-pad-x)",
                        background: isActive ? "linear-gradient(to bottom, rgba(145, 187, 242, 0.05), rgba(13, 27, 42, 0.05))" : "transparent",
                        border: isActive ? '1px solid rgba(151, 255, 239, 0.25)' : '1px solid transparent',
                      }}
                      aria-label={item.ariaLabel || item.label}
                      target={item.target}
                      ref={(el) => { pillRefs.current[i] = el; }}
                      onMouseEnter={() => handleEnter(i, isActive)}
                      onMouseLeave={() => handleLeave(i, isActive)}
                      onClick={(e) => {
                        if (item.href.startsWith("#")) {
                          e.preventDefault(); // Prevent default jump behavior
                          const targetId = item.href.substring(1); // Get the ID without the '#'
                          const targetElement = document.getElementById(targetId);
                          if (targetElement) {
                            targetElement.scrollIntoView({ behavior: "smooth" }); // Smooth scroll
                          }
                        }
                      }}
                    >
                      {PillContent}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default PillNav;
