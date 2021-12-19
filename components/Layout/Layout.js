import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import React from 'react'

export default class Layout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      inFooter: false
    }
  }

  render () {
    return (
      <div className="Layout">
        <Header />
        <main>{this.props.children}</main>
        <Footer />
      </div>
    )
  }
}
