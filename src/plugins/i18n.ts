import { createI18n } from 'vue-i18n'

const messages = {
  uk: {
    captions: {
      currentResults: 'Поточні результати',
      turnout: 'Явка',
      results: 'Результати',
      statistics: 'Статистика',
    },
    placeTypes: {
      county: 'Медьє (область)',
      constituency: 'Виборчий округ',
      settlement: 'Населений пункт',
      pollingStation: 'Виборча дільниця',
    },
    resultsTab: {
      title: 'Показники вибраного пункту',
      constituenciesTitle: 'В одномандатних округах',
      partiesListsTitle: 'За партійними списками',
      totalVotersCount: 'Загальна кількість виборців',
      totalVotesCount: 'Поточна кількість голосів',
      constituenciesVotesCount: 'За кандидатів',
      partiesListsVotesCount: 'За списками',
    },
    statisticsTab: {
      title: 'Статистика вибраного пункту',
    },
  },
  en: {
    captions: {
      currentResults: 'Current results',
      turnout: 'Turnout',
      results: 'Results',
      statistics: 'Statistics',
    },
    placeTypes: {
      county: 'County',
      constituency: 'Constituency',
      settlement: 'Settlement',
      pollingStation: 'Polling station',
    },
    resultsTab: {
      title: 'Chosen place results',
      constituenciesTitle: 'Of individual constituencies',
      partiesListsTitle: 'Of parties lists',
      totalVotersCount: 'Total voters count',
      totalVotesCount: 'Current votes count',
      constituenciesVotesCount: 'Individual constituencies',
      partiesListsVotesCount: 'Parties lists',
    },
    statisticsTab: {
      title: 'Chosen place statistics',
    },
  },
}

export default createI18n({
  legacy: false,
  locale: 'uk',
  fallbackLocale: 'en',
  messages,
})
