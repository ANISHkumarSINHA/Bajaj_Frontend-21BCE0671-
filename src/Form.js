import React, { useState } from 'react';

const Form = () => {
  const [jsonData, setJsonData] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(jsonData);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        setError('Invalid JSON format. Please include an array under the "data" key.');
        return;
      }
      setError('');

      // Call backend API
      const res = await fetch('http://localhost:5000/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError('Invalid JSON. Please correct the format.');
    }
  };

  const handleOptionChange = (e) => {
    const { value, checked } = e.target;
    setSelectedOptions(prev =>
      checked ? [...prev, value] : prev.filter(option => option !== value)
    );
  };

  const renderResponse = () => {
    if (!response) return null;
    const results = [];
    if (selectedOptions.includes('Alphabets')) {
      results.push(`Alphabets: ${response.alphabets.join(',')}`);
    }
    if (selectedOptions.includes('Numbers')) {
      results.push(`Numbers: ${response.numbers.join(',')}`);
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      results.push(`Highest Lowercase Alphabet: ${response.highest_lowercase_alphabet.join(',')}`);
    }
    return <div>{results.map((res, index) => <p key={index}>{res}</p>)}</div>;
  };

  return (
    <div>
      <h1>21BCE0671</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder='Enter JSON'
        />
        <button type='submit'>Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div>
          <h3>Multi Filter</h3>
          <div>
            <label>
              <input
                type='checkbox'
                value='Alphabets'
                onChange={handleOptionChange}
              />
              Alphabets
            </label>
            <label>
              <input
                type='checkbox'
                value='Numbers'
                onChange={handleOptionChange}
              />
              Numbers
            </label>
            <label>
              <input
                type='checkbox'
                value='Highest lowercase alphabet'
                onChange={handleOptionChange}
              />
              Highest Lowercase Alphabet
            </label>
          </div>
          <div>
            <h4>Filtered Response</h4>
            {renderResponse()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
