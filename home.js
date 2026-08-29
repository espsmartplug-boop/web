// Power Chart & Meter references
let powerChart;
let inactivityTimer;
let voltageMeter, currentMeter, pfMeter;
let latestData = {
    voltage: 0,
    current: 0,
    power_factor: 0,
    active_power: 0,
    apparent_power: 0,
    switch_state: false
};

// Power Chart Setup
function setupPowerChart() {
    const chartCanvas = document.getElementById('powerChart');
    if (!chartCanvas) return;
    const ctx = chartCanvas.getContext('2d');
    
    powerChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Active Power (W)',
                    data: [],
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'Apparent Power (VA)',
                    data: [],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 400
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Power'
                    }
                }
            }
        }
    });
}

// Color scale function based on gauge percentage
function getColorForValue(value, maxValue) {
    const percentage = maxValue > 0 ? value / maxValue : 0;
    if (percentage <= 0.33) return '#4CAF50'; // Green
    if (percentage <= 0.66) return '#FFA726'; // Orange
    return '#EF5350';                         // Red
}

// Create Canvas Gauge Meter
function createMeter(canvasId, maxValue, unit) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return () => {};
    const ctx = canvas.getContext('2d');

    let currentValue = 0;

    function drawMeter(value) {
        if (value !== undefined) {
            currentValue = value;
        }
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        const centerX = rect.width / 2;
        const centerY = rect.height - 25;
        const radius = Math.min(rect.width / 2.3, rect.height - 35);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background arc (full top semi-circle: Math.PI to 2*Math.PI)
        ctx.beginPath();
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = radius / 8;
        ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI, false);
        ctx.stroke();

        // Ensure value bounds
        const adjustedValue = Math.min(Math.max(currentValue, 0), maxValue);
        const fraction = maxValue > 0 ? adjustedValue / maxValue : 0;

        // Value arc (Clockwise from Math.PI)
        const startAngle = Math.PI;
        const endAngle = startAngle + (fraction * Math.PI);
        
        ctx.beginPath();
        ctx.strokeStyle = getColorForValue(adjustedValue, maxValue);
        ctx.lineWidth = radius / 8;
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
        ctx.stroke();

        // Scale divisions & tick marks
        const divisions = 10;
        for (let i = 0; i <= divisions; i++) {
            const scaleValue = (maxValue * i) / divisions;
            const scaleAngle = Math.PI + (i / divisions * Math.PI);
            
            const isMajor = (i % 2 === 0);
            const tickLength = isMajor ? radius / 8 : radius / 16;
            
            const outerX = centerX + radius * Math.cos(scaleAngle);
            const outerY = centerY + radius * Math.sin(scaleAngle);
            const innerX = centerX + (radius - tickLength) * Math.cos(scaleAngle);
            const innerY = centerY + (radius - tickLength) * Math.sin(scaleAngle);
            
            ctx.beginPath();
            ctx.strokeStyle = '#888';
            ctx.lineWidth = isMajor ? 2 : 1;
            ctx.moveTo(innerX, innerY);
            ctx.lineTo(outerX, outerY);
            ctx.stroke();

            // Label for major ticks
            if (isMajor) {
                const labelRadius = radius - tickLength - 12;
                const labelX = centerX + labelRadius * Math.cos(scaleAngle);
                const labelY = centerY + labelRadius * Math.sin(scaleAngle);
                ctx.font = `${Math.max(9, Math.round(radius / 12))}px Arial`;
                ctx.fillStyle = '#666';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(scaleValue.toFixed(maxValue <= 1 ? 1 : 0), labelX, labelY);
            }
        }

        // Draw needle
        const needleAngle = Math.PI + (fraction * Math.PI);
        const needleLength = radius - (radius / 5);
        
        ctx.beginPath();
        ctx.strokeStyle = '#D32F2F';
        ctx.lineWidth = 3;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + needleLength * Math.cos(needleAngle),
            centerY + needleLength * Math.sin(needleAngle)
        );
        ctx.stroke();

        // Draw needle center cap
        ctx.beginPath();
        ctx.fillStyle = '#D32F2F';
        ctx.arc(centerX, centerY, radius / 16, 0, Math.PI * 2);
        ctx.fill();
    }

    return drawMeter;
}

// Initialize Gauges
function initMeters() {
    voltageMeter = createMeter('voltageGauge', 300, 'V');
    currentMeter = createMeter('currentGauge', 10, 'A');
    pfMeter = createMeter('pfGauge', 1, '');
}

// Update power chart with real-time stream
function updatePowerChart(activePower, apparentPower) {
    if (!powerChart) return;
    
    const time = new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    powerChart.data.labels.push(time);
    powerChart.data.datasets[0].data.push(activePower);
    powerChart.data.datasets[1].data.push(apparentPower);

    // Keep the most recent 15 data points
    if (powerChart.data.labels.length > 15) {
        powerChart.data.labels.shift();
        powerChart.data.datasets[0].data.shift();
        powerChart.data.datasets[1].data.shift();
    }

    powerChart.update('none');
}

// Update all displays and meters
function updateDisplays(data) {
    if (!data) return;

    // Handle column names from Supabase (supports both snake_case and camelCase)
    const voltage = parseFloat(data.voltage ?? data.Voltage) || 0;
    const current = parseFloat(data.current ?? data.Current) || 0;
    const powerFactor = parseFloat(data.power_factor ?? data.powerFactor ?? data.pf) || 0;
    const activePower = parseFloat(data.active_power ?? data.power ?? data.ActivePower) || 0;
    const apparentPower = parseFloat(data.apparent_power ?? data.apparentPower ?? data.ApparentPower) || 0;
    const switchState = (data.switch_state !== undefined) ? Boolean(data.switch_state) : (data.switch === 1 || data.switch === true);

    latestData = {
        voltage,
        current,
        power_factor: powerFactor,
        active_power: activePower,
        apparent_power: apparentPower,
        switch_state: switchState
    };

    // Update text labels
    const vElem = document.getElementById('voltageValue');
    const cElem = document.getElementById('currentValue');
    const pfElem = document.getElementById('pfValue');
    const apElem = document.getElementById('apparentPower');
    const actElem = document.getElementById('activePower');

    if (vElem) vElem.textContent = voltage.toFixed(2);
    if (cElem) cElem.textContent = current.toFixed(2);
    if (pfElem) pfElem.textContent = powerFactor.toFixed(2);
    if (apElem) apElem.textContent = apparentPower.toFixed(2);
    if (actElem) actElem.textContent = activePower.toFixed(2);

    // Update meters
    if (voltageMeter) voltageMeter(voltage);
    if (currentMeter) currentMeter(current);
    if (pfMeter) pfMeter(powerFactor);

    // Update power chart
    updatePowerChart(activePower, apparentPower);
    
    // Update switch UI
    const switchElem = document.getElementById('switch');
    if (switchElem && switchElem.checked !== switchState) {
        switchElem.checked = switchState;
    }
}

// Reset UI displays to zero when device is inactive (without mutating database)
function resetDisplaysToZero() {
    updateDisplays({
        voltage: 0,
        current: 0,
        power_factor: 0,
        active_power: 0,
        apparent_power: 0,
        switch_state: latestData.switch_state
    });
}

// Toggle switch state in Supabase
async function toggleSwitch() {
    const switchElement = document.getElementById('switch');
    const targetState = switchElement.checked;

    try {
        // Insert a control event / status record to Supabase
        const { error } = await supabaseClient
            .from('realtime_readings')
            .insert([{
                timestamp: new Date().toISOString(),
                voltage: latestData.voltage,
                current: latestData.current,
                power_factor: latestData.power_factor,
                active_power: latestData.active_power,
                apparent_power: latestData.apparent_power,
                total_energy: 0,
                switch_state: targetState
            }]);

        if (error) throw error;
        latestData.switch_state = targetState;
        console.log('Switch state updated successfully to', targetState);
    } catch (error) {
        console.error('Error updating switch state in Supabase:', error.message || error);
        // Revert switch checkbox UI
        switchElement.checked = !targetState;
    }
}

// Fetch latest reading from Supabase
async function fetchLatestReading() {
    try {
        const { data, error } = await supabaseClient
            .from('realtime_readings')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
            updateDisplays(data[0]);
        }
    } catch (error) {
        console.error('Error fetching initial reading from Supabase:', error.message || error);
    }
}

// Subscribe to real-time changes in Supabase
function setupSupabaseRealtime() {
    if (!supabaseClient) {
        console.error('Supabase client is not available.');
        return;
    }

    // Subscribe to Postgres Realtime changes on realtime_readings
    supabaseClient
        .channel('public:realtime_readings')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'realtime_readings' },
            (payload) => {
                if (payload.new) {
                    updateDisplays(payload.new);

                    // Reset inactivity timer
                    if (inactivityTimer) clearTimeout(inactivityTimer);
                    inactivityTimer = setTimeout(resetDisplaysToZero, 10000); // 10s timeout
                }
            }
        )
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'realtime_readings' },
            (payload) => {
                if (payload.new) {
                    updateDisplays(payload.new);
                }
            }
        )
        .subscribe((status) => {
            console.log('Supabase Realtime subscription status:', status);
        });

    // Also poll periodically every 5 seconds as fallback
    setInterval(fetchLatestReading, 5000);
}

// Setup Auth & Logout
function setupAuth() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                if (supabaseClient) {
                    await supabaseClient.auth.signOut();
                }
            } catch (err) {
                console.error('Logout error:', err);
            }
            window.location.href = 'index.html';
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setupPowerChart();
    initMeters();
    setupAuth();
    fetchLatestReading();
    setupSupabaseRealtime();

    // Redraw meters on window resize for proper scale
    window.addEventListener('resize', () => {
        if (voltageMeter) voltageMeter();
        if (currentMeter) currentMeter();
        if (pfMeter) pfMeter();
    });
});
