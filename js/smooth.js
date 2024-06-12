const track = document.getElementById("image-track");

track.dataset.percentage = "0";
track.dataset.prevPercentage = "0";
track.dataset.prevScrollY = window.scrollY.toString();

function handleScroll() {
  const container = track.parentElement;
  const boundingRect = container.getBoundingClientRect();
  if (boundingRect.top < window.innerHeight && boundingRect.bottom > 0) {
    const scrollDelta = window.scrollY - parseFloat(track.dataset.prevScrollY);
    track.dataset.prevScrollY = window.scrollY;

    const maxDelta = window.innerHeight; // Use the full height for a smoother experience

    const percentage = (scrollDelta / maxDelta) * -70; // Adjust this value for finer control
    let nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;

    // Ensure nextPercentage stays within bounds
    nextPercentage = Math.min(nextPercentage, 0);
    nextPercentage = Math.max(nextPercentage, -100 * (track.children.length - 1));

    track.dataset.percentage = nextPercentage;

    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(() => {
      track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
      }, { duration: 1000, fill: "forwards" });

      const images = document.querySelectorAll("#image-track img");
      images.forEach(image => {
        image.animate({
          objectPosition: `${120 + nextPercentage}% center`
        }, { duration: 1200, fill: "forwards" });
      });
    });

    track.dataset.prevPercentage = nextPercentage;
  }
}

// Throttle function to limit the number of executions
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }
}

let handleScrollThrottled = throttle(handleScroll, 100);

window.addEventListener('scroll', handleScrollThrottled);

// Initialize the scroll animation on page load
handleScroll();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      track.dataset.prevScrollY = window.scrollY.toString();
      handleScroll(); // Ensure the scroll animation starts when the element is in view
    }
  });
});

observer.observe(track.parentElement);
