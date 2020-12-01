import { onBeforeUnmount } from 'vue';

function useKeydown(keyCombos) {
  function onKeydown(event) {
    const keyCombo = keyCombos.find(keyCombo => keyCombo.key === event.key);

    if (keyCombo) {
      keyCombo.fn();
    }
  }

  window.addEventListener('keydown', onKeydown);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
  });
}

export default useKeydown;
