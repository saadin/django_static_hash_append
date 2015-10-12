/*
 * grunt-django-static-hash-append
 * https://github.com/sadegh/django_static_hash_append
 *
 * Copyright (c) 2015 saadin
 * Licensed under the MIT license.
 */

'use strict';
var crypto = require('crypto');
var fs = require('fs');

module.exports = function(grunt) {
    var chalk = require('chalk');

    grunt.registerMultiTask('django_static_hash', 'Append static files hash', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            separator: grunt.util.linefeed,
            exclude: [],
            staticDirs: ['main/static/'],
            staticsUrl: '/static/',
            withTagOnly: false
        });
        function checksum (str, algorithm, encoding) {
            return crypto
                .createHash(algorithm || 'md5')
                .update(str, 'utf8')
                .digest(encoding || 'hex');
        }
        var replacer = function(line, regex, filepath, currentVersion){
            if(filepath.indexOf(options.staticsUrl) === 0){
                filepath = filepath.replace(options.staticsUrl, '');
            }
            options['staticDirs'].forEach(function(staticDir){
                if (grunt.file.exists(staticDir+filepath)){
                    var src = grunt.file.read(staticDir+filepath);
                    var hash = checksum(src);
                    if(hash === currentVersion){
                        grunt.log.writeln(chalk.grey('not changed:  ') + line.trim());
                    } else {
                        line = line.replace(regex, '$1'+hash+'$7');
                        grunt.log.writeln(chalk.green('line updated: ') + line.trim());
                    }
                } else {
                    grunt.log.writeln(chalk.yellow('not found:   ') + filepath);
                }
            });
            return line;
        };

        //groups:
        // 1 -> before
        // 2,3 -> quote / double quote
        // 4 -> file path
        // 5 -> version parameter
        // 6 -> current version
        // 7 -> after
        var jsMatchWithoutTag = new RegExp("(.*<script.*src=('|\")()(/static.*\\.js)\\?([\\w\\d_]+)=)([a-zA-Z0-9.]+)(\\2.*)","i");
        var jsMatchWithTag = /(.*<script.*src=('|")\{%[ ]?static ('|")(.*\.js)\3[ ]?%\}\?([\w\d_]+)=)([\d\w.]+)(\2.*)/i;
        var cssMatchWithoutTag = new RegExp("(.*<link.*href=('|\")()(/static.*\\.css)\\?([\\w\\d_]+)=)([a-zA-Z0-9.]+)(\\2.*)","i");
        var cssMatchWithTag = /(.*<link.*href=('|")\{%[ ]?static ('|")(.*\.css)\3[ ]?%\}\?([\w\d_]+)=)([\d\w.]+)(\2.*)/i;
        var regexList = [jsMatchWithTag, cssMatchWithTag];
        if (options.withTagOnly){
            regexList = [jsMatchWithoutTag, cssMatchWithoutTag];
        }
        // Iterate over all src-dest file pairs.
        this.files.forEach(function(f) {
            f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).forEach(function(filepath) {
                // Read file source.
                var src = grunt.file.read(filepath);
                grunt.log.writeln(chalk.cyan(filepath));
                var new_src = [];
                src.split('\n').forEach(function(line){
                    [jsMatchWithoutTag, jsMatchWithTag, cssMatchWithoutTag, cssMatchWithTag].forEach(function(regex){
                        var match = line.match(regex);
                        if(match && line.trim().indexOf('{#') !== 0){
                            line = replacer(line, regex, match[4], match[6]);
                        }
                    });
                    new_src.push(line);
                });
                grunt.file.write(filepath, new_src.join('\n'));
                grunt.log.writeln('');
                return src;
            });

        });
        grunt.log.writeln('----------------');
    });

};

