// Use shared Supabase client from supabaseClient.js
const supabase = window.supabaseClient;


// Initialize chart references
let realtimeChart;
let timestamps = [], apparent_power = [];
let minPowerData = [], maxPowerData = [], avgPowerData = [];

// Real-Time Data: Fetch and update table and chart
async function fetchRealtimeData() {
    try {
        const { data, error } = await supabase
            .from('realtime_readings')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(3600); // Get the latest 3600 records

        if (error) throw new Error(error.message);

        console.log('Realtime Data:', data); // Log the data to debug

        // Clear existing table data
        const tableBody = document.querySelector('#realtime-table tbody');
        tableBody.innerHTML = '';

        // Update table and chart only if data is available
        if (data && data.length > 0) {
            // Process and update table data
            data.forEach(row => {
                updateRealtimeTable(row);
            });

            // Update chart with all data points
            updateRealtimeChartWithMultiplePoints(data);
        }
    } catch (err) {
        console.error('Error fetching real-time data:', err.message);
    }
}

// Real-Time Table: Update the table with data
function updateRealtimeTable(row) {
    const tableBody = document.querySelector('#realtime-table tbody');
    const newRow = document.createElement('tr');
    
    const switchStateText = row.switch_state ? 'ON' : 'OFF';
    
    newRow.innerHTML = `
        <td>${new Date(row.timestamp).toLocaleString()}</td>
        <td>${row.voltage !== null ? row.voltage.toFixed(2) : 'N/A'}</td>
        <td>${row.current !== null ? row.current.toFixed(2) : 'N/A'}</td>
        <td>${row.power_factor !== null ? row.power_factor.toFixed(2) : 'N/A'}</td>
        <td>${row.active_power !== null ? row.active_power.toFixed(2) : 'N/A'}</td>
        <td>${row.apparent_power !== null ? row.apparent_power.toFixed(2) : 'N/A'}</td>
        <td>${row.total_energy !== null ? row.total_energy.toFixed(2) : 'N/A'}</td>
        <td>${switchStateText}</td>
    `;
    
    tableBody.appendChild(newRow);
}

// Real-Time Chart: Update with multiple data points and Min, Max, Average horizontal lines
function updateRealtimeChartWithMultiplePoints(data) {
    // Reset arrays to ensure consistent data
    timestamps = [];
    apparent_power = [];
    minPowerData = [];
    maxPowerData = [];
    avgPowerData = [];

    // Process data in chronological order (oldest first)
    const sortedData = [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Add all data points
    sortedData.forEach(row => {
        timestamps.push(new Date(row.timestamp).toLocaleTimeString());
        apparent_power.push(row.apparent_power);
    });

    // Calculate Min, Max, and Average for the last 1 hour (60 minutes)
    const timeInterval = 60; // minutes (updated for 1 hour)
    let intervalData = [];
    let currentTime = new Date();

    // Go through the data in reverse (starting from the most recent)
    for (let i = sortedData.length - 1; i >= 0; i--) {
        const dataTime = new Date(sortedData[i].timestamp);
        const timeDifference = (currentTime - dataTime) / (1000 * 60); // Convert to minutes
        
        // If the data is within the last 1 hour, include it
        if (timeDifference <= timeInterval) {
            intervalData.push(sortedData[i].apparent_power);
        } else {
            break; // Stop when we are outside the 1-hour window
        }
    }

    // Calculate Min, Max, and Average
    if (intervalData.length > 0) {
        const minPower = Math.min(...intervalData);
        const maxPower = Math.max(...intervalData);
        const avgPower = intervalData.reduce((sum, power) => sum + power, 0) / intervalData.length;

        minPowerData.push(minPower);
        maxPowerData.push(maxPower);
        avgPowerData.push(avgPower);
    }

    // Initialize or update the chart
    if (!realtimeChart) {
        const ctx = document.getElementById('realtime-chart').getContext('2d');
        realtimeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: 'Apparent Power (VA)',
                        data: apparent_power,
                        borderColor: '#2196F3',
                        borderWidth: 2,
                        fill: false
                    },
                    {
                        label: 'Min Power (VA)',
                        data: Array(timestamps.length).fill(Math.min(...minPowerData)),
                        borderColor: '#FF0000', // Red for Min Power line
                        borderWidth: 2,
                        fill: false,
                        borderDash: [5, 5] // Dotted line
                    },
                    {
                        label: 'Max Power (VA)',
                        data: Array(timestamps.length).fill(Math.max(...maxPowerData)),
                        borderColor: '#00FF00', // Green for Max Power line
                        borderWidth: 2,
                        fill: false,
                        borderDash: [5, 5] // Dotted line
                    },
                    {
                        label: 'Avg Power (VA)',
                        data: Array(timestamps.length).fill(avgPowerData[0] || 0), // Only one value for the last 1 hour
                        borderColor: '#FF9800', // Orange for Avg Power line
                        borderWidth: 2,
                        fill: false,
                        borderDash: [5, 5] // Dotted line
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        reverse: true, // Display newest data on the right
                        title: { display: true, text: 'Time' }
                    },
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Apparent Power (VA)' },
                        min: Math.min(0),
                        max: Math.max(...minPowerData.concat(maxPowerData, avgPowerData)) + 5 // Set max to slightly higher
                    }
                }
            }
        });
    } else {
        // Update chart data for the new data points and lines
        realtimeChart.data.labels = timestamps;
        realtimeChart.data.datasets[0].data = apparent_power;
        realtimeChart.data.datasets[1].data = Array(timestamps.length).fill(Math.min(...minPowerData));
        realtimeChart.data.datasets[2].data = Array(timestamps.length).fill(Math.max(...maxPowerData));
        realtimeChart.data.datasets[3].data = Array(timestamps.length).fill(avgPowerData[0] || 0);
        realtimeChart.update();
    }
}

// Function to fetch data from Supabase for bar chart
async function fetchData() {
    const { data, error } = await supabase
      .from('enrgy')  // Replace with your table name
      .select('timestamp, energy'); // Replace with your column names
  
    if (error) {
      console.error('Error fetching data:', error);
      return;
    }
  
    return data;
}
  
// Function to create the bar chart
async function createBarChart() {
    const data = await fetchData();
  
    if (data) {
        const labels = data.map(item => item.timestamp);  // Replace with the appropriate column for X-axis labels
        const values = data.map(item => item.energy);  // Replace with the column for Y-axis values
  
        const ctx = document.getElementById('myBarChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Energy Dataset',
                    data: values,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

// Fetch data from Supabase and render the chart
async function fetchDataAndRenderChart1(chartId) {
    // Query Supabase to get the data
    const { data, error } = await supabase
        .from('dayenergy')  // Change 'dayenergydummy' to your table name
        .select('*');

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    const labels = [];
    const values = [];

    // Process data
    data.forEach(item => {
        const date = new Date(item.timestamp).toISOString().split('T')[0]; // Extract date
        labels.push(date);
        values.push(item.energy); // Adjust if column name differs
    });

    // Compute Min, Max, and Average
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const avgValue = values.reduce((sum, value) => sum + value, 0) / values.length;

    // Get Chart Canvas
    const ctx = document.getElementById(chartId).getContext('2d');

    // Create Chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Energy Consumption (KW)',
                data: values,
                backgroundColor: 'rgba(33, 149, 243, 0.5)',
                borderColor: 'rgb(33, 150, 243)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxValue + 5 // Extend max slightly
                }
            },
            plugins: {
                annotation: {
                    annotations: {
                        minLine: {
                            type: 'line',
                            yMin: minValue,
                            yMax: minValue,
                            borderColor: 'rgba(255, 0, 0, 0.6)',
                            borderWidth: 2,
                            label: {
                                display: true,
                                content: `Min: ${minValue} KW`,
                                position: 'start', // Label appears above
                                yAdjust: -10, // Move up
                                backgroundColor: 'red',
                                color: 'white',
                                font: { size: 12 }
                            }
                        },
                        maxLine: {
                            type: 'line',
                            yMin: maxValue,
                            yMax: maxValue,
                            borderColor: 'rgba(4, 184, 70, 0.6)',
                            borderWidth: 2,
                            label: {
                                display: true,
                                content: `Max: ${maxValue} KW`,
                                position: 'start',
                                yAdjust: -10,
                                backgroundColor: 'green',
                                color: 'white',
                                font: { size: 12 }
                            }
                        },
                        avgLine: {
                            type: 'line',
                            yMin: avgValue,
                            yMax: avgValue,
                            borderColor: 'rgba(255, 119, 0, 0.6)',
                            borderWidth: 2,
                            label: {
                                display: true,
                                content: `Avg: ${avgValue.toFixed(2)} KW`,
                                position: 'start',
                                yAdjust: -10,
                                backgroundColor: 'orange',
                                color: 'white',
                                font: { size: 12 }
                            }
                        }
                    }
                }
            }
        }
    });
}

// Fetch data from Supabase and render the chart
async function fetchDataAndRenderChart3(chartId) {
    // Query Supabase to get the data
    const { data, error } = await supabase
        .from('energy')  // Change 'dayenergydummy' to your table name
        .select('*');

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

// Initialize the arrays
const labels = [];
const values = [];

// Process data and adjust for Sri Lanka Standard Time (SLT)
data.forEach(item => {
    // Convert timestamp to Date object
    const date = new Date(item.timestamp);

    // Adjust the time to Sri Lanka Standard Time (UTC +5:30)
    const sltDate = new Date(date.getTime() + 0.0 * 60 * 60 * 1000); // Adding 5 hours 30 minutes (5.5 hours) to UTC time

    // Extract the hour from the SLT Date object
    let hour = sltDate.getHours();  // Get the hour from the adjusted time (in SLT)

    // Optional: format the hour to ensure two digits (e.g., 08, 09)
    hour = hour < 10 ? `0${hour}` : hour;

    // Push the hour as the label and the energy value into the respective arrays
    labels.push(hour); 
    values.push(item.energy);  // Adjust if your column name is different
});


    // Compute Min, Max, and Average
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const avgValue = values.reduce((sum, value) => sum + value, 0) / values.length;

    // Get Chart Canvas
    const ctx = document.getElementById(chartId).getContext('2d');

    // Create Chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Energy Consumption (W)',
                data: values,
                backgroundColor: 'rgba(33, 149, 243, 0.5)',
                borderColor: 'rgb(33, 150, 243)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxValue + 5 // Extend max slightly
                }
            },
            plugins: {
                annotation: {
                    annotations: {
                        minLine: {
                            type: 'line',
                            yMin: minValue,
                            yMax: minValue,
                            borderColor: 'rgba(255, 0, 0, 0.6)',
                            borderWidth: 2,
                            label: {
                                display: true,
                                content: `Min: ${minValue} W`,
                                position: 'start', // Label appears above
                                yAdjust: -10, // Move up
                                backgroundColor: 'red',
                                color: 'white',
                                font: { size: 12 }
                            }
                        },
                        maxLine: {
                            type: 'line',
                            yMin: maxValue,
                            yMax: maxValue,
                            borderColor: 'rgba(4, 184, 70, 0.6)',
                            borderWidth: 2,
                            label: {
                                display: true,
                                content: `Max: ${maxValue} W`,
                                position: 'start',
                                yAdjust: -10,
                                backgroundColor: 'green',
                                color: 'white',
                                font: { size: 12 }
                            }
                        },
                        avgLine: {
                            type: 'line',
                            yMin: avgValue,
                            yMax: avgValue,
                            borderColor: 'rgba(255, 119, 0, 0.6)',
                            borderWidth: 2,
                            label: {
                                display: true,
                                content: `Avg: ${avgValue.toFixed(2)} W`,
                                position: 'start',
                                yAdjust: -10,
                                backgroundColor: 'orange',
                                color: 'white',
                                font: { size: 12 }
                            }
                        }
                    }
                }
            }
        }
    });
}      

// Function to toggle switch state in Supabase
async function toggleSwitch() {
    const switchElement = document.getElementById('switch');
    const targetState = switchElement.checked;

    try {
        const { error } = await supabase
            .from('realtime_readings')
            .insert([{
                timestamp: new Date().toISOString(),
                switch_state: targetState
            }]);

        if (error) throw error;
        console.log('Switch state updated successfully to', targetState);
    } catch (error) {
        console.error('Error updating switch state:', error.message || error);
        switchElement.checked = !targetState;
    }
}

// Fetch current switch state from Supabase
async function syncSwitchState() {
    try {
        const { data, error } = await supabase
            .from('realtime_readings')
            .select('switch_state')
            .order('timestamp', { ascending: false })
            .limit(1);

        if (error) throw error;
        if (data && data.length > 0) {
            const switchElement = document.getElementById('switch');
            if (switchElement) {
                switchElement.checked = Boolean(data[0].switch_state);
            }
        }
    } catch (error) {
        console.error('Error retrieving switch state:', error.message || error);
    }
}

// Setup Logout Button
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                if (supabase) await supabase.auth.signOut();
            } catch (e) {
                console.error(e);
            }
            window.location.href = 'index.html';
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setupLogout();
    fetchDataAndRenderChart1('powerChart1');
    fetchDataAndRenderChart3('powerChart5');
    createBarChart();
    fetchRealtimeData();
    syncSwitchState();

    setInterval(fetchRealtimeData, 5000);
});

