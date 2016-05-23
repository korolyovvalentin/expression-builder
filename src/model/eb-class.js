var utils = require('../services/utils');

module.exports = function (angular) {
    angular.module('expression-builder').directive('ebClass', Directive);

    Directive.$inject = ['$parse'];

    function Directive($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var getter = $parse(attr.ebClass),
                    classes = [];
                
                var unbind = scope.$watch('node.attributes', function () {
                    var val = getter(scope),
                        classesToRemove = classes.join(' ');
                    classes = [];
                    
                    setClasses(val);
                    
                    element.removeClass(classesToRemove);
                    element.addClass(classes.join(' '));
                }, true);
                
                scope.$on('$destroy', function () {
                    unbind();
                });
                
                function setClasses (object) {
                    if(!object) {
                        return;
                    }
                    
                    var keys = Object.keys(object),
                        length = keys.length;
                    
                    for(var i = 0; i < length; i++) {
                        var key = keys[i];
                        setClass(key, object[key]);
                    }
                }
                
                function setClass(value, predicate) {
                    if (utils.isFunction(predicate)) {
                        if (predicate(scope.node)) {
                            classes.push(value);
                        }
                    } else {
                        if (predicate) {
                            classes.push(value);
                        }
                    }
                }
            }
        }
    }
};