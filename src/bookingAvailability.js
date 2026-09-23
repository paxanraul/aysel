// Demo availability only. Replace these exports with an API adapter when a
// scheduling backend and real calendar rules are connected.
export const services = ['Макияж', 'Причёска', 'Макияж + причёска', 'Свадебный образ', 'Другое']

export const weekDates = [
  { day: 'Пн', num: '14', state: 'available' },
  { day: 'Вт', num: '15', state: 'available' },
  { day: 'Ср', num: '16', state: 'available' },
  { day: 'Чт', num: '17', state: 'selected' },
  { day: 'Пт', num: '18', state: 'available' },
  { day: 'Сб', num: '19', state: 'busy' },
  { day: 'Вс', num: '20', state: 'available' }
]

export const timeSlots = ['09:00', '11:30', '14:00', '16:30', '19:00']
