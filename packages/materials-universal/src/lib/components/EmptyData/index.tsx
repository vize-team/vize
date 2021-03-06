import './index.scss';
import * as React from 'react';

interface Props {
  text: string;
}
export function EmptyData({ text }: Props) {
  return <div className="vize_empty_data">{text || '无数据'}</div>;
}
