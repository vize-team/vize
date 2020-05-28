import * as React from "react";
import { ComponentInstance } from "../../types";
import { ComponentView } from "./ComponentView";
import { globalStore, selectStore } from "../../states";
import classNames from "classnames";
import { ComponentMask } from "./ComponentMask";

import iframeStyle from "./index.iframe.scss";
import {
  ComponentContextMenu,
  showComponentContextMenu
} from "../ContextMenu/ComponentMenu";

globalStore.setIframeStyle("ComponentItem", iframeStyle);

interface Props {
  instance: ComponentInstance;
  currentSelectedKey: number;
}

export class ComponentItem extends React.Component<Props> {
  onSelect = () => {
    const {
      instance: { key }
    } = this.props;

    selectStore.selectComponent(key);
  };

  onContextMenu = (e: React.MouseEvent) => {
    showComponentContextMenu(e, this.props.instance.key);
  };

  render() {
    const { instance, currentSelectedKey } = this.props;
    const selected = instance.key === currentSelectedKey;

    return (
      <div
        className={classNames("vize-component-item", { selected })}
        data-key={instance.key}
      >
        <ComponentView instance={instance} />
        <ComponentMask
          instance={instance}
          selected={selected}
          onClick={this.onSelect}
          onContextMenu={this.onContextMenu}
        />
        <ComponentContextMenu instance={instance} />
      </div>
    );
  }
}
