# grunt-django-static-hash-append

> appends static files sha1 checksum as a get param for versioning

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-django-static-hash-append --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-django-static-hash-append');
```

## The "django_static_hash_append" task

### Overview
In your project's Gruntfile, add a section named `django_static_hash` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  django_static_hash: {
    options: {
        // task options
    },
    django_app1: {
        files: [{
            expand: true,
            cwd: 'django_app/templates/django_app/', //path to your html files
            src: '*.html'
        }]
    },
    django_app2: {
        files: [{
            expand: true,
            cwd: 'django_app2/templates/django_app2/', //path to your html files
            src: '*.html'
        }]
    }
  },
});
```

### Options

#### options.separator
Type: `staticDirs`
Default value: `['main/static/']`

A list of static files directories.

#### options.staticsUrl
Type: `String`
Default value: `/static/`

base url for static files 
only used if options.withTagOnly = false

#### options.withTagOnly
Type: `Boolean`
Default value: `false`

Only parse lines that use {% static %} template tag to link to js and css files

### Usage Examples

#### Default Options
This example processes all template files of main app, finds all <script> and <link> tags including js or css files, computes hash of the js or css file appends it to static file url as a get param
please notice that you should add a get param to the lines that you want to be updated
for example this line wont get updated:
<script src="{% static '_js/jquery-1.11.1.min.js' %}" type="text/javascript"></script>

but this one will:
<script src="{% static '_js/main.min.js' %}?v=whatever" type="text/javascript"></script>

name of the get param doesnt matter but one and only one get param should be present

```js
grunt.initConfig({
  django_static_hash_append: {
    main: {
        files: [{
            expand: true,
            cwd: 'main/templates/main/',
            src: '*.html'
        }]
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
