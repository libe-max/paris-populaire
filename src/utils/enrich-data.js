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
    const _persons = []
    const _areas = []
    const _notions = []
    const _place_types = [p.type]
    const div = document.createElement('div')
    div.innerHTML = p.text
    const spans = div.querySelectorAll('span')
    for (let i = 0 ; i < spans.length ; i++) {
      const span = spans[i]
      const person = span.getAttribute('data-person')
      const area = span.getAttribute('data-place')
      const notion = span.getAttribute('data-notion')
      if (person) _persons.push(person)
      if (area) _areas.push(area)
      if (notion) _notions.push(notion)
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
      long_read: p.long_read, chapters: p.chapters,   _persons,
      _areas,                 _notions,               _periods,
      _place_types
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
