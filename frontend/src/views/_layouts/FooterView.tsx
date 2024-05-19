import React from 'react'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

export const FooterView: React.FC = () => {
  return (
    <div>
      ©Sample system 2024{' '}
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <span className="read-the-docs">(Click on the Vite and React logos to learn more)</span>
    </div>
  )
}
