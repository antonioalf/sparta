(function () {
  'use strict';

  /*POLICY DESCRIPTION CONTROLLER*/
  angular
    .module('webApp')
    .controller('PolicyDescriptionCtrl', PolicyDescriptionCtrl);

  PolicyDescriptionCtrl.$inject = ['PolicyModelFactory', 'PolicyFactory', '$filter', '$q'];

  function PolicyDescriptionCtrl(PolicyModelFactory, PolicyFactory, $filter, $q) {
    var vm = this;

    vm.validateForm = validateForm;

    init();

    function init() {
      vm.template = PolicyModelFactory.getTemplate();
      vm.policy = PolicyModelFactory.getCurrentPolicy();
      vm.sparkStreamingWindowData = vm.template.sparkStreamingWindow;
      vm.checkpointIntervalData = vm.template.checkpointInterval;
      vm.checkpointAvailabilityData = vm.template.checkpointAvailability;
      vm.partitionFormatData = vm.template.partitionFormat;
      vm.storageLevelData = vm.template.storageLevel;
      vm.helpLink = vm.template.helpLinks.description;
      vm.error = false;
    }

    function validateForm() {
      var defer = $q.defer();
      if (vm.form.$valid) {
        vm.error = false;
        /*Check if the name of the policy already exists*/
        findPolicyWithSameName().then(function (found) {
          vm.error = found;
          if (!found) {
            vm.policy.rawData.enabled = vm.policy.rawData.enabled.toString();
            PolicyModelFactory.nextStep();
          }
          defer.resolve();
        }, function () {
          defer.reject();
        });
      } else {
        defer.resolve();
      }
      return defer.promise;
    }

    function findPolicyWithSameName() {
      var defer = $q.defer();
      var found = false;
      var policiesList = PolicyFactory.getAllPolicies();
      policiesList.then(function (result) {
        var policiesDataList = result;
        var filteredPolicies = $filter('filter')(policiesDataList, {'policy': {'name': vm.policy.name.toLowerCase()}}, true);

        if (filteredPolicies.length > 0) {
          var foundPolicy = filteredPolicies[0].policy;
          if (vm.policy.id != foundPolicy.id || vm.policy.id === undefined) {
            found = true;
          }
        }

        defer.resolve(found);
      }, function () {
        defer.reject();
        console.log('There was an error while getting the policies list');
      });
      return defer.promise;
    }
  }
})();
