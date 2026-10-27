const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
const navLinks = document.querySelectorAll(".main-nav a");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
        });
    });
}

const sections = document.querySelectorAll(
    "#about, #practice, #record, #contact"
);

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            navLinks.forEach(link => {
                const active = link.getAttribute("href") ===
                    `#${entry.target.id}`;

                link.classList.toggle("active", active);

                if (active) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        });
    }, {
        rootMargin: "-30% 0px -55% 0px"
    });

    sections.forEach(section => sectionObserver.observe(section));
}



(function () {
    if (!window.gsap || !window.ScrollTrigger) {
        console.error("GSAP or ScrollTrigger has not loaded.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    var pic = document.getElementById("pic");
    var progress = document.getElementById("prog");
    var send = document.getElementById("send");

    // Calculate the actual scrollable height of the page.
    function pageScrollDistance() {
        return Math.max(
            1,
            document.documentElement.scrollHeight -
            window.innerHeight
        );
    }

    // Keep the background image focused on the chosen point.
    function focus(fx, fy, scale) {
        return {
            scale: scale,
            xPercent: -(fx - 0.5) * scale * 100,
            yPercent: -(fy - 0.5) * scale * 100
        };
    }
    var face = focus(0.74, 0.48, 1.9);

// Initial image position
if (pic) {
    gsap.set(pic, {
        scale: 1,
        xPercent: 0,
        yPercent: 0
    });
}

// Introductory animation
if (!reduce) {
    if (document.querySelector(".stage")) {
        gsap.from(".stage", {
            clipPath: "inset(0 0 100% 0)",
            duration: 1.4,
            ease: "power3.inOut"
        });
    }

    if (document.querySelector(".ti")) {
        gsap.from(".ti", {
            opacity: 0,
            y: 30,
            duration: 1.1,
            delay: 0.5,
            ease: "power2.out"
        });
    }
}

// Zoom and move towards the face only
if (pic && !reduce) {
    var visualArea = document.querySelector(".intro-visual");

    if (visualArea) {
        gsap.to(pic, {
            ...face,
            ease: "none",
            scrollTrigger: {
                trigger: visualArea,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
    }
}



// Fade out hero content while scrolling down
gsap.to("#hero .box", {
    autoAlpha: 0,
    y: -20,
    ease: "none",
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        invalidateOnRefresh: true
    }
});



// ABOUT — reveal text, then fade away as it leaves view
const aboutSection = document.querySelector("#about");
const aboutBox = document.querySelector("#about .rv");

if (aboutSection && aboutBox && !reduce) {

    // Reveal each child once
    gsap.fromTo(
        aboutBox.children,
        {
            autoAlpha: 0,
            y: 35,
            filter: "blur(5px)"
        },
        {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.14,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "filter",
            scrollTrigger: {
                trigger: aboutSection,
                start: "top 55%",
                toggleActions: "play none none reverse",
                once: true
            }
        }
    );

    // Fade out gradually as the section moves upward
   gsap.to(aboutBox, {
    autoAlpha: 0,
    y: -35,
    ease: "none",
    scrollTrigger: {
        trigger: aboutSection,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        invalidateOnRefresh: true
    }
});
}

/* GENERAL REVEALS — EXCLUDE ABOUT */

gsap.utils.toArray(".rv").forEach(function (el) {
    if (reduce || el.closest("#about")) return;

    gsap.fromTo(
        el.children,
        {
            autoAlpha: 0,
            y: 45,
            filter: "blur(6px)"
        },
        {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.14,
            duration: 0.6,
            ease: "power3.out",
            clearProps: "filter",
            scrollTrigger: {
                trigger: el,
                start: "top 45%",
                toggleActions: "play none none reverse",
                once: true
            }
        }
    );
});


    // Scroll progress bar.
    if (progress) {
        gsap.to(progress, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: document.documentElement,
                start: "top top",
                end: function () {
                    return "+=" + pageScrollDistance();
                },
                scrub: true,
                invalidateOnRefresh: true
            }
        });
    }




    // Reveal the list of areas.
    if (!reduce && document.querySelector(".areas")) {
        gsap.from(".areas li", {
            opacity: 0,
            x: -24,
            stagger: 0.12,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".areas",
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }

    // Animate number counters.
    gsap.utils.toArray("[data-n]").forEach(function (el) {
        var endValue = Number(el.dataset.n);

        if (!Number.isFinite(endValue)) return;

        var counter = { value: 0 };

        ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: function () {
                gsap.to(counter, {
                    value: endValue,
                    duration: reduce ? 0 : 1.6,
                    ease: "power2.out",
                    onUpdate: function () {
                        el.textContent =
                            Math.round(counter.value).toLocaleString("en");
                    }
                });
            }
        });
    });

    // Contact button.
    if (send) {
        send.addEventListener("click", function (event) {
            var nameField = document.getElementById("n");
            var emailField = document.getElementById("e");
            var message = document.getElementById("ok");

            if (!nameField || !emailField || !message) return;

            var name = nameField.value.trim();
            var email = emailField.value.trim();

            message.textContent = (!name || !email)
                ? "Add your name and email so he can reply."
                : "Thank you, " + name +
                  ". You will hear back within one business day.";
        });
    }

    // Recalculate after images, fonts and page content have loaded.
    window.addEventListener("load", function () {
        ScrollTrigger.refresh();
    });

    // Refresh when the viewport changes size.
    window.addEventListener("resize", function () {
        ScrollTrigger.refresh();
    });
})();



/* ==========================================
   CINEMATIC PHILOSOPHY SCROLL ANIMATION
========================================== */


(function () {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const philosophy = document.querySelector("#philosophy");

    if (!philosophy) return;

    const image = philosophy.querySelector(".philosophy-image");
    const photo = philosophy.querySelector(".philosophy-image img");
    const eyebrow = philosophy.querySelector(".philosophy-eyebrow");
    const heading = philosophy.querySelector(".philosophy-copy h2");
    const lead = philosophy.querySelector(".philosophy-lead");
    const description = philosophy.querySelector(".philosophy-description");
    const cta = philosophy.querySelector(".philosophy-cta");
    const bottom = philosophy.querySelector(".philosophy-bottom");
    const caption = philosophy.querySelector(".image-caption");

    if (!image || !photo) return;

    // Reduced-motion fallback: show the complete section without pinning.
    if (reduce) {
        gsap.set(image, {
            position: "absolute",
            inset: "0",
            width: "100%",
            height: "100%",
            xPercent: 0,
            yPercent: 0
        });

        gsap.set(photo, { scale: 1 });

        gsap.set(
            [eyebrow, heading, lead, description, cta, bottom, caption]
                .filter(Boolean),
            {
                autoAlpha: 1,
                y: 0
            }
        );

        return;
    }

    // Start with a small square in the centre of the screen.
    gsap.set(image, {
        position: "absolute",
        left: "50%",
        top: "50%",
        right: "auto",
        bottom: "auto",
        inset: "auto",
        width: 180,
        height: 180,
        xPercent: -50,
        yPercent: -50,
        overflow: "hidden"
    });

    gsap.set(photo, {
        scale: 1.5,
        transformOrigin: "center center"
    });

    const textLayers = [
        eyebrow,
        heading,
        lead,
        description,
        cta,
        bottom,
        caption
    ].filter(Boolean);

    gsap.set(textLayers, {
        autoAlpha: 0,
        y: 35
    });

    // Keep the section pinned while the visitor scrolls through the scene.
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: philosophy,
            start: "top top",
            end: "+=350%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });

    // PHASE 1 — Expand the square into a full-screen photograph.
    tl.to(image, {
        left: "0%",
        top: "0%",
        width: "100%",
        height: "100%",
        xPercent: 0,
        yPercent: 0,
        duration: 1,
        ease: "none"
    }, 0);

    // Slowly pull back the portrait zoom while the image expands.
    tl.to(photo, {
        scale: 1.02,
        duration: 2.5,
        ease: "none"
    }, 0);

    // PHASE 2 — Reveal the section label and main heading.
    tl.to([eyebrow, heading].filter(Boolean), {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.25,
        ease: "power2.out"
    }, 1);

    // PHASE 3 — Reveal the supporting statement.
    if (lead) {
        tl.to(lead, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, 1.9);
    }

    // PHASE 4 — Reveal the additional philosophy text.
    if (description) {
        tl.to(description, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, 2.5);
    }

    // PHASE 5 — Reveal the caption, CTA and principles.
    tl.to([caption, cta, bottom].filter(Boolean), {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out"
    }, 3.1);

    // Recalculate dimensions after images and layout have settled.
    window.addEventListener("load", function () {
        ScrollTrigger.refresh();
    });

    window.addEventListener("resize", function () {
        ScrollTrigger.refresh();
    });
})();






(function () {
    // Apply only to desktop mouse wheels, not touchpads or mobile.
    const isFinePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    );

    if (!isFinePointer.matches) return;

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let animationFrame = null;

    const strength = 0.3; // Lower = less movement per wheel input
    const stiffness = 0.12; // Lower = heavier, slower catch-up

    function animateScroll() {
        currentY += (targetY - currentY) * stiffness;

        if (Math.abs(targetY - currentY) < 0.5) {
            window.scrollTo(0, targetY);
            currentY = targetY;
            animationFrame = null;
            return;
        }

        window.scrollTo(0, currentY);
        animationFrame = requestAnimationFrame(animateScroll);
    }

    window.addEventListener("wheel", function (event) {
        // Don't interfere with browser zoom or modified wheel actions.
        if (event.ctrlKey || event.metaKey || event.shiftKey) return;

        // Let the browser handle the wheel normally.
        // This listener is intentionally passive.
        targetY = Math.max(
            0,
            Math.min(
                document.documentElement.scrollHeight - window.innerHeight,
                targetY + event.deltaY * strength
            )
        );

        if (animationFrame === null) {
            currentY = window.scrollY;
            animationFrame = requestAnimationFrame(animateScroll);
        }
    }, { passive: true });

    window.addEventListener("scroll", function () {
        // Resync when scrolling through the scrollbar or keyboard.
        if (animationFrame === null) {
            targetY = window.scrollY;
            currentY = window.scrollY;
        }
    }, { passive: true });
})();

/* =========================================
   PRACTICE AREAS IMAGE SLIDER
========================================= */

(function () {
    const section = document.querySelector("#practice");

    if (!section) return;

    const items = Array.from(
        section.querySelectorAll(".practice-item")
    );

    const slides = Array.from(
        section.querySelectorAll(".practice-slide")
    );

    const prevButton = section.querySelector(".practice-prev");
    const nextButton = section.querySelector(".practice-next");
    const currentCounter = section.querySelector(".practice-current");
    const progressBar = section.querySelector(".practice-progress span");

    if (!items.length || items.length !== slides.length) return;

    let currentIndex = 0;

    function showSlide(index) {
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            const isActive = i === currentIndex;

            slide.classList.toggle("active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });

        items.forEach((item, i) => {
            const isActive = i === currentIndex;

            item.classList.toggle("active", isActive);

            if (isActive) {
                item.setAttribute("aria-current", "true");
            } else {
                item.removeAttribute("aria-current");
            }
        });

        if (currentCounter) {
            currentCounter.textContent = String(currentIndex + 1).padStart(2, "0");
        }

        if (progressBar) {
            progressBar.style.width =
                `${((currentIndex + 1) / slides.length) * 100}%`;
        }
    }

    items.forEach((item, index) => {
        item.addEventListener("click", () => {
            showSlide(index);
        });

        item.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                showSlide(index);
            }
        });
    });

    prevButton?.addEventListener("click", () => {
        showSlide(currentIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
        showSlide(currentIndex + 1);
    });

    showSlide(0);
})();

(function () {
    const section = document.querySelector("#practice");

    if (!section) return;

    const slider = section.querySelector(".image-list");
    const prevButton = section.querySelector("#prev-slide");
    const nextButton = section.querySelector("#next-slide");
    const track = section.querySelector(".scrollbar-track");
    const thumb = section.querySelector(".scrollbar-thumb");

    if (!slider || !prevButton || !nextButton || !track || !thumb) {
        return;
    }

    let isDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let animationFrame = null;

    function getMaxScroll() {
        return Math.max(0, slider.scrollWidth - slider.clientWidth);
    }

    function updateSlider() {
        const maxScroll = getMaxScroll();
        const visibleRatio = slider.clientWidth / slider.scrollWidth;
        const thumbWidth = maxScroll <= 0
            ? 100
            : Math.max(10, visibleRatio * 100);

        thumb.style.width = `${thumbWidth}%`;

        const maxThumbTravel = track.clientWidth - thumb.offsetWidth;
        const progress = maxScroll > 0
            ? slider.scrollLeft / maxScroll
            : 0;

        thumb.style.left = `${progress * maxThumbTravel}px`;

        prevButton.disabled = slider.scrollLeft <= 2;
        nextButton.disabled = slider.scrollLeft >= maxScroll - 2;
    }

    function scrollByCard(direction) {
        const card = slider.querySelector(".image-container");
        if (!card) return;

        const styles = window.getComputedStyle(slider);
        const gap = parseFloat(styles.columnGap) || 0;
        const distance = card.getBoundingClientRect().width + gap;

        slider.scrollBy({
            left: direction * distance,
            behavior: "smooth"
        });
    }

    prevButton.addEventListener("click", function () {
        scrollByCard(-1);
    });

    nextButton.addEventListener("click", function () {
        scrollByCard(1);
    });

    slider.addEventListener("scroll", function () {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        animationFrame = requestAnimationFrame(updateSlider);
    }, { passive: true });

    window.addEventListener("resize", updateSlider);

    /* Click the scrollbar track to jump */
    track.addEventListener("pointerdown", function (event) {
        if (event.target === thumb) return;

        const rect = track.getBoundingClientRect();
        const clickPosition = event.clientX - rect.left;
        const maxThumbTravel = track.clientWidth - thumb.offsetWidth;
        const thumbPosition = Math.max(
            0,
            Math.min(maxThumbTravel, clickPosition - thumb.offsetWidth / 2)
        );

        const progress = maxThumbTravel > 0
            ? thumbPosition / maxThumbTravel
            : 0;

        slider.scrollTo({
            left: progress * getMaxScroll(),
            behavior: "smooth"
        });
    });

    /* Drag the scrollbar thumb */
    thumb.addEventListener("pointerdown", function (event) {
        event.preventDefault();

        isDragging = true;
        dragStartX = event.clientX;
        dragStartScroll = slider.scrollLeft;

        thumb.setPointerCapture(event.pointerId);
    });

    thumb.addEventListener("pointermove", function (event) {
        if (!isDragging) return;

        const maxScroll = getMaxScroll();
        const maxThumbTravel = track.clientWidth - thumb.offsetWidth;

        if (maxThumbTravel <= 0) return;

        const deltaX = event.clientX - dragStartX;
        const scrollDelta = (deltaX / maxThumbTravel) * maxScroll;

        slider.scrollLeft = dragStartScroll + scrollDelta;
    });

    function stopDragging() {
        isDragging = false;
    }

    thumb.addEventListener("pointerup", stopDragging);
    thumb.addEventListener("pointercancel", stopDragging);
    thumb.addEventListener("lostpointercapture", stopDragging);

    /* Initial state and image loading/layout changes */
    updateSlider();

    if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(updateSlider);
        observer.observe(slider);
    }
})();


(function () {
    const section = document.querySelector("#record");

    if (!section) return;

    const counters = section.querySelectorAll("[data-n]");
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let hasAnimated = false;

    function animateCounters() {
        if (hasAnimated) return;
        hasAnimated = true;

        counters.forEach(counter => {
            const target = Number(counter.dataset.n);

            if (!Number.isFinite(target)) return;

            if (reduceMotion) {
                counter.textContent = target.toLocaleString();
                return;
            }

            const duration = 1600;
            const startTime = performance.now();

            function updateCounter(now) {
                const progress = Math.min(
                    (now - startTime) / duration,
                    1
                );

                // Smooth ease-out
                const eased = 1 - Math.pow(1 - progress, 4);
                const value = Math.round(target * eased);

                counter.textContent = value.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                animateCounters();
                observer.disconnect();
            }
        }, {
            threshold: 0.3
        });

        observer.observe(section);
    } else {
        animateCounters();
    }
})();


  // why choose us: pinned, reasons swap as you scroll
var rs = gsap.utils.toArray('.rs'),
    lis = gsap.utils.toArray('#wl li');

gsap.set(rs.slice(1), { opacity: 0, y: 50 });

var wy = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
        trigger: '#why',
        start: 'top top',
        end: '+=350%', // Was 300% — transitions happen sooner
        pin: true,
        scrub: true,
        onUpdate: function(s) {
            var i = Math.min(
                rs.length - 1,
                Math.floor(s.progress * rs.length)
            );

            lis.forEach(function(l, k) {
                l.classList.toggle('on', k === i);
            });
        }
    }
});

rs.forEach(function(r, i) {
    if (i > 0) {
        wy.to(r, { opacity: 1, y: 0, duration: 0.3 }, i);
    }

    if (i < rs.length - 1) {
        wy.to(r, { opacity: 0, y: -50, duration: 0.3 }, i + 0.7);
    }
});

wy.to({}, { duration: 0.3 }, rs.length - 0.3);


  const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#ok");

if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!contactForm.reportValidity()) return;

        contactStatus.textContent =
            "Your details are ready. Connect the form to a secure submission service to send your enquiry.";

        // No enquiry is sent by this example.
    });
}



// gsap.registerPlugin(ScrollTrigger);

// const intro = document.querySelector(".intro-visual");
// const hero = document.querySelector("#hero");
// const heroBox = document.querySelector("#hero .box");
// const about = document.querySelector("#about");
// const aboutBox = document.querySelector("#about .box");

// if (intro && hero && heroBox && about && aboutBox) {
//     gsap.set(about, { autoAlpha: 0 });
//     gsap.set(aboutBox, { y: 35, autoAlpha: 0 });

//     const introTimeline = gsap.timeline({
//         scrollTrigger: {
//             trigger: intro,
//             start: "top top",
//             end: "bottom bottom",
//             scrub: 0.8,
//             pin: ".stage",
//             pinSpacing: false,
//             invalidateOnRefresh: true
//         }
//     });

//     introTimeline
//         .to(heroBox, {
//             autoAlpha: 0,
//             y: -35,
//             ease: "none",
//             duration: 1
//         })
//         .to(about, {
//             autoAlpha: 1,
//             visibility: "visible",
//             ease: "none",
//             duration: 0.2
//         }, 0.65)
//         .to(aboutBox, {
//             autoAlpha: 1,
//             y: 0,
//             ease: "power2.out",
//             duration: 0.7
//         }, 0.7);
// }

const aboutRevealItems = aboutContent
    ? aboutContent.querySelectorAll(
        ".about-eyebrow, h2, .about-lead, " +
        ".about-description, .about-stats, " +
        ".about-divider, .about-value, .about-cta"
    )
    : [];