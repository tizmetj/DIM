import React, { useState, useRef } from 'react';
import { SocketDetailsMod } from 'app/item-popup/SocketDetails';
import { LockedArmor2Mod, LockedModBase } from '../types';
import styles from './LockedArmor2ModIcon.m.scss';
import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';
import clsx from 'clsx';
import useClickOutside from 'app/dim-ui/hooks/useClickOutside';
import LockedArmor2ModMenu from './LockedArmor2ModMenu';

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
        <LockedArmor2ModMenu
          buttonRef={ref}
          onAdd={addable ? onAdd : undefined}
          onRemove={removable ? onRemove : undefined}
        />
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
