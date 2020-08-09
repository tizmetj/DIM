import React from 'react';
import ClosableContainer from '../ClosableContainer';
import { SocketDetailsMod } from 'app/item-popup/SocketDetails';
import { LockedArmor2Mod, LockedModBase } from '../types';
import styles from './LockedArmor2ModIcon.m.scss';
import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';
import clsx from 'clsx';

interface Props {
  item: LockedArmor2Mod | LockedModBase;
  defs: D2ManifestDefinitions;
  closeable?: boolean;
  clickable?: boolean;
  onClick?(): void;
  onClose(): void;
}

function LockedArmor2ModIcon({ item, defs, closeable = true, clickable, onClick, onClose }: Props) {
  return (
    <div className={styles.mod}>
      <ClosableContainer onClose={onClose} key={item.mod.hash} enabled={closeable}>
        <SocketDetailsMod
          itemDef={item.mod}
          className={clsx({ disabled: clickable === false })}
          defs={defs}
          onClick={() => {
            clickable && onClick && onClick();
          }}
        />
      </ClosableContainer>
    </div>
  );
}

export default LockedArmor2ModIcon;
