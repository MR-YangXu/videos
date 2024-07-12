import { onMounted, onUnmounted } from 'vue';
import ClipboardJS from 'clipboard';

const useCopy = () => {
  const id = `copy_${Date.now()}`;
  let copyStr = '';

  const input = document.createElement('input');
  input.type = 'hidden';
  input.id = id;

  onMounted(() => {
    document.body.appendChild(input);

    const clipboard = new ClipboardJS(input, { text: () => copyStr });

    clipboard.on('success', (e) => {
      console.log('clipboard success', e);
    });

    clipboard.on('error', (e) => {
      console.log('clipboard error', e);
      // log('error', '剪切板复制失败', e);
    });

    console.log(clipboard);

  });
   
  onUnmounted(() => {
    document.body.removeChild(input);
  });

  return (str: string) => {
    copyStr = str;
    input.click();
  };
};

export default useCopy;
