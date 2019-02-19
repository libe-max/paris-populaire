import moment from 'moment'

export default [{

  // Places
  start: 0,
  end: 21,
  keysLinePos: 2,
  types: {
    id: 'number',
    publish: v => (v === 'ok'.toLowerCase()),
    name: v => v.trim(),
    address: v => v.trim(),
    latitude: (v = 0) => parseFloat(v, 10),
    longitude: (v = 0) => parseFloat(v, 10),
    city: v => v.trim(),
    district: v => v.trim(),
    photo: v => v.trim(),
    photo_credits: v => v.trim(),
    exists: v => (v === 'oui' || v === 'rehab'),
    text: v => v,
    sources: v => v,
    lifespan: v => {
      const bounds = v.split('-').map(t => t.trim())
      if (!bounds.length) bounds.push('01/01/0000')
      if (!bounds[0]) bounds[0] = '01/01/0000'
      if (bounds.length === 1) bounds.push(bounds[0])
      if (!bounds[1]) bounds[1] = bounds[0]
      const cleanBounds = bounds.map((bound, i) => {
        const splBound = bound.split('/').map(v => v.trim()).reverse()
        if ((!splBound.length || splBound.length > 3) && !i) return moment('01/01/0000', 'DD/MM/YYYY').startOf('year')
        if ((!splBound.length || splBound.length > 3) && i) return moment('01/01/0000', 'DD/MM/YYYY').endOf('year')
        if (splBound.length === 1 && !i) return moment(bound, 'YYYY').startOf('year')
        if (splBound.length === 1 && i) return moment(bound, 'YYYY').endOf('year')
        if (splBound.length === 2 && !i) return moment(bound, 'MM/YYYY').startOf('month')
        if (splBound.length === 2 && i) return moment(bound, 'MM/YYYY').endOf('month')
        if (splBound.length === 3 && !i) return moment(bound, 'DD/MM/YYYY').startOf('day')
        /* Only condition left: (splBound.length === 3 && i) */
        return moment(bound, 'DD/MM/YYYY').endOf('day')
      })
      return {
        start_date: cleanBounds[0],
        end_date: cleanBounds[1]
      }
    },
    type: v => v.trim(),
    author: v => v.trim(),
    long_read_intro: v => v.trim(),
    long_read: v => v.trim(),
    chapters: v => v.split(',')
      .map(chp => chp.trim())
      .filter(chp => chp)
  }
}, {

  // Periods
  start: 22,
  end: 25,
  keysLinePos: 2,
  types: {
    start_date: v => moment(v, 'DD/MM/YYYY').startOf('day'),
    end_date: v => moment(v, 'DD/MM/YYYY').endOf('day')
  }
}, {

  // People
  start: 26,
  end: 27,
  keysLinePos: 2
}, {

  // Areas
  start: 28,
  end: 29,
  keysLinePos: 2
}, {

  // Notions
  start: 30,
  end: 31,
  keysLinePos: 2
}, {

  // Chapters
  start: 32,
  end: 33,
  keysLinePos: 2
}, {

  // Place types
  start: 34,
  end: 35,
  keysLinePos: 2
}]
