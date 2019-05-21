import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 0 24px;
  margin: 0 16px;
  line-height: 1.5;
  color: #333;
  max-height: 100%;
  overflow-y: auto;

  & a {
    color: #35b47e;
    text-decoration: none;
    border-bottom: 2px solid #35b47e;
  }
`

export const Info = () => (
  <Container>
    <p>
      This JATS4R validator will validate an XML document against the
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
      <a href="https://github.com/JATS4R/jats-validator-ui">
        this user interface
      </a>
      ,{' '}
      <a href="https://github.com/JATS4R/jats-validator">
        the validator web service
      </a>
      ,{' '}
      <a href="https://github.com/JATS4R/jats-schematrons">
        the Schematron rules
      </a>{' '}
      and <a href="https://github.com/JATS4R/jats-dtds">the JATS DTDs</a>.
    </p>

    <p>
      The XML content will be sent to the JATS4R web service for validation. The
      doctype is logged, for usage metrics, but the rest of the XML document
      will not be stored.
    </p>
  </Container>
)
