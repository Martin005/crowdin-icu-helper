const possibleStringIcuTypes = {
  plural: "plural",
  ordinal: "ordinal",
  select: "select",
  pluralWithSelect: "pluralWithSelect",
  ordinalWithSelect: "ordinalWithSelect",
  selectWithPlural: "selectWithPlural",
  selectWithOrdinal: "selectWithOrdinal",
};

const pluralCategoriesSortingTemplate = [
  "zero",
  "one",
  "two",
  "few",
  "many",
  "other",
];

var translationParsedIcu = {};

function getStringIcuInfo(sourceString) {
  var parsedString = icuParser.parse(sourceString);
  const firstIcuPluralOrSelect = parsedString.find((object) => {
    if (
      icuParser.isPluralElement(object) ||
      icuParser.isSelectElement(object)
    ) {
      return true;
    }
  });

  if (!firstIcuPluralOrSelect) {
    return null;
  }

  parsedString = firstIcuPluralOrSelect;
  var stringIcuInfo = {};
  if (icuParser.isPluralElement(parsedString)) {
    if (parsedString.pluralType === "ordinal") {
      stringIcuInfo.ordinalPlaceholder = parsedString.value;
    } else {
      stringIcuInfo.pluralPlaceholder = parsedString.value;
    }

    var containsSelect = false;
    for (const [optionKey, optionValue] of Object.entries(
      parsedString.options
    )) {
      if (containsSelect) {
        break;
      }

      for (const [key, value] of Object.entries(optionValue.value)) {
        if (icuParser.isSelectElement(value)) {
          stringIcuInfo.selectPlaceholder = value.value;
          stringIcuInfo.selectForms = Object.keys(value.options);
          containsSelect = true;
          break;
        }
      }
    }

    if (containsSelect) {
      if (parsedString.pluralType === "ordinal") {
        stringIcuInfo.icuType = possibleStringIcuTypes.ordinalWithSelect;
        stringIcuInfo.ordinalWithSelectStructuredTexts = [];
        for (const [optionKey, optionValue] of Object.entries(
          parsedString.options
        )) {
          stringIcuInfo.ordinalWithSelectStructuredTexts[optionKey] = [];
          for (const [key, value] of Object.entries(optionValue.value)) {
            if (icuParser.isSelectElement(value)) {
              for (const [selectKey, selectValue] of Object.entries(
                value.options
              )) {
                stringIcuInfo.ordinalWithSelectStructuredTexts[optionKey][
                  selectKey
                ] = selectValue.value
                  .map((valueObject) => {
                    return getStringValueFromIcuValueObject(valueObject);
                  })
                  .join("");
              }
            }
          }
        }
      } else {
        stringIcuInfo.icuType = possibleStringIcuTypes.pluralWithSelect;
        stringIcuInfo.pluralWithSelectStructuredTexts = [];
        for (const [optionKey, optionValue] of Object.entries(
          parsedString.options
        )) {
          stringIcuInfo.pluralWithSelectStructuredTexts[optionKey] = [];
          for (const [key, value] of Object.entries(optionValue.value)) {
            if (icuParser.isSelectElement(value)) {
              for (const [selectKey, selectValue] of Object.entries(
                value.options
              )) {
                stringIcuInfo.pluralWithSelectStructuredTexts[optionKey][
                  selectKey
                ] = selectValue.value
                  .map((valueObject) => {
                    return getStringValueFromIcuValueObject(valueObject);
                  })
                  .join("");
              }
            }
          }
        }
      }
    } else {
      if (parsedString.pluralType === "ordinal") {
        stringIcuInfo.icuType = possibleStringIcuTypes.ordinal;
        stringIcuInfo.ordinalStructuredTexts = [];
        for (const [optionKey, optionValue] of Object.entries(
          parsedString.options
        )) {
          stringIcuInfo.ordinalStructuredTexts[optionKey] = optionValue.value
            .map((valueObject) => {
              return getStringValueFromIcuValueObject(valueObject);
            })
            .join("");
        }
      } else {
        stringIcuInfo.icuType = possibleStringIcuTypes.plural;
        stringIcuInfo.pluralStructuredTexts = [];
        for (const [optionKey, optionValue] of Object.entries(
          parsedString.options
        )) {
          stringIcuInfo.pluralStructuredTexts[optionKey] = optionValue.value
            .map((valueObject) => {
              return getStringValueFromIcuValueObject(valueObject);
            })
            .join("");
        }
      }
    }
  } else if (icuParser.isSelectElement(parsedString)) {
    stringIcuInfo.selectPlaceholder = parsedString.value;
    stringIcuInfo.selectForms = Object.keys(parsedString.options);
    var containsPlural = false;
    for (const [optionKey, optionValue] of Object.entries(
      parsedString.options
    )) {
      if (containsPlural) {
        break;
      }

      for (const [key, value] of Object.entries(optionValue.value)) {
        if (icuParser.isPluralElement(value)) {
          if (value.pluralType === "ordinal") {
            stringIcuInfo.ordinalPlaceholder = value.value;
            stringIcuInfo.icuType = possibleStringIcuTypes.selectWithOrdinal;
          } else {
            stringIcuInfo.pluralPlaceholder = value.value;
            stringIcuInfo.icuType = possibleStringIcuTypes.selectWithPlural;
          }

          containsPlural = true;
          break;
        }
      }
    }

    if (containsPlural) {
      if (stringIcuInfo.icuType === possibleStringIcuTypes.selectWithOrdinal) {
        stringIcuInfo.selectWithOrdinalStructuredTexts = [];
        for (const [optionKey, optionValue] of Object.entries(
          parsedString.options
        )) {
          stringIcuInfo.selectWithOrdinalStructuredTexts[optionKey] = [];
          for (const [key, value] of Object.entries(optionValue.value)) {
            if (icuParser.isPluralElement(value)) {
              for (const [pluralKey, pluralValue] of Object.entries(
                value.options
              )) {
                stringIcuInfo.selectWithOrdinalStructuredTexts[optionKey][
                  pluralKey
                ] = pluralValue.value
                  .map((valueObject) => {
                    return getStringValueFromIcuValueObject(valueObject);
                  })
                  .join("");
              }
            }
          }
        }
      } else {
        stringIcuInfo.selectWithPluralStructuredTexts = [];
        for (const [optionKey, optionValue] of Object.entries(
          parsedString.options
        )) {
          stringIcuInfo.selectWithPluralStructuredTexts[optionKey] = [];
          for (const [key, value] of Object.entries(optionValue.value)) {
            if (icuParser.isPluralElement(value)) {
              for (const [pluralKey, pluralValue] of Object.entries(
                value.options
              )) {
                stringIcuInfo.selectWithPluralStructuredTexts[optionKey][
                  pluralKey
                ] = pluralValue.value
                  .map((valueObject) => {
                    return getStringValueFromIcuValueObject(valueObject);
                  })
                  .join("");
              }
            }
          }
        }
      }
    } else {
      stringIcuInfo.icuType = possibleStringIcuTypes.select;
      stringIcuInfo.selectStructuredTexts = [];
      for (const [optionKey, optionValue] of Object.entries(
        parsedString.options
      )) {
        stringIcuInfo.selectStructuredTexts[optionKey] = optionValue.value
          .map((valueObject) => {
            return getStringValueFromIcuValueObject(valueObject);
          })
          .join("");
      }
    }
  } else {
    stringIcuInfo = null;
  }
  return stringIcuInfo;
}

function makeUiEditorVisible() {
  const translatePanel = document.getElementById("translate-panel");
  const setTranslationButton = document.getElementById("set-translation-button");
  const noIcuMessage = document.getElementById("no-icu-message");
  const translationPreview = document.getElementById("translation-preview");

  translatePanel.style.removeProperty("display");
  translationPreview.style.removeProperty("display");
  setTranslationButton.style.display = "flex";

  noIcuMessage.removeAttribute("style");
  if (noIcuMessage.firstElementChild) {
    noIcuMessage.firstElementChild.remove();
  }
}

function makeUiEditorInvisible() {
  const translatePanel = document.getElementById("translate-panel");
  const setTranslationButton = document.getElementById("set-translation-button");
  const noIcuMessage = document.getElementById("no-icu-message");
  const translationPreview = document.getElementById("translation-preview");

  translatePanel.style.display = "none";
  setTranslationButton.style.display = "none";
  translationPreview.style.display = "none";

  noIcuMessage.style.textAlign = "center";
  noIcuMessage.style.marginTop = "8rem";

  if (noIcuMessage.childElementCount === 0) {
    const crowdinParagraph = document.createElement("crowdin-p");
    crowdinParagraph.textContent =
      "There is no ICU Message in this string that I can help you with.";
    noIcuMessage.appendChild(crowdinParagraph);
  }
}

function updateUiBasedOnSourceString(sourceString) {
  removeCurrentUi();
  const stringIcuInfo = getStringIcuInfo(sourceString);
  if (stringIcuInfo) {
    makeUiEditorVisible();
    const translatePanel = document.getElementById("translate-panel");
    translatePanel.style.minHeight = "11rem";
    translatePanel.setAttribute("data-icu", JSON.stringify(stringIcuInfo));

    AP.editor.getTopTranslation(function (data) {
      if (data && data.text) {
        translationParsedIcu = getStringIcuInfo(data.text);
      }

      AP.getContext(function (data) {
        const targetLanguageCode = data.editor.target_language_id;

        if (stringIcuInfo.icuType === possibleStringIcuTypes.plural) {
          buildUiForPluralString(translatePanel, targetLanguageCode);
        } else if (stringIcuInfo.icuType === possibleStringIcuTypes.ordinal) {
          buildUiForOrdinalString(translatePanel, targetLanguageCode);
        } else if (stringIcuInfo.icuType === possibleStringIcuTypes.select) {
          buildUiForSelectString(translatePanel, stringIcuInfo);
        } else if (
          stringIcuInfo.icuType === possibleStringIcuTypes.pluralWithSelect
        ) {
          buildUiForPluralWithSelectString(
            translatePanel,
            stringIcuInfo,
            targetLanguageCode
          );
        } else if (
          stringIcuInfo.icuType === possibleStringIcuTypes.ordinalWithSelect
        ) {
          buildUiForOrdinalWithSelectString(
            translatePanel,
            stringIcuInfo,
            targetLanguageCode
          );
        } else if (
          stringIcuInfo.icuType === possibleStringIcuTypes.selectWithPlural
        ) {
          buildUiForSelectWithPluralString(
            translatePanel,
            stringIcuInfo,
            targetLanguageCode
          );
        } else if (
          stringIcuInfo.icuType === possibleStringIcuTypes.selectWithOrdinal
        ) {
          buildUiForSelectWithOrdinalString(
            translatePanel,
            stringIcuInfo,
            targetLanguageCode
          );
        }

        // Fill in the preview with empty generated ICU translation
        document
          .getElementById("translation-preview-code")
          .setAttribute("code", getGeneratedIcuTranslation());
      });
    });
  } else {
    makeUiEditorInvisible();
  }
}

function buildUiForPluralString(translatePanel, targetLanguageCode) {
  var pluralCategories = new Intl.PluralRules(
    targetLanguageCode
  ).resolvedOptions().pluralCategories;
  var sortedPluralCategories = pluralCategories.sort(
    (a, b) =>
      pluralCategoriesSortingTemplate.indexOf(a) -
      pluralCategoriesSortingTemplate.indexOf(b)
  );

  const tabs = document.createElement("crowdin-tabs");
  tabs.setAttribute("tabs-config", JSON.stringify(sortedPluralCategories));
  tabs.setAttribute("id", `${possibleStringIcuTypes.plural}-tabs`);
  tabs.setAttribute("active-tab", "1");
  tabs.setAttribute("tab-count", sortedPluralCategories.length);
  tabs.setAttribute("is-content", "");
  tabs.classList.add("hydrated");
  styleTabs(tabs);

  for (let i = 0; i < sortedPluralCategories.length; i++) {
    const sortedCategory = sortedPluralCategories[i];
    const tabDivElement = document.createElement("div");
    tabDivElement.setAttribute("slot", `tab-${i + 1}`);
    tabDivElement.setAttribute("plural-form", sortedCategory);

    const textArea = document.createElement("textarea");
    styleTextArea(textArea);

    if (Object.keys(translationParsedIcu).length) {
      if (translationParsedIcu.pluralStructuredTexts[sortedCategory])
        textArea.value =
          translationParsedIcu.pluralStructuredTexts[sortedCategory];
    }

    tabDivElement.appendChild(textArea);

    tabs.appendChild(tabDivElement);
  }

  addTabKeyEventListeners(tabs);

  if (!translatePanel.firstChild) {
    translatePanel.appendChild(tabs);
  }
}

function buildUiForOrdinalString(translatePanel, targetLanguageCode) {
  var ordinalCategories = new Intl.PluralRules(targetLanguageCode, {
    type: "ordinal",
  }).resolvedOptions().pluralCategories;

  var sortedOrdinalCategories = [];
  if (ordinalCategories.length > 1) {
    var sortedOrdinalCategories = ordinalCategories.sort(
      (a, b) =>
        pluralCategoriesSortingTemplate.indexOf(a) -
        pluralCategoriesSortingTemplate.indexOf(b)
    );
  } else {
    sortedOrdinalCategories = ordinalCategories;
  }

  const tabs = document.createElement("crowdin-tabs");
  tabs.setAttribute("tabs-config", JSON.stringify(sortedOrdinalCategories));
  tabs.setAttribute("id", `${possibleStringIcuTypes.ordinal}-tabs`);
  tabs.setAttribute("active-tab", "1");
  tabs.setAttribute("tab-count", sortedOrdinalCategories.length);
  tabs.setAttribute("is-content", "");
  tabs.classList.add("hydrated");
  styleTabs(tabs);

  for (let i = 0; i < sortedOrdinalCategories.length; i++) {
    const sortedCategory = sortedOrdinalCategories[i];
    const tabDivElement = document.createElement("div");
    tabDivElement.setAttribute("slot", `tab-${i + 1}`);
    tabDivElement.setAttribute("ordinal-form", sortedCategory);

    const textArea = document.createElement("textarea");
    styleTextArea(textArea);

    if (Object.keys(translationParsedIcu).length) {
      if (translationParsedIcu.ordinalStructuredTexts[sortedCategory])
        textArea.value =
          translationParsedIcu.ordinalStructuredTexts[sortedCategory];
    }

    tabDivElement.appendChild(textArea);

    tabs.appendChild(tabDivElement);
  }

  addTabKeyEventListeners(tabs);

  if (!translatePanel.firstChild) {
    translatePanel.appendChild(tabs);
  }
}

function buildUiForSelectString(translatePanel, stringIcuInfo) {
  const selectForms = stringIcuInfo.selectForms;
  const tabs = document.createElement("crowdin-tabs");
  tabs.setAttribute("tabs-config", JSON.stringify(selectForms));
  tabs.setAttribute("id", `${possibleStringIcuTypes.select}-tabs`);
  tabs.setAttribute("active-tab", "1");
  tabs.setAttribute("tab-count", selectForms.length);
  tabs.setAttribute("is-content", "");
  tabs.classList.add("hydrated");
  styleTabs(tabs);

  for (let i = 0; i < selectForms.length; i++) {
    const selectForm = selectForms[i];
    const tabDivElement = document.createElement("div");
    tabDivElement.setAttribute("slot", `tab-${i + 1}`);
    tabDivElement.setAttribute("select-form", selectForm);

    const textArea = document.createElement("textarea");
    styleTextArea(textArea);

    if (Object.keys(translationParsedIcu).length) {
      if (translationParsedIcu.selectStructuredTexts[selectForm])
        textArea.value = translationParsedIcu.selectStructuredTexts[selectForm];
    }

    tabDivElement.appendChild(textArea);

    tabs.appendChild(tabDivElement);
  }

  addTabKeyEventListeners(tabs);

  if (!translatePanel.firstChild) {
    translatePanel.appendChild(tabs);
  }
}

function buildUiForPluralWithSelectString(
  translatePanel,
  stringIcuInfo,
  targetLanguageCode
) {
  var pluralCategories = new Intl.PluralRules(
    targetLanguageCode
  ).resolvedOptions().pluralCategories;
  var sortedPluralCategories = pluralCategories.sort(
    (a, b) =>
      pluralCategoriesSortingTemplate.indexOf(a) -
      pluralCategoriesSortingTemplate.indexOf(b)
  );
  const selectForms = stringIcuInfo.selectForms;

  const tabs = document.createElement("crowdin-tabs");
  tabs.setAttribute("tabs-config", JSON.stringify(sortedPluralCategories));
  tabs.setAttribute("id", `${possibleStringIcuTypes.pluralWithSelect}-tabs`);
  tabs.setAttribute("active-tab", "1");
  tabs.setAttribute("tab-count", sortedPluralCategories.length);
  tabs.setAttribute("is-content", "");
  tabs.classList.add("hydrated");
  styleTabs(tabs);

  for (let i = 0; i < sortedPluralCategories.length; i++) {
    const sortedCategory = sortedPluralCategories[i];
    const tabDivElement = document.createElement("div");
    tabDivElement.setAttribute("slot", `tab-${i + 1}`);
    tabDivElement.setAttribute("plural-form", sortedCategory);

    const tabsSelect = document.createElement("crowdin-tabs");
    tabsSelect.setAttribute("tabs-config", JSON.stringify(selectForms));
    tabsSelect.setAttribute("id", `${possibleStringIcuTypes.select}-tabs`);
    tabsSelect.setAttribute("active-tab", "1");
    tabsSelect.setAttribute("tab-count", selectForms.length);
    tabsSelect.setAttribute("is-content", "");
    tabsSelect.classList.add("hydrated");

    for (let i = 0; i < selectForms.length; i++) {
      const selectForm = selectForms[i];
      const tabSelectDivElement = document.createElement("div");
      tabSelectDivElement.setAttribute("slot", `tab-${i + 1}`);
      tabSelectDivElement.setAttribute("select-form", selectForm);

      const textArea = document.createElement("textarea");
      styleTextArea(textArea);

      if (Object.keys(translationParsedIcu).length) {
        if (
          translationParsedIcu.pluralWithSelectStructuredTexts[sortedCategory][
            selectForm
          ]
        )
          textArea.value =
            translationParsedIcu.pluralWithSelectStructuredTexts[
              sortedCategory
            ][selectForm];
      }

      tabSelectDivElement.appendChild(textArea);

      tabsSelect.appendChild(tabSelectDivElement);
    }

    addTabKeyEventListeners(tabsSelect);

    tabDivElement.appendChild(tabsSelect);

    tabs.appendChild(tabDivElement);
  }

  if (!translatePanel.firstChild) {
    translatePanel.appendChild(tabs);
  }
}

function buildUiForOrdinalWithSelectString(
  translatePanel,
  stringIcuInfo,
  targetLanguageCode
) {
  var ordinalCategories = new Intl.PluralRules(targetLanguageCode, {
    type: "ordinal",
  }).resolvedOptions().pluralCategories;

  var sortedOrdinalCategories = [];
  if (ordinalCategories.length > 1) {
    var sortedOrdinalCategories = ordinalCategories.sort(
      (a, b) =>
        pluralCategoriesSortingTemplate.indexOf(a) -
        pluralCategoriesSortingTemplate.indexOf(b)
    );
  } else {
    sortedOrdinalCategories = ordinalCategories;
  }

  const selectForms = stringIcuInfo.selectForms;

  const tabs = document.createElement("crowdin-tabs");
  tabs.setAttribute("tabs-config", JSON.stringify(sortedOrdinalCategories));
  tabs.setAttribute("id", `${possibleStringIcuTypes.ordinalWithSelect}-tabs`);
  tabs.setAttribute("active-tab", "1");
  tabs.setAttribute("tab-count", sortedOrdinalCategories.length);
  tabs.setAttribute("is-content", "");
  tabs.classList.add("hydrated");
  styleTabs(tabs);

  for (let i = 0; i < sortedOrdinalCategories.length; i++) {
    const sortedCategory = sortedOrdinalCategories[i];
    const tabDivElement = document.createElement("div");
    tabDivElement.setAttribute("slot", `tab-${i + 1}`);
    tabDivElement.setAttribute("ordinal-form", sortedCategory);

    const tabsSelect = document.createElement("crowdin-tabs");
    tabsSelect.setAttribute("tabs-config", JSON.stringify(selectForms));
    tabsSelect.setAttribute("id", `${possibleStringIcuTypes.select}-tabs`);
    tabsSelect.setAttribute("active-tab", "1");
    tabsSelect.setAttribute("tab-count", selectForms.length);
    tabsSelect.setAttribute("is-content", "");
    tabsSelect.classList.add("hydrated");

    for (let i = 0; i < selectForms.length; i++) {
      const selectForm = selectForms[i];
      const tabSelectDivElement = document.createElement("div");
      tabSelectDivElement.setAttribute("slot", `tab-${i + 1}`);
      tabSelectDivElement.setAttribute("select-form", selectForm);

      const textArea = document.createElement("textarea");
      styleTextArea(textArea);

      if (Object.keys(translationParsedIcu).length) {
        if (
          translationParsedIcu.ordinalWithSelectStructuredTexts[sortedCategory][
            selectForm
          ]
        )
          textArea.value =
            translationParsedIcu.ordinalWithSelectStructuredTexts[
              sortedCategory
            ][selectForm];
      }

      tabSelectDivElement.appendChild(textArea);

      tabsSelect.appendChild(tabSelectDivElement);
    }

    addTabKeyEventListeners(tabsSelect);

    tabDivElement.appendChild(tabsSelect);

    tabs.appendChild(tabDivElement);
  }

  if (!translatePanel.firstChild) {
    translatePanel.appendChild(tabs);
  }
}

function buildUiForSelectWithPluralString(
  translatePanel,
  stringIcuInfo,
  targetLanguageCode
) {
  const selectForms = stringIcuInfo.selectForms;
  var pluralCategories = new Intl.PluralRules(
    targetLanguageCode
  ).resolvedOptions().pluralCategories;
  var sortedPluralCategories = pluralCategories.sort(
    (a, b) =>
      pluralCategoriesSortingTemplate.indexOf(a) -
      pluralCategoriesSortingTemplate.indexOf(b)
  );

  const tabs = document.createElement("crowdin-tabs");
  tabs.setAttribute("tabs-config", JSON.stringify(selectForms));
  tabs.setAttribute("id", `${possibleStringIcuTypes.selectWithPlural}-tabs`);
  tabs.setAttribute("active-tab", "1");
  tabs.setAttribute("tab-count", selectForms.length);
  tabs.setAttribute("is-content", "");
  tabs.classList.add("hydrated");
  styleTabs(tabs);

  for (let i = 0; i < selectForms.length; i++) {
    const selectForm = selectForms[i];
    const tabDivElement = document.createElement("div");
    tabDivElement.setAttribute("slot", `tab-${i + 1}`);
    tabDivElement.setAttribute("select-form", selectForm);

    const tabsPlural = document.createElement("crowdin-tabs");
    tabsPlural.setAttribute(
      "tabs-config",
      JSON.stringify(sortedPluralCategories)
    );
    tabsPlural.setAttribute("id", `${possibleStringIcuTypes.plural}-tabs`);
    tabsPlural.setAttribute("active-tab", "1");
    tabsPlural.setAttribute("tab-count", sortedPluralCategories.length);
    tabsPlural.setAttribute("is-content", "");
    tabsPlural.classList.add("hydrated");

    for (let i = 0; i < sortedPluralCategories.length; i++) {
      const sortedCategory = sortedPluralCategories[i];
      const tabPluralDivElement = document.createElement("div");
      tabPluralDivElement.setAttribute("slot", `tab-${i + 1}`);
      tabPluralDivElement.setAttribute("plural-form", sortedCategory);

      const textArea = document.createElement("textarea");
      styleTextArea(textArea);

      if (Object.keys(translationParsedIcu).length) {
        if (
          translationParsedIcu.selectWithPluralStructuredTexts[selectForm][
            sortedCategory
          ]
        )
          textArea.value =
            translationParsedIcu.selectWithPluralStructuredTexts[selectForm][
              sortedCategory
            ];
      }

      tabPluralDivElement.appendChild(textArea);

      tabsPlural.appendChild(tabPluralDivElement);
    }

    addTabKeyEventListeners(tabsPlural);

    tabDivElement.appendChild(tabsPlural);

    tabs.appendChild(tabDivElement);
  }

  if (!translatePanel.firstChild) {
    translatePanel.appendChild(tabs);
  }
}

function buildUiForSelectWithOrdinalString(
  translatePanel,
  stringIcuInfo,
  targetLanguageCode
) {
  const selectForms = stringIcuInfo.selectForms;
  var ordinalCategories = new Intl.PluralRules(targetLanguageCode, {
    type: "ordinal",
  }).resolvedOptions().pluralCategories;

  var sortedOrdinalCategories = [];
  if (ordinalCategories.length > 1) {
    var sortedOrdinalCategories = ordinalCategories.sort(
      (a, b) =>
        pluralCategoriesSortingTemplate.indexOf(a) -
        pluralCategoriesSortingTemplate.indexOf(b)
    );
  } else {
    sortedOrdinalCategories = ordinalCategories;
  }

  const tabs = document.createElement("crowdin-tabs");
  tabs.setAttribute("tabs-config", JSON.stringify(selectForms));
  tabs.setAttribute("id", `${possibleStringIcuTypes.selectWithOrdinal}-tabs`);
  tabs.setAttribute("active-tab", "1");
  tabs.setAttribute("tab-count", selectForms.length);
  tabs.setAttribute("is-content", "");
  tabs.classList.add("hydrated");
  styleTabs(tabs);

  for (let i = 0; i < selectForms.length; i++) {
    const selectForm = selectForms[i];
    const tabDivElement = document.createElement("div");
    tabDivElement.setAttribute("slot", `tab-${i + 1}`);
    tabDivElement.setAttribute("select-form", selectForm);

    const tabsOrdinal = document.createElement("crowdin-tabs");
    tabsOrdinal.setAttribute(
      "tabs-config",
      JSON.stringify(sortedOrdinalCategories)
    );
    tabsOrdinal.setAttribute("id", `${possibleStringIcuTypes.ordinal}-tabs`);
    tabsOrdinal.setAttribute("active-tab", "1");
    tabsOrdinal.setAttribute("tab-count", sortedOrdinalCategories.length);
    tabsOrdinal.setAttribute("is-content", "");
    tabsOrdinal.classList.add("hydrated");

    for (let i = 0; i < sortedOrdinalCategories.length; i++) {
      const sortedCategory = sortedOrdinalCategories[i];
      const tabOrdinalDivElement = document.createElement("div");
      tabOrdinalDivElement.setAttribute("slot", `tab-${i + 1}`);
      tabOrdinalDivElement.setAttribute("ordinal-form", sortedCategory);

      const textArea = document.createElement("textarea");
      styleTextArea(textArea);

      if (Object.keys(translationParsedIcu).length) {
        if (
          translationParsedIcu.selectWithOrdinalStructuredTexts[selectForm][
            sortedCategory
          ]
        )
          textArea.value =
            translationParsedIcu.selectWithOrdinalStructuredTexts[selectForm][
              sortedCategory
            ];
      }

      tabOrdinalDivElement.appendChild(textArea);

      tabsOrdinal.appendChild(tabOrdinalDivElement);
    }

    addTabKeyEventListeners(tabsOrdinal);

    tabDivElement.appendChild(tabsOrdinal);

    tabs.appendChild(tabDivElement);
  }

  if (!translatePanel.firstChild) {
    translatePanel.appendChild(tabs);
  }
}

function styleTextArea(textArea) {
  textArea.style.resize = "none";
  textArea.style.height = "100px";
  textArea.style.overflow = "auto";
  textArea.style.width = "100%";
  textArea.style.fontSize = "15px";
  textArea.style.color = "#555";
  textArea.style.marginBlockStart = "-16px";
  textArea.style.outline = "none";
  textArea.style.fontFamily =
    "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif";
}

function styleTabs(tabs) {
  tabs.style.marginLeft = "1rem";
  tabs.style.marginRight = "1.5rem";
  tabs.style.display = "block";
}

function addTabKeyEventListeners(tabsElement) {
  const textAreas = tabsElement.getElementsByTagName("textarea");
  for (let i = 0; i < textAreas.length; i++) {
    const textArea = textAreas[i];

    textArea.addEventListener("input", (event) => {
      document
        .getElementById("translation-preview-code")
        .setAttribute("code", getGeneratedIcuTranslation());
    });

    textArea.addEventListener("keydown", (event) => {
      if (event.isComposing || event.keyCode === 229) {
        return;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        event.stopPropagation();

        const currentActiveTab = Number(tabsElement.getAttribute("active-tab"));
        const tabCount = Number(tabsElement.getAttribute("tab-count"));

        if (event.shiftKey) {
          if (currentActiveTab === 1) {
            tabsElement.setAttribute("active-tab", tabCount);
            setTimeout(() => {
              const textAreaToFocus = textAreas[textAreas.length - 1];
              textAreaToFocus.focus();
            }, 10);
          } else {
            tabsElement.setAttribute("active-tab", currentActiveTab - 1);
            setTimeout(() => {
              const textAreaToFocus = textAreas[i - 1];
              textAreaToFocus.focus();
            }, 10);
          }
        } else {
          if (currentActiveTab === tabCount) {
            tabsElement.setAttribute("active-tab", 1);
            setTimeout(() => {
              const textAreaToFocus = textAreas[0];
              textAreaToFocus.focus();
            }, 10);
          } else {
            tabsElement.setAttribute("active-tab", currentActiveTab + 1);
            setTimeout(() => {
              const textAreaToFocus = textAreas[i + 1];
              textAreaToFocus.focus();
            }, 10);
          }
        }
      }
    });
  }
}

function getGeneratedIcuTranslation() {
  const translatePanel = document.getElementById("translate-panel");
  const stringIcuInfo = JSON.parse(translatePanel.dataset.icu);
  var translation = "";

  if (stringIcuInfo.icuType === possibleStringIcuTypes.plural) {
    const tabs = document.getElementById(
      `${possibleStringIcuTypes.plural}-tabs`
    );
    var pluralForms = {};
    for (let i = 0; i < tabs.childNodes.length; i++) {
      const tab = tabs.childNodes[i];
      const tabPluralForm = tab.getAttribute("plural-form");
      const tabTranslation = tab.firstChild.value;

      pluralForms[tabPluralForm] = tabTranslation;
    }

    const pluralFormsTranslations = Object.entries(pluralForms)
      .map(([key, value]) => `\n  ${key} {${value}}`)
      .join("");
    translation = `{${stringIcuInfo.pluralPlaceholder}, plural,${pluralFormsTranslations}}`;
  } else if (stringIcuInfo.icuType === possibleStringIcuTypes.ordinal) {
    const tabs = document.getElementById(
      `${possibleStringIcuTypes.ordinal}-tabs`
    );
    var ordinalForms = {};
    for (let i = 0; i < tabs.childNodes.length; i++) {
      const tab = tabs.childNodes[i];
      const tabOrdinalForm = tab.getAttribute("ordinal-form");
      const tabTranslation = tab.firstChild.value;

      ordinalForms[tabOrdinalForm] = tabTranslation;
    }

    const ordinalFormsTranslations = Object.entries(ordinalForms)
      .map(([key, value]) => `\n  ${key} {${value}}`)
      .join("");
    translation = `{${stringIcuInfo.ordinalPlaceholder}, selectordinal,${ordinalFormsTranslations}}`;
  } else if (stringIcuInfo.icuType === possibleStringIcuTypes.select) {
    const tabs = document.getElementById(
      `${possibleStringIcuTypes.select}-tabs`
    );
    var selectForms = {};
    for (let i = 0; i < tabs.childNodes.length; i++) {
      const tab = tabs.childNodes[i];
      const tabSelectForm = tab.getAttribute("select-form");
      const tabTranslation = tab.firstChild.value;

      selectForms[tabSelectForm] = tabTranslation;
    }

    const selectFormsTranslations = Object.entries(selectForms)
      .map(([key, value]) => `\n  ${key} {${value}}`)
      .join("");
    translation = `{${stringIcuInfo.selectPlaceholder}, select,${selectFormsTranslations}}`;
  } else if (
    stringIcuInfo.icuType === possibleStringIcuTypes.pluralWithSelect
  ) {
    const tabs = document.getElementById(
      `${possibleStringIcuTypes.pluralWithSelect}-tabs`
    );
    var pluralForms = {};
    for (let i = 0; i < tabs.childNodes.length; i++) {
      const tab = tabs.childNodes[i];
      const tabPluralForm = tab.getAttribute("plural-form");

      const selectTabs = tab.firstElementChild;
      var selectForms = {};
      for (let i = 0; i < selectTabs.childNodes.length; i++) {
        const selectTab = selectTabs.childNodes[i];
        const tabSelectForm = selectTab.getAttribute("select-form");
        const tabTranslation = selectTab.firstChild.value;

        selectForms[tabSelectForm] = tabTranslation;
      }

      const selectFormsTranslations = Object.entries(selectForms)
        .map(([key, value]) => `\n    ${key} {${value}}`)
        .join("");
      pluralForms[
        tabPluralForm
      ] = `{${stringIcuInfo.selectPlaceholder}, select,${selectFormsTranslations}}`;
    }

    const pluralFormsTranslations = Object.entries(pluralForms)
      .map(([key, value]) => `\n  ${key} {${value}}`)
      .join("");
    translation = `{${stringIcuInfo.pluralPlaceholder}, plural,${pluralFormsTranslations}}`;
  } else if (
    stringIcuInfo.icuType === possibleStringIcuTypes.ordinalWithSelect
  ) {
    const tabs = document.getElementById(
      `${possibleStringIcuTypes.ordinalWithSelect}-tabs`
    );
    var ordinalForms = {};
    for (let i = 0; i < tabs.childNodes.length; i++) {
      const tab = tabs.childNodes[i];
      const tabOrdinalForm = tab.getAttribute("ordinal-form");

      const selectTabs = tab.firstElementChild;
      var selectForms = {};
      for (let i = 0; i < selectTabs.childNodes.length; i++) {
        const selectTab = selectTabs.childNodes[i];
        const tabSelectForm = selectTab.getAttribute("select-form");
        const tabTranslation = selectTab.firstChild.value;

        selectForms[tabSelectForm] = tabTranslation;
      }

      const selectFormsTranslations = Object.entries(selectForms)
        .map(([key, value]) => `\n    ${key} {${value}}`)
        .join("");
      ordinalForms[
        tabOrdinalForm
      ] = `{${stringIcuInfo.selectPlaceholder}, select,${selectFormsTranslations}}`;
    }

    const ordinalFormsTranslations = Object.entries(ordinalForms)
      .map(([key, value]) => `\n  ${key} {${value}}`)
      .join("");
    translation = `{${stringIcuInfo.ordinalPlaceholder}, selectordinal,${ordinalFormsTranslations}}`;
  } else if (
    stringIcuInfo.icuType === possibleStringIcuTypes.selectWithPlural
  ) {
    const tabs = document.getElementById(
      `${possibleStringIcuTypes.selectWithPlural}-tabs`
    );
    var selectForms = {};
    for (let i = 0; i < tabs.childNodes.length; i++) {
      const tab = tabs.childNodes[i];
      const tabSelectForm = tab.getAttribute("select-form");

      const pluralTabs = tab.firstElementChild;
      var pluralForms = {};
      for (let i = 0; i < pluralTabs.childNodes.length; i++) {
        const pluralTab = pluralTabs.childNodes[i];
        const tabPluralForm = pluralTab.getAttribute("plural-form");
        const tabTranslation = pluralTab.firstChild.value;

        pluralForms[tabPluralForm] = tabTranslation;
      }

      const pluralFormsTranslations = Object.entries(pluralForms)
        .map(([key, value]) => `\n    ${key} {${value}}`)
        .join("");
      selectForms[
        tabSelectForm
      ] = `{${stringIcuInfo.pluralPlaceholder}, plural,${pluralFormsTranslations}}`;
    }

    const selectFormsTranslations = Object.entries(selectForms)
      .map(([key, value]) => `\n  ${key} {${value}}`)
      .join("");
    translation = `{${stringIcuInfo.selectPlaceholder}, select,${selectFormsTranslations}}`;
  } else if (
    stringIcuInfo.icuType === possibleStringIcuTypes.selectWithOrdinal
  ) {
    const tabs = document.getElementById(
      `${possibleStringIcuTypes.selectWithOrdinal}-tabs`
    );
    var selectForms = {};
    for (let i = 0; i < tabs.childNodes.length; i++) {
      const tab = tabs.childNodes[i];
      const tabSelectForm = tab.getAttribute("select-form");

      const ordinalTabs = tab.firstElementChild;
      var ordinalForms = {};
      for (let i = 0; i < ordinalTabs.childNodes.length; i++) {
        const ordinalTab = ordinalTabs.childNodes[i];
        const tabOrdinalForm = ordinalTab.getAttribute("ordinal-form");
        const tabTranslation = ordinalTab.firstChild.value;

        ordinalForms[tabOrdinalForm] = tabTranslation;
      }

      const ordinalFormsTranslations = Object.entries(ordinalForms)
        .map(([key, value]) => `\n    ${key} {${value}}`)
        .join("");
      selectForms[
        tabSelectForm
      ] = `{${stringIcuInfo.ordinalPlaceholder}, selectordinal,${ordinalFormsTranslations}}`;
    }

    const selectFormsTranslations = Object.entries(selectForms)
      .map(([key, value]) => `\n  ${key} {${value}}`)
      .join("");
    translation = `{${stringIcuInfo.selectPlaceholder}, select,${selectFormsTranslations}}`;
  }

  return translation;
}

function checkAllFormsTranslatedBeforeSettingTranslation() {
  const textAreas = document
    .getElementById("translate-panel")
    .getElementsByTagName("textarea");
  const numberOfTextAreas = textAreas.length;
  const numberOfNotTranslatedForms = Array.from(textAreas).filter(
    (textarea) => textarea.value === ""
  ).length;

  if (numberOfNotTranslatedForms === 0) {
    setTranslation();
  } else if (numberOfNotTranslatedForms === numberOfTextAreas) {
    document.getElementById("no-translated-forms-modal").open();
  } else {
    document.getElementById("form-translations-missing-modal").open();
  }
}

function setTranslation() {
  const translation = getGeneratedIcuTranslation();
  AP.editor.setTranslation(translation);
  AP.editor.setFocus();
}

function getStringValueFromIcuValueObject(valueObject) {
  if (icuParser.isArgumentElement(valueObject)) {
    return `{${valueObject.value}}`;
  } else if (icuParser.isNumberElement(valueObject)) {
    return `{${valueObject.value}, number, ${valueObject.style}}`;
  } else if (icuParser.isDateElement(valueObject)) {
    return `{${valueObject.value}, date, ${valueObject.style}}`;
  } else if (icuParser.isTimeElement(valueObject)) {
    return `{${valueObject.value}, time, ${valueObject.style}}`;
  } else if (icuParser.isPoundElement(valueObject)) {
    return "#";
  } else if (icuParser.isTagElement(valueObject)) {
    var childrenValues = [];
    for (let i = 0; i < valueObject.children.length; i++) {
      const child = valueObject.children[i];
      childrenValues.push(getStringValueFromIcuValueObject(child));
    }
    return `<${valueObject.value}>${childrenValues.join("")}</${
      valueObject.value
    }>`;
  } else {
    return valueObject.value;
  }
}

function removeCurrentUi() {
  const translatePanel = document.getElementById("translate-panel");
  while (translatePanel.firstElementChild) {
    translatePanel.removeChild(translatePanel.firstElementChild);
  }
  translationParsedIcu = {};
  translatePanel.removeAttribute("data-icu");
}

function updateUi() {
  // First time
  AP.editor.getString(function (data) {
    updateUiBasedOnSourceString(data.text);
  });

  // Every other time
  AP.events.on("string.change", function (data) {
    updateUiBasedOnSourceString(data.text);
  });
}
