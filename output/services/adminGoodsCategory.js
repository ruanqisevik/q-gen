import { stringify } from 'qs';
import request from '@/utils/request';

export async function insertAdminGoodsCategory(params) {
  return request({
    method: 'post',
    url: '/rest/admin/GoodsCategory/insert',
    params: params,
  })
}
