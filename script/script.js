document.addEventListener('DOMContentLoaded', () => {
  // Page loader
  window.addEventListener('load', () => {
    const loader = document.querySelector('.page-loader');
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }, 800);
  });

  // Initialize AOS animations
  AOS.init({
    duration: 800,
    easing: 'ease',
    once: true,
    offset: 100
  });

  // Mobile menu toggle
  const toggleButton = document.getElementById('ham-burger');
  const closeButton = document.getElementById('close-menu');
  const navLinks = document.getElementById('nav-links');
  
  toggleButton?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  
  closeButton?.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
  
  // Close mobile menu when clicking on a link
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
  
  // Back to top button
  const backToTopButton = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
  
  backToTopButton?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Dark mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
  
  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      localStorage.setItem('theme', 'light');
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  });

  // BMI Calculator functionality
  const bmiForm = document.getElementById('bmi-form');
  const bmiScore = document.getElementById('bmi-score');
  const bmiCategory = document.getElementById('bmi-category');
  const bmiIndicator = document.getElementById('bmi-indicator');
  const bmiRecommendations = document.getElementById('bmi-recommendations');
  
  bmiForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const activity = parseFloat(document.getElementById('activity').value);
    
    // Validate inputs
    if (!height || !weight || !age || !gender || !activity) {
      showNotification('Please fill all fields', 'error');
      return;
    }
    
    // Calculate BMI: weight(kg) / (height(m))²
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBmi = Math.round(bmi * 10) / 10;
    
    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Calculate daily calorie needs
    const dailyCalories = Math.round(bmr * activity);
    
    // Calculate ideal weight range based on BMI
    const minIdealWeight = Math.round(18.5 * heightInMeters * heightInMeters);
    const maxIdealWeight = Math.round(24.9 * heightInMeters * heightInMeters);
    
    // Determine BMI category and position
    let category, position, recommendations;
    
    if (bmi < 18.5) {
      category = 'Underweight';
      position = (bmi / 18.5) * 25; // Position for underweight (0-25%)
      recommendations = `
        <h4>Recommendations for Underweight</h4>
        <ul>
          <li>Increase calorie intake with nutrient-dense foods</li>
          <li>Focus on protein-rich foods to build muscle</li>
          <li>Consider strength training to build muscle mass</li>
          <li>Aim for a gradual weight gain of 0.5-1 kg per week</li>
          <li>Target weight range: ${minIdealWeight}-${maxIdealWeight} kg</li>
        </ul>
      `;
    } else if (bmi < 25) {
      category = 'Normal weight';
      position = 25 + ((bmi - 18.5) / 6.5) * 25; // Position for normal (25-50%)
      recommendations = `
        <h4>Recommendations for Normal Weight</h4>
        <ul>
          <li>Maintain a balanced diet with plenty of fruits and vegetables</li>
          <li>Regular exercise (150+ minutes of moderate activity per week)</li>
          <li>Focus on maintaining your current healthy habits</li>
          <li>Consider a mix of cardio and strength training</li>
          <li>Your weight is within the ideal range of ${minIdealWeight}-${maxIdealWeight} kg</li>
        </ul>
      `;
    } else if (bmi < 30) {
      category = 'Overweight';
      position = 50 + ((bmi - 25) / 5) * 25; // Position for overweight (50-75%)
      recommendations = `
        <h4>Recommendations for Overweight</h4>
        <ul>
          <li>Create a moderate calorie deficit (300-500 calories/day)</li>
          <li>Increase physical activity (aim for 30+ minutes daily)</li>
          <li>Focus on whole foods and reduce processed food intake</li>
          <li>Monitor portion sizes and practice mindful eating</li>
          <li>Target weight range: ${minIdealWeight}-${maxIdealWeight} kg</li>
        </ul>
      `;
    } else {
      category = 'Obese';
      const maxBmi = 40; // Cap for visualization purposes
      position = 75 + Math.min(((bmi - 30) / 10), 1) * 25; // Position for obese (75-100%)
      recommendations = `
        <h4>Recommendations for Obesity</h4>
        <ul>
          <li>Consult with a healthcare professional for personalized advice</li>
          <li>Create a sustainable calorie deficit (500-1000 calories/day)</li>
          <li>Focus on gradual weight loss (0.5-1 kg per week)</li>
          <li>Incorporate both cardio and strength training</li>
          <li>Target weight range: ${minIdealWeight}-${maxIdealWeight} kg</li>
        </ul>
      `;
    }
    
    // Update UI with animation
    animateValue(bmiScore, 0, roundedBmi, 1000);
    bmiCategory.textContent = category;
    bmiIndicator.style.display = 'block';
    bmiIndicator.style.left = `${position}%`;
    
    // Add calorie information
    const existingCalorieInfo = document.querySelector('.calorie-info');
    if (existingCalorieInfo) {
      existingCalorieInfo.remove();
    }
    
    const calorieInfo = document.createElement('div');
    calorieInfo.classList.add('calorie-info');
    calorieInfo.innerHTML = `
      <h4>Daily Calorie Needs</h4>
      <p>${dailyCalories} calories</p>
      <small>Based on your activity level</small>
    `;
    
    document.querySelector('.bmi-info').appendChild(calorieInfo);
    
    // Update recommendations
    if (bmiRecommendations) {
      bmiRecommendations.innerHTML = recommendations;
    }
    
    // Show success notification
    showNotification('BMI calculated successfully!', 'success');
    
    // Scroll to results
    document.querySelector('.bmi-result').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  });
  
  // Initialize BMI display
  if (bmiIndicator && bmiScore.textContent === '--') {
    bmiIndicator.style.display = 'none';
  }
  
  // Testimonial slider
  const testimonialTrack = document.querySelector('.testimonial-track');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const sliderDots = document.querySelector('.slider-dots');
  
  if (testimonialTrack) {
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    // Create dots
    testimonials.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      sliderDots.appendChild(dot);
    });
    
    // Update slider position
    function updateSlider() {
      const slideWidth = testimonials[0].offsetWidth + 32; // Width + gap
      testimonialTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      
      // Update dots
      document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
    
    // Go to specific slide
    function goToSlide(index) {
      currentIndex = index;
      updateSlider();
    }
    
    // Next slide
    nextBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      updateSlider();
    });
    
    // Previous slide
    prevBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      updateSlider();
    });
    
    // Auto slide
    let slideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      updateSlider();
    }, 5000);
    
    // Pause on hover
    testimonialTrack.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    testimonialTrack.addEventListener('mouseleave', () => {
      slideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateSlider();
      }, 5000);
    });
  }
  
  // Progress tracker tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      btn.classList.add('active');
      document.getElementById(`${tabId}-tab`).classList.add('active');
      
      // Initialize charts if needed
      if (tabId === 'weight') {
        initWeightChart();
      } else if (tabId === 'nutrition') {
        initMacroChart();
      }
    });
  });
  
  // Initialize weight chart
  function initWeightChart() {
    const ctx = document.getElementById('weightChart');
    
    if (ctx && !ctx.chart) {
      ctx.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Weight (kg)',
            data: [75, 73, 71, 70, 69, 68],
            borderColor: '#ff4757',
            backgroundColor: 'rgba(255, 71, 87, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#a4b0be'
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#a4b0be'
              }
            }
          }
        }
      });
    }
  }
  
  // Initialize macro chart
  function initMacroChart() {
    const ctx = document.getElementById('macroChart');
    
    if (ctx && !ctx.chart) {
      ctx.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Protein', 'Carbs', 'Fats'],
          datasets: [{
            data: [120, 200, 55],
            backgroundColor: [
              '#e74c3c',
              '#2ecc71',
              '#f1c40f'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#a4b0be',
                padding: 20,
                font: {
                  size: 12
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Initialize charts if elements exist
  if (document.getElementById('weightChart')) {
    initWeightChart();
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Play button click handler
  const playButton = document.querySelector('.play-icon');
  playButton?.addEventListener('click', () => {
    showNotification('Video feature coming soon!', 'info');
  });
  
  // Newsletter form submission
  const newsletterForm = document.getElementById('newsletter-form');
  
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    
    // Validate email
    if (!email) {
      showNotification('Please enter your email address', 'error');
      return;
    }
    
    // Simulate form submission
    showNotification('Thank you for subscribing to our newsletter!', 'success');
    newsletterForm.reset();
  });
  
  // Helper function to animate number counting
  function animateValue(element, start, end, duration) {
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value.toFixed(1);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
  
  // Notification system
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
      notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.innerHTML = `
      <div class="notification-content">
        <p>${message}</p>
        <button class="notification-close"><i class="fas fa-times"></i></button>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '1000';
    notification.style.transform = 'translateY(100px)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';
    
    // Set background color based on type
    if (type === 'success') {
      notification.style.background = 'rgba(46, 204, 113, 0.9)';
    } else if (type === 'error') {
      notification.style.background = 'rgba(231, 76, 60, 0.9)';
    } else {
      notification.style.background = 'rgba(52, 152, 219, 0.9)';
    }
    
    // Close button styles
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.marginLeft = '10px';
    closeButton.style.cursor = 'pointer';
    
    // Close notification on button click
    closeButton.addEventListener('click', () => {
      notification.style.transform = 'translateY(100px)';
      notification.style.opacity = '0';
      
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    
    // Show notification
    setTimeout(() => {
      notification.style.transform = 'translateY(0)';
      notification.style.opacity = '1';
    }, 10);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateY(100px)';
      notification.style.opacity = '0';
      
      // Remove from DOM after animation
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }
});