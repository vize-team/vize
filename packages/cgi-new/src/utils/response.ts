import { Response } from 'types';

export class CGIResponse {
  static success<T = any>(data?: T, msg?: string): Response<T> {
    return {
      t: Date.now(),
      status: 'success',
      message: msg,
      data,
      code: 400000,
    };
  }

  static failed<T = any>(code: CGICodeMap, reason?: string): Response<T> {
    return {
      t: Date.now(),
      status: 'failed',
      message: reason || CGIReasonMap[code] || `ErrorCode: ${code}`,
      code,
    };
  }
}

export enum CGICodeMap {
  BizExists = 400001,
  PageExists = 400002,
  PageNotExists = 400003,
  PageUpdateFailed = 400004,
}

const CGIReasonMap: { [key in CGICodeMap]: string } = {
  [CGICodeMap.BizExists]: 'biz exists',
  [CGICodeMap.PageExists]: 'page exists',
  [CGICodeMap.PageNotExists]: 'page not exists',
  [CGICodeMap.PageUpdateFailed]: '',
};
