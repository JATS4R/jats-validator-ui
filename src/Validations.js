import React from 'react'
import styled from 'styled-components'
import replace from 'react-string-replace'

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

const Info = styled.div`
  padding: 0 16px;
  margin: 20px 32px;
  line-height: 1.5;
  border: 4px solid #add257;
  color: #333;

  & a {
    color: #35b47e;
    text-decoration: none;
    border-bottom: 2px solid #35b47e;
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

const formatMessage = message => {
  const text = message.replace(/^ERROR: /, '')

  return replace(text, /(https?:\/\/[^\s,]+)/, match => (
    <a href={match} target={'_blank'}>
      {match}
    </a>
  ))
}

export default ({ dtdResults, schematronResults, scrollTo }) => (
  <Container>
    {!dtdResults && !schematronResults && (
      <Info>
        <p>
          The JATS4R validator will validate an XML document against the
          appropriate JATS DTD (NISO JATS version{' '}
          <a href="https://jats.nlm.nih.gov/1.0/">1.0</a>,{' '}
          <a href="https://jats.nlm.nih.gov/1.1/">1.1</a> or{' '}
          <a href="https://jats.nlm.nih.gov/1.2/">1.2</a>), plus recommendations
          that have been{' '}
          <a href="https://jats4r.org/recommendations-list">
            {' '}
            published on the JATS4R website
          </a>
          .
        </p>

        <p>
          The source code (MIT-licensed where applicable) is available for{' '}
          <a href="https://github.com/JATS4R/jats-validator">
            the validator web service
          </a>
          ,{' '}
          <a href="https://github.com/JATS4R/jats-validator-ui">
            this user interface
          </a>
          ,{' '}
          <a href="https://github.com/JATS4R/jats-schematrons">
            the Schematron rules
          </a>{' '}
          and <a href="https://github.com/JATS4R/jats-dtds">the JATS DTDs</a>.
        </p>

        <p>
          The XML content will be sent to the JATS4R web service for validation.
          The doctype is logged, for usage metrics, but the rest of the XML
          document will not be stored.
        </p>
      </Info>
    )}

    {dtdResults && (
      <Section>
        <Header>JATS DTD</Header>

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
        <Header>JATS4R Schematron</Header>

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
                  <Message>{formatMessage(item.description)}</Message>
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
                  <Message>{formatMessage(item.description)}</Message>
                </Validation>
              ))}
            </ValidationGroup>
          )}
      </Section>
    )}
  </Container>
)
