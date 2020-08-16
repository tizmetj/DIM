import React, { useRef, RefObject } from 'react';
import { AppIcon, plusIcon, faMinus, faInfoCircle } from 'app/shell/icons';
import styles from './LockedArmor2ModIcon.m.scss';
import clsx from 'clsx';
import usePopper from 'app/dim-ui/hooks/usePopper';
import { Options } from '@popperjs/core/lib';

interface Props {
  buttonRef: RefObject<HTMLDivElement>;
  onAdd?(): void;
  onRemove?(): void;
}

function LockedArmor2ModMenu({ buttonRef, onAdd, onRemove }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const popperOptions: Partial<Options> = {
    placement: 'top',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['bottom'],
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  };
  usePopper(buttonRef, menuRef, popperOptions);

  return (
    <div ref={menuRef} className={styles.menu}>
      <div className={styles.buttons}>
        <div className={clsx(styles.button, { disabled: !onAdd })} onClick={() => onAdd?.()}>
          <AppIcon icon={plusIcon} />
        </div>
        <div className={clsx(styles.button, { disabled: !onRemove })} onClick={() => onRemove?.()}>
          <AppIcon icon={faMinus} />
        </div>
        <div className={styles.button}>
          <AppIcon icon={faInfoCircle} />
        </div>
      </div>
      <div data-popper-arrow className={styles.pointyBit} />
    </div>
  );
}

export default LockedArmor2ModMenu;
