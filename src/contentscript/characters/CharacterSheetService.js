import $ from "jquery";
import MessageService from "../../services/MessageService";

/* global chrome */

let loadCheck;
let character = {};

class CharacterSheetService {
    static init() {
        const path = window.location.pathname;
        if (!(path.startsWith("/profile/") && path.indexOf('/characters/') !== -1)) return;

        // it takes a few seconds for the character sheet to load (unlike most other pages)

        loadCheck = setInterval(() => {
            var collapsible = document.getElementsByClassName('collapsible-header-trigger');
            if (collapsible.length > 0) {
                this.actualInit();
            }
        }, 1000);
    }

    static expandAll() {
        return new Promise((resolve, reject) => {
            let collapseCheck = setInterval(() => {
                let collapsed = document.querySelectorAll("div[class$='collapsible-collapsed']");
                if (collapsed.length !== 0) {
                    collapsed.forEach(function (ele) {
                        let triggers = ele.querySelectorAll("div[class$='trigger']");
                        triggers.forEach(trigger => {
                            trigger.click();
                        });
                    });
                } else {
                    let contentHidden = document.querySelectorAll("div[class^='truncated-content truncated-content-hidden']");
                    contentHidden.forEach(function (ele) {
                        let triggers = ele.querySelectorAll("span[class='truncated-content-trigger-label']");
                        triggers.forEach(trigger => {
                            trigger.click();
                        });
                    });
                    clearInterval(collapseCheck);
                    console.log('everything is expanded');
                    resolve();
                }
            }, 100);
        });
    }

    static collapseAll() {
        return new Promise((resolve, reject) => {
            let expandCheck = setInterval(() => {
                let collapsed = document.querySelectorAll("div[class$='collapsible-opened']");
                if (collapsed.length !== 0) {
                    collapsed.forEach(function (ele) {
                        let triggers = ele.querySelectorAll("div[class$='trigger']");
                        triggers.forEach(trigger => {
                            trigger.click();
                        });
                    });
                } else {
                    clearInterval(expandCheck);
                    console.log('everything is collapsed');
                    resolve();
                }
            }, 100);
        });
    }

    static actualInit() {
        console.log('loaded');
        clearInterval(loadCheck);
        // expands sections
        this.expandAll().then(() => {
            character.armorClass = this.getArmorClass();
            character.initiative = this.getInitiative();
            character.abilities = this.getAbilities();
            character.skills = this.getSkills();
            character.proficiency = this.getProficiency();
            character.proficiencies = this.getProficiencies();
            character.attacks = this.getAttacks();
            character.spells = this.getSpells();
            console.log(character);
        });
    }

    static getArmorClass() {
        return Number(document.querySelector("div[class='quick-info-item quick-info-armor-class']")
            .querySelector("div[class='quick-info-item-value']").innerHTML) || 10;
    }

    static getInitiative() {
        let parent = document.querySelector("div[class='quick-info-item quick-info-initiative']")
            .querySelector("div[class='quick-info-item-value']");
        let initiative = Number(this.reactText(parent.innerHTML)) || 0;
        if (parent.querySelector("span[class='quick-info-item-value-extra']").innerHTML === '-') {
            initiative = -initiative;
        }
        return initiative;
    }

    static reactText(value) {
        let text = value;
        if (value && value.indexOf('-->') !== -1) {
            let valStart = value.indexOf('-->') + 3;
            let valEnd = value.indexOf('<!-- /react-text -->');
            text = text.substring(valStart, valEnd);
        }
        return text;
    }

    static getAbilities() {
        let abilities = [];
        let rows = document.querySelectorAll("tr[class^='character-ability-row']");
        rows.forEach(row => {
            let ability = {};
            ability.name = row.querySelector("th[class='character-ability-item character-ability-label']").innerHTML;
            ability.value = Number(row.querySelector("td[class='character-ability-item character-ability-score']").innerHTML) || 0;
            ability.modifier = Number(row.querySelector("td[class='character-ability-item character-ability-modifier']").querySelector("span[class='character-ability-stat-value']").innerHTML) || 0;
            if (row.querySelector("td[class='character-ability-item character-ability-modifier']").querySelector("span[class='character-ability-stat-extra']").innerHTML === '-') {
                ability.modifier = -ability.modifier;
            }
            ability.save = Number(row.querySelector("td[class='character-ability-item character-ability-save']").querySelector("span[class='character-ability-stat-value']").innerHTML) || 0;
            if (row.querySelector("td[class='character-ability-item character-ability-save']").querySelector("span[class='character-ability-stat-extra']").innerHTML === '-') {
                ability.save = -ability.save;
            }

            abilities.push(ability);
        });
        return abilities;
    }

    static getSkills() {
        let skills = [];
        let rows = document.querySelectorAll("div[class='skill-item']");
        rows.forEach(row => {
            let skill = {};
            skill.name = this.reactText(row.querySelector("span[class='skill-item-name']").innerHTML);
            skill.value = Number(this.reactText(row.querySelector("span[class='skill-item-modifier']").querySelector("span[class='skill-item-modifier-value']").innerHTML)) || 0;
            if (row.querySelector("span[class='skill-item-modifier']").querySelector("span[class='skill-item-modifier-extra']").innerHTML === '-') {
                skill.value = -skill.value;
            }

            skills.push(skill);
        });
        return skills;
    }

    static getProficiency() {
        let parent = document.querySelector("div[class='quick-info-item quick-info-proficiency-bonus']")
            .querySelector("div[class='quick-info-item-value']");
        return Number(this.reactText(parent.innerHTML)) || 0;
    }

    static getProficiencies() {
        let proficiencies = [];
        let rows = document.querySelectorAll("ul[class='feature-proficiencies']");
        rows.forEach(row => {
            row.querySelectorAll("li[class='feature-proficiencies-item']").forEach(prof => {
                proficiencies.push(prof.innerHTML);
            });
        });
        return proficiencies;
    }

    static getAttacks() {
        let attacks = [];
        let rows = document.querySelectorAll("div[class^='attack-list-item']");
        rows.forEach(row => {
            let attack = {};
            attack.name = row.querySelector("span[class='attack-list-heading-text']").innerHTML;
            attack.tohit = Number(row.querySelector("div[class='attack-item-callout-tohit-value attack-item-callout-value']").innerHTML);
            let value = row.querySelector("div[class='attack-item-callout-dmg-value attack-item-callout-value']");
            if (value) {
                attack.value = value.innerHTML;
            }
            attacks.push(attack);
        });
        return attacks;
    }

    static getFeats() {
        let feats = [];
        let rows = document.querySelectorAll("div[class='feature-group']");
        rows.forEach(row => {
            let feat = {};
            feat.name = document.querySelector("div[class='feature-group-heading']").innerHTML;
            feat.body = document.querySelector("div[class='feat-desc']").innerHTML;
            feats.push(feat);
        });

        return feats;
    }

    static getSpells() {
        let spells = [];
        let rows = document.querySelectorAll("div[class='class-spell-list-actives']");
        rows.forEach(row => {
            let rowSpells = row.querySelectorAll("div[class^='spell-list-item '");
            rowSpells.forEach(rowSpell => {
                let spell = {};
                if (rowSpell.querySelector("span[class='spell-list-heading-text']")) {
                    spell.name = rowSpell.querySelector("span[class='spell-list-heading-text']").innerHTML;
                    if (rowSpell.querySelector("span[class='collapsible-header-callout-extra']")) {
                        let type = rowSpell.querySelector("span[class='collapsible-header-callout-extra']").innerHTML;
                        if (type === 'To Hit') {
                            spell.tohit = rowSpell.querySelector("span[class='collapsible-header-callout-value']").innerHTML;
                        } else {
                            spell.dc = rowSpell.querySelector("span[class='collapsible-header-callout-value']").innerHTML;
                            spell.dcType = type;
                        }
                        let desc = (rowSpell.querySelector("div[class='truncated-content-content']") || {}).innerHTML;
                        if (desc) {
                            spell.desc = desc;
                        }
                        spell.props = [];
                        let props = rowSpell.querySelectorAll("div[class^='prop-list-item']");
                        props.forEach(propRow => {
                            let prop = {
                                label: (propRow.querySelector("div[class='prop-list-item-label']") || {}).innerHTML,
                                value: this.reactText((propRow.querySelector("div[class='prop-list-item-value']") || {}).innerHTML)
                            };
                            if (prop.label && prop.value) {
                                spell.props.push(prop);
                            }
                        });
                    }
                    spells.push(spell);
                }
            });
        });

        return spells;
    }
}

export default CharacterSheetService;

// <button class="character-button-small character-button-outline">Roll</button>

/*
{
  armorClass: { quick-info-item quick-info-armor-class
    value: quick-info-item-value
  }
  initiative: { quick-info-item quick-info-initiative
    extra: quick-info-item-value-extra,
    value: quick-info-item-value (without the extra span)
  },
  ability: { character-ability-row
    value: character-ability-item character-ability-score,
    name: character-ability-item character-ability-label,
    modifier: { character-ability-item character-ability-modifier
      value: character-ability-stat-value
      extra: character-ability-stat-extra
    },
    save: { character-ability-item character-ability-save
      value: character-ability-stat-value,
      extra: character-ability-stat-extra
    }
  },
  skills: [
    { skill-item
      stat: skill-item-stat,
      name: skill-item-name,
      modifier: { skill-item-modifier
        extra: skill-item-modifier-extra,
        value: skill-item-modifier-value
      }
    }
  ],
  proficiencies: [ feature-proficiencies
    feature-proficiencies-item
  ],
  proficiency: { quick-info-item quick-info-proficiency-bonus
    value: quick-info-item-value (without the span)
  },
  attacks: [ attack-list-item
    {
      name: attack-list-heading-text,
      tohit: attack-item-callout-tohit-value attack-item-callout-value,
      damage: attack-item-callout-dmg-value attack-item-callout-value
    }
  ],
  feats: [ collapsible-header... <div class="collapsible-heading">Feats</div>
    { feature-group
      name: feature-group-heading,
      body: feat-desc
    }
  ],
  spells: [ class-spell-list-actives (multiple)
    { ^ div spell-list-item
        name: span spell-list-heading-text
    }
  ]
}
*/