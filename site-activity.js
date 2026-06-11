(function () {
  const GOATCOUNTER_CODE = "lssnake0105";
  const GOATCOUNTER_ENDPOINT = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  const VISIT_COUNT_ENDPOINT = `https://${GOATCOUNTER_CODE}.goatcounter.com/counter/TOTAL.json`;
  const PRODUCTION_HOST = "lssnake0105.github.io";
  const counter = document.querySelector("[data-visit-count]");
  const note = document.querySelector("[data-visit-note]");

  if (!counter) return;

  function setStatus(text, detail) {
    counter.textContent = text;
    if (note && detail) note.textContent = detail;
  }

  function renderVisitCount() {
    window
      .fetch(VISIT_COUNT_ENDPOINT)
      .then(function (response) {
        if (!response.ok) throw new Error("counter unavailable");
        return response.json();
      })
      .then(function (data) {
        counter.textContent = data && data.count ? data.count : "Visit count unavailable";
      })
      .catch(function () {
        setStatus(
          "Visit count unavailable",
          "Enable public visitor counts in GoatCounter settings to display this number."
        );
      });
  }

  if (window.location.hostname !== PRODUCTION_HOST) {
    setStatus("Local preview", "Visit counting is enabled only on the public GitHub Pages site.");
    return;
  }

  if (!GOATCOUNTER_CODE) {
    setStatus("Not configured", "Add a GoatCounter site code in site-activity.js to enable counting.");
    return;
  }

  window.goatcounter = window.goatcounter || {};
  window.goatcounter.no_onload = true;

  const script = document.createElement("script");
  script.dataset.goatcounter = GOATCOUNTER_ENDPOINT;
  script.src = "https://gc.zgo.at/count.js";
  script.async = true;
  script.onload = function () {
    if (!window.goatcounter || typeof window.goatcounter.visit_count !== "function") {
      setStatus("Visit count unavailable", "The counter script loaded, but the count API was unavailable.");
      return;
    }

    window.goatcounter.count({
      path: "TOTAL",
      title: "Portfolio total visits",
      event: true
    });

    renderVisitCount();
  };
  script.onerror = function () {
    setStatus("Visit count unavailable", "The counter script could not be loaded.");
  };

  document.head.appendChild(script);
})();
