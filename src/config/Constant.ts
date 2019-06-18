export interface IOPtion {
  label: string
  value: string
}

/**
 * api请求地址
 */
export const API_URL: string = process.env.NODE_ENV === 'development' ? '' : '' 

/**
 * 默认请求超时时间
 */
export const REQUEST_TIME_OUT: number = 10000

/**
 * mock请求延时
 */
export const RESPONSE_DELAY: number = 10000

/**
 * 字段类型下拉列表选项
 */
export const filedTypeOptions: IOPtion[] = [
  {
    label: 'text',
    value: 'text'
  }, {
    label: 'keyword',
    value: 'keyword'
  }, {
    label: 'integer',
    value: 'integer'
  }, {
    label: 'long',
    value: 'long'
  }, {
    label: 'double',
    value: 'double'
  }, {
    label: 'date',
    value: 'date'
  }, {
    label: 'boolean',
    value: 'boolean'
  }
]

/**
 * 默认字段名(字段名/模板名)最大长度32个字符(不分中英文，统一最大长度32.实际字段只支持英文字母和下划线)
 */
export const defaultNameMaxLength: number = 32

/**
 * 默认字段含义(字段含义/模板描述)最大长度32个字符(不分中英文，统一最大长度32个字符)
 */
export const defaultRemarkMaxLength: number = 64
