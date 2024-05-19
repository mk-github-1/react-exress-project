import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './assets/App.css'
import styled from 'styled-components'

const App = (): JSX.Element => {
  const [count, setCount] = useState(0)

  return (
    <Wrapper>
      <div className="wrapper-container">
        <div className="header">
          <header>
            {/* <HeaderView /> */} <b>Vite + React (header)</b>
          </header>
        </div>

        <div className="global-navigation">
          <nav>{/* <MenuView /> */}navigation</nav>
        </div>
        <div className="content">
          <main>
            <div className="content-container">
              <p>content</p>
            </div>
            <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
            </div>
          </main>
        </div>
        <div className="footer">
          <footer>
            {/* <FooterView /> */}footer{' '}
            <a href="https://vitejs.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
            {/* <p className="read-the-docs">Click on the Vite and React logos to learn more</p> */}
            <span>
              Edit <code>src/App.tsx</code> and save to test HMR /{' '}
            </span>
            <span className="read-the-docs">Click on the Vite and React logos to learn more.</span>
          </footer>
        </div>
      </div>
    </Wrapper>
  )
}

export default App

const Wrapper = styled.div`
  .wrapper-container {
    /* rootに移動 */
    /* min-width: 720px; */
    /* max-width: 960px; */
    /* margin: 0 auto; */ /* 中央寄せ */
    height: 100vh;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: 40px 40px 1fr 40px;
    overflow: hidden;
  }

  .header {
    background-color: white;
    grid-row: 1 / 4;
    grid-column: 1 / -1;
    margin: 0;
    padding: 0.3rem;
  }

  .global-navigation {
    background-color: white;
    grid-row: 2 / 4;
    grid-column: 1 / -1;
    margin: 0;
    padding: 0.3rem;
  }

  .content {
    background-color: white;
    border-top: 1px solid rgb(240, 240, 240);
    grid-row: 3 / 4;
    grid-column: 1 / -1;
    padding: 0.3rem;
    overflow-y: scroll;
  }

  .footer {
    background-color: white;
    border-top: 1px solid rgb(240, 240, 240);
    grid-row: 4 / 4;
    grid-column: 1 / -1;
    margin: 0;
    padding: 0.3rem;
  }
`
