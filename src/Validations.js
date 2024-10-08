import CodeMirror from 'codemirror'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Section = styled.div`
  padding: 16px;
`

const Header = styled.div`
  font-size: 120%;
  margin-bottom: 8px;
  background: #35b47e;
  color: white;
  padding: 8px;
`

const Summary = styled.summary`
  margin: 8px 0;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

const Message = styled.div`
  padding: 8px 16px;
`

const Validation = styled.div`
  cursor: pointer;
  font-size: 90%;
  background: white;
  transition: 0.2s transform;

  margin-bottom: 3px;
  box-shadow: 0 1px 4px #ddd;

  &:hover {
    transform: translateX(-24px);
  }

  & ${Message} {
    border-left: 5px solid ${props => props.color};
  }
`

const hasError = results => {
  const types = ['errors', 'warnings']

  for (const type of types) {
    if (results[type] && results[type].length) {
      return true
    }
  }
}

const formatMessage = message => message.replace(/^\w+:\s+/, '')

const ValidationGroup = ({ results, scrollTo, color, text }) => {
  if (!results) {
    return null
  }

  return (
    <details open={results.length > 0}>
      <Summary style={{ color }}>
        {results.length} {results.length === 1 ? text.singular : text.plural}
      </Summary>

      {results.map((result, index) => (
        <Validation
          key={`result-${index}`}
          onClick={() => scrollTo(result.from.line)}
          color={color}
        >
          <Message>{result.message}</Message>
        </Validation>
      ))}
    </details>
  )
}

export const Validations = ({
  url,
  xml,
  addAnnotations,
  title,
  scrollTo,
  schematron,
}) => {
  const [error, setError] = useState(false)
  const [results, setResults] = useState(undefined)

  const abortRef = useRef(new AbortController())

  useEffect(() => {
    if (abortRef.current) {
      abortRef.current.abort()
    }

    abortRef.current = new AbortController()

    setResults(undefined)
    setError(undefined)

    const body = new FormData()
    body.set('xml', new File([xml], 'input.xml'))

    if (schematron) {
      body.set('schematron', schematron)
    }

    fetch(url, {
      method: 'POST',
      body,
      signal: abortRef.current.signal,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('There was an error')
        }
        return response.json()
      })
      .then(items => {
        const buildAnnotation = item => ({
          message: item.message || formatMessage(item.description), // schematron
          severity: item.type || 'error',
          from: CodeMirror.Pos(item.line - 1, item.column || 0),
          to: CodeMirror.Pos(item.line - 1, item.column || 0),
        })

        if (items.results) {
          items = items.results
        }

        const errors = items.errors ? items.errors.map(buildAnnotation) : []
        const infos = items.infos
          ? items.infos.map(buildAnnotation)
          : []
        const warnings = items.warnings
          ? items.warnings.map(buildAnnotation)
          : []

        addAnnotations([...errors, ...infos, ...warnings])
        setResults({ errors, infos, warnings })
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          setError(error)
        }
      })

    return () => {
      if (abortRef.current) {
        abortRef.current.abort()
      }
    }
  }, [xml, addAnnotations, url, schematron])

  return (
    <Section>
      <Header>{title}</Header>

      {error && <div>{error.message}</div>}

      {results ? (
        <div>
          {!hasError(results) && (
            <Validation color={'green'}>
              <Message>Validation passed</Message>
            </Validation>
          )}

          {results.errors.length > 0 && (
            <ValidationGroup
              results={results.errors}
              scrollTo={scrollTo}
              color={'red'}
              text={{ singular: 'error', plural: 'errors' }}
            />
          )}

          {results.warnings.length > 0 && (
            <ValidationGroup
              results={results.warnings}
              scrollTo={scrollTo}
              color={'orange'}
              text={{ singular: 'warning', plural: 'warnings' }}
            />
          )}

          {results.infos.length > 0 && (
            <ValidationGroup
              results={results.infos}
              scrollTo={scrollTo}
              color={'#00c'}
              text={{ singular: 'info', plural: 'infos' }}
            />
          )}
        </div>
      ) : (
        <div>Validating XML…</div>
      )}
    </Section>
  )
}
