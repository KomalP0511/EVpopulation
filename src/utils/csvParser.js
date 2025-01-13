// utils/csvParser.js
export const processCSVData = (csvText) => {
    const rows = csvText.split('\n');
    const headers = rows[0].split(',');
    
    return rows.slice(1).map(row => {
      const values = row.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim();
        return obj;
      }, {});
    }).filter(row => Object.values(row).some(value => value)); // Remove empty rows
  };