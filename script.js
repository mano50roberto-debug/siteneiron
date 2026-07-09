/* ═══════════════ SCROLL ANIMATIONS ═══════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), +delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.anim').forEach(el => observer.observe(el));

/* ═══════════════ NAV SCROLL ═══════════════ */
const nav = document.getElementById('nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ═══════════════ BURGER MENU ═══════════════ */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ═══════════════ FAQ ACCORDION ═══════════════ */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ═══════════════ COUNTER ANIMATION ═══════════════ */
const counters = document.querySelectorAll('.stat-num[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.count;
      const duration = 1500;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ═══════════════ SMOOTH SCROLL ═══════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = nav.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ═══════════════ MOBILE CTA VISIBILITY ═══════════════ */
const mobileCta = document.getElementById('mobileCta');
const heroSection = document.getElementById('hero');
const mobileObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    mobileCta.style.transform = entry.isIntersecting ? 'translateY(100%)' : 'translateY(0)';
  });
}, { threshold: 0.3 });
mobileCta.style.transition = 'transform .3s ease';
mobileObserver.observe(heroSection);

/* ═══════════════ TELEGRAM CHAT SIMULATOR ═══════════════ */
// URL веб-приложения Google Apps Script для отправки данных в Google Таблицы
const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwGI8eTYZZs9Gc82Sg9oetDyjdrSqVKAVeNhmIzdU2XG_hV9V2mVXudAlnNXmEs24RDaA/exec';

document.addEventListener('DOMContentLoaded', () => {
  // Координаты мыши для кастомного курсора и интерактива волны
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  const chatContainer = document.getElementById('chatContainer');
  const chatToggleBtn = document.getElementById('chatToggleBtn');
  const chatWidget = document.getElementById('chatWidget');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatBadge = document.getElementById('chatBadge');
  const chatBody = document.getElementById('chatBody');
  const heroDemoBtn = document.getElementById('heroDemoBtn');
  const chatStatus = document.getElementById('chatStatus');

  if (!chatWidget || !chatToggleBtn || !chatBody) return;

  let dialogueStarted = false;
  const userData = {
    niche: '',
    leads: '',
    channels: '',
    name: '',
    contact: '',
    calculatedPrice: ''
  };

  // Toggle Chat Window
  function toggleChat() {
    const isOpen = chatWidget.classList.contains('open');
    if (isOpen) {
      chatWidget.classList.remove('open');
      chatToggleBtn.classList.remove('active');
    } else {
      chatWidget.classList.add('open');
      chatToggleBtn.classList.add('active');
      hideBadge();
      if (!dialogueStarted) {
        startDialogue();
      }
    }
  }

  // Hide Badge
  function hideBadge() {
    if (chatBadge) {
      chatBadge.style.opacity = '0';
      chatBadge.style.transform = 'scale(0)';
      setTimeout(() => chatBadge.remove(), 300);
    }
  }

  // Attach Event Listeners
  chatToggleBtn.addEventListener('click', toggleChat);
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', toggleChat);

  if (heroDemoBtn) {
    heroDemoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      chatWidget.classList.add('open');
      chatToggleBtn.classList.add('active');
      hideBadge();
      if (!dialogueStarted) {
        startDialogue();
      }
      chatWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Trigger Badge Alert after 2.5 seconds
  setTimeout(() => {
    if (!dialogueStarted && chatBadge) {
      chatBadge.style.display = 'flex';
    }
  }, 2500);

  // Helper to format time
  function getFormattedTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  }

  // Remove typing indicator
  function removeTypingIndicator() {
    const indicator = chatBody.querySelector('.chat-typing');
    if (indicator) indicator.remove();
  }

  // Show typing indicator
  function showTyping() {
    removeTypingIndicator();
    const typingHTML = `
      <div class="chat-typing">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatBody.insertAdjacentHTML('beforeend', typingHTML);
    chatBody.scrollTop = chatBody.scrollHeight;
    if (chatStatus) chatStatus.textContent = 'печать...';
  }

  // Hide typing indicator
  function hideTyping() {
    removeTypingIndicator();
    if (chatStatus) chatStatus.textContent = 'в сети';
  }

  // Add message bubble
  function addMessage(text, sender = 'bot') {
    hideTyping();
    const time = getFormattedTime();
    const msgHTML = `
      <div class="chat-msg ${sender}">
        <div class="chat-bubble">${text}</div>
        <span class="chat-time">${time}</span>
      </div>
    `;
    chatBody.insertAdjacentHTML('beforeend', msgHTML);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Remove existing quick-reply buttons
  function clearButtons() {
    const buttons = chatBody.querySelector('.chat-buttons');
    if (buttons) buttons.remove();
  }

  // Show inline keyboard buttons
  function showButtons(options) {
    clearButtons();
    const btnContainer = document.createElement('div');
    btnContainer.className = 'chat-buttons';
    
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chat-btn';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        addMessage(opt.text, 'user');
        clearButtons();
        opt.action();
      });
      btnContainer.appendChild(btn);
    });

    chatBody.appendChild(btnContainer);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Send lead to Console and Google Sheets
  function sendLeadData(data) {
    console.log("Отправлена заявка в Telegram/Google Sheets:", data);
    
    if (GOOGLE_SHEET_WEBHOOK_URL) {
      const payload = {
        date: new Date().toLocaleString('ru-RU'),
        name: data.name,
        contact: data.contact,
        niche: data.niche,
        leads: data.leads,
        channels: data.channels,
        price: data.calculatedPrice
      };

      fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(() => {
        console.log('Данные успешно отправлены в Google Таблицы (no-cors)');
      })
      .catch(err => {
        console.error('Ошибка отправки в Google Таблицы:', err);
      });
    }
  }

  // Dialogue sequence start
  function startDialogue() {
    dialogueStarted = true;
    nextStep('welcome');
  }

  // Dialogue steps logic
  function nextStep(actionType) {
    showTyping();
    setTimeout(() => {
      if (actionType === 'welcome') {
        addMessage('Привет! Я AI-ассистент НЕЙРОН. Помогаю бизнесу автоматизировать ответы клиентам 24/7.<br><br>Хотите рассчитать ориентировочную стоимость внедрения под ваш проект за пару простых вопросов?');
        showButtons([
          { text: 'Рассчитать 💸', action: () => nextStep('pricing_niche') },
          { text: 'Как работает? 🤖', action: () => nextStep('how_it_works') }
        ]);
      } 
      else if (actionType === 'how_it_works') {
        addMessage('Я мгновенно (за 3 сек) отвечаю на вопросы ваших клиентов в Telegram, отправляю прайсы, собираю контакты и заношу их в Google Таблицу или CRM.');
        showButtons([
          { text: 'Рассчитать стоимость 💸', action: () => nextStep('pricing_niche') }
        ]);
      } 
      else if (actionType === 'pricing_niche') {
        addMessage('Вопрос 1 из 3: Какая сфера вашего бизнеса?');
        showButtons([
          { text: 'Услуги и ремонт 🛠️', action: () => { userData.niche = 'Услуги и ремонт'; nextStep('pricing_leads'); } },
          { text: 'Интернет-магазин / Продажи 📦', action: () => { userData.niche = 'Интернет-магазин / Продажи'; nextStep('pricing_leads'); } },
          { text: 'Инфобизнес / Онлайн-школа 🎓', action: () => { userData.niche = 'Инфобизнес / Онлайн-школа'; nextStep('pricing_leads'); } },
          { text: 'Общепит / Доставка еды 🍕', action: () => { userData.niche = 'Общепит / Доставка еды'; nextStep('pricing_leads'); } },
          { text: 'Недвижимость / Аренда 🏠', action: () => { userData.niche = 'Недвижимость / Аренда'; nextStep('pricing_leads'); } },
          { text: 'Медицина и Красота 💅', action: () => { userData.niche = 'Медицина и Красота'; nextStep('pricing_leads'); } },
          { text: 'Свой вариант (вписать) ✍️', action: () => nextStep('pricing_niche_custom') }
        ]);
      }
      else if (actionType === 'pricing_niche_custom') {
        addMessage('Напишите вашу сферу бизнеса:');
        const formHTML = `
          <div class="chat-form anim" style="opacity:1; transform:none;">
            <input type="text" class="chat-form-input" id="customNiche" placeholder="Например: Аренда авто..." required autocomplete="off">
            <button class="chat-form-submit" id="customNicheSubmit">Отправить</button>
          </div>
        `;
        chatBody.insertAdjacentHTML('beforeend', formHTML);
        chatBody.scrollTop = chatBody.scrollHeight;
        
        document.getElementById('customNicheSubmit').addEventListener('click', () => {
          const nicheInput = document.getElementById('customNiche');
          if (nicheInput.value.trim()) {
            userData.niche = nicheInput.value.trim();
            addMessage(userData.niche, 'user');
            chatBody.querySelector('.chat-form').remove();
            nextStep('pricing_leads');
          }
        });
      }
      else if (actionType === 'pricing_leads') {
        addMessage('Вопрос 2 из 3: Сколько примерно заявок/сообщений вы получаете в месяц?');
        showButtons([
          { text: 'До 100 заявок 📈', action: () => { userData.leads = 'До 100'; nextStep('pricing_channels'); } },
          { text: '100 - 500 заявок 📊', action: () => { userData.leads = '100-500'; nextStep('pricing_channels'); } },
          { text: 'Более 500 заявок 🚀', action: () => { userData.leads = 'Более 500'; nextStep('pricing_channels'); } }
        ]);
      } 
      else if (actionType === 'pricing_channels') {
        addMessage('Вопрос 3 из 3: В какие мессенджеры чаще всего пишут ваши клиенты?');
        showButtons([
          { text: 'Только в Telegram 💬', action: () => { userData.channels = 'Telegram'; nextStep('show_calculation'); } },
          { text: 'Telegram + WhatsApp 📱', action: () => { userData.channels = 'Telegram+WhatsApp'; nextStep('show_calculation'); } },
          { text: 'Везде (включая сайт) 🌐', action: () => { userData.channels = 'Мультиканал'; nextStep('show_calculation'); } }
        ]);
      } 
      else if (actionType === 'show_calculation') {
        let priceRange = '';
        if (userData.leads === 'До 100') {
          priceRange = 'от 25 000 до 40 000 руб.';
        } else if (userData.leads === '100-500') {
          priceRange = 'от 40 000 до 65 000 руб.';
        } else {
          priceRange = 'от 65 000 до 95 000+ руб.';
        }
        userData.calculatedPrice = priceRange;

        addMessage(`На основе ваших ответов для ниши "${userData.niche}" с объемом заявок "${userData.leads}/мес" стоимость разработки и внедрения ассистента составит:`);
        addMessage(`👉 **${priceRange}**`);
        addMessage('В эту стоимость входит написание сценария, интеграция с таблицами/CRM и техническая поддержка.');
        
        showButtons([
          { text: 'Оставить контакты 📝', action: () => nextStep('collect_name') },
          { text: 'Рассчитать заново 🔄', action: () => {
            userData.niche = '';
            userData.leads = '';
            userData.channels = '';
            userData.calculatedPrice = '';
            nextStep('pricing_niche');
          }}
        ]);
      } 
      else if (actionType === 'collect_name') {
        addMessage('Как мне к вам обращаться?');
        
        const formHTML = `
          <div class="chat-form anim" style="opacity:1; transform:none;">
            <input type="text" class="chat-form-input" id="formName" placeholder="Ваше имя..." required autocomplete="off">
            <button class="chat-form-submit" id="formNameSubmit">Отправить</button>
          </div>
        `;
        chatBody.insertAdjacentHTML('beforeend', formHTML);
        chatBody.scrollTop = chatBody.scrollHeight;
        
        document.getElementById('formNameSubmit').addEventListener('click', () => {
          const nameInput = document.getElementById('formName');
          if (nameInput.value.trim()) {
            userData.name = nameInput.value.trim();
            addMessage(userData.name, 'user');
            chatBody.querySelector('.chat-form').remove();
            nextStep('collect_contact');
          }
        });
      } 
      else if (actionType === 'collect_contact') {
        addMessage(`Приятно познакомиться, ${userData.name}! Пожалуйста, оставьте ваш телефон или Telegram @username для связи.`);
        
        const formHTML = `
          <div class="chat-form anim" style="opacity:1; transform:none;">
            <input type="text" class="chat-form-input" id="formContact" placeholder="Телефон или @username..." required autocomplete="off">
            <button class="chat-form-submit" id="formContactSubmit">Готово</button>
          </div>
        `;
        chatBody.insertAdjacentHTML('beforeend', formHTML);
        chatBody.scrollTop = chatBody.scrollHeight;

        document.getElementById('formContactSubmit').addEventListener('click', () => {
          const contactInput = document.getElementById('formContact');
          if (contactInput.value.trim()) {
            userData.contact = contactInput.value.trim();
            addMessage(userData.contact, 'user');
            chatBody.querySelector('.chat-form').remove();
            nextStep('finish');
          }
        });
      } 
      else if (actionType === 'finish') {
        addMessage('Спасибо! Заявка успешно принята. Бот зафиксировал её и отправил менеджеру.');
        addMessage('Мы свяжемся с вами в течение 5 минут. Отличного дня! 😊');
        
        sendLeadData(userData);
      }
    }, 1200);
  }

  // ═══════════════ CUSTOM CURSOR LOGIC ═══════════════ 
  const cursor = document.getElementById('customCursor');
  const cursorDot = document.getElementById('customCursorDot');

  if (cursor && cursorDot) {
    let cursorX = 0;
    let cursorY = 0;

    // Отслеживаем реальные координаты мыши
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Маленькая точка следует мгновенно
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    // Функция плавного движения (интерполяция) для внешнего круга
    const renderCursor = () => {
      const ease = 0.15;
      
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      requestAnimationFrame(renderCursor);
    };
    
    // Запускаем анимацию курсора
    requestAnimationFrame(renderCursor);

    // Добавление класса .hovered при наведении на интерактивные элементы
    const addHoverClass = () => cursor.classList.add('hovered');
    const removeHoverClass = () => cursor.classList.remove('hovered');

    const updateHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, [role="button"], input, select, textarea, .faq-q, .chat-btn, .pain-card, .sol-card, .adv-card, .service-card, .testimonial, .about-mini');
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', addHoverClass);
        el.removeEventListener('mouseleave', removeHoverClass);
        el.addEventListener('mouseenter', addHoverClass);
        el.addEventListener('mouseleave', removeHoverClass);
      });
    };

    updateHoverListeners();

    // Обновляем слушателей при изменении контента в чате (появление кнопок, форм)
    const chatObserver = new MutationObserver(() => {
      updateHoverListeners();
    });
    if (chatBody) {
      chatObserver.observe(chatBody, { childList: true, subtree: true });
    }
  }

  // ═══════════════ 3D NEON WAVE LOGIC (CANVAS) ═══════════════
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Параметры 3D сетки волны (адаптивная плотность для мобильных устройств)
    const isMobile = window.innerWidth < 768;
    const cols = isMobile ? 18 : 36;
    const rows = isMobile ? 14 : 28;
    const spacingX = isMobile ? 140 : 70; // Увеличиваем шаг, чтобы сохранить общую ширину
    const spacingZ = isMobile ? 150 : 75; // Увеличиваем шаг, чтобы сохранить общую глубину
    const zOffset = 50; // Сдвиг по глубине для предотвращения клиппинга на переднем плане
    
    const gridWidth = (cols - 1) * spacingX;
    const gridDepth = (rows - 1) * spacingZ;
    
    let time = 0;
    const waveSpeed = 0.012;
    const waveFrequencyX = isMobile ? 0.16 : 0.08;
    const waveFrequencyZ = isMobile ? 0.18 : 0.09;
    const waveAmplitude = 55;
    
    const camera = {
      x: 0,
      y: -260,
      z: -350
    };
    
    // Массив частиц (пылинок) над волной
    const particles = [];
    const particleCount = isMobile ? 25 : 75;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * gridWidth * 1.5,
        y: -100 - Math.random() * 200,
        z: Math.random() * gridDepth + zOffset,
        size: Math.random() * 1.5 + 0.5,
        speedY: Math.random() * 0.2 + 0.05,
        amplitude: Math.random() * 10,
        angle: Math.random() * Math.PI * 2
      });
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 100);
    });

    const fov = 380; 
    
    function project(point) {
      const dx = point.x - camera.x;
      const dy = point.y - camera.y;
      const dz = point.z - camera.z;
      
      if (dz <= 0) return null;
      
      const scale = fov / dz;
      return {
        x: width / 2 + dx * scale,
        y: height / 2 + dy * scale,
        scale: scale
      };
    }

    const animateWave = () => {
      ctx.fillStyle = '#040209';
      ctx.fillRect(0, 0, width, height);
      
      // Плавная реакция камеры на координаты мыши
      const mouseFactorX = (mouseX / width - 0.5) * 180;
      const mouseFactorY = (mouseY / height - 0.5) * 120;
      
      camera.x += (mouseFactorX - camera.x) * 0.05;
      camera.y += ((-260 + mouseFactorY) - camera.y) * 0.05;
      
      time += waveSpeed;
      
      const projectedGrid = [];
      
      for (let r = 0; r < rows; r++) {
        projectedGrid[r] = [];
        for (let c = 0; c < cols; c++) {
          const x = c * spacingX - gridWidth / 2;
          const z = r * spacingZ + zOffset;
          
          const angleX = (c * waveFrequencyX) + time;
          const angleZ = (r * waveFrequencyZ) - (time * 0.7);
          // Органическая интерполяция волны
          const y = Math.sin(angleX) * Math.cos(angleZ) * waveAmplitude + Math.sin(c * 0.04 - time * 0.5) * 12;
          
          projectedGrid[r][c] = project({ x, y, z });
        }
      }
      
      ctx.lineWidth = 1.0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p1 = projectedGrid[r][c];
          if (!p1) continue;
          
          const depthRatio = r / (rows - 1);
          const colRatio = c / (cols - 1);
          // Красивое затухание по краям и к горизонту
          let alpha = Math.sin(depthRatio * Math.PI) * Math.sin(colRatio * Math.PI) * 0.35;
          
          if (alpha <= 0.01) continue;
          
          ctx.strokeStyle = `rgba(124, 92, 252, ${alpha})`;
          
          // Горизонтальные линии
          if (c < cols - 1) {
            const p2 = projectedGrid[r][c + 1];
            if (p2) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
          
          // Вертикальные линии
          if (r < rows - 1) {
            const p2 = projectedGrid[r + 1][c];
            if (p2) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          // Диагональные линии (треугольная сетка как на референсе)
          if (c < cols - 1 && r < rows - 1) {
            const p2 = projectedGrid[r + 1][c + 1];
            if (p2) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }
      
      // Узлы (ноды) сетки в стиле референса
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = projectedGrid[r][c];
          if (!p) continue;
          
          const depthRatio = r / (rows - 1);
          const colRatio = c / (cols - 1);
          let alpha = Math.sin(depthRatio * Math.PI) * Math.sin(colRatio * Math.PI);
          
          if (alpha <= 0.02) continue;
          
          // Светлые сиренево-белые центры
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
          
          // Некоторые узлы крупнее и ярче
          let isMajorNode = (r % 2 === 0 && c % 2 === 0);
          let sizeMultiplier = isMajorNode ? 2.0 : 0.9;
          const size = Math.max(0.2, (sizeMultiplier * p.scale * 0.6));
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();

          // Дополнительное неоновое свечение для крупных узлов
          if (isMajorNode && alpha > 0.25) {
            ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 0.35})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      
      // Летающие частицы (пылинки)
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        
        p.y += p.speedY;
        p.angle += 0.01;
        const currentX = p.x + Math.sin(p.angle) * p.amplitude * 0.3;
        
        if (p.y > 100) {
          p.y = -200 - Math.random() * 200;
          p.x = (Math.random() - 0.5) * gridWidth * 1.5;
        }
        
        const proj = project({ x: currentX, y: p.y, z: p.z });
        if (!proj) continue;
        
        const alpha = Math.max(0, Math.min(0.65, 1.0 - (p.z / (gridDepth + zOffset)) * 1.2));
        if (alpha <= 0.01) continue;
        
        ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 0.75})`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, p.size * (proj.scale / 1.2), 0, Math.PI * 2);
        ctx.fill();
      }
      
      requestAnimationFrame(animateWave);
    };
    
    animateWave();
  }
});