let dashboardData = null;

async function fetchData() {
    try {
        const response = await fetch('data.json');
        dashboardData = await response.json();
    } catch (err) {
        console.error("Please ensure your Python script generated data.json", err);
    }
}

function nextStep(id) {
    document.querySelectorAll('.story-section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById('step' + id);
    section.classList.add('active');
    
    if (dashboardData) {
        if (id === 2) drawHist();
        if (id === 3) drawTrends();
        if (id === 4) drawHeatmap();
        if (id === 5) drawScatter();
        if (id === 6) drawBar();
    }
}

const chartDefaults = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#aaa' } } },
    scales: { 
        x: { ticks: { color: '#666' }, grid: { color: '#222' } },
        y: { ticks: { color: '#666' }, grid: { color: '#222' } }
    }
};

function drawHist() {
    new Chart(document.getElementById('histChart'), {
        type: 'bar',
        data: {
            labels: ['0', '50k', '100k', '150k', '200k'],
            datasets: [{ label: 'Country Count', data: [80, 15, 5, 2, 1], backgroundColor: '#00e5ff' }]
        },
        options: chartDefaults
    });
}

function drawTrends() {
    new Chart(document.getElementById('lineChartDual'), {
        type: 'line',
        data: {
            labels: dashboardData.line_trends.map(d => d.year),
            datasets: [
                { label: 'GDP (Trillions)', data: dashboardData.line_trends.map(d => d.GDP_Total_USD), borderColor: '#fff', yAxisID: 'y' },
                { label: 'Internet %', data: dashboardData.line_trends.map(d => d.Internet_Users_Pct), borderColor: '#00e5ff', yAxisID: 'y1' }
            ]
        },
        options: { ...chartDefaults, scales: { 
            y: { position: 'left', grid: { color: '#222' } },
            y1: { position: 'right', grid: { display: false } }
        }}
    });
}

function drawHeatmap() {
    const grid = document.getElementById('heatmapGrid');
    grid.innerHTML = '';
    const vals = [1.0, 0.55, 0.56, 0.39, -0.38, 0.55, 1.0, 0.57, 0.48, -0.46, 0.56, 0.57, 1.0, 0.84, -0.91];
    vals.forEach(v => {
        const cell = document.createElement('div');
        cell.className = 'heat-cell';
        const opacity = Math.abs(v);
        cell.style.backgroundColor = v > 0 ? `rgba(0, 229, 255, ${opacity})` : `rgba(255, 75, 75, ${opacity})`;
        cell.innerText = v.toFixed(2);
        grid.appendChild(cell);
    });
}

function drawScatter() {
    new Chart(document.getElementById('scatterChart'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Wealth vs. Connectivity',
                data: dashboardData.scatter.map(d => ({x: d.Internet_Users_Pct, y: d.GDP_Per_Capita_USD})),
                backgroundColor: 'rgba(0, 229, 255, 0.5)'
            }]
        },
        options: chartDefaults
    });
}

function drawBar() {
    new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: dashboardData.income_groups.map(g => g.Income_Group),
            datasets: [{ label: 'Avg Life Expectancy', data: dashboardData.income_groups.map(g => g.Life_Expectancy_Years), backgroundColor: ['#2d2d30', '#3e3e42', '#00e5ff', '#fff'] }]
        },
        options: chartDefaults
    });
}

fetchData();