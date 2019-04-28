import React from 'react'
import styled from 'styled-components'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import WarningIcon from '@material-ui/icons/Warning'

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
`

const Validation = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: start;
  font-size: 90%;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }

  & svg {
    height: 16px;
    width: 16px;
  }
`

const Section = styled.div`
  &:not(:first-of-type) {
    margin-top: 8px;
  }
`

const Header = styled.div`
  padding: 0 16px;
  font-weight: bold;
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
          {dtd.errors &&
            dtd.errors.map((item, index) => (
              <Validation
                key={`item-${index}`}
                onClick={() => scrollTo(item.line - 1)}
              >
                <ErrorIcon color="error" />
                <Name>{item.message}</Name>
              </Validation>
            ))}

          {dtd.warnings &&
            dtd.warnings.map((item, index) => (
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
        </div>
      </Section>
    )}

    {schematron && (
      <Section>
        <Header>Schematron</Header>
        <div>
          {schematron.errors &&
            schematron.errors.map((item, index) => (
              <Validation
                key={`item-${index}`}
                onClick={() => scrollTo(item.line - 1)}
              >
                <ErrorIcon color="error" />
                <Name>{item.description.replace(/^ERROR: /, '')}</Name>
              </Validation>
            ))}

          {schematron.warnings &&
            schematron.warnings.map((item, index) => (
              <Validation
                key={`item-${index}`}
                onClick={() => scrollTo(item.line - 1)}
              >
                <WarningIcon style={{ color: 'orange' }} />
                <Name>{item.description.replace(/^ERROR: /, '')}</Name>
              </Validation>
            ))}

          {schematron.passed &&
            schematron.passed.map((item, index) => (
              <Validation
                key={`item-${index}`}
                onClick={() => scrollTo(item.line - 1)}
              >
                <CheckCircleIcon style={{ color: 'green' }} />
                <Name>{item.description.replace(/^ERROR: /, '')}</Name>
              </Validation>
            ))}
        </div>
      </Section>
    )}
  </Container>
)
