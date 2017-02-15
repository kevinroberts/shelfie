import React from 'react'
import {createUltimatePagination, ITEM_TYPES} from './UltimatePagination'

const WrapperComponent = ({children}) => (
  <ul className='pagination'>{children}</ul>
)

const Page = ({value, isActive, onClick}) => (
  <li className={isActive ? 'page-item active' : 'page-item'}>
    <a className='page-link' href='javascript:void(0)' onClick={onClick}>{value}</a>
  </li>
)

const Ellipsis = ({onClick}) => (
  <li className='page-item'>
    <a className='page-link' href='javascript:void(0)' onClick={onClick}>...</a>
  </li>
)

const FirstPageLink = ({isActive, onClick}) => (
  <li className='page-item'>
    <a className='page-link' href='javascript:void(0)' onClick={onClick}>&laquo;</a>
  </li>
)

const PreviousPageLink = ({isActive, onClick}) => (
  <li className='page-item'>
    <a title='Previous page' className='page-link' href='javascript:void(0)' onClick={onClick}>&lsaquo;</a>
  </li>
)

const NextPageLink = ({isActive, onClick}) => (
  <li className='page-item'>
    <a title='Next page' className='page-link' href='javascript:void(0)' onClick={onClick}>&rsaquo;</a>
  </li>
)

const LastPageLink = ({isActive, onClick}) => (
  <li className='page-item'>
    <a className='page-link' href='javascript:void(0)' onClick={onClick}>&raquo;</a>
  </li>
)

const itemTypeToComponent = {
  [ITEM_TYPES.PAGE]: Page,
  [ITEM_TYPES.ELLIPSIS]: Ellipsis,
  [ITEM_TYPES.FIRST_PAGE_LINK]: FirstPageLink,
  [ITEM_TYPES.PREVIOUS_PAGE_LINK]: PreviousPageLink,
  [ITEM_TYPES.NEXT_PAGE_LINK]: NextPageLink,
  [ITEM_TYPES.LAST_PAGE_LINK]: LastPageLink
}

const UltimatePaginationBootstrap4 = createUltimatePagination({itemTypeToComponent, WrapperComponent})

export default UltimatePaginationBootstrap4
