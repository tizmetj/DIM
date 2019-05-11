import { t } from 'app/i18next-t';
import React from 'react';
import { InventoryBucket } from '../../inventory/inventory-buckets';
import { D2Item } from '../../inventory/item-types';
import { DimStore } from '../../inventory/store-types';
import { ArmorSet, LockedItemType, StatTypes } from '../types';
import { toggleLockedItem } from './utils';
import { WindowScroller, AutoSizer, List } from 'react-virtualized';
import GeneratedSet from './GeneratedSet';
import { dimLoadoutService } from 'app/loadout/loadout.service';
import { newLoadout } from 'app/loadout/loadout-utils';
import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions.service';

interface Props {
  selectedStore: DimStore;
  sets: readonly ArmorSet[];
  lockedMap: Readonly<{ [bucketHash: number]: readonly LockedItemType[] }>;
  statOrder: StatTypes[];
  defs: D2ManifestDefinitions;
  onLockChanged(bucket: InventoryBucket, locked?: LockedItemType[]): void;
}

/**
 * Renders the generated sets (processedSets)
 */
export default class GeneratedSets extends React.Component<Props> {
  private windowScroller = React.createRef<WindowScroller>();

  componentDidUpdate() {
    this.windowScroller.current && this.windowScroller.current.updatePosition();
  }

  render() {
    const { lockedMap, selectedStore, sets, defs, statOrder } = this.props;

    return (
      <div className="generated-sets">
        <h2>
          {t('LoadoutBuilder.GeneratedBuilds')} ({sets.length.toLocaleString()} stat mixes)
          <button
            className="dim-button pull-right"
            onClick={() =>
              dimLoadoutService.editLoadout(newLoadout('', {}), { showClass: true, isNew: true })
            }
          >
            Create Empty Loadout
          </button>
        </h2>
        <p>
          Use the stat filters or lock perks and items to narrow down your potential loadouts. Don't
          forget you can create a loadout from scratch. You can shift-click any item or drag it to
          the sidebar to lock it. Shift click on any perk to lock it.
        </p>
        <WindowScroller ref={this.windowScroller}>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <AutoSizer disableHeight={true}>
              {({ width }) => (
                <List
                  autoHeight={true}
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  overscanRowCount={2}
                  rowCount={sets.length}
                  rowHeight={160}
                  rowRenderer={({ index, key, style }) => (
                    <GeneratedSet
                      key={key}
                      style={style}
                      set={sets[index]}
                      selectedStore={selectedStore}
                      lockedMap={lockedMap}
                      toggleLockedItem={this.toggleLockedItem}
                      defs={defs}
                      statOrder={statOrder}
                    />
                  )}
                  noRowsRenderer={() => <h3>{t('LoadoutBuilder.NoBuildsFound')}</h3>}
                  scrollTop={scrollTop}
                  width={width}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      </div>
    );
  }

  private toggleLockedItem = (lockedItem: LockedItemType) => {
    const bucket = (lockedItem.item as D2Item).bucket;
    toggleLockedItem(
      lockedItem,
      bucket,
      this.props.onLockChanged,
      this.props.lockedMap[bucket.hash]
    );
  };
}
