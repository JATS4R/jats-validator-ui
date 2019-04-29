import React, { useState, useEffect, useCallback, useRef } from 'react'
import Validations from './Validations'
import CodeMirror from './codemirror'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import {
  ButtonContainer,
  Container,
  Header,
  Main,
  Sidebar,
  Progress,
} from './components'
import { useDropzone } from 'react-dropzone'

const VALIDATOR_URL = 'https://jats-validator.onrender.com'

const validate = (xml, type) => {
  const body = new FormData()
  body.set('xml', xml)

  return fetch(`${VALIDATOR_URL}/${type}`, { method: 'POST', body }).then(
    response => response.json()
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
  const [formatting, setFormatting] = useState(false)
  const [validating, setValidating] = useState(false)
  const [data, setData] = useState({})
  const [xml, setXML] = useState()

  const debouncedXML = useDebounce(xml, 1000)

  const onDrop = useCallback(
    acceptedFiles => {
      const reader = new FileReader()
      reader.onload = () => {
        editor.setValue(reader.result)
      }
      reader.readAsText(acceptedFiles[0])
    },
    [editor]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: '.xml',
    multiple: false,
    noClick: true,
    onDrop,
  })

  const format = useCallback(() => {
    setFormatting(true)

    const body = new FormData()
    body.set('xml', editor.getValue())

    fetch(`${VALIDATOR_URL}/format`, { method: 'POST', body })
      .then(response => response.text())
      .then(xml => {
        editor.setValue(xml)
        setFormatting(false)
        setXML(xml)
      })
  }, [editor, setXML])

  useEffect(() => {
    if (debouncedXML) {
      editor.performLint()
    }
  }, [debouncedXML, editor])

  const getAnnotations = useCallback(
    (source, updateLinting) => {
      setData({})

      if (!source) {
        return
      }

      setValidating(true)

      const annotations = []

      const output = {
        dtd: null,
        schematron: null,
      }

      const dtd = async () => {
        const results = await validate(source, 'dtd')

        output.dtd = results

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

        output.schematron = results

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

        return results
      }

      dtd()
        .then(schematron)
        .then(() => {
          setData(output)
          updateLinting(annotations)
          setValidating(false)
        })
    },
    [setData, setValidating]
  )

  const handleChange = useCallback(
    editor => {
      setXML(editor.getValue())
    },
    [setXML]
  )

  const editorRef = useRef()

  useEffect(() => {
    if (editorRef.current && !editor) {
      const editor = CodeMirror.fromTextArea(editorRef.current, {
        mode: 'xml',
        dragDrop: false,
        foldGutter: true,
        lineNumbers: true,
        lineWrapping: true,
        gutters: [
          'CodeMirror-lint-markers',
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter',
        ],
        styleActiveLine: true,
        matchTags: {
          bothTags: true,
        },
        lint: {
          async: true,
          getAnnotations,
          lintOnChange: false,
        },
      })

      editor.on('change', handleChange)

      setEditor(editor)
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
    <Container {...getRootProps()}>
      <Main>
        <Header>
          <b>JATS4R Validator</b>

          {xml ? (
            <div>
              <ButtonContainer>
                <Button
                  mini={true}
                  color={'secondary'}
                  disabled={formatting}
                  onClick={() => format()}
                >
                  Indent
                </Button>
                {formatting && <Progress size={24} />}
              </ButtonContainer>

              <Button
                mini={true}
                color={'secondary'}
                onClick={() => {
                  editor.setValue('')
                }}
              >
                Reset
              </Button>
            </div>
          ) : (
            <Input inputProps={getInputProps({ style: { display: 'flex' } })}>
              <svg width="24" height="24">
                <path
                  d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"
                  style={{ fill: 'currentColor' }}
                />
              </svg>
              {isDragActive ? 'Drop' : 'Upload'}
            </Input>
          )}
        </Header>

        <textarea ref={editorRef} />
      </Main>

      <Sidebar>
        <Header>
          <b>Validations</b>

          {xml && (
            <ButtonContainer>
              <Button
                color="primary"
                disabled={validating}
                onClick={() => editor.performLint()}
              >
                Validate
              </Button>
              {validating && <Progress size={24} />}
            </ButtonContainer>
          )}
        </Header>

        <Validations data={data} scrollTo={scrollTo} />
      </Sidebar>
    </Container>
  )
}
