(() => {
    "use strict";
    document.addEventListener("DOMContentLoaded", (() => {
        const section = document.querySelector(".about");
        const counters = document.querySelectorAll(".about__stats-number");
        if (!section || !counters.length) return;
        let started = false;
        function animateCounter(counter) {
            const target = counter.dataset.target;
            const prefix = counter.dataset.prefix || "";
            const suffix = counter.dataset.suffix || "";
            if (target === "" || isNaN(target)) {
                counter.textContent = `${prefix}${suffix}`;
                return;
            }
            const number = Number(target);
            let current = 0;
            const duration = 2e3;
            const increment = number / (duration / 16);
            function updateCounter() {
                current += increment;
                if (current < number) {
                    counter.textContent = `${prefix}${Math.floor(current)}${suffix}`;
                    requestAnimationFrame(updateCounter);
                } else counter.textContent = `${prefix}${number}${suffix}`;
            }
            updateCounter();
        }
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
    document.querySelectorAll(".faq-fields").forEach((faq => {
        faq.querySelectorAll(".faq-fields__item.active").forEach((item => {
            const content = item.querySelector(".faq-fields__content");
            content.style.height = "auto";
        }));
        faq.querySelectorAll(".faq-fields__item").forEach((item => {
            const header = item.querySelector(".faq-fields__top");
            const content = item.querySelector(".faq-fields__content");
            const link = item.querySelector("a.title");
            if (link) link.addEventListener("click", (e => {
                if (!item.classList.contains("active")) e.preventDefault();
            }));
            header.addEventListener("click", (e => {
                if (link && item.classList.contains("active") && e.target.closest("a.title")) return;
                const isOpen = item.classList.contains("active");
                faq.querySelectorAll(".faq-fields__item.active").forEach((activeItem => {
                    if (activeItem === item) return;
                    const activeContent = activeItem.querySelector(".faq-fields__content");
                    activeContent.style.height = activeContent.scrollHeight + "px";
                    requestAnimationFrame((() => {
                        activeContent.style.height = "0px";
                    }));
                    activeItem.classList.remove("active");
                }));
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
                    }), {
                        once: true
                    });
                }
            }));
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
            autoHeight: true,
            observer: true,
            observeParents: true,
            effect: "fade",
            fadeEffect: {
                crossFade: true
            },
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
    document.querySelectorAll(".response").forEach((section => {
        const columns = section.querySelectorAll(".response__column");
        columns.forEach((column => {
            let isDragging = false;
            let startY = 0;
            let startScrollTop = 0;
            column.addEventListener("mousedown", (e => {
                isDragging = true;
                startY = e.clientY;
                startScrollTop = column.scrollTop;
                column.classList.add("dragging");
            }));
            column.addEventListener("mousemove", (e => {
                if (!isDragging) return;
                const delta = e.clientY - startY;
                column.scrollTop = startScrollTop - delta;
            }));
            column.addEventListener("mouseup", (() => {
                isDragging = false;
                column.classList.remove("dragging");
            }));
            column.addEventListener("mouseleave", (() => {
                isDragging = false;
                column.classList.remove("dragging");
            }));
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
            slidesPerView: 3.5,
            spaceBetween: 12,
            speed: 600,
            grabCursor: true,
            loop: true,
            navigation: {
                nextEl: slider.querySelector(".navigation-btn__next"),
                prevEl: slider.querySelector(".navigation-btn__prev")
            },
            breakpoints: {
                1200: {
                    slidesPerView: 3.5
                },
                576: {
                    slidesPerView: 2.3
                },
                0: {
                    slidesPerView: 1
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
            const realSlides = [ ...swiper.slidesEl.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)") ];
            realSlides.forEach(((_, index) => {
                const dot = document.createElement("span");
                dot.className = "dot";
                dot.addEventListener("click", (() => {
                    swiper.slideToLoop(index);
                }));
                pagination.appendChild(dot);
            }));
        }
        function updatePagination(swiper) {
            const dots = slider.querySelectorAll(".pagination2 .dot");
            dots.forEach(((dot, index) => {
                dot.classList.toggle("active", index === swiper.realIndex);
            }));
        }
        window.addEventListener("resize", (() => {
            createPagination(swiper);
            updatePagination(swiper);
        }));
    }));
    document.querySelectorAll(".cards-slider-mob__slider2").forEach((slider => {
        const swiper = new Swiper(slider, {
            speed: 600,
            spaceBetween: 12,
            effect: "slide",
            grabCursor: true,
            slidesPerView: 1,
            breakpoints: {
                577: {
                    slidesPerView: 2
                }
            },
            navigation: {
                nextEl: slider.querySelector(".cards-slider-btn__next"),
                prevEl: slider.querySelector(".cards-slider-btn__prev")
            },
            on: {
                init(swiper) {
                    createPagination(swiper);
                    updatePagination(swiper);
                },
                slideChange(swiper) {
                    updatePagination(swiper);
                },
                breakpoint(swiper) {
                    createPagination(swiper);
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
    document.querySelectorAll(".price__slider").forEach((slider => {
        const swiper = new Swiper(slider, {
            slidesPerView: 1,
            speed: 600,
            spaceBetween: 7,
            effect: "slide",
            autoHeight: true,
            autoHeight: true,
            observer: true,
            observeParents: true,
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
    document.querySelectorAll(".specialty-slider").forEach((slider => {
        const swiper = new Swiper(slider, {
            slidesPerView: 1.1,
            speed: 600,
            spaceBetween: 10,
            effect: "slide",
            autoHeight: true,
            autoHeight: true,
            observer: true,
            observeParents: true,
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
    document.querySelectorAll(".decision-slider").forEach((slider => {
        const swiper = new Swiper(slider, {
            slidesPerView: 1,
            speed: 600,
            spaceBetween: 12,
            effect: "slide",
            autoHeight: true,
            observer: true,
            observeParents: true,
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
    document.addEventListener("DOMContentLoaded", (() => {
        const quizzes = document.querySelectorAll(".quiz");
        quizzes.forEach((quiz => {
            const slides = quiz.querySelectorAll(".quiz-slide");
            const progress = quiz.querySelectorAll(".quiz__progress-item");
            const btnNext = quiz.querySelector(".quiz__button--next");
            const btnPrev = quiz.querySelector(".quiz__button--prev");
            let currentStep = 0;
            const answers = {};
            function showStep(index) {
                slides.forEach((slide => {
                    slide.classList.remove("quiz-slide--active");
                }));
                progress.forEach((item => {
                    item.classList.remove("quiz__progress-item--active");
                }));
                slides[index].classList.add("quiz-slide--active");
                progress[index].classList.add("quiz__progress-item--active");
                btnPrev.disabled = index === 0;
                btnPrev.style.opacity = index === 0 ? ".5" : "1";
                checkSelected();
            }
            function checkSelected() {
                const currentSlide = slides[currentStep];
                if (!currentSlide) return;
                const checked = currentSlide.querySelector('input[type="radio"]:checked');
                if (checked) {
                    btnNext.disabled = false;
                    btnNext.classList.add("active");
                } else {
                    btnNext.disabled = true;
                    btnNext.classList.remove("active");
                }
            }
            quiz.addEventListener("change", (e => {
                if (!e.target.matches('input[type="radio"]')) return;
                answers[e.target.name] = e.target.value;
                checkSelected();
            }));
            btnNext.addEventListener("click", (() => {
                if (currentStep >= slides.length - 1) return;
                currentStep++;
                showStep(currentStep);
            }));
            btnPrev.addEventListener("click", (() => {
                if (currentStep <= 0) return;
                currentStep--;
                showStep(currentStep);
            }));
            progress.forEach(((item, index) => {
                item.addEventListener("click", (() => {
                    if (index <= currentStep) {
                        currentStep = index;
                        showStep(currentStep);
                    }
                }));
            }));
            showStep(currentStep);
        }));
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        const menuLinks = document.querySelectorAll(".menu a");
        if (menuLinks.length) {
            const currentPage = window.location.pathname.split("/").pop() || "index.html";
            menuLinks.forEach((link => {
                const href = link.getAttribute("href");
                if (href === currentPage) link.classList.add("active");
            }));
        }
        const footerLinks = document.querySelectorAll(".footer-menu a");
        if (footerLinks.length) {
            const currentPage = window.location.pathname.split("/").pop() || "index.html";
            footerLinks.forEach((link => {
                const href = link.getAttribute("href");
                if (href === currentPage) link.parentElement.classList.add("active");
            }));
        }
    }));
    window["FLS"] = true;
})();