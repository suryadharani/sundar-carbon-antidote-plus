document.addEventListener('DOMContentLoaded', () => {
  // Global Presentation State
  let currentSlide = 1;
  const totalSlides = 11;
  let autoplayInterval = null;
  let isAutoplayActive = false;

  // DOM Elements
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const slideCounter = document.getElementById('slide-counter');
  const slideDots = document.getElementById('slide-dots');
  const progressBar = document.getElementById('progress-bar');
  const autoplayBtn = document.getElementById('autoplay-btn');
  const startBtn = document.getElementById('start-btn');
  
  // Drawer / Calculator Elements
  const toggleCalcBtn = document.getElementById('toggle-calc-btn');
  const calculatorDrawer = document.getElementById('calculator-drawer');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const drawerOverlay = document.getElementById('drawer-overlay');

  // Slide Navigation Functions
  function updateSlide(index) {
    // Boundary check
    if (index < 1) index = 1;
    if (index > totalSlides) index = totalSlides;

    currentSlide = index;

    // Toggle slide classes
    slides.forEach((slide, idx) => {
      if (idx + 1 === currentSlide) {
        slide.classList.add('active');
        // Trigger specific slide activation events
        handleSlideActivation(currentSlide);
      } else {
        slide.classList.remove('active');
      }
    });

    // Update Counter & Progress Bar
    slideCounter.textContent = `Slide ${currentSlide} of ${totalSlides}`;
    progressBar.style.width = `${(currentSlide / totalSlides) * 100}%`;

    // Update Dots
    const dots = slideDots.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      if (idx + 1 === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Disable navigation buttons if at start/end
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
  }

  function handleSlideActivation(slideIndex) {
    if (slideIndex === 7) {
      animateGauges();
    } else {
      resetGauges();
    }

    if (slideIndex === 10) {
      triggerOdometer();
    } else {
      resetOdometer();
    }
  }

  // Next / Prev actions
  function nextSlide() {
    if (currentSlide < totalSlides) {
      updateSlide(currentSlide + 1);
    } else if (isAutoplayActive) {
      updateSlide(1); // loop back in autoplay
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      updateSlide(currentSlide - 1);
    }
  }

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    }
  });

  // Event Listeners
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
  startBtn.addEventListener('click', () => updateSlide(2));

  // Dot Navigation Click Handler
  slideDots.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) {
      const slideNum = parseInt(e.target.getAttribute('data-slide'));
      updateSlide(slideNum);
    }
  });

  // Autoplay Logic
  autoplayBtn.addEventListener('click', () => {
    if (isAutoplayActive) {
      clearInterval(autoplayInterval);
      autoplayBtn.classList.remove('active');
      autoplayBtn.textContent = 'Autoplay';
      isAutoplayActive = false;
    } else {
      autoplayInterval = setInterval(nextSlide, 5000);
      autoplayBtn.classList.add('active');
      autoplayBtn.textContent = 'Pause Autoplay';
      isAutoplayActive = true;
    }
  });

  // Calculator Modal/Drawer Logic
  toggleCalcBtn.addEventListener('click', () => {
    calculatorDrawer.classList.add('open');
  });

  function closeDrawer() {
    calculatorDrawer.classList.remove('open');
  }

  closeDrawerBtn.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // Presentation initialization moved to the bottom of DOMContentLoaded to prevent TDZ ReferenceErrors.


  // -------------------------------------------------------------
  // SLIDE 2: INJECTOR SIMULATOR INTERACTIVITY
  // -------------------------------------------------------------
  const btnUnprotected = document.getElementById('btn-unprotected');
  const btnProtected = document.getElementById('btn-protected');
  const injectorSpray = document.getElementById('injector-spray');
  const statusText = document.getElementById('simulation-status-text');
  const rustParticlesContainer = document.getElementById('rust-particles');

  let rustInterval = null;

  function setInjectorState(state) {
    if (state === 'unprotected') {
      btnUnprotected.classList.add('active');
      btnProtected.classList.remove('active');
      injectorSpray.style.transform = 'scaleY(0.4) scaleX(0.7)';
      injectorSpray.setAttribute('fill', 'rgba(255, 136, 0, 0.4)');
      statusText.innerHTML = '<span style="color: var(--orange);">⚠️ WARNING:</span> Fuel nozzle suffering from corrosion. Sputtering, fuel phase separation, and carbon deposits block optimal spray pattern.';
      
      // Spawn rusty/corrosive particle sparks
      startRustParticles();
    } else {
      btnUnprotected.classList.remove('active');
      btnProtected.classList.add('active');
      injectorSpray.style.transform = 'scaleY(1) scaleX(1)';
      injectorSpray.setAttribute('fill', 'rgba(0, 240, 255, 0.65)');
      statusText.innerHTML = '<span style="color: var(--green);">✔️ PROTECTED:</span> Booster Dose active shield prevents fuel corrosion. Delivers complete, micro-atomized fuel spray for maximum mileage.';
      
      stopRustParticles();
    }
  }

  function startRustParticles() {
    stopRustParticles();
    rustInterval = setInterval(() => {
      const p = document.createElement('div');
      p.style.position = 'absolute';
      p.style.width = `${Math.random() * 4 + 3}px`;
      p.style.height = `${Math.random() * 4 + 3}px`;
      p.style.backgroundColor = 'var(--orange)';
      p.style.borderRadius = '50%';
      p.style.boxShadow = '0 0 5px var(--orange)';
      p.style.left = `${Math.random() * 80 + 10}px`;
      p.style.top = '0px';
      
      const animTime = Math.random() * 0.8 + 0.4;
      p.style.transition = `transform ${animTime}s ease-out, opacity ${animTime}s`;
      
      rustParticlesContainer.appendChild(p);

      setTimeout(() => {
        p.style.transform = `translate(${(Math.random() - 0.5) * 40}px, ${Math.random() * 50 + 20}px)`;
        p.style.opacity = '0';
      }, 50);

      setTimeout(() => {
        p.remove();
      }, animTime * 1000);
    }, 100);
  }

  function stopRustParticles() {
    clearInterval(rustInterval);
    rustParticlesContainer.innerHTML = '';
  }

  btnUnprotected.addEventListener('click', () => setInjectorState('unprotected'));
  btnProtected.addEventListener('click', () => setInjectorState('protected'));
  setInjectorState('unprotected'); // Initial state


  // -------------------------------------------------------------
  // SLIDE 3: MOLECULAR NEUTRALIZATION CHAMBER
  // -------------------------------------------------------------
  const moleculeGrid = document.getElementById('molecule-grid');
  const btnNeutralize = document.getElementById('btn-neutralize');
  let molecules = [];

  function initMolecularChamber() {
    moleculeGrid.innerHTML = '';
    molecules = [];
    const count = 12;

    for (let i = 0; i < count; i++) {
      const isWater = i % 2 === 0;
      const typeClass = isWater ? 'mol-water' : 'mol-ethanol';
      const label = isWater ? 'H₂O' : 'Eth';
      
      const m = document.createElement('div');
      m.className = `molecule ${typeClass}`;
      m.textContent = label;
      
      // Random coordinates inside chamber
      const x = Math.random() * 320 + 20;
      const y = Math.random() * 140 + 20;
      
      m.style.left = `${x}px`;
      m.style.top = `${y}px`;
      
      moleculeGrid.appendChild(m);
      molecules.push({ element: m, x, y, dx: (Math.random() - 0.5) * 2, dy: (Math.random() - 0.5) * 2, active: true });
    }
  }

  // Animation Loop for molecules
  function animateMolecules() {
    if (currentSlide !== 3) return;
    
    molecules.forEach(m => {
      if (!m.active) return;
      
      m.x += m.dx;
      m.y += m.dy;
      
      // Wall collision
      if (m.x < 10 || m.x > 380) m.dx *= -1;
      if (m.y < 10 || m.y > 180) m.dy *= -1;
      
      m.element.style.left = `${m.x}px`;
      m.element.style.top = `${m.y}px`;
    });

    requestAnimationFrame(animateMolecules);
  }

  btnNeutralize.addEventListener('click', () => {
    btnNeutralize.disabled = true;
    
    // Spawn shield molecules that surround standard molecules
    molecules.forEach(m => {
      const shield = document.createElement('div');
      shield.className = 'molecule mol-shield active';
      shield.textContent = 'Shield';
      shield.style.left = `${m.x - 2}px`;
      shield.style.top = `${m.y - 2}px`;
      
      moleculeGrid.appendChild(shield);
      
      // Shrink and neutralize standard molecules
      setTimeout(() => {
        m.element.style.transform = 'scale(0)';
        m.element.style.opacity = '0';
        shield.style.transform = 'scale(1.2)';
        shield.style.backgroundColor = 'rgba(0, 255, 102, 0.2)';
        shield.style.color = 'var(--green)';
        shield.textContent = 'STABLE';
      }, 1000);
    });

    setTimeout(() => {
      // Re-initialize after 5 seconds to demonstrate again
      initMolecularChamber();
      btnNeutralize.disabled = false;
    }, 5000);
  });

  // Track slide transition to initialize molecular chamber
  slideDots.addEventListener('click', (e) => {
    if (e.target.getAttribute('data-slide') === '3') {
      setTimeout(() => {
        initMolecularChamber();
        animateMolecules();
      }, 200);
    }
  });
  nextBtn.addEventListener('click', () => {
    if (currentSlide === 3) {
      setTimeout(() => {
        initMolecularChamber();
        animateMolecules();
      }, 200);
    }
  });


  // -------------------------------------------------------------
  // SLIDE 4: GAUGES ANIMATION (STATS)
  // -------------------------------------------------------------
  const gaugeEff = document.getElementById('gauge-efficiency');
  const gaugeTrq = document.getElementById('gauge-torque');
  const gaugeTmp = document.getElementById('gauge-temp');
  
  const textEff = document.getElementById('gauge-text-eff');
  const textTrq = document.getElementById('gauge-text-trq');
  const textTmp = document.getElementById('gauge-text-tmp');

  function animateGauges() {
    // Set stroke dash offset to represent values
    // Circumference = 2 * PI * r = 2 * 3.14159 * 40 = 251.3
    
    // Mileage Boost: +30%
    const effOffset = 251.3 - (251.3 * 30) / 100;
    gaugeEff.style.strokeDashoffset = effOffset;
    animateTextCounter(textEff, 30, '%');

    // Torque Surge: +80%
    const trqOffset = 251.3 - (251.3 * 80) / 100;
    gaugeTrq.style.strokeDashoffset = trqOffset;
    animateTextCounter(textTrq, 80, '%');

    // Engine Temp Drop: -80%
    const tmpOffset = 251.3 - (251.3 * 80) / 100;
    gaugeTmp.style.strokeDashoffset = tmpOffset;
    animateTextCounter(textTmp, 80, '%', '-');
  }

  function resetGauges() {
    gaugeEff.style.strokeDashoffset = 251.3;
    gaugeTrq.style.strokeDashoffset = 251.3;
    gaugeTmp.style.strokeDashoffset = 251.3;
    
    textEff.textContent = '0%';
    textTrq.textContent = '0%';
    textTmp.textContent = '0%';
  }

  function animateTextCounter(element, target, suffix = '', prefix = '') {
    let count = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;
    
    const counter = setInterval(() => {
      count += increment;
      if (count >= target) {
        clearInterval(counter);
        element.textContent = `${prefix}${target}${suffix}`;
      } else {
        element.textContent = `${prefix}${Math.floor(count)}${suffix}`;
      }
    }, stepTime);
  }


  // -------------------------------------------------------------
  // SLIDE 5: PISTON WEAR & COATING INTERACTIVITY
  // -------------------------------------------------------------
  const btnCoatOff = document.getElementById('btn-coat-off');
  const btnCoatOn = document.getElementById('btn-coat-on');
  const pistonShield = document.getElementById('piston-shield');
  const pistonMovingPart = document.getElementById('piston-moving-part');
  const pistonDesc = document.getElementById('sim-piston-desc');

  function setPistonCoating(coated) {
    if (coated) {
      btnCoatOn.classList.add('active');
      btnCoatOff.classList.remove('active');
      pistonShield.classList.add('protected');
      
      // Slow down motion indicating smooth, low friction stroke
      pistonMovingPart.style.animationDuration = '1.8s';
      pistonDesc.innerHTML = '<span style="color: var(--green);">ACTIVE SHIELD:</span> Creates a robust boundary layer. Reduces engine metal-on-metal wear by <strong style="color:#fff;">85%</strong>, extending internal parts life up to <strong style="color:#fff;">5x</strong>.';
    } else {
      btnCoatOff.classList.add('active');
      btnCoatOn.classList.remove('active');
      pistonShield.classList.remove('protected');
      
      pistonMovingPart.style.animationDuration = '0.9s'; // Fast jarring motion
      pistonDesc.innerHTML = '<span style="color: var(--orange);">STANDARD METAL:</span> Suffers direct surface friction, thermal engine wear, and rapid oil breakdown.';
    }
  }

  btnCoatOff.addEventListener('click', () => setPistonCoating(false));
  btnCoatOn.addEventListener('click', () => setPistonCoating(true));


  // -------------------------------------------------------------
  // SLIDE 6: EXHAUST PARTICLES SIMULATOR
  // -------------------------------------------------------------
  const btnExhaustStandard = document.getElementById('btn-exhaust-standard');
  const btnExhaustClean = document.getElementById('btn-exhaust-clean');
  const particleStream = document.getElementById('particle-stream');
  const emissionBubble = document.getElementById('emission-bubble');

  let exhaustInterval = null;
  let currentExhaustMode = 'standard';

  function startExhaustStream() {
    clearInterval(exhaustInterval);
    exhaustInterval = setInterval(() => {
      if (currentSlide !== 6) return;

      const p = document.createElement('div');
      p.className = 'exhaust-particle';
      
      // Random ending height path
      p.style.setProperty('--y-end', `${Math.random() * 120 + 10}px`);

      if (currentExhaustMode === 'standard') {
        // Toxic dark smoke / sulfur particles
        const size = Math.random() * 12 + 6;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.backgroundColor = Math.random() > 0.5 ? '#3a3e4d' : 'var(--orange)';
        p.style.boxShadow = Math.random() > 0.5 ? 'none' : '0 0 5px var(--orange)';
        p.textContent = '';
      } else {
        // Oxygen and clean mist particles
        const size = Math.random() * 8 + 12;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.backgroundColor = Math.random() > 0.5 ? 'var(--cyan)' : 'var(--green)';
        p.style.boxShadow = `0 0 8px ${Math.random() > 0.5 ? 'var(--cyan)' : 'var(--green)'}`;
        p.style.display = 'flex';
        p.style.justifyContent = 'center';
        p.style.alignItems = 'center';
        p.style.color = '#fff';
        p.style.fontSize = '8px';
        p.style.fontWeight = 'bold';
        p.textContent = Math.random() > 0.5 ? 'O₂' : 'H₂O';
      }

      particleStream.appendChild(p);

      setTimeout(() => {
        p.remove();
      }, 2000);
    }, 150);
  }

  function setExhaustMode(mode) {
    currentExhaustMode = mode;
    if (mode === 'standard') {
      btnExhaustStandard.classList.add('active');
      btnExhaustClean.classList.remove('active');
      emissionBubble.innerHTML = '<span style="color: var(--orange);">STANDARD COMBUSTION:</span> Emitting heavy hydrocarbon soot, <strong>NOx</strong>, <strong>SOx</strong>, and toxic <strong>Arsenic</strong> gases.';
    } else {
      btnExhaustStandard.classList.remove('active');
      btnExhaustClean.classList.add('active');
      emissionBubble.innerHTML = '<span style="color: var(--green);">ANTIDOTE COMBUSTION:</span> Harmful NOx/SOx gases cut by <strong>99.9%</strong>, arsenic reduced by <strong>90%</strong>. Exhaust outputs <strong>+50% pure O₂</strong> and clean vapor.';
    }
    startExhaustStream();
  }

  btnExhaustStandard.addEventListener('click', () => setExhaustMode('standard'));
  btnExhaustClean.addEventListener('click', () => setExhaustMode('clean'));

  // Trigger when slide 9 is shown
  slideDots.addEventListener('click', (e) => {
    if (e.target.getAttribute('data-slide') === '9') {
      setTimeout(() => {
        setExhaustMode('standard');
      }, 200);
    }
  });
  nextBtn.addEventListener('click', () => {
    if (currentSlide === 9) {
      setTimeout(() => {
        setExhaustMode('standard');
      }, 200);
    }
  });


  // -------------------------------------------------------------
  // SLIDE 10: ODOMETER COUNTING
  // -------------------------------------------------------------
  const odometerNum = document.getElementById('odometer-num');
  const odometerDisplay = document.getElementById('odometer-display');
  let odometerInterval = null;

  function triggerOdometer() {
    resetOdometer();
    
    // Animate Odometer Metric
    animateTextCounter(odometerNum, 100000, ' km');

    // Digital Odometer digits scroll effect
    let currentVal = 0;
    const targetVal = 100000;
    const step = 2000;
    
    odometerInterval = setInterval(() => {
      currentVal += step;
      if (currentVal >= targetVal) {
        currentVal = targetVal;
        clearInterval(odometerInterval);
      }
      
      // Update digits DOM
      const digitsString = String(currentVal).padStart(6, '0');
      const digitEls = odometerDisplay.querySelectorAll('.digit');
      digitEls.forEach((el, index) => {
        el.textContent = digitsString[index];
      });
    }, 30);
  }

  function resetOdometer() {
    clearInterval(odometerInterval);
    odometerNum.textContent = '0 km';
    const digitEls = odometerDisplay.querySelectorAll('.digit');
    digitEls.forEach(el => el.textContent = '0');
  }


  // -------------------------------------------------------------
  // GENERAL VALUE SAVINGS CALCULATOR (NeoPlatron style)
  // -------------------------------------------------------------
  let currentVehicleType = '4-wheeler';
  
  const vehicleBtns = document.querySelectorAll('#vehicle-type-selector .vehicle-btn');
  const calcMileage = document.getElementById('calc-mileage');
  const calcPrice = document.getElementById('calc-price');
  const calculationBasisTitle = document.getElementById('calculation-basis-title');
  
  const outFuelBefore = document.getElementById('out-fuel-before');
  const outFuelAfter = document.getElementById('out-fuel-after');
  const outFuelSavedOutput = document.getElementById('out-fuel-saved');
  
  const outOilBefore = document.getElementById('out-oil-before');
  const outOilAfter = document.getElementById('out-oil-after');
  const outOilSavedOutput = document.getElementById('out-oil-saved');
  
  const outMaintBefore = document.getElementById('out-maint-before');
  const outMaintAfter = document.getElementById('out-maint-after');
  const outMaintSavedOutput = document.getElementById('out-maint-saved');

  const outCo2Fuel = document.getElementById('out-co2-fuel');
  const outCo2Reduced = document.getElementById('out-co2-reduced');
  const outCo2Trees = document.getElementById('out-co2-trees');
  const outCo2Ev = document.getElementById('out-co2-ev');
  
  const outTotalBefore = document.getElementById('out-total-before');
  const outTotalAfter = document.getElementById('out-total-after');
  const outTotalSavings = document.getElementById('out-total-savings');
  
  const outMileageBefore = document.getElementById('out-mileage-before');
  const outMileageAfter = document.getElementById('out-mileage-after');
  const outMileageGain = document.getElementById('out-mileage-gain');

  const funSavingsAmount = document.getElementById('fun-savings-amount');
  const funSavingsSuggestions = document.getElementById('fun-savings-suggestions');
  const smartInsightText = document.getElementById('smart-insight-text');

  const btnDownloadReport = document.getElementById('btn-download-report');
  const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');

  // Parameters configuration per vehicle type
  const vehicleConfig = {
    '2-wheeler': { distance: 15000, multiplier: 1.35, defaultMileage: 45, oilIntervalStandard: 3000, oilIntervalAntidote: 15000, oilUnitCost: 500, maintBefore: 5000, maintAfter: 1500 },
    '3-wheeler': { distance: 15000, multiplier: 1.30, defaultMileage: 25, oilIntervalStandard: 3000, oilIntervalAntidote: 15000, oilUnitCost: 600, maintBefore: 8000, maintAfter: 2400 },
    '4-wheeler': { distance: 100000, multiplier: 1.30, defaultMileage: 15, oilIntervalStandard: 10000, oilIntervalAntidote: 50000, oilUnitCost: 3000, maintBefore: 25000, maintAfter: 7500 },
    '6-wheeler': { distance: 100000, multiplier: 1.25, defaultMileage: 6, oilIntervalStandard: 15000, oilIntervalAntidote: 75000, oilUnitCost: 8000, maintBefore: 80000, maintAfter: 24000 },
    '10-wheeler': { distance: 100000, multiplier: 1.25, defaultMileage: 4, oilIntervalStandard: 15000, oilIntervalAntidote: 75000, oilUnitCost: 12000, maintBefore: 120000, maintAfter: 36000 },
    '14-wheeler': { distance: 100000, multiplier: 1.25, defaultMileage: 3, oilIntervalStandard: 15000, oilIntervalAntidote: 75000, oilUnitCost: 16000, maintBefore: 160000, maintAfter: 48000 }
  };

  function updateVehicleDefaultMileage(type) {
    if (vehicleConfig[type]) {
      calcMileage.value = vehicleConfig[type].defaultMileage;
    }
  }

  function runCalculations() {
    const config = vehicleConfig[currentVehicleType] || vehicleConfig['4-wheeler'];
    const mileageBefore = parseFloat(calcMileage.value) || config.defaultMileage;
    const pricePerLiter = parseFloat(calcPrice.value) || 100;
    
    // Choose boost and distance based on vehicle type config
    const distance = config.distance;
    const mileageAfter = mileageBefore * config.multiplier;
    const mileageDiff = mileageAfter - mileageBefore;
    
    // Fuel Cost Calculations
    const fuelBeforeLiters = distance / mileageBefore;
    const fuelAfterLiters = distance / mileageAfter;
    const fuelBeforeCost = fuelBeforeLiters * pricePerLiter;
    const fuelAfterCost = fuelAfterLiters * pricePerLiter;
    const fuelSavedCost = fuelBeforeCost - fuelAfterCost;
    const litersSaved = fuelBeforeLiters - fuelAfterLiters;
    
    // Engine Oil Cost Calculations
    const oilChangesBefore = distance / config.oilIntervalStandard;
    const oilChangesAfter = distance / config.oilIntervalAntidote;
    const oilCostBefore = oilChangesBefore * config.oilUnitCost;
    const oilCostAfter = oilChangesAfter * config.oilUnitCost;
    const oilSavedCost = oilCostBefore - oilCostAfter;
    
    // Maintenance Cost Calculations
    const maintCostBefore = config.maintBefore;
    const maintCostAfter = config.maintAfter;
    const maintSavedCost = maintCostBefore - maintCostAfter;
    
    // Totals
    const totalCostBefore = fuelBeforeCost + oilCostBefore + maintCostBefore;
    const totalCostAfter = fuelAfterCost + oilCostAfter + maintCostAfter;
    const totalCostSavings = totalCostBefore - totalCostAfter;
    const co2Reduced = litersSaved * 2.31;
    
    // Update DOM basis title
    calculationBasisTitle.textContent = `Calculated for ${distance.toLocaleString()} km`;
    
    // Update Fuel Card
    outFuelBefore.textContent = `₹${Math.round(fuelBeforeCost).toLocaleString()}`;
    outFuelAfter.textContent = `₹${Math.round(fuelAfterCost).toLocaleString()}`;
    outFuelSavedOutput.textContent = `₹${Math.round(fuelSavedCost).toLocaleString()}`;
    
    // Update Oil Card
    outOilBefore.textContent = `₹${Math.round(oilCostBefore).toLocaleString()}`;
    outOilAfter.textContent = `₹${Math.round(oilCostAfter).toLocaleString()}`;
    outOilSavedOutput.textContent = `₹${Math.round(oilSavedCost).toLocaleString()}`;
    
    // Update Maintenance Card
    outMaintBefore.textContent = `₹${Math.round(maintCostBefore).toLocaleString()}`;
    outMaintAfter.textContent = `₹${Math.round(maintCostAfter).toLocaleString()}`;
    outMaintSavedOutput.textContent = `₹${Math.round(maintSavedCost).toLocaleString()}`;

    // Update CO2 Card
    outCo2Fuel.textContent = `${litersSaved.toFixed(1)} L`;
    outCo2Reduced.textContent = `${co2Reduced.toFixed(1)} kg`;
    
    const treesEquivalent = Math.round(co2Reduced / 22);
    const evEquivalent = Math.round(co2Reduced / 0.162);
    outCo2Trees.textContent = `🌳 Planting ${treesEquivalent.toLocaleString()} Trees`;
    outCo2Ev.textContent = `🚗 Driving ${evEquivalent.toLocaleString()} km EV`;
    
    // Update Total Summary Card
    outTotalBefore.textContent = `₹${Math.round(totalCostBefore).toLocaleString()}`;
    outTotalAfter.textContent = `₹${Math.round(totalCostAfter).toLocaleString()}`;
    outTotalSavings.textContent = `₹${Math.round(totalCostSavings).toLocaleString()}`;
    
    // Update Mileage Card
    outMileageBefore.textContent = mileageBefore.toFixed(2);
    outMileageAfter.textContent = mileageAfter.toFixed(2);
    outMileageGain.textContent = mileageDiff.toFixed(2);

    // Update fun savings comparison list
    const suggestions = [];
    if (totalCostSavings < 15000) {
      suggestions.push("🛵 One year of vehicle insurance");
      suggestions.push("🎧 Premium wireless earbuds");
    } else if (totalCostSavings < 35000) {
      suggestions.push("🛵 One year of vehicle insurance");
      suggestions.push("📺 A new Smart TV");
    } else if (totalCostSavings < 75000) {
      suggestions.push("📱 A new smartphone");
      suggestions.push("📺 A new Smart TV");
    } else {
      suggestions.push("✈ A weekend getaway");
      suggestions.push("📱 A premium smartphone");
    }
    
    funSavingsAmount.textContent = `₹${Math.round(totalCostSavings).toLocaleString()}`;
    funSavingsSuggestions.innerHTML = suggestions.map(s => `
      <span style="font-size: 0.8rem; border: 1px solid var(--border-color); padding: 5px 12px; border-radius: 20px; background: rgba(255, 255, 255, 0.02); display: flex; align-items: center; color: var(--text-main); font-weight: 500; font-family: 'Inter';">
        ${s}
      </span>
    `).join('');

    // Update Smart Insight
    smartInsightText.innerHTML = `Based on your current mileage of <strong>${mileageBefore.toFixed(1)} km/L</strong> and fuel price of <strong>₹${pricePerLiter}</strong>, your vehicle could potentially save <strong>₹${Math.round(totalCostSavings).toLocaleString()}</strong> over <strong>${distance.toLocaleString()} km</strong> while reducing fuel consumption and associated CO₂ emissions.`;
  }

  // Event Listeners for selectors
  vehicleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      vehicleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentVehicleType = btn.getAttribute('data-type');
      updateVehicleDefaultMileage(currentVehicleType);
      runCalculations();
    });
  });

  // Bind input listeners
  calcMileage.addEventListener('input', runCalculations);
  calcPrice.addEventListener('input', runCalculations);

  // WhatsApp Share Event
  btnShareWhatsapp.addEventListener('click', () => {
    const config = vehicleConfig[currentVehicleType] || vehicleConfig['4-wheeler'];
    const mileageBefore = parseFloat(calcMileage.value) || config.defaultMileage;
    const mileageAfter = mileageBefore * config.multiplier;
    const distance = config.distance;
    
    const fuelBeforeLiters = distance / mileageBefore;
    const fuelAfterLiters = distance / mileageAfter;
    const litersSaved = fuelBeforeLiters - fuelAfterLiters;
    
    const pricePerLiter = parseFloat(calcPrice.value) || 100;
    const fuelBeforeCost = fuelBeforeLiters * pricePerLiter;
    const fuelAfterCost = fuelAfterLiters * pricePerLiter;
    
    const oilChangesBefore = distance / config.oilIntervalStandard;
    const oilChangesAfter = distance / config.oilIntervalAntidote;
    const oilCostBefore = oilChangesBefore * config.oilUnitCost;
    const oilCostAfter = oilChangesAfter * config.oilUnitCost;
    
    const maintCostBefore = config.maintBefore;
    const maintCostAfter = config.maintAfter;
    
    const totalCostBefore = fuelBeforeCost + oilCostBefore + maintCostBefore;
    const totalCostAfter = fuelAfterCost + oilCostAfter + maintCostAfter;
    const totalCostSavings = totalCostBefore - totalCostAfter;
    const co2Reduced = litersSaved * 2.31;
    
    const msg = `🚗 I calculated my fuel savings using the Sundar Carbon Savings Calculator!\n\n` +
                `• Vehicle Type: ${currentVehicleType}\n` +
                `• Target Distance: ${distance.toLocaleString()} km\n` +
                `• Current Mileage: ${mileageBefore.toFixed(2)} km/L\n` +
                `• Projected Mileage: ${mileageAfter.toFixed(2)} km/L\n` +
                `• Fuel Saved: ${litersSaved.toFixed(1)} Litres\n` +
                `• CO₂ Emissions Reduced: ${co2Reduced.toFixed(1)} kg\n` +
                `• Estimated Net Savings: ₹${Math.round(totalCostSavings).toLocaleString()}\n\n` +
                `Calculate yours:\n` +
                `https://suryadharani.github.io/sundar-carbon-antidote-plus/`;
                
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // PDF Report Download Event
  btnDownloadReport.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const config = vehicleConfig[currentVehicleType] || vehicleConfig['4-wheeler'];
    const mileageBefore = parseFloat(calcMileage.value) || config.defaultMileage;
    const mileageAfter = mileageBefore * config.multiplier;
    const distance = config.distance;
    
    const fuelBeforeLiters = distance / mileageBefore;
    const fuelAfterLiters = distance / mileageAfter;
    const litersSaved = fuelBeforeLiters - fuelAfterLiters;
    
    const pricePerLiter = parseFloat(calcPrice.value) || 100;
    const fuelBeforeCost = fuelBeforeLiters * pricePerLiter;
    const fuelAfterCost = fuelAfterLiters * pricePerLiter;
    const fuelSavedCost = fuelBeforeCost - fuelAfterCost;
    
    const oilChangesBefore = distance / config.oilIntervalStandard;
    const oilChangesAfter = distance / config.oilIntervalAntidote;
    const oilCostBefore = oilChangesBefore * config.oilUnitCost;
    const oilCostAfter = oilChangesAfter * config.oilUnitCost;
    const oilSavedCost = oilCostBefore - oilCostAfter;
    
    const maintCostBefore = config.maintBefore;
    const maintCostAfter = config.maintAfter;
    const maintSavedCost = maintCostBefore - maintCostAfter;
    
    const totalCostBefore = fuelBeforeCost + oilCostBefore + maintCostBefore;
    const totalCostAfter = fuelAfterCost + oilCostAfter + maintCostAfter;
    const totalCostSavings = totalCostBefore - totalCostAfter;
    const co2Reduced = litersSaved * 2.31;
    
    // PDF Styles & Branding colors
    doc.setFillColor(15, 17, 26); // Dark Theme color block header
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 240, 255); // Cyan
    doc.text("SUNDAR CARBON", 15, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("ANTIDOTE PLUS® + BOOSTER DOSE", 15, 28);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(170, 170, 170);
    doc.text("Savings & Performance Certification Report", 15, 36);
    
    // Date & Time
    const now = new Date();
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 125, 36);
    
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, 55, 195, 55);
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(15, 17, 26);
    doc.text("VEHICLE EFFICIENCY REPORT", 15, 65);
    
    // Specifications Section
    doc.setFontSize(12);
    doc.text("1. Input Specifications", 15, 75);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`• Vehicle Configuration: ${currentVehicleType}`, 20, 83);
    doc.text(`• Current Mileage: ${mileageBefore.toFixed(2)} km/L`, 20, 90);
    doc.text(`• Fuel Base Price: ₹${pricePerLiter} / Liter`, 20, 97);
    doc.text(`• Analysis Baseline Distance: ${distance.toLocaleString()} km`, 20, 104);
    
    // Savings Table Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 17, 26);
    doc.text("2. Efficiency & Savings Projections", 15, 117);
    
    // Table Grid draw
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(245, 247, 250);
    doc.rect(15, 122, 180, 55, 'F');
    doc.rect(15, 122, 180, 55, 'S');
    
    doc.line(15, 132, 195, 132);
    doc.line(15, 142, 195, 142);
    doc.line(15, 152, 195, 152);
    doc.line(15, 162, 195, 162);
    doc.line(100, 122, 100, 177); // middle divider
    doc.line(150, 122, 150, 177); // right divider
    
    // Table Headers
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Category", 18, 128);
    doc.text("Before Treatment", 103, 128);
    doc.text("With Antidote Plus®", 153, 128);
    
    doc.setFont("helvetica", "normal");
    doc.text("Fuel Mileage", 18, 138);
    doc.text(`${mileageBefore.toFixed(2)} km/L`, 103, 138);
    doc.text(`${mileageAfter.toFixed(2)} km/L`, 153, 138);
    
    doc.text("Fuel Expenditure", 18, 148);
    doc.text(`₹${Math.round(fuelBeforeCost).toLocaleString()}`, 103, 148);
    doc.text(`₹${Math.round(fuelAfterCost).toLocaleString()}`, 153, 148);
    
    doc.text("Engine Oil Cost", 18, 158);
    doc.text(`₹${Math.round(oilCostBefore).toLocaleString()}`, 103, 158);
    doc.text(`₹${Math.round(oilCostAfter).toLocaleString()}`, 153, 158);
    
    doc.text("Maintenance Cost", 18, 168);
    doc.text(`₹${Math.round(maintCostBefore).toLocaleString()}`, 103, 168);
    doc.text(`₹${Math.round(maintCostAfter).toLocaleString()}`, 153, 168);
    
    // Bottom Total Operational Row
    doc.setFont("helvetica", "bold");
    doc.text("Total Operational Cost", 18, 174);
    doc.text(`₹${Math.round(totalCostBefore).toLocaleString()}`, 103, 174);
    doc.text(`₹${Math.round(totalCostAfter).toLocaleString()}`, 153, 174);
    
    // Savings Summary Panel
    doc.setFillColor(235, 250, 240); // Soft green
    doc.rect(15, 185, 180, 20, 'F');
    doc.rect(15, 185, 180, 20, 'S');
    
    doc.setFontSize(11);
    doc.setTextColor(40, 120, 60);
    doc.text("NET VALUED SAVINGS:", 20, 197);
    doc.setFontSize(14);
    doc.text(`₹${Math.round(totalCostSavings).toLocaleString()}`, 80, 198);
    
    doc.setFontSize(8.5);
    doc.text(`CO₂ Reduced: ${co2Reduced.toFixed(1)} kg (Saved ${litersSaved.toFixed(1)} L)`, 115, 193);
    const pdfTrees = Math.round(co2Reduced / 22);
    const pdfEv = Math.round(co2Reduced / 0.162);
    doc.text(`🌳 Planting ${pdfTrees.toLocaleString()} Trees`, 115, 198);
    doc.text(`🚗 Driving ${pdfEv.toLocaleString()} km EV`, 115, 203);
    
    // Smart Insight summary text box
    doc.setDrawColor(200, 220, 240);
    doc.setFillColor(240, 248, 255); // Soft blue
    doc.rect(15, 212, 180, 25, 'F');
    doc.rect(15, 212, 180, 25, 'S');
    
    doc.setTextColor(15, 17, 26);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("💡 Smart Insight:", 20, 220);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const insightLines = doc.splitTextToSize(
      `Based on your specifications, upgrading to Sundar Carbon Antidote Plus protects your engine systems, yielding ₹${Math.round(totalCostSavings).toLocaleString()} in total economic savings and reducing CO₂ footprints by ${co2Reduced.toFixed(1)} kg over ${distance.toLocaleString()} km.`,
      170
    );
    doc.text(insightLines, 20, 228);
    
    // Certifications block at page bottom
    doc.setDrawColor(240, 240, 240);
    doc.line(15, 245, 195, 245);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("CERTIFIED & APPROVED BY:", 15, 253);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text("✔ Dubai Materials Lab Certified", 18, 262);
    doc.text("✔ ISO 9001:2015 Quality Standards", 18, 268);
    doc.text("✔ Telangana Pollution Control Board Approved", 100, 262);
    doc.text("✔ Made in India - Molecular Engineering", 100, 268);
    
    // Save PDF
    doc.save(`Sundar_Carbon_Savings_Report_${currentVehicleType.replace(' ', '_')}.pdf`);
  });

  // Run initial calculator compute
  runCalculations();

  // Initialize display once all elements, listeners, and variables are declared
  updateSlide(1);
});
