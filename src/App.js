import React, { useState, useEffect, useCallback, useRef } from 'react'
import Validations from './Validations'
import CodeMirror, { createEditor } from './codemirror'
import { Brand, Container, Header, Logo, Main, Sidebar } from './components'
import { useDropzone } from 'react-dropzone'
import logo from './logo.png'

const VALIDATOR_URL = 'https://jats-validator.onrender.com'

const placeholder = 'Enter JATS XML or choose a file above…'

const validate = (xml, type) => {
  const body = new FormData()
  body.set('xml', xml)

  return fetch(`${VALIDATOR_URL}/${type}`, { method: 'POST', body }).then(
    response => response.json()
  )
}

const format = blob => {
  const body = new FormData()
  body.set('xml', blob)

  return fetch(`${VALIDATOR_URL}/format`, { method: 'POST', body }).then(
    response => response.text()
  )
}

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export const App = () => {
  const [editor, setEditor] = useState(undefined)
  const [xml, setXML] = useState()
  const [dtdResults, setDtdResults] = useState()
  const [schematronResults, setSchematronResults] = useState()

  const debouncedXML = useDebounce(xml, 1000)

  const onDrop = useCallback(
    acceptedFiles => {
      if (acceptedFiles.length) {
        editor.setOption('placeholder', 'Formatting XML…')
        editor.setValue('')

        format(acceptedFiles[0]).then(xml => {
          editor.setValue(xml)
          editor.setOption('placeholder', placeholder)
        })
      }
    },
    [editor]
  )

  const { getInputProps } = useDropzone({
    accept: '.xml',
    multiple: false,
    noClick: true,
    onDrop,
  })

  useEffect(() => {
    if (debouncedXML) {
      editor.performLint()
    }
  }, [debouncedXML, editor])

  const getAnnotations = useCallback(
    (source, updateLinting) => {
      updateLinting([])

      setDtdResults(null)

      setSchematronResults(null)

      if (!source) {
        return
      }

      setDtdResults({
        running: true,
      })

      setSchematronResults({
        running: true,
      })

      const annotations = []

      const dtd = async () => {
        const results = await validate(source, 'dtd')

        setDtdResults({ ...results, ready: true })

        const handleAnnotation = item => {
          annotations.push({
            message: item.message,
            severity: 'error',
            from: CodeMirror.Pos(item.line - 1, item.column),
            to: CodeMirror.Pos(item.line - 1, item.column),
          })
        }

        results.errors.forEach(handleAnnotation)
      }

      const schematron = async () => {
        const { results } = await validate(source, 'schematron')

        setSchematronResults({ ...results, ready: true })

        const handleAnnotation = item => {
          annotations.push({
            message: item.description,
            severity: item.type,
            from: CodeMirror.Pos(item.line - 1),
            to: CodeMirror.Pos(item.line - 1),
          })
        }

        results.errors.forEach(handleAnnotation)
        results.warnings.forEach(handleAnnotation)
      }

      dtd()
        .then(schematron)
        .then(() => {
          updateLinting(annotations)
        })
    },
    [setDtdResults, setSchematronResults]
  )

  const handleChange = useCallback(
    editor => {
      setXML(editor.getValue())
    },
    [setXML]
  )

  const editorRef = useRef(undefined)

  useEffect(() => {
    if (editorRef.current && !editor) {
      const editor = createEditor(editorRef.current, {
        getAnnotations,
        placeholder,
      })

      editor.on('change', handleChange)

      setEditor(editor)

      const params = new URLSearchParams(window.location.hash.substr(1))

      if (params.get('url')) {
        fetch(params.get('url'))
          .then(response => response.text())
          .then(xml => {
            editor.setValue(xml)
          })
      }
    }
  }, [editor, editorRef, getAnnotations, handleChange])

  const scrollTo = line => {
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
  }

  return (
    <Container>
      <Main>
        <Header>
          <Logo>
            <img src={logo} alt={'JATS4R logo'} height={64} />
            <Brand>Validator</Brand>
          </Logo>

          <input
            {...getInputProps()}
            tabIndex={1}
            style={{ display: 'flex' }}
            onMouseDown={event => {
              event.target.value = ''
            }}
          />
        </Header>

        <textarea ref={editorRef} tabIndex={2} />
      </Main>

      <Sidebar>
        <Validations
          dtdResults={dtdResults}
          schematronResults={schematronResults}
          scrollTo={scrollTo}
        />
      </Sidebar>
    </Container>
  )
}
