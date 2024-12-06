export function makeElement({ label, classes, html, event }) {
  const myElement = document.createElement(label);
  if (classes) myElement.className = classes;
  if (html) myElement.innerHTML = html;
  if (event) myElement.addEventListener(event.type, event.function);
  return myElement;
}
