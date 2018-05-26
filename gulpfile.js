var gulp = require('gulp');
var del = require('del');
var jeditor = require("gulp-json-editor");

gulp.task('cover:clean', function (done) {
    return del('coverage', done);
});

gulp.task('cover:enableconfig', () => {
    return gulp.src("./template/coverconfig.json")
        .pipe(jeditor(function (json) {
            json.enabled = true;
            return json; // must return JSON object.
        }))
        .pipe(gulp.dest("./", { 'overwrite': true }));
});

gulp.task('cover:enable', ['cover:clean', 'cover:enableconfig']);

gulp.task('cover:disable', () => {
    return gulp.src("./template/coverconfig.json")
        .pipe(jeditor(function (json) {
            json.enabled = false;
            return json; // must return JSON object.
        }))
        .pipe(gulp.dest("./", { 'overwrite': true }));
});