// src/directives/resizable.js

export default {
  mounted(el) {
    // Add resizable property to the element
    el.style.position = 'relative'
    el.style.overflow = 'hidden'
  
    // Create a resizer element
    const resizer = document.createElement('div')

    resizer.style.width = '5px'
    resizer.style.height = '100%'
    resizer.style.position = 'absolute'
    resizer.style.right = '0'
    resizer.style.top = '0'
    resizer.style.cursor = 'col-resize'
    resizer.style.userSelect = 'none'
    el.appendChild(resizer)
  
    resizer.addEventListener('mousedown', event => {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
  
      let prevX = event.clientX
  
      function onMouseMove(e) {
        const dx = e.clientX - prevX
        const newWidth = el.offsetWidth + dx
  
        el.style.width = `${newWidth}px`
        prevX = e.clientX
      }
  
      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
    })
  },
}
  