// Use shared Supabase client from supabaseClient.js
const supabase = window.supabaseClient;


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
async function fetchDataAndRenderChart2(chartId) {
    // Query Supabase to get the data
    const { data, error } = await supabase
        .from('dayenergydummy')  // Change 'dayenergydummy' to your table name
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

// Fetch data from Supabase and render the chart
async function fetchDataAndRenderChart4(chartId) {
    // Query Supabase to get the data
    const { data, error } = await supabase
        .from('energydummy')  // Change 'dayenergydummy' to your table name
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

        // Call the function to fetch data and render the chart in the first canvas
        fetchDataAndRenderChart1('powerChart1');
        
        // Call the function to fetch data and render the chart in the second canvas
        fetchDataAndRenderChart2('powerChart2');
        fetchDataAndRenderChart2('powerChart3');
        fetchDataAndRenderChart2('powerChart4');

        // Call the function to fetch data and render the chart in the first canvas
        fetchDataAndRenderChart3('powerChart5');
                
        // Call the function to fetch data and render the chart in the second canvas
        fetchDataAndRenderChart4('powerChart6');

        // Call the function to fetch data and render the chart in the second canvas
        fetchDataAndRenderChart4('powerChart7');

// Function to calculate the total energy from the 'dayenergy' table
async function calculateDayTotalEnergy() {
    // Fetch the energy data from the 'dayenergy' table
    const { data, error } = await supabase
        .from('dayenergy')  // Replace with your actual table name
        .select('energy');  // Only select the 'energy' column

    if (error) {
        console.error('Error fetching data from Supabase:', error);
        return;
    }

    // Sum the energy values
    const totalEnergy = data.reduce((sum, row) => sum + row.energy, 0);

    // Display the total energy on the page
    document.getElementById('total-energy').textContent = totalEnergy;
}

// Function to calculate the total energy from the 'energy' table
async function calculateEnergyTotal() {
    // Fetch the energy data from the 'energy' table
    const { data, error } = await supabase
        .from('energy')  // Replace with your actual table name
        .select('energy');  // Only select the 'energy' column

    if (error) {
        console.error('Error fetching data from Supabase:', error);
        return;
    }

    // Sum the energy values
    const totalEnergy = data.reduce((sum, row) => sum + row.energy, 0);

    // Display the total energy on the page
    document.getElementById('daytotal-energy').textContent = totalEnergy;
}

// Call the functions to calculate and display the total energy
calculateDayTotalEnergy();
calculateEnergyTotal();

// Function to calculate total energy from the 'dayenergy' table, predict total energy for the month, and calculate energy cost
async function calculateAndPredictEnergyCost() {
    // Fetch the energy data from the 'dayenergy' table
    const { data, error } = await supabase
        .from('dayenergy')
        .select('energy, timestamp');  // Include the date to get the energy usage per day

    if (error) {
        console.error('Error fetching data from Supabase:', error);
        return;
    }

    // Handle empty data case
    if (!data || data.length === 0) {
        console.log('No data available');
        return;
    }

    // Calculate the total energy used so far and count the number of days
    const totalEnergyUsed = data.reduce((sum, row) => sum + row.energy, 0);
    const numberOfDays = data.length;

    // Calculate the average daily energy usage
    const averageDailyEnergy = totalEnergyUsed / numberOfDays;

    // Get the current date and the total days in the current month
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const totalDaysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Calculate the remaining days in the month
    const remainingDays = totalDaysInMonth - currentDay;

    // Predict the total energy by the end of the month
    const predictedEnergyEndOfMonth = (totalEnergyUsed + (averageDailyEnergy * remainingDays)) / 3600000 ;

    // Assuming an average cost of electricity in Sri Lanka (e.g., 28.0 LKR per kWh)
    const energyCostPerUnit = 28.0;  // Replace with the current rate in LKR per kWh

    // Calculate the predicted energy cost by the end of the month
    const predictedEnergyCost = predictedEnergyEndOfMonth * energyCostPerUnit ;

    // Display the results on the page
    document.getElementById('predicted-energy').textContent = ` ${predictedEnergyEndOfMonth.toFixed(2)} kWh`;
    document.getElementById('predicted-cost').textContent = ` ${predictedEnergyCost.toFixed(2)}`;
}

// Call the function to calculate and predict total energy and cost
calculateAndPredictEnergyCost();

// JavaScript to toggle mobile drawer visibility
function toggleMobileDrawer() {
    const drawer = document.querySelector('.mobile-drawer');
    drawer.classList.toggle('open');  // Adds/removes the 'open' class to the mobile drawer
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
    syncSwitchState();
});

