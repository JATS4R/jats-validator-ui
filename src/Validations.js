import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
`

const Section = styled.div`
  margin: 32px 0 0 16px;
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
  const types = ['errors', 'warnings', 'passed']

  for (const type of types) {
    if (results[type] && results[type].length) {
      return true
    }
  }
}

export default ({ data: { dtd, schematron }, scrollTo }) => (
  <Container>
    {dtd && (
      <Section>
        <Header>DTD</Header>

        {!hasError(dtd) && (
          <Validation color={'green'}>
            <Message>DTD validation passed</Message>
          </Validation>
        )}

        {dtd.errors && dtd.errors.length > 0 && (
          <ValidationGroup open={dtd.errors.length > 0}>
            <summary style={{ color: 'red' }}>
              {dtd.errors.length} {dtd.errors.length === 1 ? 'error' : 'errors'}
            </summary>

            {dtd.errors.map((item, index) => (
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

        {dtd.warnings && dtd.warnings.length > 0 && (
          <ValidationGroup open={dtd.warnings.length > 0}>
            <summary style={{ color: 'orange' }}>
              {dtd.warnings.length}{' '}
              {dtd.warnings.length === 1 ? 'warning' : 'warnings'}
            </summary>

            {dtd.warnings.map((item, index) => (
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

    {schematron && (
      <Section>
        <Header>Schematron</Header>
        <div>
          {schematron.errors && schematron.errors.length > 0 && (
            <ValidationGroup open={schematron.errors.length > 0}>
              <summary style={{ color: 'red' }}>
                {schematron.errors.length}{' '}
                {schematron.errors.length === 1 ? 'error' : 'errors'}
              </summary>

              {schematron.errors.map((item, index) => (
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

          {schematron.warnings && schematron.warnings.length > 0 && (
            <ValidationGroup open={schematron.warnings.length > 0}>
              <summary style={{ color: 'orange' }}>
                {schematron.warnings.length}{' '}
                {schematron.warnings.length === 1 ? 'warning' : 'warnings'}
              </summary>

              {schematron.warnings.map((item, index) => (
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

          {schematron.passed && schematron.passed.length > 0 && (
            <ValidationGroup open={false}>
              <summary style={{ color: 'green' }}>
                {schematron.passed.length} tests passed
              </summary>

              {schematron.passed.map((item, index) => (
                <Validation
                  key={`item-${index}`}
                  onClick={() => scrollTo(item.line - 1)}
                  color={'green'}
                >
                  <Message>{item.description.replace(/^ERROR: /, '')}</Message>
                </Validation>
              ))}
            </ValidationGroup>
          )}
        </div>
      </Section>
    )}
  </Container>
)
