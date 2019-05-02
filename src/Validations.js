import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-top: 80px;
`

const Section = styled.div`
  padding: 16px;
`

const Header = styled.div`
  font-size: 120%;
  margin-bottom: 8px;
`

const ValidationGroup = styled.details`
  summary {
    margin: 8px 0;
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }
`

const Message = styled.div`
  padding: 8px 16px;
`

const Validation = styled.div`
  cursor: pointer;
  font-size: 90%;
  background: none;
  transition: 0.2s transform;

  margin-bottom: 3px;
  box-shadow: 0 1px 4px #ddd;

  &:hover {
    transform: translateX(-16px);
  }

  & svg {
    height: 16px;
    width: 16px;
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

export default ({ dtdResults, schematronResults, scrollTo }) => (
  <Container>
    {dtdResults && (
      <Section>
        <Header>DTD</Header>

        {dtdResults.running ? (
          <div>Running…</div>
        ) : (
          dtdResults.ready &&
          !hasError(dtdResults) && (
            <Validation color={'green'}>
              <Message>DTD validation passed</Message>
            </Validation>
          )
        )}

        {dtdResults.ready && dtdResults.errors && dtdResults.errors.length > 0 && (
          <ValidationGroup open={dtdResults.errors.length > 0}>
            <summary style={{ color: 'red' }}>
              {dtdResults.errors.length}{' '}
              {dtdResults.errors.length === 1 ? 'error' : 'errors'}
            </summary>

            {dtdResults.errors.map((item, index) => (
              <Validation
                key={`item-${index}`}
                onClick={() => scrollTo(item.line - 1)}
                color={'red'}
              >
                <Message>{item.message}</Message>
              </Validation>
            ))}
          </ValidationGroup>
        )}

        {dtdResults.ready &&
          dtdResults.warnings &&
          dtdResults.warnings.length > 0 && (
            <ValidationGroup open={dtdResults.warnings.length > 0}>
              <summary style={{ color: 'orange' }}>
                {dtdResults.warnings.length}{' '}
                {dtdResults.warnings.length === 1 ? 'warning' : 'warnings'}
              </summary>

              {dtdResults.warnings.map((item, index) => (
                <Validation
                  key={`item-${index}`}
                  onClick={() => scrollTo(item.line - 1)}
                  color={'orange'}
                >
                  <Message>
                    {item.name}: {item.message}
                  </Message>
                </Validation>
              ))}
            </ValidationGroup>
          )}
      </Section>
    )}

    {schematronResults && (
      <Section>
        <Header>Schematron</Header>

        {schematronResults.running ? (
          <div>Running…</div>
        ) : (
          dtdResults.ready &&
          !hasError(schematronResults) && (
            <Validation color={'green'}>
              <Message>Schematron validation passed</Message>
            </Validation>
          )
        )}

        {schematronResults.ready &&
          schematronResults.errors &&
          schematronResults.errors.length > 0 && (
            <ValidationGroup open={schematronResults.errors.length > 0}>
              <summary style={{ color: 'red' }}>
                {schematronResults.errors.length}{' '}
                {schematronResults.errors.length === 1 ? 'error' : 'errors'}
              </summary>

              {schematronResults.errors.map((item, index) => (
                <Validation
                  key={`item-${index}`}
                  onClick={() => scrollTo(item.line - 1)}
                  color={'red'}
                >
                  <Message>{item.description.replace(/^ERROR: /, '')}</Message>
                </Validation>
              ))}
            </ValidationGroup>
          )}

        {schematronResults.ready &&
          schematronResults.warnings &&
          schematronResults.warnings.length > 0 && (
            <ValidationGroup open={schematronResults.warnings.length > 0}>
              <summary style={{ color: 'orange' }}>
                {schematronResults.warnings.length}{' '}
                {schematronResults.warnings.length === 1
                  ? 'warning'
                  : 'warnings'}
              </summary>

              {schematronResults.warnings.map((item, index) => (
                <Validation
                  key={`item-${index}`}
                  onClick={() => scrollTo(item.line - 1)}
                  color={'orange'}
                >
                  <Message>{item.description.replace(/^ERROR: /, '')}</Message>
                </Validation>
              ))}
            </ValidationGroup>
          )}
      </Section>
    )}
  </Container>
)
