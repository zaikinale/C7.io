import { IoStar, IoHeart, IoBookmark, IoFlash, IoRocket, IoCode, IoBriefcase, IoSchool, IoFitness, IoMusicalNotes } from "react-icons/io5"

export const COLORS = [
  { name: 'default', value: 'rgb(12, 12, 12)' },
  { name: 'blue', value: '#1e3a5f' },
  { name: 'green', value: '#1a4d2e' },
  { name: 'purple', value: '#3d1f5c' },
  { name: 'orange', value: '#5c3a1f' },
  { name: 'red', value: '#5c1f1f' },
]

export const ICONS = [
  { name: 'star', Icon: IoStar },
  { name: 'heart', Icon: IoHeart },
  { name: 'bookmark', Icon: IoBookmark },
  { name: 'flash', Icon: IoFlash },
  { name: 'rocket', Icon: IoRocket },
  { name: 'code', Icon: IoCode },
  { name: 'briefcase', Icon: IoBriefcase },
  { name: 'school', Icon: IoSchool },
  { name: 'fitness', Icon: IoFitness },
  { name: 'music', Icon: IoMusicalNotes },
]

export const AVAILABLE_TASKS = [
  { id: 1, text: 'Сделать макет дашборда', done: true },
  { id: 2, text: 'Написать API-запросы', done: false },
  { id: 3, text: 'Code review PR #42', done: false },
  { id: 4, text: 'Обновить зависимости', done: false },
]

export const AVAILABLE_USERS = [
  { id: 1, name: 'Иван Петров', email: 'ivan@example.com' },
  { id: 2, name: 'Мария Сидорова', email: 'maria@example.com' },
  { id: 3, name: 'Алексей Козлов', email: 'alex@example.com' },
  { id: 4, name: 'Елена Новикова', email: 'elena@example.com' },
]

export const AVAILABLE_NOTES = [
  { id: 1, title: 'Идеи для проекта', text: 'Не забыть обновить зависимости проекта' },
  { id: 2, title: 'Встреча с клиентом', text: 'Обсудить требования к новому функционалу' },
  { id: 3, title: 'Техническое задание', text: 'API должно поддерживать REST и GraphQL' },
]

export const INITIAL_GROUPS = [
  { id: 1, name: 'Работа', description: '', users: [], notes: [] },
  { id: 2, name: 'Личное', description: '', users: [], notes: [] },
  { id: 3, name: 'Учёба', description: '', users: [], notes: [] },
]