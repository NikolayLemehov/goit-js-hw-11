import '../css/switch-btn.css'

export const btnValue = {
  BUTTON: 'button',
  SCROLL: 'scroll',
}
export const initSwitchBtn = () => {
  const toggleForm = document.querySelector('form.toggle-form');
  const value = [...toggleForm.elements['toggle']].filter(it => it.checked)[0].value
  // console.dir(checked)
  const v = null;
  const button = document.querySelectorAll('button.toggle');
  if (!button) return;
  toggleForm.addEventListener('submit', e => e.preventDefault())
  toggleForm.addEventListener('change', (e) => {
    // switch (e.target.value) {
    //   case btnValue.BUTTON:
    //   case btnValue.SCROLL:
    // }
    window.dispatchEvent(new CustomEvent('toggleLoadingType', {detail: {type: e.target.value}}));
    // console.log('form', e.target.value)
  })

  // button.addEventListener('click', event => {
  //   if (button.getAttribute('aria-pressed') === 'true') {
  //     button.removeAttribute('aria-pressed')
  //   } else {
  //     button.setAttribute('aria-pressed', 'true')
  //   }
  // })
}
