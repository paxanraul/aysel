import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { services, timeSlots, weekDates } from './bookingAvailability'

function Arrow() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M3 10h13M11 5l5 5-5 5" /></svg>
}

function Close() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
}

function BookingSheet({ open, onClose }) {
  const [step, setStep] = React.useState(1)
  const [selection, setSelection] = React.useState({ service: '', date: 'Чт, 17 октября', time: '', name: '', phone: '', comment: '' })
  const [confirmation, setConfirmation] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    const escape = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [open, onClose])

  const choose = (field, value) => setSelection((current) => ({ ...current, [field]: value }))
  const next = () => {
    if (step < 4) setStep((current) => current + 1)
    else setConfirmation(true)
  }
  const previous = () => step > 1 ? setStep((current) => current - 1) : onClose()
  const canContinue = step === 1 ? selection.service : step === 2 ? selection.date : step === 3 ? selection.time : selection.name.trim() && selection.phone.trim()

  React.useEffect(() => {
    if (open) return
    const timer = window.setTimeout(() => {
      setStep(1)
      setConfirmation(false)
      setSelection({ service: '', date: 'Чт, 17 октября', time: '', name: '', phone: '', comment: '' })
    }, 250)
    return () => window.clearTimeout(timer)
  }, [open])

  return <>
    <div className={`sheet-backdrop ${open ? 'is-open' : ''}`} onClick={onClose} aria-hidden="true" />
    <section className={`booking-sheet ${open ? 'is-open' : ''}`} aria-modal="true" role="dialog" aria-label="Онлайн-запись">
      <div className="sheet-handle" />
      <header className="sheet-header">
        <div>
          <p className="step-count">{confirmation ? 'Заявка готова' : `Шаг ${step} из 4`}</p>
          <h2>{confirmation ? 'До встречи' : ['Выберите услугу', 'Выберите дату', 'Выберите время', 'Ваши контакты'][step - 1]}</h2>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Закрыть запись"><Close /></button>
      </header>

      {!confirmation && <div className="progress" aria-hidden="true"><span style={{ width: `${step * 25}%` }} /></div>}

      {confirmation ? <div className="confirmation">
        <div className="confirmation-mark">✓</div>
        <p>Спасибо, {selection.name}.</p>
        <h3>Ваш выбор сохранён</h3>
        <dl>
          <div><dt>Услуга</dt><dd>{selection.service}</dd></div>
          <div><dt>Дата и время</dt><dd>{selection.date}, {selection.time}</dd></div>
          {selection.comment.trim() && <div><dt>Пожелания</dt><dd>{selection.comment}</dd></div>}
        </dl>
        <div className="personal-note">Запись будет подтверждена Айсел лично.</div>
        <button className="primary-button" onClick={onClose}>ОК</button>
      </div> : <>
        <div className="sheet-content">
          {step === 1 && <div className="service-list">
            {services.map((service) => <button key={service} className={`service-option ${selection.service === service ? 'selected' : ''}`} onClick={() => choose('service', service)}>
              <span>{service}</span><i aria-hidden="true" />
            </button>)}
          </div>}

          {step === 2 && <div className="calendar">
            <div className="calendar-month"><span>Октябрь 2026</span><span className="calendar-chevrons">‹&nbsp;&nbsp;›</span></div>
            <div className="date-row">
              {weekDates.map((date) => <button key={date.num} disabled={date.state === 'busy'} className={`date ${date.state}`} onClick={() => choose('date', `${date.day}, ${date.num} октября`)}>
                <small>{date.day}</small><b>{date.num}</b>{date.state === 'busy' && <em>—</em>}
              </button>)}
            </div>
            <p className="calendar-note"><span />Доступные даты на этой неделе</p>
          </div>}

          {step === 3 && <div className="time-content">
            <p className="selection-line">{selection.date}</p>
            <div className="time-grid">{timeSlots.map((slot) => <button key={slot} className={selection.time === slot ? 'selected' : ''} onClick={() => choose('time', slot)}>{slot}</button>)}</div>
            <p className="quiet-note">Время указано по Москве</p>
          </div>}

          {step === 4 && <div className="contact-form">
            <label>Имя<input autoComplete="name" value={selection.name} onChange={(e) => choose('name', e.target.value)} placeholder="Как к вам обращаться" /></label>
            <label>Телефон<input autoComplete="tel" inputMode="tel" value={selection.phone} onChange={(e) => choose('phone', e.target.value)} placeholder="+7 000 000-00-00" /></label>
            <label><span>Комментарий <small>необязательно</small></span><textarea value={selection.comment} onChange={(e) => choose('comment', e.target.value)} placeholder="Например: хочу лёгкий макияж, есть референс или важные пожелания" /></label>
            <p className="quiet-note">Мы используем номер только для подтверждения записи.</p>
          </div>}
        </div>
        <footer className="sheet-footer">
          <button className="back-button" onClick={previous}>{step === 1 ? 'Отмена' : 'Назад'}</button>
          <button className="next-button" disabled={!canContinue} onClick={next}>{step === 4 ? 'Оставить заявку' : 'Продолжить'}<Arrow /></button>
        </footer>
      </>}
    </section>
  </>
}

function App() {
  const [open, setOpen] = React.useState(false)
  const imageBase = `${import.meta.env.BASE_URL}images/`
  return <main className="page-shell">
    <section className="hero" aria-label="AYSELL MAKE UP">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="AYSELL MAKE UP">AYSELL<br />MAKE UP</a>
        <div className="top-actions"><span>Москва</span><button className="menu-trigger" aria-label="Открыть меню"><i /><i /></button></div>
      </header>

      <div className="hero-photo hero-photo-main"><img src={`${imageBase}aysel-bridal.jpg`} alt="Свадебный макияж и укладка Айсел" /></div>
      <div className="hero-photo hero-photo-detail"><img src={`${imageBase}aysel-bride.jpg`} alt="Деталь свадебной причёски" /></div>
      <div className="image-caption">свадебный<br />образ</div>

      <div className="hero-copy">
        <h1>Образ,<br />в котором<br /><em>ты остаёшься собой</em></h1>
        <p>Макияж · причёски · свадебные образы</p>
      </div>

      <div className="hero-actions">
        <button className="primary-button hero-button" onClick={() => setOpen(true)}>Выбрать дату <Arrow /></button>
        <a className="whatsapp-link" href="https://wa.me/" target="_blank" rel="noreferrer">Нужна консультация? <span>Написать в WhatsApp</span></a>
      </div>
    </section>
    <BookingSheet open={open} onClose={() => setOpen(false)} />
  </main>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
