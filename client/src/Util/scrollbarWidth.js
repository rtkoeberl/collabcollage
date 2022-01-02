export default class TempScrollBox {
  constructor() {
    this.scrollBarWidth = null;

    this.measureScrollbarWidth();
  }

  measureScrollbarWidth() {
    // Add temporary box to wrapper
    let scrollbox = document.createElement('div');

    // Make box scrollable
    scrollbox.style.overflow = 'scroll';
    scrollbox.style.width = '100%';

    // Append box to document
    document.body.appendChild(scrollbox);

    // Measure inner width of box
    this.scrollBarWidth = scrollbox.offsetWidth - scrollbox.clientWidth;

    // Remove box
    document.body.removeChild(scrollbox);
  }

  get width() {
    return this.scrollBarWidth;
  }
}