import { action, computed, observable } from "mobx";
import { message } from "antd";
import { PageInstance } from "types";
import { createPage } from "../utils";
import { componentsStore } from "./components";

export class PagesStore {
  public init = () => {
    this.addPage(true);
  };

  @observable
  public pages: PageInstance[] = [];

  @observable
  private currentPageIndex: number = 0;

  @computed
  public get currentPage(): PageInstance {
    return this.pages[this.currentPageIndex];
  }

  @action
  public setCurrentPage = (pageIndex: number): void => {
    this.currentPageIndex = pageIndex;
  };

  @action
  public addPage = (isHome?: boolean): void => {
    const page = createPage("new page", isHome);
    this.pages.push(page);
    componentsStore.addComponentInstancesMap(page.key);
  };

  @action
  public deletePage = (pageIndex: number): void => {
    if (this.pages.length === 1) {
      message.warn("至少保留一个页面");
      return;
    }

    const { key, isHome } = this.pages[pageIndex]!;
    componentsStore.deleteComponentInstancesMap(key);
    this.pages.splice(pageIndex, 1);

    if (this.currentPageIndex >= this.pages.length) {
      this.currentPageIndex -= 1;
    }

    if (isHome) {
      this.pages[0]!.isHome = true;
    }
  };

  @action
  public setPageHome = (pageIndex: number): void => {
    this.pages.find(i => i.isHome)!.isHome = false;
    this.pages[pageIndex].isHome = true;
  };

  @action
  public setPageName = (pageIndex: number, name: string): void => {
    this.pages[pageIndex].name = name;
  };
}

export const pagesStore = new PagesStore();
