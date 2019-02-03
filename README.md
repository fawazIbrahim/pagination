# JQuery Pagination Plugin

This is a simple plugin to ebable items pagination using JQuery.

## Usage:
First, make shore to include "paginator-v1.css" and "paginator-v1.js" in your project, in addition to "jquery-3.3.1" files.

Decide where to put your pagination items (pages numbers and arrows, the items to paginate)

For example, here we are going to put pages number in "#holder" item, and paginate the items in "#list" which has "list-item" class:
```html
<div id="holder"></div>
<div id="list">
  <div class="list-item">....</div>
  <div class="list-item">....</div>
  <div class="list-item">....</div>
  <div class="list-item">....</div>
  ...
</div>
```

```javascript
var args = {
    selector: '#list',
    elementClass: 'list-item',
    paginationHolder: '#holder',
};
var paginator = paginationSystem.init(args);
paginator.paginate();
```

## Arguments:
The full arguments object has this form:
```javascript
var args = {
    selector: '#list',
    elementClass: 'list-item',
    itemsInPage: 25,
    currentPage: 1,
    paginationHolder: '#holder',
    delta: 2,
    date: {
        hasDate: true,
        dayAttr: 'data-day',
        monthAttr: 'data-month',
        yearAttr: 'data-year',
        format: '[month] [day], [year]'
    },
    debugEvents: true
};
```

* **selector**: is the ID of items container (which are to be paginated)
* **elementClass**: is the class name which all paginated items have
* **itemsInPage**: is the number of items in each page
* **currentPage**: is the first page to start with after initiation
* **paginationHolder**: is the ID element which will hold pages numbers and arrows
* **delta**: is a parameter to decide how many numbers will be shown next to a selected page number
  * 1 (Minimum value): *result: (1 ... 4 \[5] 6 ... 10)*
  * 2 : *result: (1 2 ... 5 6 \[7] 8 9 ... 12 13)*
* **date**: for some items that are sorted according to their date, you can show the date changes, but first you will have to make shore to store the date as three seperated attributes (day, month, year) for each item. Example:
  * Items:
  ```html
  <div id="list">
    <div class="list-item" data-day="4" data-month="FEB" data-year="2019">...</div>
    <div class="list-item" data-day="4" data-month="FEB" data-year="2019">...</div>
    <div class="list-item" data-day="3" data-month="FEB" data-year="2019">...</div>
    <div class="list-item" data-day="3" data-month="FEB" data-year="2019">...</div>
    <div class="list-item" data-day="3" data-month="FEB" data-year="2019">...</div>
    <div class="list-item" data-day="2" data-month="FEB" data-year="2019">...</div>
  </div>
  ```
  * date argument:
  ```javascript
  var args = {
    ...,
    date: {
        hasDate: true,                  // confirm that items have dates
        dayAttr: 'data-day',            // name of the attributes that stores the day
        monthAttr: 'data-month',        // name of the attributes that stores the month
        yearAttr: 'data-year',          // name of the attributes that stores the year
        format: '[month] [day], [year]' // format of the date, you can use the three reserved words [day], [month], [year]
    },
    ...
  };
  ```
* **debugEvents**: is a boolean that indicates whether to "log" events

## Pagination Functions:
First, you need to have a handler for the object, you can do that in two ways:
  * At the moment of initiation:
  ```javascript
  var args = {...};
  var paginator = paginationSystem.init(args);
  paginator.paginate(); // or some other function
  ```
  * At any moment:
  ```javascript
  var paginator = $('#selector'); //"selector" is the ID of items container
  paginator.goToFirstOage();
  ```
### Functions are:
  * **paginate**: executes the pagination process according to initiation arguments
  ```javascript
  paginator.paginate();
  ```
  * **rePaginate**: removes all pagination parameters and executes the pagination process again
  ```javascript
  paginator.rePaginate();
  ```
  * **removePagination**: removes all pagination parameters from the item
  ```javascript
  paginator.removePagination();
  ```
  * **goToPage**: navigates to a specific page number
    * Parameters: \[pageNumber: integer]
  ```javascript
  paginator.goToPage(5);
  ```
  * **goToFirstPage**: navigates to the first page
  ```javascript
  paginator.goToFirstPage();
  ```
  * **goToLastPage**: navigates to the last page
  ```javascript
  paginator.goToLastPage();
  ```
  * **getCurrentPage**: returns current active page
  ```javascript
  paginator.getCurrentPage();
  ```
  * **getPagesCount**: returns number of current pages
  ```javascript
  paginator.getPagesCount();
  ```

## Events:
Binding events is easy like any other jquery event:
```javascript
paginator.on('pagination.afterInit', functionName); // 'pagination.afterInit' is the event name
```

### Events are:
  1 - 'pagination.afterInit'
  
  2 - 'pagination.beforePaginate'
  
  3 - 'pagination.afterPaginate'
  
  4 - 'pagination.beforeRemovePagination'
  
  5 - 'pagination.afterRemovePagination'
  
  6 - 'pagination.beforePagesClassesAdded'
  
  7 - 'pagination.afterPagesClassesAdded'
  
  8 - 'pagination.beforePageChange'
  
  9 - 'pagination.afterPageChange'
  
