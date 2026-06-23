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
        const languageBlocks = document.querySelectorAll(".languages");
        if (!languageBlocks.length) return;
        languageBlocks.forEach((languageBlock => {
            const currentLanguage = languageBlock.querySelector(".languages__current");
            const dropdown = languageBlock.querySelector(".languages__dropdown");
            if (!currentLanguage || !dropdown) return;
            currentLanguage.addEventListener("click", (e => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle("active");
            }));
            dropdown.addEventListener("click", (e => {
                const selectedLanguage = e.target.closest("a");
                if (!selectedLanguage) return;
                e.preventDefault();
                const currentText = currentLanguage.textContent.trim();
                const selectedText = selectedLanguage.textContent.trim();
                currentLanguage.textContent = selectedText;
                currentLanguage.setAttribute("aria-label", selectedText);
                selectedLanguage.textContent = currentText;
                selectedLanguage.setAttribute("aria-label", currentText);
                dropdown.querySelectorAll("a").forEach((item => {
                    item.classList.remove("active");
                }));
                selectedLanguage.classList.add("active");
                dropdown.classList.remove("active");
            }));
            document.addEventListener("click", (e => {
                if (!languageBlock.contains(e.target)) dropdown.classList.remove("active");
            }));
        }));
    }));
    window["FLS"] = true;
})();