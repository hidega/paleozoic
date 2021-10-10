function ElementBuilder(window, elementName, p, peek = p || (() => { })) {
  var element = window.document.createElement(elementName)

  peek(element)

  var removeChildren = () => element.childNodes.forEach(n => n.remove())

  this.setChildren = children => {
    removeChildren()
    children.forEach(e => element.appendChild(e))
    return this
  }

  this.setAttribute = (name, value) => {
    element.setAttribute(name, value)
    return this
  }

  this.setCss = cssText => {
    element.style = cssText
    return this
  }

  this.setId = id => {
    element.id = id
    return this
  }

  this.setClasses = classes => {
    Array.isArray(classes) || (classes = [classes])
    element.classList.value = ''
    classes.forEach(c => element.classList.add(c))
    return this
  }

  this.setTextContent = txt => {
    removeChildren()
    element.innerHTML = txt
    return this
  }

  this.build = () => element
}

module.exports = ElementBuilder
