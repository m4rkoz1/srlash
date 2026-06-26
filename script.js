/* ==========================================================================
   SR LASH - STUDIO DE BELEZA
   Interatividade e Comportamentos (ciliosrecreio.com.br)
   ========================================================================== */

// --- CONFIGURAÇÃO CENTRAL ---
// Altere o número abaixo com o DDD (apenas números, incluindo 55 para o Brasil)
// Exemplo: '5521988888888' para o DDD 21
const WHATSAPP_PHONE = '5521977226901';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Configurações Dinâmicas
    setupWhatsAppLinks();
    setupMobileMenu();
    setupHeaderScroll();
    setupScrollAnimations();
    setupGalleryFilter();
    setupGalleryLightbox();
    setupTestimonialsCarousel();
    setupInstagramCarousel();
    setupFaqAccordion();
    setupActiveNavLinkOnScroll();
});

/**
 * 1. Atualiza todos os links do WhatsApp na página dinamicamente
 * baseado no número configurado na constante WHATSAPP_PHONE.
 */
function setupWhatsAppLinks() {
    const waLinks = document.querySelectorAll('a[href*="wa.me/"]');
    waLinks.forEach(link => {
        const currentHref = link.getAttribute('href');
        try {
            // Extrai a mensagem pré-definida, se existir
            const urlObj = new URL(currentHref);
            const textParam = urlObj.searchParams.get('text');
            
            // Constrói a nova URL com o número correto
            let newHref = `https://wa.me/${WHATSAPP_PHONE}`;
            if (textParam) {
                newHref += `?text=${encodeURIComponent(textParam)}`;
            }
            link.setAttribute('href', newHref);
        } catch (e) {
            // Fallback caso a URL não seja parseável diretamente
            if (currentHref.includes('text=')) {
                const parts = currentHref.split('text=');
                link.setAttribute('href', `https://wa.me/${WHATSAPP_PHONE}?text=${parts[1]}`);
            } else {
                link.setAttribute('href', `https://wa.me/${WHATSAPP_PHONE}`);
            }
        }
    });
}

/**
 * 2. Menu Mobile Sanduíche e Overlay
 */
function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('mobileOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        toggleBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
        overlay.classList.toggle('active');
        // Trava o scroll do body quando o menu está aberto
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    }

    function closeMenu() {
        toggleBtn.classList.remove('open');
        navMenu.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // Fecha o menu ao clicar em qualquer link da navegação
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/**
 * 3. Efeito no Header ao Rolar a Página
 */
function setupHeaderScroll() {
    const header = document.querySelector('.main-header');
    
    function checkScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Verifica no carregamento inicial
}

/**
 * 4. Animação de Scroll (Fade in Up) usando Intersection Observer
 */
function setupScrollAnimations() {
    const animElements = document.querySelectorAll('.fade-in-up');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                    // Uma vez animado, não precisa observar novamente
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // Dispara um pouco antes de entrar totalmente
        });
        
        animElements.forEach(el => observer.observe(el));
    } else {
        // Fallback para navegadores antigos
        animElements.forEach(el => el.classList.add('appear'));
    }
}

/**
 * 5. Filtro de Categorias na Galeria
 */
function setupGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe ativa de todos os botões e adiciona no clicado
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Mostrar com animação suave
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Esconder com animação suave
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400); // Aguarda o fim da transição do CSS (0.4s)
                }
            });
        });
    });
}

/**
 * 6. Lightbox da Galeria (Visualização de Imagens em Tela Cheia)
 */
function setupGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImg');
    const captionText = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h4').textContent;
            
            modal.style.display = 'block';
            modalImg.src = img.src;
            captionText.innerHTML = title;
            document.body.style.overflow = 'hidden'; // Trava scroll da página
        });
    });
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Libera scroll
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    // Fecha clicando fora da imagem
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === closeBtn) {
            closeModal();
        }
    });

    // Tecla ESC fecha o modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

/**
 * 7. Carrossel de Depoimentos
 */
function setupTestimonialsCarousel() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let carouselInterval;
    
    function showTestimonial(index) {
        cards.forEach((card, i) => {
            card.classList.remove('active');
            dots[i].classList.remove('active');
            if (i === index) {
                card.classList.add('active');
                dots[i].classList.add('active');
            }
        });
        currentIndex = index;
    }
    
    function nextTestimonial() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= cards.length) {
            nextIndex = 0;
        }
        showTestimonial(nextIndex);
    }
    
    // Controle por cliques nos pontinhos
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            resetAutoplay();
        });
    });
    
    // Inicia rotação automática (a cada 6 segundos)
    function startAutoplay() {
        carouselInterval = setInterval(nextTestimonial, 6000);
    }
    
    function resetAutoplay() {
        clearInterval(carouselInterval);
        startAutoplay();
    }
    
    startAutoplay();
}

/**
 * 8. Acordeão de Perguntas Frequentes (FAQ)
 */
function setupFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            const isOpen = faqItem.classList.contains('active');
            
            // Fecha todos os FAQs abertos
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Se não estava aberto, abre o clicado
            if (!isOpen) {
                faqItem.classList.add('active');
                const answer = faqItem.querySelector('.faq-answer');
                // Atribui altura dinâmica para a transição suave de CSS funcionar
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/**
 * 9. Destacar Link Ativo na Navbar ao Rolar a Página
 */
function setupActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // Offset do header fixo
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * 10. Carrossel do Feed do Instagram
 */
function setupInstagramCarousel() {
    const slides = document.querySelectorAll('.insta-slide');
    const prevBtn = document.getElementById('instaPrev');
    const nextBtn = document.getElementById('instaNext');
    
    if (!slides.length || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    let autoplayInterval;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        currentIndex = index;
    }
    
    function nextSlide() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    }
    
    function prevSlide() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }
        showSlide(prevIndex);
    }
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    startAutoplay();
}
