(function () {
  'use strict';

  angular
    .module('webApp')
    .factory('PolicyModelFactory', PolicyModelFactory);
  PolicyModelFactory.$inject = ['fragmentConstants'];

  function PolicyModelFactory(fragmentConstants) {
    var policy = {};
    var status = {};
    var finalJSON = {};
    var template = {};

    function initPolicy() {
      status.currentStep = 0;
      policy.name = "";
      policy.description = "";
      policy.sparkStreamingWindow = 6000;
      policy.storageLevel = "MEMORY_AND_DISK_SER";
      policy.checkpointPath = "/tmp/checkpoint";
      policy.rawData = {};
      policy.rawData.enabled = false;
      policy.rawData.partitionFormat = "day";
      policy.rawData.path = "";
      policy.input = {};
      policy.outputs = [];
      policy.models = [];
      policy.cubes = [];
    }

    function setPolicy(inputPolicyJSON) {
      status.currentStep = 0;
      policy.id = inputPolicyJSON.id;
      policy.name = inputPolicyJSON.name;
      policy.description = inputPolicyJSON.description;
      policy.sparkStreamingWindow = inputPolicyJSON.sparkStreamingWindow;
      policy.storageLevel = inputPolicyJSON.storageLevel;
      policy.checkpointPath = inputPolicyJSON.checkpointPath;
      policy.rawData = inputPolicyJSON.rawData;
      policy.rawData.enabled = (inputPolicyJSON.rawData.enabled == "true");
      policy.models = inputPolicyJSON.transformations; //TODO Change policy models attribute to transformations
      policy.cubes = inputPolicyJSON.cubes;

      var policyFragments = separateFragments(inputPolicyJSON.fragments);
      policy.input = policyFragments.input;
      policy.outputs = policyFragments.outputs;
    }

    function setTemplate(newTemplate){
      template = newTemplate;
    }

    function getTemplate(){
     return template;
    }

    function separateFragments(fragments) {
      var result = {};
      var input = null;
      var outputs = [];
      var fragment = null;

      for (var i = 0; i < fragments.length; ++i) {
        fragment = fragments[i];
        if (fragment.fragmentType == fragmentConstants.OUTPUT) {
          outputs.push(fragment);
        } else
          input = fragment;
      }

      result.input = input;
      result.outputs = outputs;
      return result;
    }

    function getCurrentPolicy() {
      if (!policy)
        initPolicy();
      return policy;
    }

    function previousStep() {
      status.currentStep--;
    }

    function nextStep() {
      status.currentStep++;
    }

    function getProcessStatus() {
      return status;
    }

    function resetPolicy() {
      initPolicy();
    }

    function getAllModelOutputs() {
      var allModelOutputs = [];
      var models = policy.models;
      var outputs = [];
      var modelOutputs, output = null;
      for (var i = 0; i < models.length; ++i) {
        modelOutputs = models[i].outputFields;
        for (var j = 0; j < modelOutputs.length; ++j) {
          output = modelOutputs[j];
          if (outputs.indexOf(output) == -1) {
            allModelOutputs.push(output);
          }
        }
      }
      return allModelOutputs;
    }

    function getFinalJSON() {
      return finalJSON;
    }

    function setFinalJSON(json) {
      return finalJSON = json;
    }

    return {
      setPolicy: setPolicy,
      setTemplate: setTemplate,
      getTemplate: getTemplate,
      getCurrentPolicy: getCurrentPolicy,
      previousStep: previousStep,
      nextStep: nextStep,
      getProcessStatus: getProcessStatus,
      resetPolicy: resetPolicy,
      getAllModelOutputs: getAllModelOutputs,
      getFinalJSON: getFinalJSON,
      setFinalJSON: setFinalJSON
    }
  }

})();


