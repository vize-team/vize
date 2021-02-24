import './index.scss';
import * as React from 'react';
import { PageHeader, Button, Input, Tooltip } from 'antd';
import { BiGlobe } from 'react-icons/bi';
import { useUser } from 'hooks';
import { BreadcrumbNavigator } from './BreadcrumbNavigator';
import AVATAR from 'static/avatar.png';

interface Props {
  title: string;
  searchText?: string;
  onSearch?: (v: string) => void;
  appendAfterSearch?: React.ReactNode;
}

const { Search } = Input;

export function Header({ title, children, searchText, onSearch, appendAfterSearch }: React.PropsWithChildren<Props>) {
  const [, user] = useUser();

  return (
    <PageHeader className="main-header">
      <div className="header-top">
        <BreadcrumbNavigator />
        <div className="header-operations">
          <Button className="languages" icon={<BiGlobe />}>
            中
          </Button>
          <Tooltip
            title={
              <div className="user-logout">
                <p>{user?.name}</p>
                <a href="/logout">
                  <Button type="link">登出</Button>
                </a>
              </div>
            }
          >
            <img src={AVATAR} alt="avatar" className="avatar" />
          </Tooltip>
        </div>
      </div>

      <h1>{title}</h1>

      {onSearch ? (
        <div className="search-wrap">
          <Search placeholder={searchText} onSearch={onSearch} enterButton size="large" />
          {appendAfterSearch}
        </div>
      ) : null}

      {children}
    </PageHeader>
  );
}
