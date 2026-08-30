/**
 * CareNest - Global JavaScript Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Bootstrap Tooltips & Popovers if available
  if (typeof bootstrap !== 'undefined') {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  // 2. Interactive Star Rating Selector
  const starContainers = document.querySelectorAll('.interactive-star-rating');
  starContainers.forEach(container => {
    const stars = container.querySelectorAll('.star-item');
    const inputTarget = document.querySelector(container.dataset.inputTarget || '#ratingValue');
    
    stars.forEach((star, index) => {
      star.addEventListener('mouseenter', () => highlightStars(stars, index + 1));
      star.addEventListener('mouseleave', () => {
        const currentVal = inputTarget ? parseInt(inputTarget.value) || 0 : 0;
        highlightStars(stars, currentVal);
      });
      star.addEventListener('click', () => {
        const rating = index + 1;
        if (inputTarget) inputTarget.value = rating;
        highlightStars(stars, rating);
        showToast('Rating Selected', `You rated ${rating} out of 5 stars.`, 'info');
      });
    });
  });

  function highlightStars(stars, count) {
    stars.forEach((star, i) => {
      if (i < count) {
        star.classList.remove('bi-star', 'text-muted');
        star.classList.add('bi-star-fill', 'text-warning');
      } else {
        star.classList.remove('bi-star-fill', 'text-warning');
        star.classList.add('bi-star', 'text-muted');
      }
    });
  }

  // 3. Dashboard Sidebar Mobile Toggler
  const sidebarToggleBtn = document.getElementById('sidebarToggle');
  const dashboardSidebar = document.querySelector('.dashboard-sidebar');
  if (sidebarToggleBtn && dashboardSidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      dashboardSidebar.classList.toggle('show-mobile');
    });
  }

  // 4. Live Range / Budget Slider Display
  const budgetRange = document.getElementById('budgetRange');
  const budgetValue = document.getElementById('budgetValue');
  if (budgetRange && budgetValue) {
    budgetRange.addEventListener('input', (e) => {
      budgetValue.textContent = `$${e.target.value}/hr`;
    });
  }
});

/**
 * Global Toast Notification Helper
 * @param {string} title - Heading of the toast
 * @param {string} message - Content message
 * @param {string} type - 'success' | 'info' | 'warning' | 'danger'
 */
function showToast(title, message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '1090';
    document.body.appendChild(toastContainer);
  }

  const bgClass = type === 'success' ? 'bg-success text-white' :
                  type === 'danger' ? 'bg-danger text-white' :
                  type === 'warning' ? 'bg-warning text-dark' : 'bg-primary text-white';

  const toastId = 'toast_' + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          <strong>${title}:</strong> ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML('beforeend', toastHtml);
  const toastElement = document.getElementById(toastId);
  if (typeof bootstrap !== 'undefined') {
    const toast = new bootstrap.Toast(toastElement, { delay: 4000 });
    toast.show();
    toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
  }
}
