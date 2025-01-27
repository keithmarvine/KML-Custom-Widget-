/** @jsx jsx */
import { jsx } from 'jimu-core'
import React, { useState } from 'react'

export default function Widget () {
  const [fileName, setFileName] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<any[] | null>(null)

  // Function to parse the KML file content
  const parseKML = (kmlContent: string) => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(kmlContent, 'text/xml')

    // Check for XML parsing errors
    const parserErrors = xmlDoc.getElementsByTagName('parsererror')
    if (parserErrors.length > 0) {
      console.error('Invalid KML file: XML parsing error.')
      return []
    }

    // Extract Placemark elements
    const placemarks = xmlDoc.getElementsByTagName('Placemark')
    const features = Array.from(placemarks).map((placemark) => {
      const name = placemark.getElementsByTagName('name')[0]?.textContent || 'Unnamed'
      const coordinates = placemark.getElementsByTagName('coordinates')[0]?.textContent?.trim()

      if (!coordinates) {
        console.warn('Missing coordinates in a Placemark.')
        return null
      }

      return { name, coordinates }
    }).filter(Boolean) // Remove null entries

    return features
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          console.log('KML Content:', result) // Log the KML content
          const parsedFeatures = parseKML(result)
          setParsedData(parsedFeatures) // Set parsed data
          console.log('Parsed Features:', parsedFeatures)
        } else {
          console.error('File content is not a string.')
        }
      }

      reader.onerror = () => {
        console.error('Error reading the file.')
      }

      reader.readAsText(file) // Read the file as text
    } else {
      console.error('No file selected.')
    }
  }

  return (
    <div className="widget-kml-uploader jimu-widget">
      <h3>KML File Uploader</h3>
      <input
        type="file"
        accept=".kml"
        onChange={handleFileUpload}
        style={{ margin: '10px 0' }}
      />
      {fileName && <p>Uploaded File: {fileName}</p>}

      {parsedData && parsedData.length > 0
        ? (
          <div>
            <h4>Parsed Data:</h4>
            <ul>
              {parsedData.map((feature, index) => (
                <li key={index}>
                  <strong>{feature.name}</strong>: {feature.coordinates}
                </li>
              ))}
            </ul>
          </div>
          )
        : (
            fileName && <p>No valid data found in the file.</p>
          )}
    </div>
  )
}
