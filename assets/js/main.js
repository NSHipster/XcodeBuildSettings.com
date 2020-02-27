window.addEventListener(
  "load",
  event => {
    if (!!window.IntersectionObserver) {
      let callback = (entries, observer) => {
        const active = entries
          .filter(e => e.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRect.height - a.intersectionRect.height ||
              a.rootBounds.top - b.rootBounds.top
          )[0];
        console.log(active);
        if (active) {
          requestAnimationFrame(() => {
            document.querySelectorAll(`nav ul li`).forEach(li => {
              li.classList.remove("active");
            });

            let li = document.querySelector(
              `nav ul ul > li a[href="#${active.target.id}"]`
            ).parentElement;
            li.classList.add("active");
            li.parentElement.parentElement.classList.add("active");
          });
        }
      };

      let observer = new IntersectionObserver(callback, { threshold: 0 });
      document.querySelectorAll("section section").forEach(section => {
        observer.observe(section);
      });
    }
  },
  false
);
