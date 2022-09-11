import '../css/switch-btn.css'

export const btnValue = {
  BUTTON: 'button',
  SCROLL: 'scroll',
}
export const initSwitchBtn = () => {
  const toggleForm = document.querySelector('form.toggle-form');
  const button = document.querySelectorAll('button.toggle');
  if (!button) return;
  toggleForm.addEventListener('submit', e => e.preventDefault())
  toggleForm.addEventListener('change', (e) => {
    window.dispatchEvent(new CustomEvent('toggleLoadingType', {detail: {type: e.target.value}}));
  })
}
