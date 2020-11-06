import { action, computed, observable } from 'mobx';
import { getQueryParams } from 'utils';
import { LayoutMode, PageMode } from 'types';
import { StoreWithUtils } from './utils';

export class EditStore extends StoreWithUtils<EditStore> {
  constructor() {
    super();
    const { key, libs, debugPorts, container } = getQueryParams();
    this.pageKey = key;
    this.libNames = libs;
    this.containerName = container;
    this.debugPorts = debugPorts;
    this.mainLib = libs[0];
  }

  public readonly pageKey: string;

  public readonly containerName: string;

  public readonly libNames: string[];

  public readonly mainLib: string;

  public readonly debugPorts: number[];

  public layoutMode: LayoutMode = LayoutMode.STREAM;

  public pageMode: PageMode = PageMode.SINGLE;

  @computed
  public get isSinglePageMode() {
    return this.pageMode === PageMode.SINGLE;
  }

  @observable
  public previewMode = false;

  @action
  public togglePreviewMode = () => {
    this.previewMode = !this.previewMode;
  };

  @observable
  public iframeStyleMap: { [name: string]: string } = {};

  @action
  public setIframeStyle = (name: string, style: string) => {
    this.iframeStyleMap[name] = style;
  };
}

export const editStore = new EditStore();