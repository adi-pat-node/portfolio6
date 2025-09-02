"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { MdArrowOutward } from "react-icons/md";
import Marquee from "@/components/Marquee/Marquee";
import Footer from "@/components/Footer/Footer";
import ShuffleText from "@/components/ShuffleText/ShuffleText";
import GeometricBackground from "@/components/GeometricBackground/GeometricBackground";
import { carouselItems } from "./carouselItems";

import "./home.css";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef();

  // initialize Lenis smooth scrolling instance on window
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      window.lenis = lenis;
    }

    return () => {
      window.lenis = null;
    };
  }, [lenis]);

  // controls geometric background animation on scroll
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ".intro",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const yMove = -750 * progress;
          const rotation = 360 * progress;

          gsap.to(".geo-bg", {
            y: yMove,
            rotation: rotation,
            duration: 0.1,
            ease: "none",
            overwrite: true,
          });
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  // handles case studies image pinning and scale animations on scroll
  useGSAP(
    () => {
      const images = gsap.utils.toArray(".case-studies-img");

      images.forEach((img, i) => {
        const imgElement = img.querySelector("img");

        ScrollTrigger.create({
          trigger: img,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            gsap.to(imgElement, {
              scale: 2 - self.progress,
              duration: 0.1,
              ease: "none",
            });
          },
        });

        ScrollTrigger.create({
          trigger: img,
          start: "top top",
          end: () =>
            `+=${
              document.querySelector(".case-studies-item").offsetHeight *
              (images.length - i - 1)
            }`,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  // handles carousel slide transitions with clip-path animations
  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      const projects = gsap.utils.toArray(".project");

      ScrollTrigger.create({
        trigger: ".carousel",
        start: "top top",
        end: `+=${window.innerHeight * (projects.length - 1)}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress * (projects.length - 1);
          const currentSlide = Math.floor(progress);
          const slideProgress = progress - currentSlide;

          if (currentSlide < projects.length - 1) {
            gsap.set(projects[currentSlide], {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
            });

            const nextSlideProgress = gsap.utils.interpolate(
              "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
              slideProgress
            );

            gsap.set(projects[currentSlide + 1], {
              clipPath: nextSlideProgress,
            });
          }

          projects.forEach((project, index) => {
            if (index < currentSlide) {
              gsap.set(project, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
              });
            } else if (index > currentSlide + 1) {
              gsap.set(project, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              });
            }
          });
        },
      });

      gsap.set(projects[0], {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <ReactLenis
      root
      options={{
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
      }}
    >
      <div className="app" ref={container}>
        <section className="hero">
          <div className="hero-img">
            <img src="/images/home/hero.jpeg" alt="" />
          </div>
          <div className="hero-img-overlay"></div>
          <div className="hero-img-gradient"></div>
          <div className="container">
            <div className="hero-copy">
              <div className="hero-copy-col">
                <ShuffleText as="h3" text="A glimpse into" />
                <ShuffleText as="h1" text="Where Art Meets Code" />
              </div>
              <div className="hero-copy-col">
                <div className="hero-icon">
                  <img src="/images/home/hero-abstract-icon.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="intro" id="intro">
          <div className="geo-bg">
            <GeometricBackground />
          </div>
          <Marquee />
          <div className="intro-container">
            <div className="container">
              <div className="col">
                <p className="primary">[ Painting the picture ]</p>
              </div>
              <div className="col">
                <div className="intro-copy">
                  <p>
                    Vireon has transformed the landscape of AI creativity,
                    evolving from simple, low-resolution designs to crafting
                    hyper-realistic, high-definition visuals that redefine the
                    limits of imagination and technological innovation
                  </p>
                  <p>
                    This advancement has unlocked powerful creative tools for
                    users of all experience levels, ranging from industry
                    experts to casual creators. However, it has also sparked
                    important conversations about the ethical implications of
                    AI-generated content, including concerns over intellectual
                    property, the potential for misinformation, and the ongoing
                    debate about the authenticity of artistic expression
                  </p>
                </div>
                <div className="prompt-example">
                  <div className="prompt-example-header">
                    <h4>
                      // PROMPT: A sci-fi fashion portrait of a person in
                      futuristic fashion
                    </h4>
                  </div>
                  <div className="prompt-example-results">
                    <div className="prompt-example-result-item">
                      <div className="prompt-example-result-item-img">
                        <img src="/images/home/prompt-1.jpeg" alt="" />
                        <div className="hero-img-overlay"></div>
                      </div>
                      <div className="prompt-example-result-item-title">
                        <h4>2018 - Created using innovative technologies</h4>
                      </div>
                    </div>
                    <div className="prompt-example-result-item">
                      <div className="prompt-example-result-item-img">
                        <img src="/images/home/prompt-2.jpeg" alt="" />
                        <div className="hero-img-overlay"></div>
                      </div>
                      <div className="prompt-example-result-item-title">
                        <h4>2025 — Created with Vireon V2</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="case-studies" id="case-studies">
          <div className="case-studies-header">
            <div className="container">
              <ShuffleText
                as="h2"
                text="Explore Fresh Success Stories"
                triggerOnScroll={true}
              />
            </div>
          </div>
          <div className="case-studies-content">
            <div className="container">
              <div className="col">
                <p className="primary">[ Case Studies ]</p>
              </div>
              <div className="col">
                <div className="case-studies-copy">
                  <h2>What Ways is AI Redefining Artistic Limits?</h2>
                  <p>
                    Generative AI has evolved swiftly, progressing from simple
                    visuals to producing breathtaking, realistic art that pushes
                    the boundaries of creativity and technology
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="case-studies-items">
          <div className="case-studies-items-content col">
            <div className="case-studies-item case-studies-item-1">
              <div className="container">
                <h3>Creativity in the Era of Algorithms</h3>
                <p className="primary">[ Lumina Horizon — Tara Lee ]</p>
                <div className="case-studies-item-inner-img">
                  <img
                    src="/images/home/case-study-1.jpeg"
                    alt="Futuristic AI-generated art"
                  />
                </div>
                <p>
                  Tara Lee's AI-driven installation mesmerizes audiences at the
                  Global Digital Arts Forum, sparking discussions on the
                  interplay between human creativity and machine accuracy. The
                  piece showcases AI's boundless potential as a collaborator in
                  contemporary art.
                </p>
                <div className="case-studies-item-inner-link">
                  <Link href="/archive">Uncover the Path</Link>
                  <div className="link-icon">
                    <MdArrowOutward size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="case-studies-item case-studies-item-2">
              <div className="container">
                <h3>The Rise of AI-Powered Fashionn</h3>
                <p className="primary">
                  [ Innovative Fabrics — Chary Marquez ]
                </p>
                <div className="case-studies-item-inner-img">
                  <img
                    src="/images/home/case-study-2.jpeg"
                    alt="AI-driven fashion design showcase"
                  />
                </div>
                <p>
                  Chary Marquez unveils the first fashion magazine curated
                  entirely by AI, showcasing futuristic designs that push the
                  limits of creativity. While hailed for its innovation, the
                  magazine sparks debates about the place of human designers in
                  a machine-driven creative world.
                </p>
                <div className="case-studies-item-inner-link">
                  <Link href="/archive">Read Full Story</Link>
                  <div className="link-icon">
                    <MdArrowOutward size={24} />
                  </div>
                </div>
              </div>
            </div>
            <div className="case-studies-item case-studies-item-3">
              <div className="container">
                <h3>The Emergence of AI-Driven Art Awards</h3>
                <p className="primary">
                  [ Constructed Realities — Jenny Smith ]
                </p>
                <div className="case-studies-item-inner-img">
                  <img
                    src="/images/home/case-study-3.jpeg"
                    alt="AI-curated artwork showcase"
                  />
                </div>
                <p>
                  Jenny Smith's revolutionary AI-curated exhibition showcases
                  the boundless creativity of machine-generated art. The
                  collection presents hyper-realistic depictions of entirely
                  fictional subjects, authenticity, and the evolving role of AI
                  in the future of artistic recognition.
                </p>
                <div className="case-studies-item-inner-link">
                  <Link href="/archive">Discover the Showcase</Link>
                  <div className="link-icon">
                    <MdArrowOutward size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="case-studies-items-images col">
            <div className="case-studies-img case-studies-img-1">
              <img src="/images/home/case-study-1.jpeg" alt="" />
              <div className="hero-img-overlay"></div>
              <div className="case-studies-img-link">
                <Link href="/archive">
                  <span>
                    (&nbsp; View Article <MdArrowOutward />
                    &nbsp;)
                  </span>
                </Link>
              </div>
            </div>
            <div className="case-studies-img case-studies-img-2">
              <img src="/images/home/case-study-2.jpeg" alt="" />
              <div className="hero-img-overlay"></div>
              <div className="case-studies-img-link">
                <Link href="/archive">
                  <span>
                    (&nbsp; View Article <MdArrowOutward />
                    &nbsp;)
                  </span>
                </Link>
              </div>
            </div>
            <div className="case-studies-img case-studies-img-3">
              <img src="/images/home/case-study-3.jpeg" alt="" />
              <div className="hero-img-overlay"></div>
              <div className="case-studies-img-link">
                <Link href="/archive">
                  <span>
                    (&nbsp; View Article <MdArrowOutward />
                    &nbsp;)
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="abstract-bg">
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
        </section>

        <section className="works" id="works">
          <div className="works-header">
            <div className="container">
              <ShuffleText
                as="h2"
                text="Timeless Art Through a New Lens"
                triggerOnScroll={true}
              />
            </div>
          </div>

          <div className="works-content">
            <div className="container">
              <div className="col">
                <p className="primary">[ Artistic Journeys ]</p>
              </div>
              <div className="col">
                <div className="works-copy">
                  <h2>Can Machines Create Like Human Artists?</h2>
                  <p>
                    These experiments delve into the capabilities of advanced AI
                    tools like Midjourney and DALL-E 3, reinterpreting classic
                    masterpieces with innovative and bold prompts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="carousel">
          {carouselItems.map((item) => (
            <div
              key={item.id}
              id={`project-${item.id}`}
              className="project"
              style={{
                clipPath:
                  item.id === "01"
                    ? "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)"
                    : "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              }}
            >
              <div className="project-bg">
                <img src={item.bg} alt="" />

                <div className="hero-img-overlay"></div>
                <div className="hero-img-gradient"></div>
              </div>
              <div className="project-main">
                <img src={item.main} alt="" />
              </div>
              <div className="project-header">
                <div className="project-id">
                  <h2>Archive {item.id}</h2>
                </div>
                <div className="project-whitespace"></div>
                <div className="project-title">
                  <h2>{item.title}</h2>
                </div>
              </div>
              <div className="project-info">
                <div className="project-url">
                  <Link href={item.url}>( The Journey )</Link>
                </div>
              </div>
              <Link
                href={item.url}
                className="project-overlay-link"
                aria-label={`View ${item.title} project`}
              />
            </div>
          ))}
        </section>

        <Footer />
      </div>
    </ReactLenis>
  );
}
