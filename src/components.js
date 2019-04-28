import CircularProgress from '@material-ui/core/CircularProgress'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: sans-serif;
`

export const Main = styled.div`
  flex: 1;
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .CodeMirror {
    flex: 1;
  }
`

export const Sidebar = styled.div`
  flex: 1;
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const Header = styled.div`
  padding: 4px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
`

export const ButtonContainer = styled.span`
  position: relative;
`

export const Progress = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`
