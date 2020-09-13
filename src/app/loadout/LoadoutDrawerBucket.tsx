import { D1ManifestDefinitions } from 'app/destiny1/d1-definitions';
import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';
import Sockets from 'app/loadout-builder/generated-sets/Sockets';
import React from 'react';
import { InventoryBucket } from '../inventory/inventory-buckets';
import { DimItem } from '../inventory/item-types';
import { sortItems } from '../shell/filters';
import { addIcon, AppIcon } from '../shell/icons';
import { LoadoutItem } from './loadout-types';
import LoadoutDrawerItem from './LoadoutDrawerItem';

export default function LoadoutDrawerBucket({
  bucket,
  loadoutItems,
  items,
  itemSortOrder,
  defs,
  pickLoadoutItem,
  equip,
  remove,
}: {
  bucket: InventoryBucket;
  loadoutItems: LoadoutItem[];
  items: DimItem[];
  itemSortOrder: string[];
  defs: D1ManifestDefinitions | D2ManifestDefinitions;
  pickLoadoutItem(bucket: InventoryBucket): void;
  equip(item: DimItem, e: React.MouseEvent): void;
  remove(item: DimItem, e: React.MouseEvent): void;
}) {
  if (!bucket.type) {
    return null;
  }

  const equippedItems = sortItems(
    items.filter((i) =>
      loadoutItems.some((li) => li.id === i.id && li.hash === i.hash && li.equipped)
    ),
    itemSortOrder
  );
  const unequippedItems = sortItems(
    items.filter((i) =>
      loadoutItems.some((li) => li.id === i.id && li.hash === i.hash && !li.equipped)
    ),
    itemSortOrder
  );

  return (
    <div className="loadout-bucket">
      {equippedItems.length > 0 || unequippedItems.length > 0 ? (
        <>
          <div className="loadout-bucket-name">{bucket.name}</div>
          <div className={`loadout-bucket-items bucket-${bucket.type}`}>
            <div className="sub-bucket equipped">
              <div className="equipped-item">
                {equippedItems.length > 0 ? (
                  equippedItems.map((item) => (
                    <>
                      <LoadoutDrawerItem
                        key={item.index}
                        item={item}
                        equip={equip}
                        remove={remove}
                      />
                      {item.isDestiny2() && defs.isDestiny2() && (
                        <div style={{ marginLeft: 4 }}>
                          <Sockets item={item} defs={defs} showEquippedMods={true} />
                        </div>
                      )}
                    </>
                  ))
                ) : (
                  <a onClick={() => pickLoadoutItem(bucket)} className="pull-item-button">
                    <AppIcon icon={addIcon} />
                  </a>
                )}
              </div>
            </div>
            {(equippedItems.length > 0 || unequippedItems.length > 0) && bucket.type !== 'Class' && (
              <div className="sub-bucket">
                {unequippedItems.map((item) => (
                  <LoadoutDrawerItem key={item.index} item={item} equip={equip} remove={remove} />
                ))}
                {equippedItems.length > 0 &&
                  unequippedItems.length < bucket.capacity - 1 &&
                  bucket.type !== 'Class' && (
                    <a onClick={() => pickLoadoutItem(bucket)} className="pull-item-button">
                      <AppIcon icon={addIcon} />
                    </a>
                  )}
              </div>
            )}
          </div>
        </>
      ) : (
        <a onClick={() => pickLoadoutItem(bucket)} className="dim-button loadout-add">
          <AppIcon icon={addIcon} /> {bucket.name}
        </a>
      )}
    </div>
  );
}
