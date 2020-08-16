import { useLayoutEffect, useRef, RefObject } from 'react';
import { popperGenerator, Instance, Options } from '@popperjs/core/lib/popper-lite';
import flip from '@popperjs/core/lib/modifiers/flip';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import applyStyles from '@popperjs/core/lib/modifiers/applyStyles';
import computeStyles from '@popperjs/core/lib/modifiers/computeStyles';
import popperOffsets from '@popperjs/core/lib/modifiers/popperOffsets';
import offset from '@popperjs/core/lib/modifiers/offset';
import arrow from '@popperjs/core/lib/modifiers/arrow';

/** Makes a custom popper that doesn't have the event listeners modifier */
const createPopper = popperGenerator({
  defaultModifiers: [
    popperOffsets,
    offset,
    computeStyles,
    applyStyles,
    flip,
    preventOverflow,
    arrow,
  ],
});

const popperOptions = (): Partial<Options> => ({
  placement: 'top',
  modifiers: [
    {
      name: 'preventOverflow',
    },
    {
      name: 'flip',
      options: {
        fallbackPlacements: ['top', 'bottom', 'right', 'left'],
      },
    },
    {
      name: 'offset',
      options: {
        offset: [0, 10],
      },
    },
  ],
});

function usePopper(
  referenceRef: RefObject<HTMLDivElement>,
  popupRef: RefObject<HTMLDivElement>,
  options?: Partial<Options>
) {
  const popper = useRef<Instance>();
  const optionsWithDefaults = options || popperOptions();
  // Reposition the popup as it is shown or if its size changes
  const reposition = () => {
    if (referenceRef.current && popupRef.current) {
      if (popper.current) {
        popper.current.update();
      } else {
        popper.current = createPopper(referenceRef.current, popupRef.current, optionsWithDefaults);
        popper.current.update();
        setTimeout(() => popper.current?.update(), 0); // helps fix arrow position
      }
    }
  };

  const clearPopper = () => {
    if (popper) {
      popper.current?.destroy();
      popper.current = undefined;
    }
  };

  useLayoutEffect(() => {
    reposition();
    return clearPopper;
  });
}

export default usePopper;
