const plot = document.getElementById('plot');
const slidersDiv = document.getElementById('sliders');
const equationSelect = document.getElementById('equation-select');

// Default parameters for equations
let params = {
  a: 1, b: 1, c: 1, h: 0, k: 0, l: 0, r: 5, d: 10
};

// Functions to generate 3D data
const generateData = {
  paraboloid: (a, b) => {
    const x = [];
    const y = [];
    const z = [];
    for (let i = -5; i <= 5; i += 0.1) {
      for (let j = -5; j <= 5; j += 0.1) {
        x.push(i);
        y.push(j);
        z.push(a * i ** 2 + b * j ** 2);
      }
    }
    return { x, y, z };
  },
  sphere: (h, k, l, r) => {
    const phi = [];
    const theta = [];
    const x = [];
    const y = [];
    const z = [];
    for (let i = 0; i < 2 * Math.PI; i += 0.1) {
      for (let j = 0; j < Math.PI; j += 0.1) {
        x.push(h + r * Math.sin(j) * Math.cos(i));
        y.push(k + r * Math.sin(j) * Math.sin(i));
        z.push(l + r * Math.cos(j));
      }
    }
    return { x, y, z };
  },
  ellipsoid: (h, k, l, a, b, c) => {
    const x = [];
    const y = [];
    const z = [];
    for (let i = -Math.PI; i <= Math.PI; i += 0.1) {
      for (let j = -Math.PI / 2; j <= Math.PI / 2; j += 0.1) {
        x.push(h + a * Math.cos(i) * Math.cos(j));
        y.push(k + b * Math.sin(i) * Math.cos(j));
        z.push(l + c * Math.sin(j));
      }
    }
    return { x, y, z };
  },
  hyperboloid: (h, k, l, a, b, c) => {
    const x = [];
    const y = [];
    const z = [];
    for (let i = -5; i <= 5; i += 0.1) {
      for (let j = -5; j <= 5; j += 0.1) {
        x.push(h + i);
        y.push(k + j);
        z.push(l + Math.sqrt(Math.abs((i ** 2 / a ** 2) - 1)) * c);
      }
    }
    return { x, y, z };
  },
  plane: (a, b, c, d) => {
    const x = [];
    const y = [];
    const z = [];
    for (let i = -5; i <= 5; i += 0.1) {
      for (let j = -5; j <= 5; j += 0.1) {
        x.push(i);
        y.push(j);
        z.push((d - a * i - b * j) / c);
      }
    }
    return { x, y, z };
  }
};

// Function to update sliders dynamically based on selected equation
function updateSliders(equation) {
  slidersDiv.innerHTML = ''; // Clear existing sliders
  const config = {
    paraboloid: ['a', 'b'],
    sphere: ['h', 'k', 'l', 'r'],
    ellipsoid: ['h', 'k', 'l', 'a', 'b', 'c'],
    hyperboloid: ['h', 'k', 'l', 'a', 'b', 'c'],
    plane: ['a', 'b', 'c', 'd'],
  };
  const sliderNames = config[equation];

  sliderNames.forEach((name) => {
    const container = document.createElement('div');
    container.className = 'slider-container';
    container.innerHTML = `
      <label>${name}: <span id="${name}-value">${params[name]}</span></label>
      <input type="range" id="${name}-slider" min="-10" max="10" step="0.1" value="${params[name]}">
    `;
    slidersDiv.appendChild(container);
    
    document.getElementById(`${name}-slider`).addEventListener('input', (event) => {
      params[name] = parseFloat(event.target.value);
      document.getElementById(`${name}-value`).innerText = params[name];
      plotGraph(); // Update graph when slider changes
    });
  });
}

// Function to plot the graph
function plotGraph() {
  const equation = equationSelect.value;
  const data = generateData[equation](...Object.values(params));

  const trace = {
    x: data.x,
    y: data.y,
    z: data.z,
    type: 'scatter3d',
    mode: 'markers',
    marker: {
      size: 2,
      color: 'blue',
      opacity: 0.8
    }
  };

  const layout = {
    scene: {
      xaxis: { title: 'X' },
      yaxis: { title: 'Y' },
      zaxis: { title: 'Z' }
    },
    title: `Graph of ${equation}`,
    paper_bgcolor: '#f4f4f9',
  };

  Plotly.newPlot(plot, [trace], layout);
}

// Initial Setup
equationSelect.addEventListener('change', () => {
  updateSliders(equationSelect.value);
  plotGraph();
});

updateSliders(equationSelect.value);
plotGraph(); // Initial graph on page load
