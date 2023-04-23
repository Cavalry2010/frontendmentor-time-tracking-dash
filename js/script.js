"use strict";

class Dashboard {
  cur = "weekly";
  data;
  categories = document.querySelectorAll(".category");
  settingBtns = document.querySelector(".settings");

  constructor() {
    this.init();
    this.settingBtns.addEventListener("click", this.changeSetting.bind(this));
  }

  async getJSON() {
    try {
      const data = await fetch("../data.json").then((res) => res.json());
      this.data = data;
    } catch (error) {
      console.log(error);
    }
  }

  sortData(timeframe) {
    this.data.forEach((object) => {
      this.renderResults(object, timeframe);
    });
  }

  renderResults(category, timeframe) {
    const title = category.title;
    const { current, previous } = category.timeframes[timeframe];
    const time =
      timeframe === "daily"
        ? "Day"
        : timeframe === "weekly"
        ? "Week"
        : timeframe === "monthly"
        ? "Month"
        : "";
    const dashCategories = Array.from(this.categories);
    dashCategories.forEach((element) => {
      const stats = Array.from(
        element.firstElementChild.lastElementChild.children
      );
      if (title === element.dataset.category) {
        element.classList.toggle("category-stats--hide");
        element.classList.remove("transition");
        setTimeout(function () {
          stats[0].textContent = `${current}hrs`;
          stats[1].textContent = `Last ${time} - ${previous}hrs`;
          element.classList.toggle("category-stats--hide");
          element.classList.add("transition");
        }, 200);
      }
    });
  }

  changeSetting(e) {
    e.preventDefault();

    const target = e.target;
    if (target.tagName !== "BUTTON" || target.dataset.setting === this.cur)
      return;
    this.sortData(target.dataset.setting);
    this.changeActiveSetting(target.dataset.setting);
    this.cur = target.dataset.setting;
  }

  changeActiveSetting(setting) {
    const btns = Array.from(this.settingBtns.children);
    btns.forEach((btn) => {
      const realBtn = btn.firstElementChild;
      realBtn.classList.remove("setting--active");
      if (realBtn.dataset.setting === setting) {
        realBtn.classList.add("setting--active");
      }
    });
  }

  async init() {
    await this.getJSON();
    this.sortData(this.cur);
    this.changeActiveSetting(this.cur);
  }
}

const app = new Dashboard();
