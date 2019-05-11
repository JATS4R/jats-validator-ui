import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'
import { editor, placeholder } from './editor'
import { Info } from './Info'
import logo from './logo.png'
import { Validations } from './Validations'

const VALIDATOR_URL = 'https://jats-validator.onrender.com'

const Container = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Helvetica Neue', Arial, sans-serif;
`

const Main = styled.div`
  flex: 1;
  width: 60%;
  max-width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Editor = styled.div`
  flex: 1;
  overflow: hidden;

  .CodeMirror {
    height: 100%;

    pre.CodeMirror-placeholder {
      color: #777;
    }
  }
`

const Sidebar = styled.div`
  flex: 1;
  width: 40%;
  max-width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-top: 80px;
  box-sizing: border-box;
`

const Header = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 120%;
  flex-wrap: wrap;
`

const Brand = styled.span``

const Logo = styled.div`
  display: flex;
  align-items: center;

  ${Brand} {
    margin: 0 1ch;
  }

  a {
    text-decoration: none;
  }
`

const Input = styled.input`
  margin: 1ch 0;
  display: flex !important;
`

export const App = () => {
  const [error, setError] = useState(undefined)
  const [xml, setXML] = useState(undefined)
  const [annotations, setAnnotations] = useState([])

  const addAnnotations = useCallback(
    newAnnotations => {
      setAnnotations(annotations => [...annotations, ...newAnnotations])
    },
    [setAnnotations]
  )

  const editorRef = useRef()

  useEffect(() => {
    editor.setOption('lint', {
      getAnnotations: () => annotations,
    })

    editor.performLint()
  }, [annotations])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.appendChild(editor.display.wrapper)
      editor.refresh()
    }
  }, [editorRef])

  useEffect(() => {
    // TODO: add hashchange listener?
    const params = new URLSearchParams(window.location.search.substr(1))

    if (params.get('url')) {
      setXML(undefined)
      // TODO: isFetching
      editor.setOption('placeholder', 'Fetching XML…')

      fetch(params.get('url'))
        .then(response => response.text())
        .then(xml => {
          setXML(xml)
        })
    }
  }, [setXML])

  useEffect(() => {
    if (!xml) {
      setAnnotations([])
    }
  }, [xml, setAnnotations])

  const scrollTo = useCallback(line => {
    if (!Number.isInteger(line)) {
      return
    }

    const pos = {
      line,
      ch: 0,
    }

    editor.getDoc().setSelection(pos)

    // scroll to line
    const height = editor.getScrollInfo().clientHeight
    const coords = editor.charCoords(pos, 'local')
    editor.scrollTo(null, (coords.top + coords.bottom - height) / 2)
  }, [])

  const onDrop = useCallback(
    acceptedFiles => {
      if (acceptedFiles.length) {
        setXML(undefined)
        editor.setOption('placeholder', 'Formatting XML…')

        const body = new FormData()
        body.set('xml', acceptedFiles[0])

        fetch(`${VALIDATOR_URL}/format`, {
          method: 'POST',
          body,
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('There was an error')
            }
            return response.text()
          })
          .then(xml => {
            setXML(xml)
            editor.setOption('placeholder', placeholder)
          })
          .catch(error => {
            setError(error)
          })
      }
    },
    [setXML]
  )

  useEffect(() => {
    editor.setValue(xml || '')
  }, [xml])

  const { getInputProps } = useDropzone({
    accept: '.xml',
    multiple: false,
    noClick: true,
    onDrop,
  })

  return (
    <Container>
      <Main>
        <Header>
          <Logo>
            <a href={'https://jats4r.org/'}>
              <img src={logo} alt={'JATS4R logo'} height={64} />
            </a>
            <Brand>Validator</Brand>
          </Logo>

          <Input
            {...getInputProps()}
            tabIndex={1}
            onMouseDown={event => {
              event.target.value = ''
              setXML(undefined)
            }}
          />
        </Header>

        <Editor ref={editorRef} tabIndex={2} />
      </Main>

      <Sidebar>
        {error && <div>{error.message}</div>}

        {xml ? (
          <div>
            <Validations
              title={'JATS DTD'}
              url={`${VALIDATOR_URL}/dtd`}
              xml={xml}
              addAnnotations={addAnnotations}
              scrollTo={scrollTo}
            />

            <Validations
              title={'JATS4R Schematron'}
              url={`${VALIDATOR_URL}/schematron`}
              xml={xml}
              addAnnotations={addAnnotations}
              scrollTo={scrollTo}
            />
          </div>
        ) : (
          <Info />
        )}
      </Sidebar>
    </Container>
  )
}
