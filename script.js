const WHATSAPP_PHONE = '5521974691398';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href*="wa.me/"]:not([data-designer-contact])').forEach(link => {
        const url = new URL(link.href);
        url.pathname = `/${WHATSAPP_PHONE}`;
        link.href = url.href;
    });
    setupMobileMenu();
    setupNavigation();
    setupGallery();
    setupFaq();
    setupHeroVideo();
    setupSocialPreview();
    const rail = document.querySelector('.ticker-track');
    document.getElementById('photoRailPrev').addEventListener('click', () => rail.scrollBy({left:-380, behavior:reducedMotion.matches ? 'auto' : 'smooth'}));
    document.getElementById('photoRailNext').addEventListener('click', () => rail.scrollBy({left:380, behavior:reducedMotion.matches ? 'auto' : 'smooth'}));
    setupCarousel('.testimonial-card', '.dot', null, null, 6000);
    setupCarousel('.insta-slide', null, '#instaPrev', '#instaNext', 5000);
    document.querySelectorAll('video').forEach(video => {
        video.addEventListener('play', () => {
            document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
        });
    });
});

function setupMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('navMenu');
    const overlay = document.getElementById('mobileOverlay');
    const mobile = window.matchMedia('(max-width: 1199px)');
    const links = [...nav.querySelectorAll('a')];
    function setOpen(open, restoreFocus = true) {
        nav.classList.toggle('open', open);
        toggle.classList.toggle('open', open);
        overlay.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        document.body.style.overflow = open ? 'hidden' : '';
        links.forEach(link => link.tabIndex = mobile.matches && !open ? -1 : 0);
        if (open) links[0]?.focus();
        else if (restoreFocus) toggle.focus();
    }
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    overlay.addEventListener('click', () => setOpen(false));
    links.forEach(link => link.addEventListener('click', () => setOpen(false, false)));
    document.addEventListener('keydown', event => {
        if (!nav.classList.contains('open')) return;
        if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
        if (event.key === 'Tab') {
            const focusable = [toggle, ...links];
            const index = focusable.indexOf(document.activeElement);
            if (event.shiftKey && index <= 0) { event.preventDefault(); focusable.at(-1).focus(); }
            if (!event.shiftKey && index === focusable.length - 1) { event.preventDefault(); toggle.focus(); }
        }
    });
    mobile.addEventListener('change', () => setOpen(false, false));
    setOpen(false, false);
}

function setupNavigation() {
    const header = document.querySelector('.main-header');
    const sections = [...document.querySelectorAll('section[id]')];
    const links = [...document.querySelectorAll('.nav-link[href^="#"]')];
    let pending = false;
    function update() {
        const position = window.scrollY + header.offsetHeight + 40;
        let current = sections[0]?.id;
        sections.forEach(section => { if (section.offsetTop <= position) current = section.id; });
        header.classList.toggle('scrolled', window.scrollY > 30);
        links.forEach(link => {
            const active = link.hash === `#${current}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
        pending = false;
    }
    window.addEventListener('scroll', () => {
        if (!pending) { pending = true; requestAnimationFrame(update); }
    }, {passive:true});
    update();
}

function setupGallery() {
    const items = [...document.querySelectorAll('.gallery-item')];
    const filters = [...document.querySelectorAll('.filter-btn')];
    const modal = document.getElementById('lightboxModal');
    const image = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const close = document.getElementById('lightboxClose');
    let opener;
    filters.forEach(button => {
        button.setAttribute('aria-pressed', String(button.classList.contains('active')));
        button.addEventListener('click', () => {
            filters.forEach(other => {
                other.classList.toggle('active', other === button);
                other.setAttribute('aria-pressed', String(other === button));
            });
            items.forEach(item => { item.hidden = button.dataset.filter !== 'all' && item.dataset.category !== button.dataset.filter; });
        });
    });
    function open(item) {
        opener = item;
        const thumbnail = item.matches('img') ? item : item.querySelector('img');
        image.src = thumbnail.src;
        image.alt = thumbnail.alt;
        caption.textContent = item.querySelector('h4')?.textContent || thumbnail.alt;
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        close.focus();
    }
    function dismiss() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        opener?.focus({preventScroll:true});
    }
    const photos = [...items, ...document.querySelectorAll('.insta-slide img, .ticker-items img')];
    photos.forEach(item => {
        item.tabIndex = item.closest('[aria-hidden="true"]') ? -1 : 0;
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Ampliar foto: ${(item.matches('img') ? item : item.querySelector('img')).alt}`);
        item.addEventListener('click', () => open(item));
        item.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(item); }
        });
    });
    close.addEventListener('click', dismiss);
    modal.addEventListener('click', event => { if (event.target === modal) dismiss(); });
    document.addEventListener('keydown', event => {
        if (modal.getAttribute('aria-hidden') === 'true') return;
        if (event.key === 'Escape') dismiss();
        if (event.key === 'Tab') { event.preventDefault(); close.focus(); }
    });
}

function setupFaq() {
    const items = [...document.querySelectorAll('.faq-item')];
    items.forEach((item, index) => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        button.id = `faq-question-${index}`;
        answer.id = `faq-answer-${index}`;
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', answer.id);
        answer.setAttribute('role', 'region');
        answer.setAttribute('aria-labelledby', button.id);
        answer.setAttribute('aria-hidden', 'true');
        button.addEventListener('click', () => {
            const open = !item.classList.contains('active');
            items.forEach(other => {
                const active = other === item && open;
                other.classList.toggle('active', active);
                other.querySelector('.faq-question').setAttribute('aria-expanded', String(active));
                other.querySelector('.faq-answer').setAttribute('aria-hidden', String(!active));
                other.querySelector('.faq-answer').style.maxHeight = active ? other.querySelector('.faq-answer').scrollHeight + 'px' : '';
            });
        });
    });
    window.addEventListener('resize', () => {
        items.filter(item => item.classList.contains('active')).forEach(item => {
            const answer = item.querySelector('.faq-answer');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        });
    });
}

function setupCarousel(selector, dotSelector, previousSelector, nextSelector, interval) {
    const slides = [...document.querySelectorAll(selector)];
    if (!slides.length) return;
    const dots = dotSelector ? [...document.querySelectorAll(dotSelector)] : [];
    const root = slides[0].parentElement;
    const controls = nextSelector ? root.parentElement : document.getElementById('depoimentos');
    let index = 0, timer;
    function show(next) {
        index = (next + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            slide.setAttribute('aria-hidden', String(i !== index));
            slide.querySelectorAll('img[role="button"]').forEach(photo => photo.tabIndex = i === index ? 0 : -1);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.setAttribute('aria-pressed', String(i === index));
        });
    }
    function stop() { clearInterval(timer); }
    function start() {
        stop();
        if (!reducedMotion.matches && !document.hidden && !controls.matches(':hover') && !controls.contains(document.activeElement)) timer = setInterval(() => {
            if (document.getElementById('lightboxModal').getAttribute('aria-hidden') === 'true') show(index + 1);
        }, interval);
    }
    dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
    if (previousSelector) document.querySelector(previousSelector)?.addEventListener('click', () => { show(index - 1); start(); });
    if (nextSelector) document.querySelector(nextSelector)?.addEventListener('click', () => { show(index + 1); start(); });
    controls.addEventListener('mouseenter', stop);
    controls.addEventListener('mouseleave', start);
    controls.addEventListener('focusin', stop);
    controls.addEventListener('focusout', () => queueMicrotask(start));
    document.addEventListener('visibilitychange', start);
    reducedMotion.addEventListener('change', start);
    show(0); start();
}

function setupHeroVideo() {
    const video = document.getElementById('heroVideo');
    const button = document.getElementById('heroVideoControl');
    async function begin() {
        try { await video.play(); }
        catch {
            video.muted = true;
            try { await video.play(); } catch { /* Native controls remain available. */ }
        }
        update();
    }
    function update() {
        button.textContent = video.paused ? 'Reproduzir vídeo' : video.muted ? 'Ativar áudio' : 'Silenciar áudio';
        button.setAttribute('aria-label', button.textContent);
    }
    button.addEventListener('click', async () => {
        if (video.paused) video.muted = false;
        else video.muted = !video.muted;
        try { await video.play(); } catch { /* The video also has native controls. */ }
        update();
    });
    ['play', 'pause', 'volumechange'].forEach(event => video.addEventListener(event, update));
    begin();
}

function setupSocialPreview() {
    const widget = document.getElementById('socialPreview');
    const toggle = document.getElementById('socialPreviewToggle');
    const content = document.getElementById('socialPreviewContent');
    const tabs = [...widget.querySelectorAll('[data-social]')];
    const panels = [...widget.querySelectorAll('.social-panel')];
    function setOpen(open) {
        content.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Minimizar prévias das redes sociais' : 'Abrir prévias das redes sociais');
        toggle.querySelector('span').textContent = open ? '−' : '+';
    }
    toggle.addEventListener('click', () => setOpen(content.hidden));
    tabs.forEach(tab => tab.addEventListener('click', () => {
        tabs.forEach(other => other.setAttribute('aria-pressed', String(other === tab)));
        panels.forEach(panel => {
            panel.hidden = panel.id !== tab.dataset.social;
            const frame = panel.querySelector('iframe');
            if (!panel.hidden && !frame.src) frame.src = frame.dataset.src;
        });
    }));
    setOpen(window.innerWidth > 767);
}
