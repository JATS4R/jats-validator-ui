import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Helvetica Neue', Arial, sans-serif;
`

export const Main = styled.div`
  flex: 1;
  width: 60%;
  max-width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .CodeMirror {
    flex: 1;

    pre.CodeMirror-placeholder {
      color: #777;
    }
  }
`

export const Sidebar = styled.div`
  flex: 1;
  width: 40%;
  max-width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const Header = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 120%;
`

export const Brand = styled.span`
  //font-weight: bold;
`

export const Logo = styled.div`
  display: flex;
  align-items: center;

  ${Brand} {
    margin-left: 1ch;
  }
`
