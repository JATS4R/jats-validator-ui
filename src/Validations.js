import React from 'react'
import styled from 'styled-components'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import WarningIcon from '@material-ui/icons/Warning'

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
`

const ValidationGroup = styled.details`
  padding: 0 16px;

  summary {
    margin: 8px 0;
  }
`

const Validation = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: start;
  font-size: 90%;
  background: #f6f6f6;
  transition: 0.2s background-color;

  border-top: 1px solid #fff;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;

  &:hover {
    background-color: #e8f2ff;
  }

  & svg {
    height: 16px;
    width: 16px;
  }
`

const Section = styled.div`
  &:not(:first-of-type) {
    margin-top: 16px;
  }
`

const Header = styled.div`
  padding: 0 16px;
  font-size: 120%;
  margin-bottom: 8px;
`

const Name = styled.div`
  margin-left: 8px;
`

export default ({ data: { dtd, schematron }, scrollTo }) => (
  <Container>
    {dtd && (
      <Section>
        <Header>DTD</Header>
        <div>
          {dtd.errors && dtd.errors.length > 0 && (
            <ValidationGroup open={dtd.errors.length > 0}>
              <summary style={{ color: 'red' }}>
                {dtd.errors.length}{' '}
                {dtd.errors.length === 1 ? 'error' : 'errors'}
              </summary>

              {dtd.errors.map((item, index) => (
                <Validation
                  key={`item-${index}`}
                  onClick={() => scrollTo(item.line - 1)}
                >
                  <ErrorIcon color="error" />
                  <Name>{item.message}</Name>
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
                >
                  <WarningIcon style={{ color: 'orange' }} />
                  <Name>
                    {item.name} :{item.message}
                  </Name>
                </Validation>
              ))}
            </ValidationGroup>
          )}
        </div>
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
                >
                  <ErrorIcon color="error" />
                  <Name>{item.description.replace(/^ERROR: /, '')}</Name>
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
                >
                  <WarningIcon style={{ color: 'orange' }} />
                  <Name>{item.description.replace(/^ERROR: /, '')}</Name>
                </Validation>
              ))}
            </ValidationGroup>
          )}

          {schematron.passed && schematron.passed.length > 0 && (
            <ValidationGroup open={false}>
              <summary style={{ color: 'green' }}>
                {schematron.passed.length} passed
              </summary>

              {schematron.passed.map((item, index) => (
                <Validation
                  key={`item-${index}`}
                  onClick={() => scrollTo(item.line - 1)}
                >
                  <CheckCircleIcon style={{ color: 'green' }} />
                  <Name>{item.description.replace(/^ERROR: /, '')}</Name>
                </Validation>
              ))}
            </ValidationGroup>
          )}
        </div>
      </Section>
    )}
  </Container>
)
