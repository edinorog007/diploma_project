'use strict';
const { src, dest, watch, series } = require('gulp');
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');

exports.less = function() {
    return src('./main/src/style.less')
        .pipe(less())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(dest('./dist/'));
}

exports.default = function() {
    watch('./main/src/*.less', series('less'));
}

chrome.storage.local.set({ key: data }, () => {
    if (chrome.runtime.lastError) {
        console.error("Ошибка сохранения:", chrome.runtime.lastError);
    }
});
