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
        const submenus = document.querySelectorAll(".menu-mobile__submenu");
        document.addEventListener("click", (e => {
            const openBtn = e.target.closest(".submenu-open");
            if (openBtn) {
                const menu = openBtn.dataset.menu;
                submenus.forEach((item => item.classList.remove("active")));
                const current = document.querySelector(`[data-submenu="${menu}"]`);
                if (current) {
                    const title = openBtn.parentElement.querySelector("a").textContent.trim();
                    const span = current.querySelector(".submenu-back-next span");
                    if (span) span.textContent = title;
                    current.classList.add("active");
                }
            }
            if (e.target.closest(".submenu-close")) submenus.forEach((item => item.classList.remove("active")));
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
    document.querySelectorAll(".arrow-open").forEach((btn => {
        btn.addEventListener("click", (e => {
            e.preventDefault();
            const item = btn.closest(".open-dropwdown");
            const top = item.querySelector(".open-dropwdown__top");
            item.classList.toggle("active");
            top.classList.toggle("active");
        }));
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
    function infiniteColumn(selector, direction = 1, baseSpeed = 60) {
        const column = document.querySelector(selector);
        if (!column) return;
        column.innerHTML += column.innerHTML;
        let position = 0;
        let paused = false;
        let wheelSpeed = 0;
        const getHeight = () => column.scrollHeight / 2;
        let lastTime = performance.now();
        function animate(time) {
            const delta = time - lastTime;
            lastTime = time;
            if (!paused) {
                const autoMove = baseSpeed * delta / 1e3;
                position += (autoMove + wheelSpeed) * direction;
                const h = getHeight();
                position = (position % h + h) % h;
                column.style.transform = `translateY(${-position}px)`;
            }
            wheelSpeed *= .92;
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        column.addEventListener("mouseenter", (() => {
            paused = true;
        }));
        column.addEventListener("mouseleave", (() => {
            paused = false;
        }));
        column.addEventListener("wheel", (e => {
            e.preventDefault();
            if (paused) return;
            wheelSpeed += e.deltaY * .25;
        }), {
            passive: false
        });
    }
    infiniteColumn(".response__column--down", 1, 60);
    infiniteColumn(".response__column--up", -1, 60);
    document.querySelectorAll(".card-slider").forEach((slider => {
        new Swiper(slider, {
            slidesPerView: 1,
            speed: 600,
            spaceBetween: 7,
            effect: "slide",
            navigation: {
                nextEl: slider.querySelector(".navigation-btn__next"),
                prevEl: slider.querySelector(".navigation-btn__prev")
            },
            grabCursor: true
        });
    }));
    document.querySelectorAll(".cards-slider-mob__slider").forEach((slider => {
        const swiper = new Swiper(slider, {
            slidesPerView: 1,
            speed: 600,
            spaceBetween: 7,
            effect: "slide",
            navigation: {
                nextEl: slider.querySelector(".cards-slider-btn__next"),
                prevEl: slider.querySelector(".cards-slider-btn__prev")
            },
            grabCursor: true,
            on: {
                init(swiper) {
                    createPagination(swiper);
                    updatePagination(swiper);
                },
                slideChange(swiper) {
                    updatePagination(swiper);
                }
            }
        });
        function createPagination(swiper) {
            const pagination = slider.querySelector(".pagination2");
            if (!pagination) return;
            pagination.innerHTML = "";
            const maxDots = window.innerWidth <= 576 ? 6 : 10;
            const dotsCount = Math.min(swiper.slides.length, maxDots);
            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                dot.addEventListener("click", (() => swiper.slideTo(i)));
                pagination.appendChild(dot);
            }
        }
        function updatePagination(swiper) {
            const dots = slider.querySelectorAll(".pagination2 .dot");
            if (!dots.length) return;
            const activeDot = swiper.activeIndex % dots.length;
            dots.forEach(((dot, index) => {
                dot.classList.toggle("active", index === activeDot);
            }));
        }
        window.addEventListener("resize", (() => {
            createPagination(swiper);
            updatePagination(swiper);
        }));
    }));
    document.querySelectorAll(".consultation-slider").forEach((slider => {
        new Swiper(slider, {
            slidesPerView: "auto",
            spaceBetween: 12,
            speed: 600,
            loop: true,
            grabCursor: true,
            freeMode: {
                enabled: true,
                momentum: true
            },
            loopedSlides: 10
        });
    }));
    window.addEventListener("load", (() => {
        new Swiper(".advantages-slider", {
            slidesPerView: 1,
            spaceBetween: 7,
            speed: 600,
            on: {
                init(swiper) {
                    initControls(swiper);
                    updateActive(swiper);
                },
                slideChange(swiper) {
                    updateActive(swiper);
                }
            }
        });
        function initControls(swiper) {
            swiper.slides.forEach((slide => {
                const prevBtn = slide.querySelector(".navigation-btn--prev");
                const nextBtn = slide.querySelector(".navigation-btn--next");
                const pagination = slide.querySelector(".pagination");
                if (!prevBtn || !nextBtn || !pagination) return;
                prevBtn.onclick = () => swiper.slidePrev();
                nextBtn.onclick = () => swiper.slideNext();
                if (pagination.dataset.init === "true") return;
                pagination.dataset.init = "true";
                swiper.slides.forEach(((_, i) => {
                    const dot = document.createElement("span");
                    dot.classList.add("dot");
                    dot.onclick = () => swiper.slideTo(i);
                    pagination.appendChild(dot);
                }));
            }));
        }
        function updateActive(swiper) {
            swiper.slides.forEach((slide => {
                const pagination = slide.querySelector(".pagination");
                if (!pagination) return;
                const dots = pagination.querySelectorAll(".dot");
                dots.forEach(((dot, i) => {
                    dot.classList.toggle("active", i === swiper.activeIndex);
                }));
            }));
        }
    }));
    document.querySelectorAll(".reviews-slider").forEach((slider => {
        const swiper = new Swiper(slider, {
            slidesPerView: 5,
            spaceBetween: 11,
            speed: 600,
            grabCursor: true,
            watchOverflow: true,
            navigation: {
                nextEl: slider.querySelector(".navigation-btn__next"),
                prevEl: slider.querySelector(".navigation-btn__prev")
            },
            breakpoints: {
                1200: {
                    slidesPerView: 5
                },
                1024: {
                    slidesPerView: 4
                },
                768: {
                    slidesPerView: 3
                },
                720: {
                    slidesPerView: 3
                },
                576: {
                    slidesPerView: 2
                },
                0: {
                    slidesPerView: 1.8
                }
            },
            on: {
                init(swiper) {
                    createPagination(swiper);
                    updatePagination(swiper);
                    updateNavState(swiper);
                },
                slideChange(swiper) {
                    updatePagination(swiper);
                    updateNavState(swiper);
                },
                resize(swiper) {
                    updateNavState(swiper);
                }
            }
        });
        function updateNavState(swiper) {
            const prev = slider.querySelector(".navigation-btn__prev");
            const next = slider.querySelector(".navigation-btn__next");
            if (!prev || !next) return;
            prev.classList.toggle("is-disabled", swiper.isBeginning);
            next.classList.toggle("is-disabled", swiper.isEnd);
            prev.disabled = swiper.isBeginning;
            next.disabled = swiper.isEnd;
        }
        function createPagination(swiper) {
            const pagination = slider.querySelector(".pagination2");
            if (!pagination) return;
            pagination.innerHTML = "";
            const maxDots = window.innerWidth <= 576 ? 6 : 10;
            const dotsCount = Math.min(swiper.slides.length, maxDots);
            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                dot.addEventListener("click", (() => {
                    swiper.slideTo(i);
                }));
                pagination.appendChild(dot);
            }
        }
        function updatePagination(swiper) {
            const dots = slider.querySelectorAll(".pagination2 .dot");
            if (!dots.length) return;
            const activeDot = swiper.activeIndex % dots.length;
            dots.forEach(((dot, index) => {
                dot.classList.toggle("active", index === activeDot);
            }));
        }
        window.addEventListener("resize", (() => {
            createPagination(swiper);
            updatePagination(swiper);
            updateNavState(swiper);
        }));
    }));
    document.querySelectorAll(".response__column").forEach((column => {
        let isDragging = false;
        let startY = 0;
        let startScrollTop = 0;
        column.addEventListener("mousedown", (e => {
            isDragging = true;
            startY = e.clientY;
            startScrollTop = column.scrollTop;
            column.classList.add("dragging");
        }));
        document.addEventListener("mousemove", (e => {
            if (!isDragging) return;
            const delta = e.clientY - startY;
            column.scrollTop = startScrollTop - delta;
        }));
        document.addEventListener("mouseup", (() => {
            isDragging = false;
            column.classList.remove("dragging");
        }));
    }));
    document.querySelectorAll(".response-slider").forEach((slider => {
        const swiper = new Swiper(slider, {
            slidesPerView: 2.8,
            spaceBetween: 12,
            speed: 600,
            grabCursor: true,
            navigation: {
                nextEl: slider.querySelector(".navigation-btn__next"),
                prevEl: slider.querySelector(".navigation-btn__prev")
            },
            breakpoints: {
                576: {
                    slidesPerView: 2.6
                },
                0: {
                    slidesPerView: 1.3
                }
            },
            on: {
                init(swiper) {
                    createPagination(swiper);
                    updatePagination(swiper);
                },
                slideChange(swiper) {
                    updatePagination(swiper);
                }
            }
        });
        function createPagination(swiper) {
            const pagination = slider.querySelector(".pagination2");
            if (!pagination) return;
            pagination.innerHTML = "";
            const maxDots = window.innerWidth <= 1024 ? 6 : 10;
            const dotsCount = Math.min(swiper.slides.length, maxDots);
            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                dot.addEventListener("click", (() => {
                    swiper.slideTo(i);
                }));
                pagination.appendChild(dot);
            }
        }
        function updatePagination(swiper) {
            const dots = slider.querySelectorAll(".pagination2 .dot");
            if (!dots.length) return;
            const activeDot = swiper.activeIndex % dots.length;
            dots.forEach(((dot, index) => {
                dot.classList.toggle("active", index === activeDot);
            }));
        }
        window.addEventListener("resize", (() => {
            createPagination(swiper);
            updatePagination(swiper);
        }));
    }));
    document.querySelectorAll(".blog__slider").forEach((slider => {
        const swiper = new Swiper(slider, {
            slidesPerView: 3,
            spaceBetween: 12,
            speed: 600,
            breakpoints: {
                1024: {
                    slidesPerView: 3
                },
                576: {
                    slidesPerView: 2
                },
                0: {
                    slidesPerView: 1
                }
            },
            navigation: {
                nextEl: slider.querySelector(".navigation-btn__next"),
                prevEl: slider.querySelector(".navigation-btn__prev")
            },
            on: {
                init(swiper) {
                    createPagination(swiper);
                    updatePagination(swiper);
                },
                slideChange(swiper) {
                    updatePagination(swiper);
                }
            }
        });
        function createPagination(swiper) {
            const pagination = slider.querySelector(".pagination2");
            if (!pagination) return;
            pagination.innerHTML = "";
            const maxDots = window.innerWidth <= 576 ? 6 : 10;
            const dotsCount = Math.min(swiper.slides.length, maxDots);
            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                dot.addEventListener("click", (() => swiper.slideTo(i)));
                pagination.appendChild(dot);
            }
        }
        function updatePagination(swiper) {
            const dots = slider.querySelectorAll(".pagination2 .dot");
            if (!dots.length) return;
            const activeDot = swiper.activeIndex % dots.length;
            dots.forEach(((dot, index) => {
                dot.classList.toggle("active", index === activeDot);
            }));
        }
        window.addEventListener("resize", (() => {
            createPagination(swiper);
            updatePagination(swiper);
        }));
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        const buttons = document.querySelectorAll(".method-btn");
        const hiddenInput = document.getElementById("contactMethod");
        const output = document.querySelector("#selectedMethod span");
        if (!buttons.length) return;
        function setMethod(value = "") {
            if (hiddenInput) hiddenInput.value = value;
            if (output) output.textContent = value;
        }
        buttons.forEach((btn => {
            btn.addEventListener("click", (() => {
                if (btn.classList.contains("active")) {
                    btn.classList.remove("active");
                    setMethod("");
                    return;
                }
                buttons.forEach((b => b.classList.remove("active")));
                btn.classList.add("active");
                setMethod(btn.dataset.value);
            }));
        }));
        setMethod("");
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        const buttons = document.querySelectorAll(".interest");
        const hiddenInput = document.getElementById("interest");
        if (!buttons.length) return;
        function setInterest(value = "") {
            if (hiddenInput) hiddenInput.value = value;
        }
        buttons.forEach((btn => {
            btn.addEventListener("click", (() => {
                if (btn.classList.contains("active")) {
                    btn.classList.remove("active");
                    setInterest("");
                    return;
                }
                buttons.forEach((b => b.classList.remove("active")));
                btn.classList.add("active");
                setInterest(btn.dataset.value);
            }));
        }));
    }));
    document.querySelectorAll(".dropdown-interest").forEach((dropdown => {
        const top = dropdown.querySelector(".dropdown-interest__top");
        const span = top.querySelector("span");
        const list = dropdown.querySelector(".consultation2-form__interest");
        const arrow = dropdown.querySelector("svg");
        let isOpen = false;
        let selected = null;
        const placeholder = span.textContent;
        list.style.display = "none";
        top.addEventListener("click", (() => {
            isOpen = !isOpen;
            list.style.display = isOpen ? "flex" : "none";
            arrow.style.transform = isOpen ? "rotate(-90deg)" : "rotate(90deg)";
        }));
        const buttons = dropdown.querySelectorAll(".interest, .method-btn");
        buttons.forEach((btn => {
            btn.addEventListener("click", (() => {
                const value = btn.dataset.value;
                if (selected === value) {
                    selected = null;
                    span.textContent = placeholder;
                } else {
                    selected = value;
                    span.textContent = value;
                }
                list.style.display = "none";
                arrow.style.transform = "rotate(90deg)";
                isOpen = false;
            }));
        }));
    }));
    document.querySelectorAll(".photos__slider").forEach((slider => {
        const swiper = new Swiper(slider, {
            slidesPerView: 1,
            speed: 600,
            spaceBetween: 7,
            effect: "slide",
            navigation: {
                nextEl: slider.querySelector(".navigation-btn__next"),
                prevEl: slider.querySelector(".navigation-btn__prev")
            },
            grabCursor: true,
            on: {
                init(swiper) {
                    createPagination(swiper);
                    updatePagination(swiper);
                },
                slideChange(swiper) {
                    updatePagination(swiper);
                }
            }
        });
        function createPagination(swiper) {
            const pagination = slider.querySelector(".pagination2");
            if (!pagination) return;
            pagination.innerHTML = "";
            const maxDots = window.innerWidth <= 576 ? 6 : 10;
            const dotsCount = Math.min(swiper.slides.length, maxDots);
            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                dot.addEventListener("click", (() => swiper.slideTo(i)));
                pagination.appendChild(dot);
            }
        }
        function updatePagination(swiper) {
            const dots = slider.querySelectorAll(".pagination2 .dot");
            if (!dots.length) return;
            const activeDot = swiper.activeIndex % dots.length;
            dots.forEach(((dot, index) => {
                dot.classList.toggle("active", index === activeDot);
            }));
        }
        window.addEventListener("resize", (() => {
            createPagination(swiper);
            updatePagination(swiper);
        }));
    }));
    document.querySelectorAll(".services__slider").forEach((slider => {
        const swiper = new Swiper(slider, {
            slidesPerView: 3.3,
            spaceBetween: 12,
            speed: 600,
            grabCursor: true,
            navigation: {
                nextEl: slider.querySelector(".navigation-btn__next"),
                prevEl: slider.querySelector(".navigation-btn__prev")
            },
            on: {
                init(swiper) {
                    createPagination(swiper);
                    updatePagination(swiper);
                },
                slideChange(swiper) {
                    updatePagination(swiper);
                }
            }
        });
        function createPagination(swiper) {
            const pagination = slider.querySelector(".pagination2");
            if (!pagination) return;
            pagination.innerHTML = "";
            const maxDots = window.innerWidth <= 576 ? 6 : 10;
            const dotsCount = Math.min(swiper.slides.length, maxDots);
            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                dot.addEventListener("click", (() => {
                    swiper.slideTo(i);
                }));
                pagination.appendChild(dot);
            }
        }
        function updatePagination(swiper) {
            const dots = slider.querySelectorAll(".pagination2 .dot");
            if (!dots.length) return;
            const activeDot = swiper.activeIndex % dots.length;
            dots.forEach(((dot, index) => {
                dot.classList.toggle("active", index === activeDot);
            }));
        }
        window.addEventListener("resize", (() => {
            createPagination(swiper);
            updatePagination(swiper);
        }));
    }));
    window["FLS"] = true;
})();