import './index.scss';
import * as React from 'react';
import { ComponentInstance } from '../../../types';
import { HotAreaItem } from './HotAreaItem';
import { AppRenderProps } from '../AppRender/types';

interface Props extends Pick<AppRenderProps, 'global' | 'meta'> {
  instance: ComponentInstance;
}

export function HotAreas({ instance, global, meta }: Props) {
  if (!instance?.hotAreas?.length) {
    return null;
  }

  return (
    <div className="vize-hotareas-container">
      {instance.hotAreas.map(hotArea => (
        <HotAreaItem key={hotArea.key} hotArea={hotArea} componentInstance={instance} global={global} meta={meta} />
      ))}
    </div>
  );
}