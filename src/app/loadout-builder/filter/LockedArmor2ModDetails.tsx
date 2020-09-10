import { Options } from '@popperjs/core/lib';
import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';
import usePopper from 'app/dim-ui/hooks/usePopper';
import { PluggableInventoryItemDefinition } from 'app/inventory/item-types';
import { StatValue } from 'app/item-popup/PlugTooltip';
import { armorStatHashes } from 'app/search/search-filter-values';
import React, { RefObject, useRef } from 'react';
import styles from './LockedArmor2ModDetails.m.scss';

interface Props {
  modDef: PluggableInventoryItemDefinition;
  defs: D2ManifestDefinitions;
  buttonRef: RefObject<HTMLDivElement>;
}

function LockedArmor2ModDetails({ modDef, defs, buttonRef }: Props) {
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
    <div ref={menuRef} className={styles.popup}>
      <div className={styles.details}>
        <div className={styles.title}>{modDef.displayProperties.name}</div>
        <div className={styles.description}>{modDef.displayProperties.description}</div>
        <div className={styles.stats}>
          {modDef.investmentStats
            .filter((stat) => armorStatHashes.includes(stat.statTypeHash))
            .map((stat) => (
              <div className={styles.plugStats} key={stat.statTypeHash}>
                <StatValue value={stat.value} defs={defs} statHash={stat.statTypeHash} />
              </div>
            ))}
        </div>
      </div>
      <div data-popper-arrow className={styles.pointyBit} />
    </div>
  );
}

export default LockedArmor2ModDetails;
