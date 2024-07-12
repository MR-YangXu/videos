import { computed } from 'vue';

type stringNumber = string | number;
const propType = [String, Number];

export interface StyleDefine {
  radius?: stringNumber;
  padding?: stringNumber;
}

export const styleProps = {
  radius: propType,
  padding: propType,
};

export function appendStyles(styles: { [key: string]: string | number }, key: string, input: string | number | undefined): void {
  if (input === undefined) return;
  let value: string;
  if (!isNaN(+input)) {
    value = input + 'px';
  } else {
    value = input + '';
  }

  if (value) {
    styles[key] = value;
  }
}

export function getStyles(props: StyleDefine, filter = (_key: string) => true) {
  const styles = computed<{ [index: string]: string | number }>(() => {
    const results: { [key: string]: string | number } = {};

    if (filter('radius')) appendStyles(results, 'border-radius', props.radius);
    if (filter('padding')) appendStyles(results, 'padding', props.padding);

    return results;
  });

  return styles;
}
