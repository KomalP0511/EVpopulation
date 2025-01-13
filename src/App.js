import { useState, useEffect } from 'react';
import { processCSVData } from './utils/csvParser';
import EVDashboard from './components/dashboard/EVDashboard';



function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL ;
    
    fetch(API_URL)
      .then(response => response.text())
      .then(csvText => {
        const processedData = processCSVData(csvText);
        setData(processedData);
        console.log(processedData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setIsLoading(false);
      });
  }, []);
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <EVDashboard data={data} />
    </div>
  );
}

export default App;