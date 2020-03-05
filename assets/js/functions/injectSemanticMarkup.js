function injectSemanticMarkup() {
  let script = document.createElement("script");
  script.type = "application/ld+json";

  let questions = [];

  document.querySelectorAll("section section > ul > li").forEach(term => {
    const name = term.querySelector("code").innerText;
    const description = term.querySelector(".description").innerText;

    if (description) {
      questions.push({
        "@type": "Question",
        name: `What is the ${name} Xcode build setting?`,
        acceptedAnswer: {
          text: description.replace(/(^\s+|\s+$)/g, "")
        }
      });
    }
  });

  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions
  });

  document.body.appendChild(script);
}
