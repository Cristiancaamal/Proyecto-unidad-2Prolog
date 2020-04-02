const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

const attrsToString = (obj = {}) =>
  Object.keys(obj)
    .map(attr => `${attr}="${obj[attr]}"`)
    .join(' ')

const tagAttrs = obj => (content = '') => `<${obj.tag}${obj.attrs ? ' ' : ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`

const tag = t => typeof t === 'string' ? tagAttrs({ tag: t }) : tagAttrs(t)

const tableRowTag = tag('tr')
const tableRow = items => compose(tableRowTag, tableCells)(items)

const tableCell = tag('td')
const tableCells = items => items.map(tableCell).join('')

const trashIcon = tag({tag: 'i', attrs: {class: 'fas fa-trash-alt'}})('')

let descripcion = $('#descripcion')
let calorias = $('#calorias')
let carbohidratos = $('#carbohidratos')
let proteina = $('#proteina')

let list = []

descripcion.keypress(() => {
  descripcion.removeClass('is-invalid')
})

calorias.keypress(() => {
  calorias.removeClass('is-invalid')
})

carbohidratos.keypress(() => {
  carbohidratos.removeClass('is-invalid')
})

proteina.keypress(() => {
  proteina.removeClass('is-invalid')
})

const validateInputs = () => {

  descripcion.val() ? '' : $('#descripcion').addClass('is-invalid')
  calorias.val() ? '' : $('#calorias').addClass('is-invalid')
  carbohidratos.val() ? '' : $('#carbohidratos').addClass('is-invalid')
  proteina.val() ? '' : $('#proteina').addClass('is-invalid')

  if(
    descripcion.val() &&
    calorias.val() &&
    carbohidratos.val() &&
    proteina.val()
  ) add()
}

const add = () => {
  const newItem = {
    descripcion: descripcion.val(),
    calorias: parseInt(calorias.val()),
    carbohidratos: parseInt(carbohidratos.val()),
    proteina: parseInt(proteina.val())
  }

  list.push(newItem)
  updateTotals()
  cleanInputs()
  renderItems()
}

const removeItem = (index) => {
  list.splice(index, 1)

  updateTotals()
  renderItems()
}

const updateTotals = () => {
  let calorias = 0, carbohidratos = 0, proteina = 0

  list.map(item => {
    calorias += item.calorias,
    carbohidratos += item.carbohidratos,
    proteina += item.proteina
  })

  $('#totalCalorias').text(calorias)
  $('#totalCarbohidratos').text(carbohidratos)
  $('#totalProteina').text(proteina)
}

const cleanInputs = () => {
  descripcion.val('')
  calorias.val('')
  carbohidratos.val('')
  proteina.val('')
}

const renderItems = () => {
  $('tbody').empty()

  list.map((item, index) => {

    const removeButton = tag({
      tag: 'button',
      attrs: {
        class: 'btn btn-outline-danger',
        onclick: `removeItem(${index})`
      }
    })(trashIcon)

    $('tbody').append(tableRow([item.descripcion, item.calorias, item.carbohidratos, item.proteina, removeButton]))
  })
}
