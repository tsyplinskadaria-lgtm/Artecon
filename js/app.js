(() => {
    "use strict";
    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || "";
        const duration = 1800;
        let startTime = null;
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }
        function step(time) {
            if (!startTime) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = easeOutCubic(progress);
            const value = Math.floor(eased * target);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
    }
    document.addEventListener("DOMContentLoaded", (() => {
        const section = document.querySelector(".about");
        const counters = document.querySelectorAll(".about__stats-number");
        if (!section || !counters.length) return;
        let started = false;
        const observer = new IntersectionObserver((entries => {
            entries.forEach((entry => {
                if (entry.isIntersecting && !started) {
                    started = true;
                    counters.forEach((counter => {
                        animateCounter(counter);
                    }));
                    observer.disconnect();
                }
            }));
        }), {
            threshold: .4
        });
        observer.observe(section);
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        const slider = document.querySelector(".menu-mobile__slider");
        if (!slider) return;
        document.addEventListener("click", (e => {
            if (e.target.closest(".submenu-open")) slider.style.transform = "translateX(-50%)";
            if (e.target.closest(".submenu-close")) slider.style.transform = "translateX(0)";
        }));
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        const menu = document.querySelector(".mobile-menu");
        const overlay = document.querySelector(".overlay");
        const openMenu = document.querySelector(".open-menu");
        const closeMenu = document.querySelector(".close-menu");
        if (!menu || !overlay) return;
        const open = () => {
            menu.classList.add("active");
            overlay.classList.add("active");
            document.body.style.overflow = "hidden";
        };
        const close = () => {
            menu.classList.remove("active");
            overlay.classList.remove("active");
            document.body.style.overflow = "";
        };
        openMenu?.addEventListener("click", open);
        closeMenu?.addEventListener("click", close);
        overlay?.addEventListener("click", close);
    }));
    document.querySelectorAll("[data-video]").forEach((item => {
        const id = item.dataset.video;
        const preview = item.querySelector(".video__preview");
        preview.style.backgroundImage = `url(https://img.youtube.com/vi/${id}/hqdefault.jpg)`;
        item.addEventListener("click", (function() {
            this.innerHTML = `\n      <iframe \n        src="https://www.youtube.com/embed/${id}?autoplay=1"\n        frameborder="0"\n        allow="autoplay; encrypted-media"\n        allowfullscreen>\n      </iframe>\n    `;
        }));
    }));
    window.addEventListener("load", (() => {
        const currentButtons = document.querySelectorAll(".languages__current");
        const allLanguageLinks = document.querySelectorAll(".languages__dropdown a");
        function setLanguage(lang) {
            currentButtons.forEach((btn => {
                btn.textContent = lang;
                btn.setAttribute("aria-label", lang);
            }));
            allLanguageLinks.forEach((link => {
                link.classList.toggle("active", link.textContent.trim() === lang);
            }));
        }
        document.querySelectorAll(".languages").forEach((block => {
            const current = block.querySelector(".languages__current");
            const dropdown = block.querySelector(".languages__dropdown");
            if (!current || !dropdown) return;
            current.addEventListener("click", (e => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle("active");
            }));
        }));
        allLanguageLinks.forEach((link => {
            link.addEventListener("click", (e => {
                e.preventDefault();
                const lang = link.textContent.trim();
                setLanguage(lang);
                document.querySelectorAll(".languages__dropdown").forEach((drop => drop.classList.remove("active")));
            }));
        }));
        document.addEventListener("click", (e => {
            document.querySelectorAll(".languages").forEach((block => {
                if (!block.contains(e.target)) block.querySelector(".languages__dropdown")?.classList.remove("active");
            }));
        }));
    }));
    document.querySelectorAll(".faq-fields__item").forEach((item => {
        const header = item.querySelector(".faq-fields__top");
        const content = item.querySelector(".faq-fields__content");
        header.addEventListener("click", (() => {
            const isOpen = item.classList.contains("active");
            if (isOpen) {
                content.style.height = content.scrollHeight + "px";
                requestAnimationFrame((() => {
                    content.style.height = "0px";
                }));
                item.classList.remove("active");
            } else {
                item.classList.add("active");
                content.style.height = content.scrollHeight + "px";
                content.addEventListener("transitionend", (function handler() {
                    if (item.classList.contains("active")) content.style.height = "auto";
                    content.removeEventListener("transitionend", handler);
                }));
            }
        }));
    }));
    document.querySelectorAll(".card-slider").forEach((slider => {
        new Swiper(slider, {
            slidesPerView: 1,
            speed: 600,
            effect: "slide",
            navigation: {
                nextEl: slider.querySelector(".card-slider__next"),
                prevEl: slider.querySelector(".card-slider__prev")
            },
            grabCursor: true
        });
    }));
    document.querySelectorAll(".consultation-slider").forEach((slider => {
        new Swiper(slider, {
            slidesPerView: "auto",
            speed: 600,
            effect: "slide",
            spaceBetween: 12,
            grabCursor: true
        });
    }));
    window["FLS"] = true;
})();