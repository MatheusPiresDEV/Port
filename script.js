document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. CÁLCULO DINÂMICO DE IDADE (12/11/2006)
  // ==========================================
  const ageElement = document.getElementById('userAge');
  if (ageElement) {
    const birthDate = new Date(2006, 10, 12); // Mês no JS é base zero (10 = Novembro)
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    ageElement.textContent = age;
  }

  // ==========================================
  // 2. CÁLCULO DINÂMICO DO PROGRESSO DE CURSO
  // ==========================================
  const ongoingCourses = document.querySelectorAll('.ongoing-course');

  ongoingCourses.forEach(course => {
    const startAttr = course.getAttribute('data-start'); // Formato: "AAAA-MM"
    const endAttr = course.getAttribute('data-end');     // Formato: "AAAA-MM"

    if (startAttr && endAttr) {
      const startDate = new Date(`${startAttr}-01T00:00:00`);
      const endDate = new Date(`${endAttr}-01T00:00:00`);
      const today = new Date();

      const totalTime = endDate.getTime() - startDate.getTime();
      const elapsedTime = today.getTime() - startDate.getTime();

      let percentage = Math.floor((elapsedTime / totalTime) * 100);

      // Trava os limites em 0% e 100%
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      // Atualiza o texto da porcentagem no cabeçalho
      const percentLabel = course.querySelector('.calc-percent');
      if (percentLabel) {
        percentLabel.textContent = `${percentage}%`;
      }

      // Cria a estrutura visual da Barra de Progresso em HTML
      const progressContainer = document.createElement('div');
      progressContainer.className = 'progress-container';
      progressContainer.innerHTML = `
        <div class="progress-info">
          <span>Progresso da Formação</span>
          <span>${percentage}% Concluído</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: 0%"></div>
        </div>
      `;

      course.appendChild(progressContainer);

      // Anima o preenchimento da barra
      setTimeout(() => {
        const fillBar = progressContainer.querySelector('.progress-bar-fill');
        if (fillBar) {
          fillBar.style.width = `${percentage}%`;
        }
      }, 200);
    }
  });

  // ==========================================
  // 3. MENU HAMBÚRGUER MOBILE
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      icon.className = navMenu.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  // ==========================================
  // 4. EFEITO TYPEWRITER
  // ==========================================
  const typewriterElement = document.getElementById('typewriter');
  const phrases = [
    "Analista de BI & Dados | Power BI, SQL & DAX | Estudante de Ciência de Dados",
    "BI & Data Analyst | Power BI, SQL & DAX | Data Science student"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let nextSpeed = isDeleting ? 20 : 40;

    if (!isDeleting && charIndex === currentPhrase.length) {
      nextSpeed = 2500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      nextSpeed = 400;
    }

    setTimeout(typeEffect, nextSpeed);
  }

  if (typewriterElement) typeEffect();

  // ==========================================
  // 5. NAVEGAÇÃO POR TABS DOS PROJETOS
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const parentCard = button.closest('.project-card');
      const targetTabId = button.getAttribute('data-tab');

      parentCard.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      parentCard.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

      button.classList.add('active');
      const targetContent = parentCard.querySelector(`#${targetTabId}`);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // ==========================================
  // 6. CARROSSEL DE IMAGENS
  // ==========================================
  const carousels = document.querySelectorAll('.carousel-container');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-nav.prev');
    const nextBtn = carousel.querySelector('.carousel-nav.next');
    const indicatorsContainer = carousel.querySelector('.carousel-indicators');

    if (slides.length <= 1) {
      carousel.classList.add('no-carousel');
      return;
    }

    let currentIndex = 0;

    if (indicatorsContainer) {
      indicatorsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        indicatorsContainer.appendChild(dot);
      });
    }

    const dots = indicatorsContainer ? indicatorsContainer.querySelectorAll('.carousel-dot') : [];

    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentIndex));
    }

    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
      });
    }
  });

  // ==========================================
  // 7. PROJETOS FIXOS & PAGINAÇÃO
  // ==========================================
  const ITEMS_PER_PAGE = 3;
  let currentPage = 1;
  let currentFilter = 'all';

  const container = document.getElementById('projectsContainer');
  const paginationControls = document.getElementById('paginationControls');

  if (container) {
    let allCards = Array.from(container.querySelectorAll('.project-card'));

    allCards.sort((a, b) => {
      const aPinned = a.getAttribute('data-pinned') === 'true';
      const bPinned = b.getAttribute('data-pinned') === 'true';
      return bPinned - aPinned;
    });

    allCards.forEach(card => container.appendChild(card));

    function renderProjects() {
      const filteredCards = allCards.filter(card => {
        const category = card.getAttribute('data-category');
        return currentFilter === 'all' || category === currentFilter;
      });

      const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);

      if (currentPage > totalPages) currentPage = totalPages || 1;

      allCards.forEach(card => card.style.display = 'none');

      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const cardsToDisplay = filteredCards.slice(start, end);

      cardsToDisplay.forEach(card => card.style.display = 'block');

      renderPaginationControls(totalPages);
    }

    function renderPaginationControls(totalPages) {
      if (!paginationControls) return;
      paginationControls.innerHTML = '';

      if (totalPages <= 1) return;

      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.classList.add('page-btn');
        if (i === currentPage) btn.classList.add('active');
        btn.textContent = i;
        btn.addEventListener('click', () => {
          currentPage = i;
          renderProjects();
          document.getElementById('projetos').scrollIntoView({ behavior: 'smooth' });
        });
        paginationControls.appendChild(btn);
      }
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        currentFilter = button.getAttribute('data-filter');
        currentPage = 1;
        renderProjects();
      });
    });

    renderProjects();
  }

  // ==========================================
  // 8. BOTÃO VOLTAR AO TOPO
  // ==========================================
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});