(function( $ ) {
    $.fn.paginate = function(){
        if($(this).is('.pagination-selector') && ('#' + $(this).attr('id')) == $(this).attr('data-selector')) {
            paginationSystem.paginate($(this));
        }
        return $(this);
    };
    $.fn.rePaginate = function(){
        if($(this).is('.pagination-selector') && ('#' + $(this).attr('id')) == $(this).attr('data-selector')) {
            var args = paginationSystem.getPaginationArgs($(this));
            paginationSystem.removePagination($(this));
            paginationSystem.init(args);
            paginationSystem.paginate($(this));
        }
        return $(this);
    };
    $.fn.removePagination = function(){
        if($(this).is('.pagination-selector') && ('#' + $(this).attr('id')) == $(this).attr('data-selector')) {
            paginationSystem.removePagination($(this));
        }
        return $(this);
    };
    $.fn.goToPage = function(pageNumber){
        if($(this).is('.pagination-selector') && ('#' + $(this).attr('id')) == $(this).attr('data-selector')) {
            paginationSystem.goToPage($(this), pageNumber);
        }
        return $(this);
    };
    $.fn.goToFirstPage = function(){
        if($(this).is('.pagination-selector') && ('#' + $(this).attr('id')) == $(this).attr('data-selector')) {
            paginationSystem.goToFirstPage($(this));
        }
        return $(this);
    };
    $.fn.goToLastPage = function(){
        if($(this).is('.pagination-selector') && ('#' + $(this).attr('id')) == $(this).attr('data-selector')) {
            paginationSystem.goToLastPage($(this));
        }
        return $(this);
    };
    $.fn.getCurrentPage = function(){
        if($(this).is('.pagination-selector') && ('#' + $(this).attr('id')) == $(this).attr('data-selector')) {
            return paginationSystem.getCurrentPage($(this));
        }
        return undefined;
    };
    $.fn.getPagesCount = function(){
        if($(this).is('.pagination-selector') && ('#' + $(this).attr('id')) == $(this).attr('data-selector')) {
            return paginationSystem.getPagesCount($(this));
        }
        return undefined;
    };
}( jQuery ));
var paginationSystem = {
    allEventsConst: {
        1: 'pagination.afterInit',
        2: 'pagination.beforePaginate',
        3: 'pagination.afterPaginate',
        4: 'pagination.beforeRemovePagination',
        5: 'pagination.afterRemovePagination',
        6: 'pagination.beforePagesClassesAdded',
        7: 'pagination.afterPagesClassesAdded',
        8: 'pagination.beforePageChange',
        9: 'pagination.afterPageChange',
    },
    init: function (passedArgs) {
        var args = {
            selector: null,
            elementClass: 'pagination-item',
            itemsInPage: 2,
            currentPage: 1,
            paginationHolder: null,
            delta: 2,
            date: {
                hasDate: false,
                dayAttr: null,
                monthAttr: null,
                yearAttr: null,
                format: '[month] [day], [year]'
            },
            debugEvents: false
        };
        for(var attrName in passedArgs){
            if(attrName != 'date') {
                args[attrName] = passedArgs[attrName];
            }
        }
        if(passedArgs.hasOwnProperty('date')){
            for(var attrName in passedArgs.date){
                args.date[attrName] = passedArgs.date[attrName];
            }
        }
        var paginationContainer = $(args.selector);
        if(paginationContainer !== undefined && paginationContainer.is(args.selector)){
            paginationContainer.addClass('pagination-selector');
            paginationContainer.attr('data-selector', args.selector);
            paginationContainer.attr('data-itemsinpage', args.itemsInPage);
            paginationContainer.attr('data-currentpage', args.currentPage);
            paginationContainer.attr('data-paginationholder', args.paginationHolder);
            paginationContainer.attr('data-delta', args.delta);
            if(args.date && args.date.hasOwnProperty('hasDate') && args.date.hasDate){
                if(     args.date.hasOwnProperty('dayAttr') && args.date.dayAttr != null
                    &&  args.date.hasOwnProperty('monthAttr') && args.date.monthAttr != null
                    &&  args.date.hasOwnProperty('yearAttr') && args.date.yearAttr != null
                    &&  args.date.hasOwnProperty('format') && args.date.format != null) {
                    paginationContainer.attr('data-date', JSON.stringify(args.date));
                }
            }
            paginationContainer.attr('data-elementclass', args.elementClass);
            paginationContainer.find('.' + args.elementClass).addClass('pagination-item');
            paginationContainer.attr('data-debugevents', args.debugEvents);
            if(args.debugEvents){
                for(var i in paginationSystem.allEventsConst) {
                    paginationContainer.on(paginationSystem.allEventsConst[i],{name: paginationSystem.allEventsConst[i]}, paginationSystem.debugEvent);
                }
            }
            paginationContainer.trigger('pagination.afterInit');
            return paginationContainer;
        }
        return null;
    },
    getPaginationArgs: function (paginationContainer) {
        return {
            selector: paginationContainer.attr('data-selector'),
            elementClass: paginationContainer.attr('data-elementclass'),
            itemsInPage: parseInt(paginationContainer.attr('data-itemsinpage')),
            currentPage: parseInt(paginationContainer.attr('data-currentpage')),
            paginationHolder: paginationContainer.attr('data-paginationholder'),
            delta: paginationContainer.attr('data-delta'),
            date: paginationContainer.attr('data-date'),
            debugEvents: paginationContainer.attr('data-debugevents')
        };
    },
    paginate: function (paginationContainer) {
        paginationContainer.trigger('pagination.beforePaginate');
        var currentPage = parseInt(paginationContainer.attr('data-currentpage'));
        paginationSystem.setPagesOnPaginationItems(paginationContainer);
        paginationSystem.setPage(paginationContainer, currentPage);
        paginationSystem.setPaginationButtons(paginationContainer);
        paginationContainer.trigger('pagination.afterPaginate');
    },
    removePagination: function(paginationContainer){
        paginationContainer.trigger('pagination.beforeRemovePagination');
        var pagesCount = parseInt(paginationContainer.attr('data-pagescount'));
        for(var pageNumber = 1; pageNumber<= pagesCount ; pageNumber++){
            paginationContainer.find('.pagination-item.pagination-item-page-' + pageNumber).removeClass('pagination-item-page-' + pageNumber);
        }
        paginationContainer.find('.pagination-item').removeClass('pagination-item-active-page').removeClass('pagination-item-not-active-page');
        paginationContainer.find('.pagination-date-seperator').remove();
        var paginationHolder = $(paginationContainer.attr('data-paginationholder'));
        if(paginationHolder.is(paginationContainer.attr('data-paginationholder'))){
            paginationHolder.html('');
            paginationHolder.removeClass('pagination-holder');
        }
        paginationContainer.find('.pagination-date-seperator').remove();
        paginationContainer.removeClass('pagination-selector');
        paginationContainer.attr('data-selector', '');
        paginationContainer.attr('data-elementClass', '');
        paginationContainer.attr('data-itemsinpage', '');
        paginationContainer.attr('data-pagescount', '');
        paginationContainer.attr('data-itemscount', '');
        paginationContainer.attr('data-currentpage', '');
        paginationContainer.attr('data-paginationholder', '');
        paginationContainer.attr('data-delta', '');
        paginationContainer.attr('data-date', '');
        paginationContainer.attr('data-debugevents', false);
        paginationContainer.find('.pagination-date-seperator').remove();
        paginationContainer.trigger('pagination.afterRemovePagination');
        for(var i in paginationSystem.allEventsConst) {
            paginationContainer.unbind(paginationSystem.allEventsConst[i]);
        }
    },
    setPagesOnPaginationItems: function (paginationContainer) {
        paginationContainer.trigger('pagination.beforePagesClassesAdded');
        var itemsInPage = parseInt(paginationContainer.attr('data-itemsinpage'));
        var counter = 0;
        var pageNumber = 1;
        var itemsCount = 0;
        paginationContainer.find('.pagination-item').each(function () {
            $(this).addClass('pagination-item-page-' + pageNumber);
            itemsCount++;
            counter++;
            counter = counter%itemsInPage;
            if(counter == 0){
                pageNumber++;
            }
        });
        if(counter == 0 && itemsCount > 0){
            pageNumber--;
        }
        paginationContainer.attr('data-pagescount', pageNumber);
        paginationContainer.attr('data-itemscount', itemsCount);
        paginationContainer.trigger('pagination.afterPagesClassesAdded');
    },
    setPage: function (paginationContainer, currentPage) {
        paginationContainer.trigger('pagination.beforePageChange');
        var currentPageInt = parseInt(currentPage);
        var pagesCount = parseInt(paginationContainer.attr('data-pagescount'));
        if(pagesCount > 0) {
            while (currentPageInt > pagesCount){
                currentPageInt--;
            }
            paginationContainer.find('.pagination-item').removeClass('pagination-item-active-page').addClass('pagination-item-not-active-page');
            paginationContainer.find('.pagination-item.pagination-item-page-' + currentPageInt).removeClass('pagination-item-not-active-page').addClass('pagination-item-active-page');
            paginationContainer.attr('data-currentpage', currentPageInt);
            paginationSystem.formatDates(paginationContainer);
        }
        paginationContainer.trigger('pagination.afterPageChange');
    },
    setPaginationButtons: function (paginationContainer) {
        var paginationHolder = $(paginationContainer.attr('data-paginationholder'));
        var itemsInPage = parseInt(paginationContainer.attr('data-itemsinpage'));
        var itemsCount = parseInt(paginationContainer.attr('data-itemscount'));
        var delta = parseInt(paginationContainer.attr('data-delta'));
        if(paginationHolder !== undefined && paginationHolder.is(paginationContainer.attr('data-paginationholder'))){
            paginationHolder.addClass('pagination-holder');
            var paginationCounterHtml = '<span class="pagination-counter"><span class="from-number">0</span>-<span class="to-number">0</span>/<span class="total-number">0</span></span>';
            var paginationPagesHtml = '<span class="pagination-pages-buttons noselect"></span>';
            paginationHolder.html(paginationCounterHtml + paginationPagesHtml);
            var currentPage = parseInt(paginationContainer.attr('data-currentpage'));
            var pagesCount = parseInt(paginationContainer.attr('data-pagescount'));
            var paginationList = paginationHolder.find('.pagination-pages-buttons').first();
            paginationList.attr('data-pagination', '#' + paginationContainer.attr('id'));
            var items = [];
            var prevPage = $('<span class="pagination-prev-page pagination-number-page" data-page="prev">&laquo;</span>');
            if(currentPage == 1){
                prevPage.addClass('pagination-page-selector-not-active')
            }
            items.push(prevPage);
            var rangeWithDots = paginationSystem.generatePagesAlgorithm(currentPage, pagesCount, delta);
            for(var i in rangeWithDots){
                var item = $('<span class="pagination-number-page" data-page="' + rangeWithDots[i] + '">' + rangeWithDots[i] + '</span>');
                if(rangeWithDots[i] == '...'){
                    item.addClass('pagination-page-selector-not-active');
                    item.addClass('pagination-page-selector-dots');
                }else{
                    if(parseInt(rangeWithDots[i]) == currentPage){
                        item.addClass('active');
                    }
                }
                items.push(item);
            }
            var nextPage = $('<span class="pagination-next-page pagination-number-page" data-page="next">&raquo;</span>');
            if(currentPage == pagesCount){
                nextPage.addClass('pagination-page-selector-not-active')
            }
            items.push(nextPage);
            for(var j in items){
                items[j].on('click', paginationSystem.goToPageClick);
                paginationList.append(items[j]);
            }

            var paginationCounter = paginationHolder.find('.pagination-counter').first();
            var fromNumber = paginationCounter.find('.from-number').first();
            var toNumber = paginationCounter.find('.to-number').first();
            var totalNumber = paginationCounter.find('.total-number').first();
            totalNumber.text(itemsCount);
            if(itemsCount == 0){
                fromNumber.text(itemsCount);
            }else{
                fromNumber.text((itemsInPage * (currentPage - 1)) + 1);
            }
            if(currentPage == pagesCount){
                toNumber.text(itemsCount)
            }else{
                toNumber.text(itemsInPage * currentPage);
            }
        }
    },
    generatePagesAlgorithm: function (currentPage, pagesCount, deltaValue) {
        var current = currentPage,
            last = pagesCount,
            delta = deltaValue,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;

        for (var i = 1; i <= last; i++) {
            if ((i >= 1 && i < (1 + delta))|| (i > (last - delta) && i <= last) || i >= left && i < right) {
                range.push(i);
            }
        }

        for (var i in range) {
            if (l) {
                if (range[i] - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (range[i] - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(range[i]);
            l = range[i];
        }

        return rangeWithDots;
    },
    goToPageClick: function (ev) {
        var isNotActive = $(this).is('.pagination-page-selector-not-active');
        var isActive = $(this).is('.active');
        var pageNumber = $(this).attr('data-page');
        var paginationList = $(this).closest('.pagination-pages-buttons');
        var selector = paginationList.attr('data-pagination');
        if(!isNotActive && !isActive) {
            paginationSystem.goToPage($(selector), pageNumber);
        }
    },
    goToPage: function(paginationContainer, pageNumber){
        var currentPage = parseInt(paginationContainer.attr('data-currentpage'));
        var pagesCount = parseInt(paginationContainer.attr('data-pagescount'));
        if(pageNumber == 'prev'){
            if(currentPage != 1){
                paginationSystem.setPage(paginationContainer, currentPage - 1);
                paginationSystem.setPaginationButtons(paginationContainer);
            }
        }else if(pageNumber == 'next'){
            if(currentPage != pagesCount){
                paginationSystem.setPage(paginationContainer, currentPage + 1);
                paginationSystem.setPaginationButtons(paginationContainer);
            }
        }else if (pageNumber != '...'){
            var intPageNumber = parseInt(pageNumber);
            paginationSystem.setPage(paginationContainer, intPageNumber);
            paginationSystem.setPaginationButtons(paginationContainer);
        }
    },
    goToFirstPage: function (paginationContainer){
        paginationSystem.goToPage(paginationContainer, 1);
    },
    goToLastPage: function (paginationContainer){
        var pagesCount = parseInt(paginationContainer.attr('data-pagescount'));
        paginationSystem.goToPage(paginationContainer, pagesCount);
    },
    getCurrentPage: function (paginationContainer) {
        return parseInt(paginationContainer.attr('data-currentpage'));
    },
    getPagesCount: function (paginationContainer) {
        return parseInt(paginationContainer.attr('data-pagescount'));
    },
    formatDates: function (paginationContainer) {
        if(paginationContainer.attr('data-date')){
            var dateOptions = JSON.parse(paginationContainer.attr('data-date'));
            if(dateOptions.hasOwnProperty('hasDate') && dateOptions.hasDate == true) {
                paginationContainer.find('.pagination-date-seperator').remove();
                var daySelector = dateOptions.dayAttr;
                var monthSelector = dateOptions.monthAttr;
                var yearSelector = dateOptions.yearAttr;
                var format = dateOptions.format;
                var lastItem = {
                    day: null,
                    month: null,
                    year: null
                };
                paginationContainer.find('.pagination-item.pagination-item-active-page').each(function (index) {
                    var current = {
                        day: $(this).attr(daySelector),
                        month: $(this).attr(monthSelector),
                        year: $(this).attr(yearSelector)
                    };
                    if (index == 0) {
                        paginationSystem.addDateBefore($(this), current, format);
                    } else {
                        if (current.day != lastItem.day || lastItem.month != current.month || lastItem.year != current.year) {
                            paginationSystem.addDateBefore($(this), current, format);
                        }
                    }
                    lastItem.day = current.day;
                    lastItem.month = current.month;
                    lastItem.year = current.year;
                });
            }
        }
    },
    addDateBefore: function(item, dateData, format){
        var date = format;
        date = date.replace("[day]", dateData.day);
        date = date.replace("[month]", dateData.month);
        date = date.replace("[year]", dateData.year);
        var dateItem = $('<div class="pagination-date-seperator"><span class="pagination-date-value"></span></div>');
        dateItem.find('span').first().text(date);
        item.before(dateItem)
    },
    debugEvent: function (event) {
        console.log( "Event: " + event.data.name);
    }
};