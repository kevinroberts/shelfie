import React, { Component } from 'react'

export default class Footer extends Component {

  render () {
    const CURRENT_YEAR = new Date().getFullYear()
    return (
      <footer className='footer container-fluid'>
        <div className='container'>
          <p className='pull-left'>Copyright &copy; <a href='http://www.kevinroberts.us'>Vinberts</a> {CURRENT_YEAR}. All rights reserved.</p>
          <div className='pull-right'>
            <ul className='nav nav-pills'>
              <li className='nav-item'><a href='#asdf'>Privacy</a></li>
              <li className='nav-item'><a href='#sdgds'>Legal</a></li>
              <li className='nav-item'><a href='http://www.kevinroberts.us'>About</a></li>
            </ul>
          </div>
        </div>
      </footer>
    )
  }
}
