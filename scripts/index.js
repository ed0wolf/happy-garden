/*globals console: true, menuData: true  */
var $ = window.jQuery,
    R = window.R;

var Maybe = (function() {
  function Maybe(value) {

  }
}());

var Dish = (function () {
  'use strict';

  function Dish(dishData) {
    this.name = dishData.name;
    this.description = dishData.description;
    this.price = dishData.price;
  }

  function nameAsDom(name) {
    return ' <span class="dish-name">' + name + '<span>';
  }

  function priceAsDom(price) {
    return ' <span class="dish-price">' + price + '<span>';
  }


  Dish.prototype.asDom = function () {
    var dishDiv = $('<div>');
    dishDiv.append(nameAsDom(this.name));
    dishDiv.append(priceAsDom(this.price));
    return dishDiv;
  };

  return Dish;
}());

var Section = (function () {
  'use strict';
  function Section(sectionData) {
    this.name = sectionData.name;
    var newDish = function(dish) {
      return new Dish(dish);
    };
    this.dishes = R.map(newDish, sectionData.dishes);
  }

  function nameAsDom(name) {
    return '<h2>' + name + '</h2>';
  }

  Section.prototype.asDom = function () {
    var sectionEle = $('<div>');
    sectionEle.append(nameAsDom(this.name));

    this.dishes.forEach(function (dish) {
      sectionEle.append(dish.asDom());
    });
    return sectionEle;
  };

  return Section;
}());

var Search = (function () {
  'use strict';
  function Search(sections, searchCallback) {
    this.sections = sections;
    this.searchCallback = searchCallback;
  }

  function filterDishes(searchValue, sections) {

    return sections.map(function (section) {
      var filteredDishes = section.dishes.filter(function (dish) {
        return new RegExp(searchValue, ['i']).test(dish.name);
      });
      if(filteredDishes.length > 0) {
        return new Section({ name: section.name, dishes: filteredDishes });
      } else {
        return null;
      }
    }).filter(function(section) {
      return section !== null;
    });
  }

  Search.prototype.asDom = function () {
    var me = this,
        searchBox = $('<input id="menuzzy-search">');
    searchBox.keyup(function (e) {
      var searchValue = this.value;
      me.searchCallback(filterDishes(searchValue, me.sections));
    });
    return searchBox;
  };

  return Search;
}());

var Menuzzy = (function () {
  'use strict';
  function Menuzzy(menuData) {
    this.sections = menuData.map(function (sectionData) {
      return new Section(sectionData);
    });
  }

  function createSectionsDom(sections) {
    var sectionsContainer = $('<div id="menuzzy-sections">');
    sections.forEach(function (section) {
      sectionsContainer.append(section.asDom());
    });
    return sectionsContainer;
  }

  Menuzzy.prototype.asDom = function () {
    var menuDiv = $('<div>'),
    searchCallback = function (sections) {
      var newSectionsDom = createSectionsDom(sections);
      $('#menuzzy-sections').replaceWith(newSectionsDom);
    },
    search = new Search(this.sections, searchCallback);

    menuDiv.append(search.asDom());
    menuDiv.append(createSectionsDom(this.sections));

    return menuDiv;
  };

  return Menuzzy;
}());

$(function () {
  'use strict';

  var menu = new Menuzzy(menuData);
  $('#menuzzy-container').append(menu.asDom());
});
