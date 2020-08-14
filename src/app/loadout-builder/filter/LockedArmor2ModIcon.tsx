import React, { useState, useRef } from 'react';
import { SocketDetailsMod } from 'app/item-popup/SocketDetails';
import { LockedArmor2Mod, LockedModBase } from '../types';
import styles from './LockedArmor2ModIcon.m.scss';
import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';
import clsx from 'clsx';
import useClickOutside from 'app/dim-ui/useClickOutside';
import { AppIcon, plusIcon, faMinus, faInfoCircle } from 'app/shell/icons';

interface Props {
  item: LockedArmor2Mod | LockedModBase;
  defs: D2ManifestDefinitions;
  addable: boolean;
  removable: boolean;
  dimmed: boolean;
  onAdd?(): void;
  onRemove?(): void;
}

function LockedArmor2ModIcon({ item, defs, addable, removable, dimmed, onAdd, onRemove }: Props) {
  const ref = useRef(null);
  const [open, setOpen] = useState<{ menu: boolean; info: boolean }>({ menu: false, info: false });
  useClickOutside(ref, open.menu, () => setOpen({ menu: false, info: false }));

  return (
    <div ref={ref} className={styles.wrapper}>
      {open.menu && (
        <div className={styles.menu}>
          {open.info && <div>I am info</div>}
          <div className={styles.buttons}>
            <div
              className={clsx(styles.button, { disabled: !addable })}
              onClick={() => addable && onAdd?.()}
            >
              <AppIcon icon={plusIcon} />
            </div>
            <div
              className={clsx(styles.button, { disabled: !removable })}
              onClick={() => removable && onRemove?.()}
            >
              <AppIcon icon={faMinus} />
            </div>
            <div className={styles.button} onClick={() => setOpen({ menu: true, info: true })}>
              <AppIcon icon={faInfoCircle} />
            </div>
          </div>
          <div className={styles.pointyBit} />
        </div>
      )}
      <div className={styles.mod}>
        {/* TODO Not sure if we should be using SocketDetailsMod as is, maybe extract it? */}
        <SocketDetailsMod
          itemDef={item.mod}
          className={clsx({ disabled: dimmed, [styles.selected]: open.menu })}
          defs={defs}
          onClick={() => setOpen({ menu: true, info: false })}
        />
      </div>
    </div>
  );
}

export default React.memo(LockedArmor2ModIcon);
