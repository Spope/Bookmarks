services.factory('$modal', ['$rootScope', '$compile', '$http', '$timeout', '$q', '$templateCache', '$controller', function($rootScope, $compile, $http, $timeout, $q, $templateCache, $controller) {

  var ModalFactory = function ModalFactoryFn(config, params) {
    function Modal(config, params) {

      var options = angular.extend({show: true}, {}, config),
          scope = options.scope ? options.scope : $rootScope.$new(),
          templateUrl = options.template;

      return $q.when($templateCache.get(templateUrl) || $http.get(templateUrl, {cache: true}).then(function(res) {
          return res.data;
      }))
      .then(function onSuccess(template) {

        // Build modal object
        var id = templateUrl.replace('.html', '').replace(/[\/|\.|:]/g, '-') + '-' + scope.$id;
        var $modal = $('<div class="modal hide" tabindex="-1"></div>').attr('id', id).addClass('fade').html(template);
        if(options.modalClass) $modal.addClass(options.modalClass);

        //Using the controller passed in the options
        var ctrlInstance, ctrlLocals = {};
        if(config.controller) {

            //setting the modal vars into its scope
            for(var key in params) {
                scope[key] = params[key];
            }
            ctrlLocals.$scope = scope;
            ctrlLocals.$modalInstance = $modal;

          ctrlInstance = $controller(config.controller, ctrlLocals);
        }

        $('body').append($modal);

        // Compile modal content
        scope.modal = {};
        $timeout(function() {
          $compile($modal)(scope);
        });

        // Provide scope display functions
        scope.$modal = function(name) {
          $modal.modal(name);
        };
        angular.forEach(['show', 'hide'], function(name) {
          scope[name] = function() {
            $modal.modal(name);
          };
        });
        scope.dismiss = scope.hide;

        // Emit modal events
        angular.forEach(['show', 'shown', 'hide', 'hidden'], function(name) {
          $modal.on(name, function(ev) {
            scope.$emit('modal-' + name, ev);
          });
        });

        // Support autofocus attribute
        $modal.on('shown.bs.modal', function(ev) {
          $('input[autofocus], textarea[autofocus]', $modal).first().trigger('focus');
        });
        // Auto-remove $modal created via service
        $modal.on('hide.bs.modal', function(ev) {
          if(!options.persist) scope.$destroy();
        });

        // Garbage collection
        scope.$on('$destroy', function() {
          $modal.remove();
        });

        $modal.modal(options);

        return $modal;

      });

    }

    return new Modal(config, params);

  };

  return ModalFactory;

}])

.directive('bsModal', function($q, $modal) {

  return {
    restrict: 'A',
    scope: true,
    link: function postLink(scope, iElement, iAttrs, controller) {

      var options = {
        template: scope.$eval(iAttrs.bsModal),
        persist: true,
        show: false,
        scope: scope
      };

      // $.fn.datepicker options
      angular.forEach(['modalClass', 'backdrop', 'keyboard'], function(key) {
        if(angular.isDefined(iAttrs[key])) options[key] = iAttrs[key];
      });

      $q.when($modal(options)).then(function onSuccess(modal) {
        iElement.attr('data-target', '#' + modal.attr('id')).attr('data-toggle', 'modal');
      });

    }
  };
});
