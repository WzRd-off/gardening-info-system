import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function MainPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToServices = (e) => {
    e.preventDefault();
    const element = document.getElementById('services');
    if (element) {
      const headerOffset = 72; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Header />
      <div className="home-container">

          <section className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="h1">Створюємо гармонію природи у вашому дворі</h1>
            <p className="text-body">
              EcoGarden — ваш надійний партнер у догляді за садом, поливі та професійному ландшафтному дизайні. Делегуйте турботи нам і насолоджуйтесь результатом.
            </p>
            <div className="hero-actions">
              <Link to="/auth" className="btn-filled">Оформити замовлення</Link>
              <a href="#services" onClick={scrollToServices} className="btn-outline btn-outline-white">Наші послуги</a>
            </div>
          </div>
          
          {/* ОБНОВЛЕННАЯ КНОПКА СКРОЛЛА ВНИЗ */}
          <a href="#services" onClick={scrollToServices} className="scroll-indicator">
            <span>Дослідити</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </a>
        </section>

        {/* SERVICES BENTO GRID SECTION */}
        <section id="services" className="services-section">
          <h2 className="h2">Комплексний підхід до вашого саду</h2>
          <p className="text-body section-subtitle">
            Ми пропонуємо повний спектр послуг для створення та підтримки ідеального стану вашої ділянки.
          </p>
          
          <div className="bento-grid">
            <div className="bento-card bento-large">
              <div className="bento-image-area">
                <img className="bento-image" src="/garden-service.jpg" alt="Садівництво та догляд" />
              </div>
              <h3 className="bento-title">Садівництво та догляд</h3>
              <p className="text-body">
                Професійний догляд за деревами, кущами та квітниками. Здійснюємо санітарну та формувальну обрізку, лікування рослин від хвороб, а також сезонну посадку та регулярне підживлення ґрунту еко-добривами.
              </p>
            </div>

            <div className="bento-card bento-tall">
              <div className="bento-image-area">
                <img className="bento-image" src="/irrigation-system.jpg" alt="Системи поливу" />
              </div>
              <h3 className="bento-title">Системи поливу</h3>
              <p className="text-body">
                Проектування, монтаж та налаштування розумних систем автоматичного та крапельного поливу. Регулярний моніторинг вологості для здоров'я ваших рослин.
              </p>
            </div>

            <div className="bento-card bento-small-1">
              <div className="bento-image-area">
                <img className="bento-image" src="/model.avif" alt="Ландшафтний дизайн" />
              </div>
              <h3 className="bento-title">Ландшафтний дизайн</h3>
              <p className="text-body bento-small-text">Створення 3D-проектів, зонування та планування ділянки.</p>
            </div>

            <div className="bento-card bento-small-2">
              <div className="bento-image-area">
                <img className="bento-image" src="/dern.jpg" alt="Ідеальний газон" />
              </div>
              <h3 className="bento-title">Ідеальний газон</h3>
              <p className="text-body bento-small-text">Укладання рулонного газону, аерація та систематична стрижка.</p>
            </div>

            <div className="bento-card bento-wide">
              <div className="bento-image-area">
                <img className="bento-image" src="/organic.jpg" alt="Екологічні матеріали" />
              </div>
              <h3 className="bento-title">Екологічні матеріали</h3>
               <p className="text-body">Ми використовуємо лише сертифіковані органічні добрива та безпечні засоби захисту рослин, зберігаючи мікрофлору ґрунту.</p>
            </div>
          </div>
        </section>

        {/* СЕКЦИЯ: ПРОЦЕСС РАБОТЫ */}
        <section className="process-section">
          <div className="container-wrapper">
            <div className="section-header-center">
              <h2 className="h2">Як ми працюємо</h2>
              <p className="text-body section-subtitle">
                Прозорий та зрозумілий процес від першого дзвінка до квітучого саду.
              </p>
            </div>
            
            <div className="process-grid">
              {[
                { step: '01', title: 'Заявка і виїзд', desc: 'Огляд ділянки, заміри, аналіз ґрунту та обговорення ваших побажань.' },
                { step: '02', title: 'Проектування', desc: 'Створення 3D-ескізу, підбір рослин та складання прозорого кошторису.' },
                { step: '03', title: 'Реалізація', desc: 'Доставка матеріалів, підготовка ґрунту, посадка та монтаж систем поливу.' },
                { step: '04', title: 'Підтримка', desc: 'Гарантійний догляд, сезонна обрізка та регулярне обслуговування ділянки.' }
              ].map((item, index) => (
                <div key={index} className="process-card">
                  <div className="process-step-bg">{item.step}</div>
                  <h3 className="h3 process-title">{item.title}</h3>
                  <p className="text-body">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PORTFOLIO GRID SECTION */}
        <section className="portfolio-section">
          <div className="portfolio-header">
            <div>
              <h2 className="h2 portfolio-title">Галерея робіт</h2>
              <p className="text-body">Ознайомтеся з нашими найкращими реалізованими проектами.</p>
            </div>
          </div>
          
          <div className="portfolio-grid">
            <div className="portfolio-item portfolio-item--featured">
              <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80" alt="Озеленення двору" />
              <div className="portfolio-overlay">
                <div className="portfolio-glass-card">
                  <span className="portfolio-tag">Ландшафт</span>
                  <h3 className="h3 portfolio-item-title">Озеленення приватного двору</h3>
                  <p className="text-body portfolio-item-desc">Київська область, 2023</p>
                </div>
              </div>
            </div>
            
            <div className="portfolio-item">
              <img src="https://images.unsplash.com/photo-1558904541-efa843a96f09?auto=format&fit=crop&w=1200&q=80" alt="Система поливу" />
              <div className="portfolio-overlay">
                <div className="portfolio-glass-card">
                  <span className="portfolio-tag">Полив</span>
                  <h3 className="h3 portfolio-item-title">Монтаж автополиву та газон</h3>
                  <p className="text-body portfolio-item-desc">Котеджне містечко, 2024</p>
                </div>
              </div>
            </div>

            <div className="portfolio-item">
              <img src="https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=1200&q=80" alt="Реконструкція саду" />
              <div className="portfolio-overlay">
                <div className="portfolio-glass-card">
                  <span className="portfolio-tag">Садівництво</span>
                  <h3 className="h3 portfolio-item-title">Реконструкція старого саду</h3>
                  <p className="text-body portfolio-item-desc">Одеса, 2024</p>
                </div>
              </div>
            </div>

            <div className="portfolio-item">
              <img src="https://images.unsplash.com/photo-1585320817134-ab7cea356313?auto=format&fit=crop&w=1200&q=80" alt="Квітник з розами" />
              <div className="portfolio-overlay">
                <div className="portfolio-glass-card">
                  <span className="portfolio-tag">Дизайн</span>
                  <h3 className="h3 portfolio-item-title">Красива клумба з розами</h3>
                  <p className="text-body portfolio-item-desc">Львівська область, 2024</p>
                </div>
              </div>
            </div>

            <div className="portfolio-item">
              <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80" alt="Садова доріжка" />
              <div className="portfolio-overlay">
                <div className="portfolio-glass-card">
                  <span className="portfolio-tag">Ландшафт</span>
                  <h3 className="h3 portfolio-item-title">Облаштування садової доріжки</h3>
                  <p className="text-body portfolio-item-desc">Харківськая область, 2024</p>
                </div>
              </div>
            </div>

            <div className="portfolio-item portfolio-item--featured">
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80" alt="Зелений газон" />
              <div className="portfolio-overlay">
                <div className="portfolio-glass-card">
                  <span className="portfolio-tag">Газон</span>
                  <h3 className="h3 portfolio-item-title">Укладка рулонного газону</h3>
                  <p className="text-body portfolio-item-desc">Донецька область, 2024</p>
                </div>
              </div>
            </div>

            <div className="portfolio-item">
              <img src="https://images.unsplash.com/photo-1589967622444-8b8409e7e17d?auto=format&fit=crop&w=1200&q=80" alt="Фонтан у саду" />
              <div className="portfolio-overlay">
                <div className="portfolio-glass-card">
                  <span className="portfolio-tag">Водойми</span>
                  <h3 className="h3 portfolio-item-title">Декоративний фонтан на ділянці</h3>
                  <p className="text-body portfolio-item-desc">Zaporizhzhia region, 2023</p>
                </div>
              </div>
            </div>

            <div className="portfolio-item">
              <img src="https://images.unsplash.com/photo-1564334614601-1e9c92e0ce8b?auto=format&fit=crop&w=1200&q=80" alt="Комбіновані квітники" />
              <div className="portfolio-overlay">
                <div className="portfolio-glass-card">
                  <span className="portfolio-tag">Дизайн</span>
                  <h3 className="h3 portfolio-item-title">Комбіновані клумби та боскети</h3>
                  <p className="text-body portfolio-item-desc">Вінницька область, 2023</p>
                </div>
              </div>
            </div>

            <div className="portfolio-item portfolio-item--featured">
              <img src="https://images.unsplash.com/photo-1584341127014-9420d3acbd45?auto=format&fit=crop&w=1200&q=80" alt="Тіністі дерева" />
              <div className="portfolio-overlay">
                <div className="portfolio-glass-card">
                  <span className="portfolio-tag">Садівництво</span>
                  <h3 className="h3 portfolio-item-title">Висадка декоративних дерев</h3>
                  <p className="text-body portfolio-item-desc">Полтавська область, 2024</p>
                </div>
              </div>
            </div>

            <div className="portfolio-item">
              <img src="https://images.unsplash.com/photo-1586930252167-5aca5e42cddc?auto=format&fit=crop&w=1200&q=80" alt="Озеленення терас" />
              <div className="portfolio-overlay">
                <div className="portfolio-glass-card">
                  <span className="portfolio-tag">Дизайн</span>
                  <h3 className="h3 portfolio-item-title">Озеленення та благоустрій терас</h3>
                  <p className="text-body portfolio-item-desc">Чернівецька область, 2024</p>
                </div>
              </div>
            </div>

            <div className="portfolio-item">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80" alt="Садові скульптури" />
              <div className="portfolio-overlay">
                <div className="portfolio-glass-card">
                  <span className="portfolio-tag">Мистецтво</span>
                  <h3 className="h3 portfolio-item-title">Прикраса саду скульптурами</h3>
                  <p className="text-body portfolio-item-desc">Сумська область, 2023</p>
                </div>
              </div>
            </div>

            <div className="portfolio-item">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80" alt="Садові скульптури" />
              <div className="portfolio-overlay">
                <div className="portfolio-glass-card">
                  <span className="portfolio-tag">Мистецтво</span>
                  <h3 className="h3 portfolio-item-title">Прикраса саду скульптурами</h3>
                  <p className="text-body portfolio-item-desc">Сумська область, 2023</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* СЕКЦИЯ: FAQ (АККОРДЕОН) */}
        <section className="faq-section">
          <div className="faq-container">
            <div className="section-header-center">
              <h2 className="h2">Часті запитання</h2>
              <p className="text-body section-subtitle">
                Відповіді на найпопулярніші запитання наших клієнтів.
              </p>
            </div>
            
            <div className="faq-list">
              {[
                { q: 'Чи даєте ви гарантію на приживлюваність рослин?', a: 'Так, ми надаємо гарантію на всі висаджені нами рослини терміном на 1 рік за умови дотримання наших рекомендацій щодо догляду або замовлення послуги регулярного обслуговування.' },
                { q: 'З якими площами ви працюєте?', a: 'Ми реалізуємо проекти будь-якого масштабу — від невеликих приватних дворів (від 1 сотки) до великих комерційних територій.' },
                { q: 'Чи можна замовити лише проект без реалізації?', a: 'Звісно. Ви можете замовити детальний ландшафтний проект, який включає 3D-візуалізацію, креслення та дендроплан, і реалізувати його самостійно.' },
                { q: 'Як формується вартість послуг?', a: 'Вартість залежить від площі ділянки, обраних матеріалів, складності робіт та вартості самих рослин. Після виїзду фахівця ми складаємо детальний кошторис до початку робіт.' }
              ].map((faq, i) => (
                <div key={i} className={`faq-item ${activeFaq === i ? 'active' : ''}`}>
                  <button className="faq-button" onClick={() => toggleFaq(i)}>
                    <span className="h3 faq-question">{faq.q}</span>
                    <svg className="faq-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  
                  <div className="faq-answer-wrapper">
                    <div className="faq-answer-inner">
                      <p className="text-body faq-answer-text">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="contacts" className="cta-section">
          <div className="cta-container">
            <div className="cta-content">
              <h2 className="h2">Почніть свій шлях до ідеального саду</h2>
              <p className="text-body">
                Створіть особистий кабінет, щоб легко додавати свої ділянки, відстежувати стан рослин та замовляти послуги нашої бригади онлайн у кілька кліків.
              </p>
              <div>
                <Link to="/auth" className="btn-filled cta-btn-inverted">
                  Зареєструватися або увійти
                </Link>
              </div>
            </div>

            <div className="cta-contacts">
              <div className="contact-widget">
                <div className="widget-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="widget-info">
                  <h4>Зателефонуйте нам</h4>
                  <p>+38 (099) 123-45-67</p>
                </div>
              </div>

              <div className="contact-widget">
                <div className="widget-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="widget-info">
                  <h4>Напишіть нам</h4>
                  <p>hello@ecogarden.ua</p>
                </div>
              </div>

              <div className="contact-widget">
                <div className="widget-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="widget-info">
                  <h4>Наш офіс</h4>
                  <p>м. Одеса, вул. Садова, 15</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}