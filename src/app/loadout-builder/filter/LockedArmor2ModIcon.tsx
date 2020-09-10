import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';
import useClickOutside from 'app/dim-ui/hooks/useClickOutside';
import { SocketDetailsMod } from 'app/item-popup/SocketDetails';
import { AppIcon, faMinus, plusIcon } from 'app/shell/icons';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { LockedArmor2Mod, LockedModBase } from '../types';
import LockedArmor2ModDetails from './LockedArmor2ModDetails';
import styles from './LockedArmor2ModIcon.m.scss';

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
      {open.menu && <LockedArmor2ModDetails modDef={item.mod} buttonRef={ref} defs={defs} />}
      <div className={clsx(styles.mod, { disabled: dimmed })}>
        {/* TODO Not sure if we should be using SocketDetailsMod as is, maybe extract it? */}
        <SocketDetailsMod
          itemDef={item.mod}
          className={clsx({ [styles.selected]: open.menu })}
          defs={defs}
          onClick={() => setOpen({ menu: true, info: false })}
        />
        <div className={styles.sideButtons}>
          <div className={clsx(styles.sideButton, { disabled: !addable })} onClick={onAdd}>
            <AppIcon icon={plusIcon} />
          </div>
          <div className={clsx(styles.sideButton, { disabled: !removable })} onClick={onRemove}>
            <AppIcon icon={faMinus} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(LockedArmor2ModIcon);
