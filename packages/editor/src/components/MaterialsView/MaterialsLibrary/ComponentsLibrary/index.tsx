import * as React from "react";
import { observer } from "mobx-react";
import { MaterialsComponentMeta, Maybe } from "types";
import { materialsStore } from "states";
import { WithTagsList } from "../WithTagsList";
import { MaterialsViewType } from "../../HeaderOptions";
import { MaterialsComponentItem } from "./MaterialsComponentItem";
import "./index.scss";
import { MaterialsComponentPreview } from "./MaterialsComponentPreview";

interface State {
  currentComponent: Maybe<MaterialsComponentMeta>;
}

@observer
export class ComponentsLibrary extends React.Component {
  public state: State = {
    currentComponent: null
  };

  private onSelectItem = (currentComponent: MaterialsComponentMeta) => {
    this.setState({ currentComponent });
  };

  private renderItem = (item: MaterialsComponentMeta) => {
    const { currentComponent } = this.state;
    return (
      <MaterialsComponentItem
        key={item.identityName}
        item={item}
        currentItem={currentComponent ? currentComponent.identityName : null}
        onSelect={this.onSelectItem}
      />
    );
  };

  private renderPreview = () => {
    const { currentComponent } = this.state;
    if (!currentComponent) {
      return null;
    }
    return <MaterialsComponentPreview item={currentComponent} />;
  };

  public render() {
    return (
      <div className="vize-components-library">
        <WithTagsList
          view={MaterialsViewType.COMPONENTS}
          itemsMap={materialsStore.components}
        >
          {this.renderItem}
        </WithTagsList>
        {this.renderPreview()}
      </div>
    );
  }
}
