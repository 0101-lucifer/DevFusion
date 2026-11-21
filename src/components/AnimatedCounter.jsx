import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ target }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let hasCounted = false;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasCounted) {
        hasCounted = true;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const updateCounter = () => {
          current += step;
          if (current < target) {
            setCount(Math.ceil(current));
            requestAnimationFrame(updateCounter);
          } else {
            setCount(target);
          }
        };
        updateCounter();
      }
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}</span>;
};

export default AnimatedCounter;