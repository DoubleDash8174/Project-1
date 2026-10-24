
/* =========================================
   CAMPBELL'S BAKEHOUSE - SITE SETTINGS
   ========================================= */

const DEFAULTS = {
  fontSize: 16,
  backgroundColor: "#746656",
  fontColor: "#ffffff"
};

const STORAGE_KEY = "campbellsBakehouseSettings";

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      return {
        fontSize: Number.isFinite(parsed.fontSize)
          ? Math.min(52, Math.max(12, parsed.fontSize))
          : DEFAULTS.fontSize,
        backgroundColor: /^#[0-9a-f]{6}$/i.test(parsed.backgroundColor || "")
          ? parsed.backgroundColor
          : DEFAULTS.backgroundColor,
        fontColor: /^#[0-9a-f]{6}$/i.test(parsed.fontColor || "")
          ? parsed.fontColor
          : DEFAULTS.fontColor
      };
    }
  } catch (error) {
    console.warn("Could not load saved settings.", error);
  }

  return { ...DEFAULTS };
}

function applySettings(settings) {
  const root = document.documentElement;

  root.style.setProperty("--font-size", settings.fontSize + "px");
  root.style.setProperty("--background", settings.backgroundColor);
  root.style.setProperty("--text", settings.fontColor);

  // Keep settings controls in sync with the current values.
  const fontSize = document.getElementById("fontSize");
  const fontSizeValue = document.getElementById("fontSizeValue");
  const backgroundColor = document.getElementById("backgroundColor");
  const backgroundValue = document.getElementById("backgroundValue");
  const fontColor = document.getElementById("fontColor");
  const fontValue = document.getElementById("fontValue");

  if (fontSize) fontSize.value = settings.fontSize;
  if (fontSizeValue) fontSizeValue.textContent = settings.fontSize;

  if (backgroundColor) backgroundColor.value = settings.backgroundColor;
  if (backgroundValue) backgroundValue.textContent = settings.backgroundColor;

  if (fontColor) fontColor.value = settings.fontColor;
  if (fontValue) fontValue.textContent = settings.fontColor;
}

function saveSettings(settings) {
  applySettings(settings);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Could not save settings in this browser.", error);
  }

  const status = document.getElementById("settingsStatus");
  if (status) {
    status.textContent = "Your settings have been updated.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let settings = loadSettings();

  // Apply saved preferences on every page.
  applySettings(settings);

  const fontSize = document.getElementById("fontSize");
  const backgroundColor = document.getElementById("backgroundColor");
  const fontColor = document.getElementById("fontColor");
  const resetButton = document.getElementById("resetSettings");

  if (fontSize) {
    fontSize.addEventListener("input", () => {
      settings.fontSize = Number(fontSize.value);
      saveSettings(settings);
    });
  }

  if (backgroundColor) {
    backgroundColor.addEventListener("input", () => {
      settings.backgroundColor = backgroundColor.value;
      saveSettings(settings);
    });
  }

  if (fontColor) {
    fontColor.addEventListener("input", () => {
      settings.fontColor = fontColor.value;
      saveSettings(settings);
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      settings = { ...DEFAULTS };

      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn("Could not clear saved settings.", error);
      }

      applySettings(settings);

      const status = document.getElementById("settingsStatus");
      if (status) {
        status.textContent = "Defaults restored successfully.";
      }
    });
  }
});

