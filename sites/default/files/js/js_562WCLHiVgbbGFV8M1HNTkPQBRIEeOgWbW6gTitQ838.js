/**
 * @file
 */

(function ($, Drupal) {
  "use strict";

  Drupal.behaviors.twitterMediaEntity = {
    attach: function (context) {
      function _init () {
        twttr.widgets.load(context);
      }

      // If the tweet is being embedded in a CKEditor's iFrame the widgets
      // library might not have been loaded yet.
      if (typeof twttr == 'undefined') {
        $.getScript('//platform.twitter.com/widgets.js', _init);
      }
      else {
        _init();
      }
    }
  };

})(jQuery, Drupal);
;
/**
 * @file entity_browser.view.js
 *
 * Defines the behavior of the entity browser's view widget.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Registers behaviours related to view widget.
   */
  Drupal.behaviors.entityBrowserView = {
    attach: function (context) {
      // Add the AJAX to exposed forms.
      // We do this as the selector in core/modules/views/js/ajax_view.js
      // assumes that the form the exposed filters reside in has a
      // views-related ID, which ours does not.
      var views_instance = Drupal.views.instances[Object.keys(Drupal.views.instances)[0]];
      if (views_instance) {
        // Initialize the exposed form AJAX.
        views_instance.$exposed_form = $('div#views-exposed-form-' + views_instance.settings.view_name.replace(/_/g, '-') + '-' + views_instance.settings.view_display_id.replace(/_/g, '-'));
        views_instance.$exposed_form.once('exposed-form').each(jQuery.proxy(views_instance.attachExposedFormAjax, views_instance));

        // The form values form_id, form_token, and form_build_id will break
        // the exposed form. Remove them by splicing the end of form_values.
        if (views_instance.exposedFormAjax && views_instance.exposedFormAjax.length > 0) {
          var ajax = views_instance.exposedFormAjax[0];
          ajax.options.beforeSubmit = function (form_values, element_settings, options) {
            form_values = form_values.splice(form_values.length - 3, 3);
            ajax.ajaxing = true;
            return ajax.beforeSubmit(form_values, element_settings, options);
          };
        }

        // Handle Enter key press in the views exposed form text fields: ensure
        // that the correct button is used for the views exposed form submit.
        // The default browser behavior for the Enter key press is to click the
        // first found button. But there can be other buttons in the form, for
        // example, ones added by the Tabs widget selector plugin.
        views_instance.$exposed_form.once('submit-by-enter-key').find('input[type="text"]').each(function () {
          $(this).on('keypress', function (event) {
            if (event.keyCode == 13) {
              event.preventDefault();
              views_instance.$exposed_form.find('input[type="submit"]').first().click();
            }
          });
        });

        // If "auto_select" functionality is enabled, then selection column is
        // hidden and click on row will actually add element into selection
        // display over javascript event. Currently only multistep display
        // supports that functionality.
        if (drupalSettings.entity_browser_widget.auto_select) {
          var selection_cells = views_instance.$view.find('.views-field-entity-browser-select');

          // Register on cell parents (rows) click event.
          selection_cells.parent()
            .once('register-row-click')
            .click(function (event) {
              event.preventDefault();

              var $row = $(this);

              // Ensure to use input (checkbox) field from entity browser
              // column dedicated for selection checkbox.
              var $input = $row.find('.views-field-entity-browser-select input.form-checkbox');

              // Get selection display element and trigger adding of entity
              // over ajax request.
              $row.parents('form')
                .find('.entities-list')
                .trigger('add-entities', [[$input.val()]]);
            });

          // Hide selection cells (selection column) with checkboxes.
          selection_cells.hide();
        }
      }
    }
  };

}(jQuery, Drupal, drupalSettings));
;
/**
 * @file Entity_browser.admin.js.
 *
 * Defines the behavior of the entity browser's tab display.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Registers behaviours related to tab display.
   */
  Drupal.behaviors.entityBrowserTabs = {
    attach: function (context) {
      var $form = $(context).find('.entity-browser-form').once('entity-browser-admin');
      if (!$form.length) {
        return;
      }

      var $nav = $('<nav class="eb-tabs"></nav>');
      var $tabs = $(Drupal.theme('entityTabs'));

      $form.find('.tab').each(function (index, element) {
        var $element = $(element);
        var classesArray = [];
        classesArray.push($element.attr('disabled') ? 'is-active active' : '');
        var text = $element.text();
        var textClass = text.toLowerCase().replace(/ /g, '-');
        classesArray.push(textClass);
        var classes = classesArray.join(' ');
        var tabSettings = {
          class: classes,
          id: $element.attr('id'),
          title: $(this)[0].value
        };
        var $tab = $(Drupal.theme('entityTab', tabSettings));

        // Add a click event handler that submits the hidden input buttons.
        $tab.find('a').on('click', function (event) {
          var buttonID = $(event.currentTarget).data().buttonId;
          $form.find('#' + buttonID).trigger('click');
          event.preventDefault();
        });
        $tab.appendTo($tabs);
      });
      $tabs.appendTo($nav);
      $nav.prependTo($form);
      $form.find('.tab').css('display', 'none');
    }
  };

  /**
   * Theme function for entity browser tabs.
   *
   * @return {object}
   *   This function returns a jQuery object.
   */
  Drupal.theme.entityTabs = function () {
    return $('<ul role="navigation" aria-label="Tabs"></ul>');
  };

  /**
   * Theme function for an entity browser tab.
   *
   * @param {object} settings
   *   An object with the following keys:
   * @param {string} settings.title
   *   The name of the tab.
   * @param {string} settings.class
   *   Classes for the tab.
   * @param {string} settings.id
   *   ID for the data- button ID.
   *
   * @return {object}
   *   This function returns a jQuery object.
   */
  Drupal.theme.entityTab = function (settings) {
    return $('<li tabindex="-1"></li>')
      .addClass(settings.class)
      .append($('<a href="#"></a>').addClass(settings.class).attr('data-button-id', settings.id)
      .append(settings.title)
    );
  };

}(jQuery, Drupal, drupalSettings));
;
