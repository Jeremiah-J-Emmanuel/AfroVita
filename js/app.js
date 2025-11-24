// Show welcome alerts only after the page has rendered cards (so charts can load first)
const storageKey = 'hasVisitedBefore';

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem(storageKey)) return;

    const resultsContainer = document.getElementById('results-container');

    function showAlertsAndMarkVisited() {
        alert(`Welcome to AfroVita, the urban health and resource tracker for Africa.
This is a web application that makes use of the World Bank Data API that displays the health data for the 54 African countries recognized by the United Nations.`);

        alert(`TIPS on AfroVita
As mentioned earlier, AfroVita gets the data for all African Countries.
However, not all African Countries have data for the selected years so they will not be reflected in the app.
Some countries also have gaps in their data. These gaps in a country's data will be represented by dotted lines.`);

        alert(`AfroVita Tutorial
There are four health indicators to choose from, and you can view data as old as 2013 by changing the year.
You can also make use of sorting and filters like sorting by 'Severity' which lists countries from worst to best, and the 'Critical Risk Only' filter which selects countries worse than the region's average.
You can also apply more than one filter.`);

        localStorage.setItem(storageKey, 'true');
    }

    // If resultsContainer exists, wait for it to get children (cards inserted by renderData)
    if (resultsContainer) {
        const observer = new MutationObserver((mutations, obs) => {
            if (resultsContainer.children.length > 0) {
                obs.disconnect();
                // small delay to allow canvases to be painted
                setTimeout(showAlertsAndMarkVisited, 100);
            }
        });
        observer.observe(resultsContainer, { childList: true });

        // fallback: if no cards appear within 8s, show alerts anyway
        const fallback = setTimeout(() => {
            observer.disconnect();
            showAlertsAndMarkVisited();
        }, 8000);

        // cancel fallback if alerts shown earlier
        const originalShow = showAlertsAndMarkVisited;
        showAlertsAndMarkVisited = () => { clearTimeout(fallback); originalShow(); };
    } else {
        // If the container isn't present for some reason, show alerts after a short delay
        setTimeout(showAlertsAndMarkVisited, 1000);
    }
});

const AFRICAN_COUNTRIES = [
    { code: 'DZ', name: 'Algeria', region: 'North' },
    { code: 'AO', name: 'Angola', region: 'South' },
    { code: 'BJ', name: 'Benin', region: 'West' },
    { code: 'BW', name: 'Botswana', region: 'South' },
    { code: 'BF', name: 'Burkina Faso', region: 'West' },
    { code: 'BI', name: 'Burundi', region: 'East' },
    { code: 'CV', name: 'Cabo Verde', region: 'West' },
    { code: 'CM', name: 'Cameroon', region: 'Central' },
    { code: 'CF', name: 'Central African Republic', region: 'Central' },
    { code: 'TD', name: 'Chad', region: 'Central' },
    { code: 'KM', name: 'Comoros', region: 'East' },
    { code: 'CD', name: 'DR Congo', region: 'Central' },
    { code: 'CG', name: 'Republic of Congo', region: 'Central' },
    { code: 'CI', name: 'Côte d\'Ivoire', region: 'West' },
    { code: 'DJ', name: 'Djibouti', region: 'East' },
    { code: 'EG', name: 'Egypt', region: 'North' },
    { code: 'GQ', name: 'Equatorial Guinea', region: 'Central' },
    { code: 'ER', name: 'Eritrea', region: 'East' },
    { code: 'SZ', name: 'Eswatini', region: 'South' },
    { code: 'ET', name: 'Ethiopia', region: 'East' },
    { code: 'GA', name: 'Gabon', region: 'Central' },
    { code: 'GM', name: 'Gambia', region: 'West' },
    { code: 'GH', name: 'Ghana', region: 'West' },
    { code: 'GN', name: 'Guinea', region: 'West' },
    { code: 'GW', name: 'Guinea-Bissau', region: 'West' },
    { code: 'KE', name: 'Kenya', region: 'East' },
    { code: 'LS', name: 'Lesotho', region: 'South' },
    { code: 'LR', name: 'Liberia', region: 'West' },
    { code: 'LY', name: 'Libya', region: 'North' },
    { code: 'MG', name: 'Madagascar', region: 'East' },
    { code: 'MW', name: 'Malawi', region: 'East' },
    { code: 'ML', name: 'Mali', region: 'West' },
    { code: 'MR', name: 'Mauritania', region: 'North' },
    { code: 'MU', name: 'Mauritius', region: 'East' },
    { code: 'MA', name: 'Morocco', region: 'North' },
    { code: 'MZ', name: 'Mozambique', region: 'East' },
    { code: 'NA', name: 'Namibia', region: 'South' },
    { code: 'NE', name: 'Niger', region: 'West' },
    { code: 'NG', name: 'Nigeria', region: 'West' },
    { code: 'RW', name: 'Rwanda', region: 'East' },
    { code: 'ST', name: 'São Tomé and Príncipe', region: 'Central' },
    { code: 'SN', name: 'Senegal', region: 'West' },
    { code: 'SC', name: 'Seychelles', region: 'East' },
    { code: 'SL', name: 'Sierra Leone', region: 'West' },
    { code: 'SO', name: 'Somalia', region: 'East' },
    { code: 'ZA', name: 'South Africa', region: 'South' },
    { code: 'SS', name: 'South Sudan', region: 'East' },
    { code: 'SD', name: 'Sudan', region: 'North' },
    { code: 'TZ', name: 'Tanzania', region: 'East' },
    { code: 'TG', name: 'Togo', region: 'West' },
    { code: 'TN', name: 'Tunisia', region: 'North' },
    { code: 'UG', name: 'Uganda', region: 'East' },
    { code: 'ZM', name: 'Zambia', region: 'East' },
    { code: 'ZW', name: 'Zimbabwe', region: 'South' }
];

//This is for mapping the HTML select options to thier regions in Africa
const REGION_MAP = {
    'General': 'General',
    'North': 'North',
    'East': 'East',
    'West': 'West',
    'Central': 'Central', 
    'South': 'South'
};

//Quick map of known indicators to their units so we don't rely only on the label text
const INDICATOR_UNITS = {
    'SP.DYN.IMRT.IN': 'per 1k', //Infant mortality (per 1,000 live births)
    'SH.STA.MALR': 'cases', //Malaria: show raw case numbers rather than "per 1k"
    'SH.STA.HYGN.ZS': '%', //example: percent
    'SH.H2O.BASW.ZS': '%' //basic water access percent
};

//Helper to format numbers nicely for cards and tooltips
function formatNumber(v) {
    if (v === null || v === undefined || Number.isNaN(v)) return 'N/A';
    //For small decimal values show two decimals, otherwise use grouping
    if (Math.abs(v) < 100) return Number(v).toFixed(2);
    return new Intl.NumberFormat('en-US', {maximumFractionDigits:2}).format(v);
}


const app = {};


document.addEventListener('DOMContentLoaded', () => {
//The Event DOMContentLoaded is added so that the DOM elements will be accessed only when the DOM is fully loaded

    const resultsContainer = document.getElementById('results-container');
    const statusMessage = document.getElementById('status-message');
    const indicatorSelect = document.getElementById('indicator');
    const regionSelect = document.getElementById('region');
    const yearSelect = document.getElementById('year');
    const btnCritical = document.getElementById('btn-critical');
    const btnSeverity = document.getElementById('btn-severity');

    app.dom = { resultsContainer, statusMessage, indicatorSelect, regionSelect, yearSelect, btnCritical, btnSeverity };

    app.fullData = new Map();
    app.currentIndicator = indicatorSelect.value; //This is used to get the value of the health indicator that the user selects

    const selectedRegionText = regionSelect.options[regionSelect.selectedIndex].text.split(' ')[0];
    /*The above line gets the text from the selected region and then parses it by space(' ') to get the first
    word of the value and then use it in the Map*/

    app.currentRegion = REGION_MAP[selectedRegionText] || 'General';
    //This is used to assign the region based on the first word of the selected region, or "General" in case of 'all of Africa', 
    app.currentYear = yearSelect.value;

    //The two lines of code below are used to reset the state of the 'sorting by severity' or the 'Crtical Risk Only' filter
    app.filterActive = false;
    app.sortActive = false;

    app.dom.resultsContainer.innerHTML = ''; //This is to clear the initial placeholders I used when developing the html and css
    initApp();
});



//This function is used to tell the user the status of the API call
function updateStatus(msg, type) {
    const { statusMessage } = app.dom;
    statusMessage.textContent = msg; 
    
    if (type) {
        statusMessage.classList.add(type);
    }

    //This will clear the status after 5 seconds if it is not a loading message
    if (type !== 'loading') {
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = '';
        }, 5000); //5000 milliseconds = 5seconds
    }
}


function getHistoricalYears(endYear) {
    const years = [];
    const startYear = parseInt(endYear) - 5;
    for (let y = parseInt(endYear); y >= startYear; y--) {
        years.push(y.toString());
    }
    return years.reverse();
}



/**
 * Fetch historical data from the World Bank API for a given indicator and year.
 * Populates `app.fullData` with a structure: { [iso2]: { [year]: number|null } }
 */
async function fetchDataForIndicator(indicatorCode, year) {
    updateStatus(`Fetching historical data for ${indicatorCode} (Trend: ${parseInt(year) - 5} to ${year})...`, 'loading');

    const startYear = parseInt(year) - 5;
    const apiUrl = `https://api.worldbank.org/v2/country/all/indicator/${indicatorCode}?date=${startYear}:${year}&format=json&per_page=20000`;

    try {
        const resp = await fetch(apiUrl);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const json = await resp.json();
        const dataArray = Array.isArray(json) && json[1] ? json[1] : [];

        //Initialize structure for the African country list and requested years
        const historicalData = {};
        const years = getHistoricalYears(year);
        AFRICAN_COUNTRIES.forEach(c => {
            historicalData[c.code] = {};
            years.forEach(y => {
                historicalData[c.code][y] = null;
            });
        });

        dataArray.forEach(entry => {
            const cc = entry.country && entry.country.id ? entry.country.id.toUpperCase() : null;
            const yr = entry.date;
            const val = entry.value;
            if (cc && historicalData[cc] && yr in historicalData[cc]) {
                historicalData[cc][yr] = val !== null ? parseFloat(val) : null;
            }
        });

        app.fullData.set(indicatorCode, historicalData);
        updateStatus(` Historical data loaded from World Bank.`, 'success');
        return true;
    } catch (err) {
        console.error(err);
        updateStatus(` Failed to fetch World Bank data: ${err.message}`, 'error');
        return false;
    }
}


/*The above Initializes a Chart.js line graph for a single country card.
@param {string} countryCode - The country's two-letter code.
@param {Array<number>} dataValues - The 6 historical data points.
@param {Array<string>} dataLabels - The 6 year labels.
@param {string} indicatorLabel - The name of the health indicator.*/

function renderCountryChart(countryCode, dataPoints, dataLabels, indicatorLabel) {
    //Check if Chart object exists (requires Chart.js CDN in HTML)
    if (typeof Chart === 'undefined') {
        console.error("Chart.js not loaded. Please add the CDN script tag to your HTML.");
        return;
    }

    const ctx = document.getElementById(`chart-${countryCode}`);
    if (!ctx) return; //This skips the chart if the canvas not found

    //Try the explicit unit map first, otherwise fall back to parsing the label
    const unitMatch = indicatorLabel.match(/\((.*?)\)/);
    const unitFromLabel = unitMatch ? unitMatch[1] : '';
    const unit = INDICATOR_UNITS[app.currentIndicator] || unitFromLabel || '';

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dataLabels,
            datasets: [{
                label: indicatorLabel,
                data: dataPoints,
                spanGaps: true,
                borderColor: '#FFFFFF', //Use white for the line so it stands-out on the red card
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                tension: 0.3,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2,
                //Draw dotted segments where data is missing so those gaps are visible
                segment: {
                    borderDash: ctx => {
                        const p0Missing = ctx.p0 && ctx.p0.raw && ctx.p0.raw.isMissing;
                        const p1Missing = ctx.p1 && ctx.p1.raw && ctx.p1.raw.isMissing;
                        return (p0Missing || p1Missing) ? [6, 6] : undefined;
                    }
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false //Hide the legend; the card title already names the metric
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const raw = context.parsed && context.parsed.y != null ? context.parsed.y : null;
                            const v = raw !== null ? formatNumber(raw) : 'N/A';
                            return `${context.label}: ${v} ${unit}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: false },
                    ticks: { color: 'white' },
                    grid: { display: false }
                },
                y: {
                    title: { display: false },
                    ticks: { color: 'white', callback: (value) => `${value}${unit ? ` ${unit}` : ''}` },
                    grid: { color: 'rgba(255, 255, 255, 0.3)' } //Use lighter grid lines for subtlety
                }
            }
        }
    });
}


/**
 * Filters, sorts, and renders the health data cards based on the current app state.
 */
async function renderData(triggerFetch = false) {
    const { indicatorSelect, resultsContainer } = app.dom;

    //Check if we need to fetch fresh data for the selected indicator/year
    if (triggerFetch && !app.fullData.has(app.currentIndicator)) {
        const success = await fetchDataForIndicator(app.currentIndicator, app.currentYear);
        if (!success) {
             resultsContainer.innerHTML = `<p style="text-align:center; padding: 20px; color: var(--text-dark);">Could not retrieve data for this indicator.</p>`;
             return;
        }
    }
    
    const historicalData = app.fullData.get(app.currentIndicator) || {};
    resultsContainer.innerHTML = '';
    
    if (Object.keys(historicalData).length === 0) {
        resultsContainer.innerHTML = `<p style="text-align:center; padding: 20px; color: var(--text-dark);">No data available for the selected indicator or year.</p>`;
        return;
    }

    const indicatorDisplayName = indicatorSelect.options[indicatorSelect.selectedIndex].text;
    const targetYear = app.currentYear;
    const historicalYears = getHistoricalYears(targetYear);

    
    //Process data: pick the displayed value and prepare the 6-point trend
    let processedData = AFRICAN_COUNTRIES.map(country => {
        const countryData = historicalData[country.code] || {};

        //Look up the target-year value if present
        let currentValue = countryData[targetYear] !== null ? countryData[targetYear] : null;

        //Build trend points as objects so Chart.js can mark missing years
        const trendData = historicalYears.map(year => {
            const value = countryData[year];
            return {
                x: year,
                y: value !== null ? value : null,
                isMissing: value === null
            };
        });

        /*The below decides which year/value to show- It will defaultly go for the target year,
        but if not available it will fall back to the latest available data*/
        let displayValue = currentValue;
        let displayYear = targetYear;

        //If target-year is missing, walk backwards to find the newest available year in the window
        if (displayValue === null) {
            for (let i = historicalYears.length - 1; i >= 0; i--) {
                const y = historicalYears[i];
                if (countryData[y] !== null) {
                    displayValue = countryData[y];
                    displayYear = y;
                    break;
                }
            }
        }

        return {
            name: country.name,
            region: country.region,
            value: displayValue, //The single value shown on the card for quick reading
            date: displayValue !== null ? displayYear : 'N/A', //The year that value came from (or N/A)
            code: country.code,
            trendData: trendData
        };
    }).filter(item => item.value !== null); //Filter out countries with absolutely no recent data in the window

    
    /*Decide if lower numbers are worse for this indicator (access metrics use lower=worse)
    This is because, for some health indicators, lower values, like basic drinking water access are bad,
    but for Malaria, they are good.*/
    
    const isAccessIndicator = app.currentIndicator.includes('.ZS'); 

    //The below applies a region filter when a region that is not General is selected.
    if (app.currentRegion !== 'General') {
        processedData = processedData.filter(item => item.region.toLowerCase() === app.currentRegion.toLowerCase());
    }

    //If the Critical Risk filter is active, keep only countries performing worse than the average
    if (app.filterActive && processedData.length > 0) {
        const values = processedData.map(item => item.value);
        const sum = values.reduce((a, b) => a + b, 0);
        const average = sum / processedData.length;

        //The below compares each country to the average using the correct direction for this indicator 
        processedData = processedData.filter(item => 
            isAccessIndicator ? item.value < average : item.value > average
        );

        //This tells the user how many countries are flagged as critical
        updateStatus(`Showing ${processedData.length} countries at critical risk (vs. regional average of ${average.toFixed(2)}).`, 'error');
    }
    
    //Sort by Severity shows the worst-performing countries first
    if (app.sortActive) {
        //For access-type indicators (basic drinking water access), lower is worse so sort ascending. For othe=r types of indicators, sort descending
        processedData.sort((a, b) => isAccessIndicator ? a.value - b.value : b.value - a.value);
        updateStatus(`Data sorted by severity.`, 'success');
    }

    //Build the HTML cards for each country we're showing
    if (processedData.length === 0) {
        resultsContainer.innerHTML = `<p style="text-align:center; padding: 20px; color: var(--text-dark);">No countries meet the current filter criteria.</p>`;
        return;
    }
    
    //Compute a sensible max for risk normalization (for non-access indicators use observed max)
    const observedMax = processedData.reduce((m, it) => Math.max(m, it.value || 0), 0) || 100;
    const cardHtml = processedData.map(item => {
        const unitForCard = INDICATOR_UNITS[app.currentIndicator] || (indicatorDisplayName.match(/\((.*?)\)/) ? indicatorDisplayName.match(/\((.*?)\)/)[1] : '');
        const formattedValue = formatNumber(item.value);
        const implausiblePer1k = unitForCard && unitForCard.toLowerCase().includes('per 1k') && item.value > 1000;
        const cardId = `chart-${item.code}`;

        //Figure card color based on computed risk. It keeps the red aesthetic)
        let riskValue = item.value;
        if (isAccessIndicator) {
            //Access indicators treat 100 as best and 0 as worst
            riskValue = 100 - riskValue;
        } 
        
        //Normalize risk into a 0-100 scale for visual mapping
        const maxRisk = isAccessIndicator ? 100 : observedMax;
        const riskNormalized = Math.min(100, (riskValue / (maxRisk || 1)) * 100);

        const cardColor = 'var(--primary-red)';

        return `
            <div class="data-card" style="background-color: ${cardColor};" aria-label="${item.name} data: ${formattedValue}">
                <div class="card-details">
                    <h3>${item.name} (${item.region})</h3>
                    <div class="data-year">
                        <p>Latest Data: ${item.date}</p>
                        <p>Indicator: ${indicatorDisplayName}</p>
                    </div>
                </div>
                <div class="card-data-value">
                    <div class="data-value">${formattedValue}${unitForCard ? ` ${unitForCard}` : ''}</div>
                    ${implausiblePer1k ? `<div class="data-warning" style="font-size:0.7rem;color:#ffeeba;margin-top:6px;">Value looks unusually large for ${unitForCard}; check indicator units.</div>` : ''}
                </div>
                <div class="chart-container" style="height: 150px; width: 100%; margin-top: 15px;">
                    <canvas id="${cardId}"></canvas>
                </div>
            </div>
        `;
    }).join('');

    //This inserts the cards into the page, then draw the small charts
    resultsContainer.innerHTML = cardHtml;
    
    //Give the browser a moment so the canvas elements exist before Chart.js runs
    setTimeout(() => {
        processedData.forEach(item => {
            renderCountryChart(item.code, item.trendData, historicalYears, indicatorDisplayName);
        });
    }, 50); //This adds a small delay to ensure the canvases are fully set up
    //Final status to the user about how many cards are visible
    if (!app.filterActive && !app.sortActive) {
         updateStatus(`Displaying ${processedData.length} countries. Click a filter to analyze trends.`, 'success');
    }
}


//EVENT HANDLERS — These are for the user's UI interactions

function handleSelectChange(event) {
    const { indicatorSelect, regionSelect, yearSelect } = app.dom;
    
    //This updates the app's  state based on which control was changed by the user
    switch (event.target.id) {
        case 'indicator':
            app.currentIndicator = indicatorSelect.value;
            //This will always cause a refresh when the indicator changes
            renderData(true); 
            break;
        case 'region':
            //This maps the selected region text to our REGION_MAP keys
            const selectedRegionText = regionSelect.options[regionSelect.selectedIndex].text.split(' ')[0];
            app.currentRegion = REGION_MAP[selectedRegionText] || 'General';
            //Since changing the region only changes the list of countries to display, we can re-render from the existing data
            renderData(false);
            break;
        case 'year':
            app.currentYear = yearSelect.value;
            //Since year selected changes the historical window we need to fetch fresh historical data
            renderData(true); 
            break;
    }
}


 /* Handles the Critical Risk filter button toggle. */
function handleCriticalFilter() {
    app.filterActive = !app.filterActive;
    app.dom.btnCritical.textContent = app.filterActive ? 'Showing Critical Risk' : 'Critical Risk Only';
    app.dom.btnCritical.style.backgroundColor = app.filterActive ? '#374151' : 'var(--primary-red)'; 
    renderData(false);
}

/**
 * Handles the Sort by Severity button toggle.
 */
function handleSeveritySort() {
    app.sortActive = !app.sortActive;
    app.dom.btnSeverity.textContent = app.sortActive ? 'Sorted: Worst First ' : 'Sort by Severity';
    app.dom.btnSeverity.style.backgroundColor = app.sortActive ? '#374151' : 'var(--primary-red)'; 
    renderData(false);
}


//INITIALIZATION — Starts up everything 

/*Initializes the web application: This sets up the Event-listeners and performs the initial data load.*/

function initApp() {
    const { indicatorSelect, regionSelect, yearSelect, btnCritical, btnSeverity } = app.dom;

    //This sets up the Event-listeners for the dashboard-controls (indicator, region, year, filters)
    indicatorSelect.addEventListener('change', handleSelectChange);
    regionSelect.addEventListener('change', handleSelectChange);
    yearSelect.addEventListener('change', handleSelectChange);
    
    btnCritical.addEventListener('click', handleCriticalFilter);
    btnSeverity.addEventListener('click', handleSeveritySort);


    renderData(true); //Start up the code
}