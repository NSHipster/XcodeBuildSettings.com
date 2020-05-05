function registerIntersectionObservers() {
  if (!!window.IntersectionObserver) {
    let callback = (entries, observer) => {
      const active = entries
        .filter((e) => e.isIntersecting)
        .sort(
          (a, b) =>
            b.intersectionRect.height - a.intersectionRect.height ||
            a.rootBounds.top - b.rootBounds.top
        )[0];

      if (active) {
        requestAnimationFrame(() => {
          document.querySelectorAll("nav ul li").forEach((li) => {
            li.classList.remove("active");
          });

          let a = document.querySelector(
            `nav ul ul > li a[href="#${active.target.id}"]`
          );

          if (a) {
            let li = a.parentElement;
            li.classList.add("active");
            li.parentElement.parentElement.classList.add("active");
          }
        });
      }
    };

    let observer = new IntersectionObserver(callback, { threshold: 0 });
    document.querySelectorAll("section section").forEach((section) => {
      observer.observe(section);
    });
  }
}
