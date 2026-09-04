import { useState } from "react";
import "./App.css";

const modes = [
  {
    id: "normal",
    name: "Normal",
    description: "Typical color vision",
    accent: "Normal",
  },
  {
    id: "protanopia",
    name: "Protanopia",
    description: "Reduced red sensitivity",
    accent: "Red-blind",
  },
  {
    id: "deuteranopia",
    name: "Deuteranopia",
    description: "Reduced green sensitivity",
    accent: "Green-blind",
  },
  {
    id: "tritanopia",
    name: "Tritanopia",
    description: "Reduced blue sensitivity",
    accent: "Blue-blind",
  },
  {
    id: "achromatopsia",
    name: "Achromatopsia",
    description: "Very limited color perception",
    accent: "Monochrome",
  },
];

const palette = [
  { name: "Primary", hex: "#6366F1" },
  { name: "Success", hex: "#22C55E" },
  { name: "Warning", hex: "#F59E0B" },
  { name: "Danger", hex: "#EF4444" },
  { name: "Info", hex: "#38BDF8" },
  { name: "Purple", hex: "#A855F7" },
];

const visionRows = [
  {
    label: "Normal",
    className: "vision-normal",
    text: "Success",
  },
  {
    label: "Protanopia",
    className: "vision-protanopia",
    text: "Success",
  },
  {
    label: "Deuteranopia",
    className: "vision-deuteranopia",
    text: "Success",
  },
  {
    label: "Tritanopia",
    className: "vision-tritanopia",
    text: "Success",
  },
  {
    label: "Achromatopsia",
    className: "vision-achromatopsia",
    text: "Success",
  },
];

function hexToRgb(hex) {
  var clean = hex.replace("#", "");

  if (clean.length === 3) {
    clean =
      clean[0] +
      clean[0] +
      clean[1] +
      clean[1] +
      clean[2] +
      clean[2];
  }

  var number = parseInt(clean, 16);

  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
}

function getLuminance(hex) {
  var rgb = hexToRgb(hex);

  var values = [rgb.r, rgb.g, rgb.b].map(function (value) {
    var normalized = value / 255;

    if (normalized <= 0.03928) {
      return normalized / 12.92;
    }

    return Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return (
    values[0] * 0.2126 +
    values[1] * 0.7152 +
    values[2] * 0.0722
  );
}

function getContrastRatio(color1, color2) {
  var luminance1 = getLuminance(color1);
  var luminance2 = getLuminance(color2);

  var light = Math.max(luminance1, luminance2);
  var dark = Math.min(luminance1, luminance2);

  return (light + 0.05) / (dark + 0.05);
}

function getScore(ratio) {
  if (ratio >= 7) {
    return {
      value: 100,
      label: "Excellent",
      description: "Passes WCAG AA and AAA for normal text.",
    };
  }

  if (ratio >= 4.5) {
    return {
      value: 85,
      label: "Good",
      description: "Passes WCAG AA for normal text.",
    };
  }

  if (ratio >= 3) {
    return {
      value: 65,
      label: "Needs improvement",
      description: "Suitable for large text, but not normal text.",
    };
  }

  if (ratio >= 2) {
    return {
      value: 45,
      label: "Limited",
      description: "Contrast is below recommended accessibility levels.",
    };
  }

  return {
    value: 25,
    label: "Poor",
    description: "Very low contrast. Consider changing the colors.",
  };
}

function App() {
  var [mode, setMode] = useState("normal");
  var [textColor, setTextColor] = useState("#FFFFFF");
  var [backgroundColor, setBackgroundColor] = useState("#2563EB");
  var [pickedColor, setPickedColor] = useState("#8B5CF6");
  var [copied, setCopied] = useState(false);
  var [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  var contrastRatio = getContrastRatio(textColor, backgroundColor);
  var score = getScore(contrastRatio);

  var passesNormalAA = contrastRatio >= 4.5;
  var passesLargeAA = contrastRatio >= 3;
  var passesAAA = contrastRatio >= 7;

  var pickedRgb = hexToRgb(pickedColor);

  var rgbText =
    "rgb(" +
    pickedRgb.r +
    ", " +
    pickedRgb.g +
    ", " +
    pickedRgb.b +
    ")";

  function scrollToSection(id) {
    var element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function handleMobileNavigation(id) {
    scrollToSection(id);
    setMobileMenuOpen(false);
  }

  async function copyColor() {
    try {
      await navigator.clipboard.writeText(pickedColor);
      setCopied(true);

      setTimeout(function () {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  }

  function getModeClass() {
    if (mode === "protanopia") {
      return "simulation-protanopia";
    }

    if (mode === "deuteranopia") {
      return "simulation-deuteranopia";
    }

    if (mode === "tritanopia") {
      return "simulation-tritanopia";
    }

    if (mode === "achromatopsia") {
      return "simulation-achromatopsia";
    }

    return "";
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-inner">
          <button
            className="brand"
            type="button"
            onClick={() => scrollToSection("top")}
          >
            <span className="brand-mark">
              <span></span>
              <span></span>
              <span></span>
            </span>

            <span className="brand-name">ColorVision</span>
          </button>

          <div className="nav-links">
            <button
              type="button"
              onClick={() => scrollToSection("demo")}
            >
              Simulator
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("tools")}
            >
              Tools
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("principles")}
            >
              Principles
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("about")}
            >
              About
            </button>
          </div>

          <div className="nav-right">
            <span className="nav-status">
              <span className="status-dot"></span>
              Accessibility first
            </span>

            <button
              className="mobile-menu-button"
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? "×" : "☰"}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="mobile-menu">
              <button
                type="button"
                onClick={() => handleMobileNavigation("demo")}
              >
                Simulator
              </button>

              <button
                type="button"
                onClick={() => handleMobileNavigation("tools")}
              >
                Tools
              </button>

              <button
                type="button"
                onClick={() => handleMobileNavigation("principles")}
              >
                Principles
              </button>

              <button
                type="button"
                onClick={() => handleMobileNavigation("about")}
              >
                About
              </button>
            </div>
          )}
        </div>
      </nav>

      <main>
        <section className="hero" id="top">
          <div className="hero-orbit orbit-one"></div>
          <div className="hero-orbit orbit-two"></div>

          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line"></span>
              DIGITAL ACCESSIBILITY
            </div>

            <h1>
              See the web
              <br />
              <span>without barriers.</span>
            </h1>

            <p className="hero-description">
              A practical toolkit for designing interfaces that work
              for people with different types of color vision.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => scrollToSection("demo")}
              >
                Explore simulator
                <span>→</span>
              </button>

              <button
                className="secondary-button"
                type="button"
                onClick={() => scrollToSection("tools")}
              >
                Check a color
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-card card-top">
              <span className="tiny-label">CONTRAST</span>
              <strong>7.4:1</strong>
              <span className="good-text">AAA PASS</span>
            </div>

            <div className="color-orb">
              <div className="orb-inner"></div>
            </div>

            <div className="floating-card card-bottom">
              <span className="tiny-label">VISION</span>
              <strong>5 MODES</strong>
              <span className="muted-text">SIMULATE</span>
            </div>
          </div>
        </section>

        <section className="section" id="modes">
          <div className="section-heading">
            <div>
              <span className="section-number">01</span>
              <span className="section-kicker">COLOR MODES</span>
            </div>

            <p>
              Explore how common color vision deficiencies
              change the way interface colors are perceived.
            </p>
          </div>

          <div className="mode-grid">
            {modes.map(function (item) {
              return (
                <button
                  className={
                    "mode-card " +
                    (mode === item.id ? "active" : "")
                  }
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                >
                  <div className={"mode-preview " + item.id}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className="mode-card-body">
                    <div className="mode-title-row">
                      <strong>{item.name}</strong>

                      {mode === item.id && (
                        <span className="selected-badge">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <p>{item.description}</p>
                    <small>{item.accent}</small>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="section live-section" id="demo">
          <div className="section-heading">
            <div>
              <span className="section-number">02</span>
              <span className="section-kicker">LIVE PREVIEW</span>
            </div>

            <p>
              Switch between vision modes and see how the same
              interface can appear differently.
            </p>
          </div>

          <div className="live-layout">
            <div className={"browser-window " + getModeClass()}>
              <div className="browser-bar">
                <div className="browser-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <span className="browser-address">
                  preview.colorvision.local
                </span>
              </div>

              <div className="demo-page">
                <div className="demo-sidebar">
                  <div className="demo-logo"></div>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="demo-main">
                  <div className="demo-header">
                    <div>
                      <small>OVERVIEW</small>
                      <h3>Dashboard</h3>
                    </div>

                    <div className="demo-avatar">CV</div>
                  </div>

                  <div className="demo-stats">
                    <div className="demo-stat">
                      <small>USERS</small>
                      <strong>24.8K</strong>
                      <span className="trend positive">
                        ↑ 12.4%
                      </span>
                    </div>

                    <div className="demo-stat">
                      <small>ORDERS</small>
                      <strong>8.42K</strong>
                      <span className="trend negative">
                        ↓ 2.1%
                      </span>
                    </div>

                    <div className="demo-stat">
                      <small>REVENUE</small>
                      <strong>$42.6K</strong>
                      <span className="trend positive">
                        ↑ 8.7%
                      </span>
                    </div>
                  </div>

                  <div className="demo-chart">
                    <div className="chart-header">
                      <strong>Activity</strong>
                      <span>Last 30 days</span>
                    </div>

                    <div className="chart">
                      <div className="chart-line"></div>
                      <div className="chart-bar bar-one"></div>
                      <div className="chart-bar bar-two"></div>
                      <div className="chart-bar bar-three"></div>
                      <div className="chart-bar bar-four"></div>
                      <div className="chart-bar bar-five"></div>
                      <div className="chart-bar bar-six"></div>
                      <div className="chart-bar bar-seven"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mode-control">
              <span className="control-label">SIMULATION MODE</span>

              <div className="mode-selector">
                {modes.map(function (item) {
                  return (
                    <button
                      className={
                        mode === item.id ? "selected" : ""
                      }
                      type="button"
                      key={item.id}
                      onClick={() => setMode(item.id)}
                    >
                      <span className={"selector-dot " + item.id}></span>
                      {item.name}
                    </button>
                  );
                })}
              </div>

              <div className="mode-explanation">
                <span className="explanation-icon">i</span>

                <p>
                  Color is only one visual signal. Accessible
                  interfaces also use labels, icons, patterns,
                  shapes, and text to communicate meaning.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="palette">
          <div className="section-heading">
            <div>
              <span className="section-number">03</span>
              <span className="section-kicker">COLOR PALETTE</span>
            </div>

            <p>
              A simple interface palette demonstrating why
              color should never be the only communication method.
            </p>
          </div>

          <div className="palette-grid">
            {palette.map(function (item) {
              return (
                <div className="palette-card" key={item.name}>
                  <div
                    className="palette-color"
                    style={{ backgroundColor: item.hex }}
                  ></div>

                  <div className="palette-info">
                    <strong>{item.name}</strong>
                    <span>{item.hex}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="meaning-demo">
            <div className="meaning-header">
              <div>
                <span className="tiny-label">STATUS EXAMPLE</span>
                <h3>Meaning beyond color</h3>
              </div>

              <span className="accessibility-chip">
                Accessible pattern
              </span>
            </div>

            <div className="status-list">
              <div className="status-item success-status">
                <span className="status-symbol">✓</span>
                <div>
                  <strong>Completed</strong>
                  <small>Payment received successfully</small>
                </div>
              </div>

              <div className="status-item warning-status">
                <span className="status-symbol">!</span>
                <div>
                  <strong>Pending</strong>
                  <small>Waiting for confirmation</small>
                </div>
              </div>

              <div className="status-item danger-status">
                <span className="status-symbol">×</span>
                <div>
                  <strong>Failed</strong>
                  <small>Payment could not be processed</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section tools-section" id="tools">
          <div className="section-heading">
            <div>
              <span className="section-number">04</span>
              <span className="section-kicker">TOOLS</span>
            </div>

            <p>
              Test colors, inspect values, and understand
              accessibility requirements before shipping.
            </p>
          </div>

          <div className="tools-grid">
            <div className="tool-card contrast-card">
              <div className="tool-header">
                <div>
                  <span className="tool-number">01 / CONTRAST</span>
                  <h3>Contrast checker</h3>
                </div>

                <span className="tool-icon">◐</span>
              </div>

              <div className="contrast-preview">
                <div
                  className="contrast-preview-inner"
                  style={{
                    color: textColor,
                    backgroundColor: backgroundColor,
                  }}
                >
                  <small>PREVIEW</small>
                  <strong>Readable text matters.</strong>
                  <span>Check your foreground and background pair.</span>
                </div>
              </div>

              <div className="color-inputs">
                <label>
                  <span>TEXT</span>

                  <div className="input-row">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(event) =>
                        setTextColor(event.target.value.toUpperCase())
                      }
                    />

                    <input
                      className="hex-input"
                      value={textColor}
                      onChange={(event) =>
                        setTextColor(event.target.value.toUpperCase())
                      }
                      maxLength={7}
                      aria-label="Text color"
                    />
                  </div>
                </label>

                <label>
                  <span>BACKGROUND</span>

                  <div className="input-row">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(event) =>
                        setBackgroundColor(
                          event.target.value.toUpperCase()
                        )
                      }
                    />

                    <input
                      className="hex-input"
                      value={backgroundColor}
                      onChange={(event) =>
                        setBackgroundColor(
                          event.target.value.toUpperCase()
                        )
                      }
                      maxLength={7}
                      aria-label="Background color"
                    />
                  </div>
                </label>
              </div>

              <div className="contrast-result">
                <div className="ratio-display">
                  <strong>{contrastRatio.toFixed(2)}:1</strong>
                  <span>CONTRAST RATIO</span>
                </div>

                <div className="passes">
                  <div className={passesNormalAA ? "pass" : "fail"}>
                    <span>{passesNormalAA ? "✓" : "×"}</span>
                    Normal AA
                  </div>

                  <div className={passesLargeAA ? "pass" : "fail"}>
                    <span>{passesLargeAA ? "✓" : "×"}</span>
                    Large AA
                  </div>

                  <div className={passesAAA ? "pass" : "fail"}>
                    <span>{passesAAA ? "✓" : "×"}</span>
                    AAA
                  </div>
                </div>
              </div>
            </div>

            <div className="tool-card picker-card">
              <div className="tool-header">
                <div>
                  <span className="tool-number">02 / PICKER</span>
                  <h3>Color picker</h3>
                </div>

                <span className="tool-icon">◉</span>
              </div>

              <div
                className="picker-preview"
                style={{ backgroundColor: pickedColor }}
              >
                <span>SELECT A COLOR</span>
              </div>

              <div className="picker-control">
                <input
                  type="color"
                  value={pickedColor}
                  onChange={(event) =>
                    setPickedColor(event.target.value.toUpperCase())
                  }
                  aria-label="Choose a color"
                />

                <div className="picker-values">
                  <span>HEX</span>
                  <strong>{pickedColor}</strong>

                  <span>RGB</span>
                  <strong>{rgbText}</strong>
                </div>

                <button
                  className="copy-button"
                  type="button"
                  onClick={copyColor}
                >
                  {copied ? "Copied ✓" : "Copy HEX"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="comparison">
          <div className="section-heading">
            <div>
              <span className="section-number">06</span>
              <span className="section-kicker">VISION COMPARISON</span>
            </div>

            <p>
              The same visual signal can change dramatically
              between different types of color vision.
            </p>
          </div>

          <div className="comparison-card">
            <div className="comparison-intro">
              <div>
                <span className="tiny-label">SIMULATED OUTPUT</span>
                <h3>How does this look?</h3>
              </div>

              <p>
                Compare the same color-coded status across
                different vision types.
              </p>
            </div>

            <div className="vision-table">
              {visionRows.map(function (row) {
                return (
                  <div className="vision-row" key={row.label}>
                    <span className="vision-label">
                      {row.label}
                    </span>

                    <div
                      className={
                        "vision-sample " + row.className
                      }
                    >
                      <span className="vision-symbol">✓</span>
                      {row.text}
                    </div>

                    <span className="vision-note">
                      Text + symbol
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section principles-section" id="principles">
          <div className="section-heading">
            <div>
              <span className="section-number">07</span>
              <span className="section-kicker">
                ACCESSIBILITY PRINCIPLES
              </span>
            </div>

            <p>
              Four simple rules for creating interfaces that
              communicate clearly to more people.
            </p>
          </div>

          <div className="principles-grid">
            <article className="principle-card">
              <span className="principle-number">01</span>
              <div className="principle-icon">◈</div>
              <h3>Don't rely on color</h3>
              <p>
                Use text, icons, shapes, labels, or patterns
                alongside color to communicate meaning.
              </p>
            </article>

            <article className="principle-card">
              <span className="principle-number">02</span>
              <div className="principle-icon">◐</div>
              <h3>Check contrast</h3>
              <p>
                Maintain sufficient contrast between text,
                controls, icons, and their backgrounds.
              </p>
            </article>

            <article className="principle-card">
              <span className="principle-number">03</span>
              <div className="principle-icon">◎</div>
              <h3>Test variations</h3>
              <p>
                Simulate different color vision types during
                design and development.
              </p>
            </article>

            <article className="principle-card">
              <span className="principle-number">04</span>
              <div className="principle-icon">◇</div>
              <h3>Keep it clear</h3>
              <p>
                Good accessibility usually makes interfaces
                easier for everyone to understand.
              </p>
            </article>
          </div>
        </section>

        <section className="section score-section" id="score">
          <div className="section-heading">
            <div>
              <span className="section-number">08</span>
              <span className="section-kicker">
                ACCESSIBILITY SCORE
              </span>
            </div>

            <p>
              A quick interpretation of your current contrast
              result.
            </p>
          </div>

          <div className="score-card">
            <div className="score-circle">
              <span>{score.value}</span>
              <small>/ 100</small>
            </div>

            <div className="score-content">
              <span className="tool-number">CURRENT RESULT</span>
              <h3>{score.label}</h3>
              <p>{score.description}</p>

              <div className="score-bar">
                <span style={{ width: score.value + "%" }}></span>
              </div>

              <div className="score-meta">
                <span>
                  Ratio <strong>{contrastRatio.toFixed(2)}:1</strong>
                </span>

                <span>
                  AA{" "}
                  <strong>
                    {passesNormalAA ? "PASS" : "FAIL"}
                  </strong>
                </span>

                <span>
                  AAA{" "}
                  <strong>
                    {passesAAA ? "PASS" : "FAIL"}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="about-card">
            <div className="about-mark">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div>
              <span className="section-kicker">09 / WHY IT MATTERS</span>

              <h2>
                Accessibility isn't a feature.
                <br />
                It's part of good design.
              </h2>

              <p>
                ColorVision helps designers and developers
                understand how their color choices affect real
                people. The goal isn't to remove color from
                interfaces — it's to make sure color is never
                the only way someone can understand them.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <strong>ColorVision</strong>
          <span>Designing for every way of seeing.</span>
        </div>

        <span>© 2026 ColorVision</span>
      </footer>
    </div>
  );
}

export default App;