define(['jquery', 'underscore', 'backbone', 'base/form-validation', 'base/modules/custom_select_wrapper'], function ($, _, backbone, formValidation, customSelectWrapper) {

    'use strict';
    var modelText;
    function init(container, isCreate) {
        var backboneView = backboneInit();
        if (isCreate)
            return new backboneView({
                el: container
            });
        else
            return backboneView;

    }

    function backboneInit() {
        return Backbone.View.extend({
            events: {
                'change #Enquiry_Type': 'checkSelectedEnquiry',
                'change #SelectBrand': 'brandChange',
                'change #SelectEnquiry': 'selectEnquiryChange'
            },
            initialize: function () {
                formValidation.init(this.$el);
                this.checkSelectedEnquiry();
                this.registEvents();
                if ($('#SelectBrand').val() != '') {
                    $('#SelectBrand').change();
                }
            },

            registEvents: function () {
            },
            selectEnquiryChange: function(element) {
                $('#SelectBrand').val('0').prop('selected', true);
                $("#SelectModel").empty();
                $("#SelectModel").append("<option value=\"0\">" + modelText + "</option>");
                customSelectWrapper.updateSelect($("#SelectBrand"));
                customSelectWrapper.updateSelect($("#SelectModel"));
            },
            brandChange: function (element) {
                var brandId = element.currentTarget.value;
                if (brandId != '') {
                    var modelIdFromUrl = parseInt($('#modelIdFromUrl').val());
                    var selectedVehicleEnquiry = this.$el.find('#SelectEnquiry').val();

                    var requestOptions = {};
                    if (selectedVehicleEnquiry == 'Pre-Owned') {
                        requestOptions.url = "/FinanceAndInsurance/VehiclePreownedModel";
                    }
                    else {
                        requestOptions.url = "/FinanceAndInsurance/GetNewModel";
                    }
                    requestOptions.type = "POST";
                    requestOptions.data = { BrandId: brandId, lang: $('html').attr('lang') };
                    requestOptions.success = function (StatesList) {
                        $("#SelectModel").empty();
                        $("#SelectModel").append("<option value=\"0\">" + modelText + "</option>");
                        for (var i = 0; i < StatesList.length; i++) {
                            if (StatesList[i].Text != null) {
                                $("#SelectModel").append("<option value=\"" + StatesList[i].Value.ID + "\"" + (modelIdFromUrl == StatesList[i].Value.ID ? " selected>" : ">") + StatesList[i].Text + "</option>");
                            }
                        }
                        $("#SelectModel").attr("data-disabled", false);

                        customSelectWrapper.updateSelect($("#SelectModel"));
                    };
                    requestOptions.error = function (err) {
                        alert(err);
                    };
                    $.ajax(requestOptions);
                } else {
                    $("#SelectModel").empty();
                    $("#SelectModel").append("<option value=\"0\">" + modelText + "</option>");
                    customSelectWrapper.updateSelect($("#SelectBrand"));
                    customSelectWrapper.updateSelect($("#SelectModel"));
                }
            },
            checkSelectedEnquiry: function () {
                var selectedEnquiryType = this.$el.find('#Enquiry_Type').val();
                var siblings = this.$el.find('#Enquiry_Type').closest('.vehicle-information').children().not(':first');
                siblings.addClass('input-hidden');

                if (selectedEnquiryType == 'Vehicle Enquiry') {
                    for (var i = 0; i < siblings.length; i++) {
                        var textarea = siblings.eq(i).find('textarea');
                        if (!textarea || textarea.length == 0) {
                            siblings.eq(i).removeClass('input-hidden');
                        }
                    }

                    // $('#AdditionalMessage').rules('add','required');
                    // $('#AdditionalMessage').parent().addClass('is-required');
                    this.addValidation($('#AdditionalMessage'));

                    // $('#Message').rules('remove','required');
                    // $('#Message').parent().removeClass('is-required');
                    // $('#Message').removeClass('invalid');
                    this.removeValidation($('#Message'));
                }
                else {
                    for (var i = 0; i < siblings.length; i++) {
                        var textarea = siblings.eq(i).find('textarea');
                        if (textarea && textarea.length > 0) {
                            siblings.eq(i).removeClass('input-hidden');
                        }
                    }
                    // $('#AdditionalMessage').rules('remove','required');
                    // $('#AdditionalMessage').parent().removeClass('is-required');
                    this.removeValidation($('#AdditionalMessage'));

                    // $('#Message').rules('add','required');
                    // $('#Message').parent().addClass('is-required');
                    this.addValidation($('#Message'));
                }
            },
            addValidation: function(element){
                element.rules('add','required');
                element.parent().addClass('is-required');
                element.removeClass('invalid');
            },
            removeValidation: function(element){
                element.rules('remove','required');
                element.parent().removeClass('is-required');
                element.removeClass('invalid');
            }
        });
    }
    function preProcess() {
        modelText = $('#selectModelTextHiddenField').val();
        
    }

    return {
        init: function (container, isCreate) {
            preProcess();
            return init(container, isCreate);
            
        }
    };
});
