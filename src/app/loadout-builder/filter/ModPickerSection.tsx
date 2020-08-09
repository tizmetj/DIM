import React from 'react';
import _ from 'lodash';
import styles from './ModPickerSection.m.scss';
import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';
import { LockedArmor2Mod, ModPickerCategory, ModPickerCategories } from '../types';
import { DestinyEnergyType } from 'bungie-api-ts/destiny2';
import LockedArmor2ModIcon from './LockedArmor2ModIcon';
import { getSpecialtySocketMetadataByPlugCategoryHash } from 'app/utils/item-utils';
import clsx from 'clsx';

interface Props {
  defs: D2ManifestDefinitions;
  mods: readonly LockedArmor2Mod[];
  locked?: readonly LockedArmor2Mod[];
  title: string;
  category: ModPickerCategory;
  maximumSelectable: number;
  energyMustMatch?: boolean;
  onModSelected(mod: LockedArmor2Mod);
  onModRemoved(mod: LockedArmor2Mod);
}

function ModPickerSection({
  defs,
  mods,
  locked,
  title,
  category,
  maximumSelectable,
  energyMustMatch,
  onModSelected,
  onModRemoved,
}: Props) {
  const isModClickable = (item: LockedArmor2Mod) => {
    if (locked && locked.length >= maximumSelectable) {
      return false;
    }

    if (energyMustMatch) {
      // cases where item is any energy or all mods are any energy
      if (
        item.mod.plug.energyCost!.energyType === DestinyEnergyType.Any ||
        locked?.every((locked) => locked.mod.plug.energyCost!.energyType === DestinyEnergyType.Any)
      ) {
        return true;
      }

      if (
        locked?.some(
          (lockedMod) =>
            lockedMod.mod.plug.energyCost!.energyType !== item.mod.plug.energyCost!.energyType
        )
      ) {
        return false;
      }
    }

    return true;
  };

  const displayGroups = _.groupBy(mods, (mod) => {
    switch (category) {
      case ModPickerCategories.general:
        return 'singleGroup';
      case ModPickerCategories.seasonal:
        return getSpecialtySocketMetadataByPlugCategoryHash(mod.mod.plug.plugCategoryHash)?.season;
      default:
        return mod.mod.plug.energyCost.energyType;
    }
  });

  const getSubHeader = (firstMod: LockedArmor2Mod) => {
    switch (category) {
      case ModPickerCategories.general:
        return null;
      case ModPickerCategories.seasonal:
        return (
          <h3>{`Season ${
            getSpecialtySocketMetadataByPlugCategoryHash(firstMod.mod.plug.plugCategoryHash)?.season
          }`}</h3>
        );
      default:
        return (
          <h3>
            {
              defs.EnergyType.get(firstMod.mod.plug.energyCost.energyTypeHash).displayProperties
                .name
            }
          </h3>
        );
    }
  };

  return (
    <div id={`mod-picker-section-${category}`}>
      <h2>{title}</h2>
      <div
        className={clsx({
          [styles.oneSection]: category === ModPickerCategories.general,
          [styles.fourSections]: category !== ModPickerCategories.general,
        })}
      >
        {Object.entries(displayGroups).map(([key, group], index) => (
          <div key={key} style={{ gridColumn: (index % 4) + 1 }}>
            {getSubHeader(group[0])}
            <div className={styles.mods}>
              {group.map((item) => (
                <LockedArmor2ModIcon
                  key={item.key}
                  item={item}
                  defs={defs}
                  clickable={isModClickable(item)}
                  closeable={Boolean(locked?.some((l) => l.mod.hash === item.mod.hash))}
                  onClick={() => onModSelected(item)}
                  onClose={() => onModRemoved(item)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModPickerSection;
