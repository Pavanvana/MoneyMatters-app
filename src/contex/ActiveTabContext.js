import React from 'react'

const changeTabContex = React.createContext({
  activeTab: 'dashboard',
  changeTab: () => {}
})

export default changeTabContex