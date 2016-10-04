import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.buildProxy = () => {
      this.$http.post('/api/proxies', {userAccount: this.userAccount})
        .then(response => {
          console.log(response);
        });
    };
  }
}

MainController.$inject = ['$http'];


export default angular.module('registrationApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController,
    controllerAs: 'main'
  })
  .name;
