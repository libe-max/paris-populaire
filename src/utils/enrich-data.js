/*
 * Enrich data
 * ---------------------
 *
 * This function adds some fields to place items.
 * Those fields are deduced from the data found in
 * place.text and place.lifespan fields.
 *
 * Input data should be an array of the folloing form:
 *
 * =======================================================================
 *  0      | 1       | 2       | 3     | 4       | 5        | 6           
 * --------|---------|---------|-------|---------|----------|-------------
 *  places | periods | persons | areas | notions | chapters | place_types 
 * --------|---------|---------|-------|---------|----------|-------------
 * =======================================================================
 */

function enrichData (data) {
  // Check if input data is valid
  if (!Array.isArray(data) || data.length !== 7) {
    const msg = 'Cannot enrich data which is not an array of length 7'
    throw new Error(msg)
  }
  const unfilteredPlaces = data[0]
  const periods = data[1]
  const persons = data[2]
  const areas = data[3]
  const notions = data[4]
  const chapters = data[5]
  const place_types = data[6]

  // Filter places via 'publish' prop, then return an object
  // containing only useful props
  const filteredPlaces = unfilteredPlaces.filter(p => p.publish)
  const places = filteredPlaces.map(p => {
    // Getting persons, areas and notions from p.text
    const _place_types = [p.type]
    const _persons = []
    const _areas = []
    const _notions = []
    const _display_text = document.createElement('div')
    _display_text.innerHTML = p.text
    const $sources = document.createElement('div')
    $sources.innerHTML = p.sources
    const sources = $sources.querySelectorAll('span.source')
    const sourcesArr = []
    for (let source of sources) sourcesArr.push(source)
    const _display_sources = sourcesArr.map(s => {
      const urlRegexp = /https?:\/\/[a-z0-9-._~/?#[\]@!$&'()*+,;=:%]+/igm
      return s.innerHTML.replace(urlRegexp, txt => `<a href="${txt}" target="_blank">${txt}</a>`)
    })

    // Handle data-* spans (links between cards, people markup, sources markup...)
    let whileCnt = 0
    while (_display_text.querySelector('span:not([data-handled])') && whileCnt < 100) {
      const span = _display_text.querySelector('span:not([data-handled])')
      const person = span.getAttribute('data-person')
      const area = span.getAttribute('data-place')
      const notion = span.getAttribute('data-notion')
      const source = span.getAttribute('data-source')
      const link = span.getAttribute('data-link')
      if (person) {
        _persons.push(person)
        // const spanContent = span.innerHTML
        // span.innerHTML = `<a>${spanContent}</a>`
      } else if (area) {
        _areas.push(area)
        // const spanContent = span.innerHTML
        // span.innerHTML = `<a>${spanContent}</a>`
      } else if (notion) {
        _notions.push(notion)
        // const spanContent = span.innerHTML
        // span.innerHTML = `<a>${spanContent}</a>`
      } else if (source) {
        span.innerHTML += ` <sup>${source}</sup>`
        const spanContent = span.innerHTML
        span.innerHTML = `<a>${spanContent}</a>`
      } else if (link) {
        const spanContent = span.innerHTML
        span.innerHTML = `<a>${spanContent}</a>`
      }
      span.setAttribute('data-handled', 'true')
      whileCnt ++
    }

    // Getting periods from matching p.lifespan and data[2]
    const _periods = []
    periods.forEach(period => {
      if (p.lifespan.start_date < period.end_date &&
        p.lifespan.end_date > period.start_date
      ) _periods.push(period.id)
    })

    // Return final place object
    return {
      id: p.id,               name: p.name,
      address: p.address,     longitude: p.longitude, latitude: p.latitude,
      city: p.city,           district: p.district,   photo: p.photo,
      exists: p.exists,       text: p.text,           lifespan: p.lifespan,
      type: p.type,           author: p.author,       long_read_intro: p.long_read_intro,
      long_read: p.long_read, sources: p.sources,     _chapters: p.chapters,
      _persons,               _areas,                 _notions,
      _periods,               _place_types,           _display_text,
      _display_sources
    }
  })
  
  return {
    places,
    periods,
    persons,
    areas,
    notions,
    chapters,
    place_types
  }
}

export default enrichData
